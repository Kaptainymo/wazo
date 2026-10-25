// POST /api/unlock  { id, email, name, marketing, lang, token }
// Saves the lead and reveals the deeper analysis for this wazo if the email is Pro.
import { env, ready, send, body, str, cleanEmail, LANGS, clientIp, ipHash, human, count, sinceISO, getLead, upsertLead, getWazo, patchWazo, open } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  const email = cleanEmail(b.email);
  if (!email) return send(res, 400, { code: "bad_email" });
  const ip = clientIp(req), ih = ipHash(ip);
  if (!(await human(b.token, ip, req, res))) return send(res, 403, { code: "bot" });

  try {
    const w = await getWazo(b.id);
    if (!w) return send(res, 404, { code: "not_found" });
    if (open()) return send(res, 200, { full: true, wazo: w.result });
    // Abuse throttle only (Pro is otherwise unlimited); not a business limit.
    if (!w.unlocked && (await count("wazos", `unlock_ip_hash=eq.${ih}&unlocked_at=gte.${sinceISO(24)}`)) >= Number(env("UNLOCK_PER_DAY", "40")))
      return send(res, 429, { code: "limit" });
    const prev = await getLead(email);
    const row = { email, lang: LANGS.includes(b.lang) ? b.lang : (prev?.lang || "en") };
    const name = str(b.name, 120); if (name) row.name = name;
    if (b.marketing === true) row.marketing = true;
    const lead = await upsertLead(row);

    if (w.unlocked) {
      if (w.email && w.email !== email && lead?.plan !== "pro") return send(res, 402, { code: "need_pro" });
      return send(res, 200, { full: true, wazo: w.result });
    }
    if (lead?.plan !== "pro") return send(res, 402, { code: "need_pro" });
    await patchWazo(w.id, { email, unlocked: true, unlock_ip_hash: ih, unlocked_at: new Date().toISOString() });
    return send(res, 200, { full: true, wazo: w.result });
  } catch (e) {
    console.error("unlock", e.message);
    return send(res, 500, { code: "error" });
  }
}
