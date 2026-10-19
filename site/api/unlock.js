// POST /api/unlock  { id, email, name, marketing, lang, token }
// Saves the lead and returns the full wazo if this email still has its free one (or is Pro).
import { ready, send, body, str, cleanEmail, LANGS, clientIp, human, getLead, upsertLead, patchLead, getWazo, patchWazo } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  const email = cleanEmail(b.email);
  if (!email) return send(res, 400, { code: "bad_email" });
  if (!(await human(b.token, clientIp(req)))) return send(res, 403, { code: "bot" });

  try {
    const w = await getWazo(b.id);
    if (!w) return send(res, 404, { code: "not_found" });
    const prev = await getLead(email);
    const row = { email, lang: LANGS.includes(b.lang) ? b.lang : (prev?.lang || "en") };
    const name = str(b.name, 120); if (name) row.name = name;
    if (b.marketing === true) row.marketing = true;
    const lead = await upsertLead(row);

    if (w.unlocked) {
      if (w.email && w.email !== email && lead?.plan !== "pro") return send(res, 402, { code: "need_pro" });
      return send(res, 200, { full: true, wazo: w.result });
    }
    const pro = lead?.plan === "pro";
    if (!pro && lead?.free_used) return send(res, 402, { code: "need_pro" });
    await patchWazo(w.id, { email, unlocked: true });
    if (!pro) await patchLead(email, { free_used: true });
    return send(res, 200, { full: true, wazo: w.result });
  } catch (e) {
    console.error("unlock", e.message);
    return send(res, 500, { code: "error" });
  }
}
