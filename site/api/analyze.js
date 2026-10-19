// POST /api/analyze  { idea, cust, budget, time, lang, token, email? }
// Runs one analysis. Before an email is given, only the idea, scores and money are returned;
// the 7-day test, fine print and bottom line stay on the server until /api/unlock.
import { env, ready, send, body, str, cleanEmail, LANGS, clientIp, ipHash, human, count, getLead, patchLead, claimFree, insertWazo, sinceISO, partial } from "./_lib.js";
import { buildPrompt, shape, parseJSON } from "./_prompt.js";

export const config = { maxDuration: 60 };

const LIMITS = () => ({
  anonPerDay: Number(env("ANON_PER_DAY", "2")),   // analyses per IP per day without an email
  ipPerDay: Number(env("IP_PER_DAY", "12")),      // hard ceiling per IP per day, everyone
  proPerDay: Number(env("PRO_PER_DAY", "30")),
  dailyCap: Number(env("DAILY_CAP", "300")),      // whole site per day, protects the API bill
});

async function askClaude(prompt, signal) {
  if (env("WAZO_MOCK") === "1") return MOCK;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", signal,
    headers: { "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: env("WAZO_MODEL", "claude-sonnet-5-5"), max_tokens: 3000, messages: [{ role: "user", content: prompt }] }),
  });
  if (r.status === 429 || r.status === 529) throw Object.assign(new Error("busy"), { code: "busy" });
  if (!r.ok) throw Object.assign(new Error("model " + r.status + " " + (await r.text()).slice(0, 200)), { code: "model" });
  const j = await r.json();
  if (j.stop_reason === "refusal") throw Object.assign(new Error("refused"), { code: "refused" });
  return (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  const lang = LANGS.includes(b.lang) ? b.lang : "en";
  const idea = str(b.idea, 1200);
  if (idea.length < 8) return send(res, 400, { code: "need_idea" });
  const fields = { idea, cust: str(b.cust, 200), budget: str(b.budget, 40), time: str(b.time, 40), lang };
  const email = cleanEmail(b.email);
  const ip = clientIp(req), ih = ipHash(ip), L = LIMITS();

  if (!(await human(b.token, ip))) return send(res, 403, { code: "bot" });

  try {
    const day = sinceISO(24);
    if ((await count("wazos", `created_at=gte.${day}`)) >= L.dailyCap) return send(res, 503, { code: "busy" });
    const ipCount = await count("wazos", `ip_hash=eq.${ih}&created_at=gte.${day}`);
    if (ipCount >= L.ipPerDay) return send(res, 429, { code: "limit" });

    let lead = email ? await getLead(email) : null;
    const pro = lead?.plan === "pro";
    let full = false;
    if (pro) {
      if ((await count("wazos", `email=eq.${encodeURIComponent(email)}&created_at=gte.${day}`)) >= L.proPerDay) return send(res, 429, { code: "limit" });
      full = true;
    } else if (lead && lead.free_used) {
      return send(res, 402, { code: "need_pro" });
    } else if (lead && !lead.free_used) {
      full = true;                                   // their one free full wazo
    } else if (ipCount >= L.anonPerDay) {
      return send(res, 429, { code: "limit_anon" }); // ask for an email to continue
    }

    // Claim the free wazo now, so two requests fired together can't both get it.
    const claimed = full && !pro;
    if (claimed && !(await claimFree(email))) return send(res, 402, { code: "need_pro" });
    const release = async () => { if (claimed) { try { await patchLead(email, { free_used: false }); } catch {} } };

    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 55000);
    let text;
    try { text = await askClaude(buildPrompt(fields), ctl.signal); }
    catch (e) { await release(); throw e; }
    finally { clearTimeout(timer); }
    const raw = parseJSON(text);
    if (!raw) { await release(); return send(res, 502, { code: "invalid_json" }); }
    const w = shape(raw, lang);
    if (!w.idea) w.idea = idea;

    const row = await insertWazo({ ip_hash: ih, email: full ? email : null, lang, idea, verdict: w.verdict, result: w, unlocked: full, ...(full ? { unlock_ip_hash: ih, unlocked_at: new Date().toISOString() } : {}) });
    return send(res, 200, { id: row.id, full, wazo: full ? w : partial(w) });
  } catch (e) {
    const code = e.code === "busy" ? "busy" : e.code === "refused" ? "refused" : e.name === "AbortError" ? "timeout" : "error";
    console.error("analyze", e.message);
    return send(res, code === "busy" ? 503 : 500, { code });
  }
}

const MOCK = JSON.stringify({
  idea: "A WhatsApp bot that books barbershop appointments", title: "Barber Bot", verdict: "PIVOT",
  headline: "Barbers want full chairs, not another app to answer.", deciding: "That 20% of barbers pay monthly after a free month.", tip: "Sell to shops with 3+ chairs first.",
  scores: [{ key: "pain", score: 6, grade: "B", evidence: "No-shows and phone tag cost chair time daily." }, { key: "demand", score: 6, grade: "C", evidence: "Most small shops still book by phone or chat." }, { key: "space", score: 4, grade: "B", evidence: "Booking apps exist but few live inside WhatsApp." }, { key: "pay", score: 5, grade: "C", evidence: "Shops pay for booking tools, but churn is high." }],
  money: { price: 29, low: 20, base: 80, high: 200, breaker: "Barbers churn after the first slow month." },
  graveyard: [{ name: "Local booking startups (2019 wave)", why: "Could not beat free calendars." }], competition: [{ name: "Booking platforms", note: "Strong in salons, weak in WhatsApp." }],
  gap: "Booking that happens where the customer already chats.", israel: "Start in one city, sell door to door.", fit: "Needs field sales and a simple bot.",
  kill: { action: "Visit 30 barbershops and offer a free month.", budget: 50, pass: "8 say yes, 3 commit to pay." },
});
