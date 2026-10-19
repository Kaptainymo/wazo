// POST /api/lead  { action: "plan" | "delete", email, plan?, lang? }
// "plan": records which launch price someone wants held. "delete": records a deletion request.
import { ready, send, body, cleanEmail, LANGS, getLead, upsertLead, patchLead } from "./_lib.js";

const PLANS = ["one", "pack", "pro", "teams"];

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  const email = cleanEmail(b.email);
  if (!email) return send(res, 400, { code: "bad_email" });
  try {
    if (b.action === "plan") {
      if (!PLANS.includes(b.plan)) return send(res, 400, { code: "bad_plan" });
      await upsertLead({ email, lang: LANGS.includes(b.lang) ? b.lang : "en", plan_interest: b.plan, plan_interest_at: new Date().toISOString() });
      return send(res, 200, { ok: true });
    }
    if (b.action === "delete") {
      if (await getLead(email)) await patchLead(email, { delete_requested: true, delete_at: new Date().toISOString() });
      return send(res, 200, { ok: true });                 // same answer either way: doesn't reveal who signed up
    }
    return send(res, 400, { code: "bad_action" });
  } catch (e) {
    console.error("lead", e.message);
    return send(res, 500, { code: "error" });
  }
}
