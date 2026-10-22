// POST /api/deepen  { id, email, lang, token }
// Pro-only. Returns a cached or freshly generated deeper follow-up analysis for a wazo.
import { env, ready, send, body, cleanEmail, LANGS, clientIp, human, getLead, getWazo, patchWazo } from "./_lib.js";
import { buildDeepPrompt, shapeDeep, parseJSON } from "./_prompt.js";

export const config = { maxDuration: 60 };

async function askClaude(prompt, signal) {
  if (env("WAZO_MOCK") === "1") return MOCK_DEEP;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", signal,
    headers: { "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: env("WAZO_MODEL", "claude-sonnet-5-5"), max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
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
  const email = cleanEmail(b.email);
  if (!email) return send(res, 400, { code: "bad_email" });
  const ip = clientIp(req);
  if (!(await human(b.token, ip))) return send(res, 403, { code: "bot" });

  try {
    const lead = await getLead(email);
    if (lead?.plan !== "pro") return send(res, 402, { code: "need_pro" });
    const w = await getWazo(b.id);
    if (!w) return send(res, 404, { code: "not_found" });
    if (w.deep) return send(res, 200, { deep: w.deep });

    const lang = LANGS.includes(b.lang) ? b.lang : (w.lang || "en");
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 55000);
    let text;
    try { text = await askClaude(buildDeepPrompt({ idea: w.idea, lang, result: w.result }), ctl.signal); }
    finally { clearTimeout(timer); }
    const raw = parseJSON(text);
    if (!raw) return send(res, 502, { code: "invalid_json" });
    const deep = shapeDeep(raw);
    await patchWazo(w.id, { deep });
    return send(res, 200, { deep });
  } catch (e) {
    const code = e.code === "busy" ? "busy" : e.code === "refused" ? "refused" : e.name === "AbortError" ? "timeout" : "error";
    console.error("deepen", e.message);
    return send(res, code === "busy" ? 503 : 500, { code });
  }
}

const MOCK_DEEP = JSON.stringify({
  risks: [
    { name: "Owner adoption", severity: "high", note: "Barbers are slow to change booking habits even when the tool is free." },
    { name: "Seasonal churn", severity: "medium", note: "Summer slowdowns make shops cancel subscriptions first." },
  ],
  strategy: "Sell the time saved, not the technology. Lead every pitch with the number of missed calls a shop loses per week. Bundle onboarding with a 15 minute in person setup so the owner never has to read a manual.",
  milestones: [
    { day: 30, goal: "10 paying shops in one city, onboarded in person." },
    { day: 60, goal: "Under 5% monthly churn across those 10 shops." },
    { day: 90, goal: "One referral-driven shop with no direct sales touch." },
  ],
});
