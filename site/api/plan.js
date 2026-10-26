// POST /api/plan  { email }  ->  { pro: boolean }
// True only for a verified Pro subscriber: the email has a subscription AND this browser proved it owns the email.
import { ready, send, body, cleanEmail, getLead, proVerified, verifiedEmail, enforceVerify, open } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  if (open()) return send(res, 200, { pro: true, verified: true });
  const email = cleanEmail(b.email), v = verifiedEmail(req);
  if (enforceVerify() && (!email || !v || v !== email)) return send(res, 200, { pro: false, verified: !!v && v === email });
  if (!email) return send(res, 200, { pro: false, verified: false });
  try { return send(res, 200, { pro: proVerified(await getLead(email), email, req), verified: true }); }
  catch (e) { console.error("plan", e.message); return send(res, 500, { code: "error" }); }
}
