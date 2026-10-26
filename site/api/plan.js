// POST /api/plan  { email, token }  ->  { pro: boolean }
// Lets the app know whether this email already has an active Pro subscription, so it can stop offering the upgrade.
import { ready, send, body, cleanEmail, clientIp, human, getLead, open } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  const email = cleanEmail(b.email);
  if (!email) return send(res, 200, { pro: !!open() });
  if (!(await human(b.token, clientIp(req), req, res))) return send(res, 403, { code: "bot" });
  try {
    const lead = await getLead(email);
    return send(res, 200, { pro: open() || lead?.plan === "pro" });
  } catch (e) {
    console.error("plan", e.message);
    return send(res, 500, { code: "error" });
  }
}
