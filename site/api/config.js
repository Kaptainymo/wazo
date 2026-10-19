// GET /api/config  -> public settings the page needs (the Turnstile site key is public by design).
import { env, ready, send } from "./_lib.js";

export default function handler(req, res) {
  send(res, 200, { ready: ready(), siteKey: env("TURNSTILE_SITEKEY"), umami: env("UMAMI_WEBSITE_ID") });
}
