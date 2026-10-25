// POST /api/verify  { token }
// Checks the Cloudflare Turnstile token once and sets the signed cookie that later calls accept.
import { ready, send, body, clientIp, human } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  if (!(await human(b.token, clientIp(req), req, res))) return send(res, 403, { code: "bot" });
  return send(res, 200, { ok: true });
}
