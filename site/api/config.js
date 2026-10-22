// GET /api/config  -> public settings the page needs (client-side tokens/price IDs are public by design).
import { env, ready, send } from "./_lib.js";

export default function handler(req, res) {
  send(res, 200, {
    ready: ready(),
    siteKey: env("TURNSTILE_SITEKEY"),
    umami: env("UMAMI_WEBSITE_ID"),
    paddleToken: env("PADDLE_CLIENT_TOKEN"),
    paddleEnv: env("PADDLE_ENV", "sandbox"),
    paddlePricePro: env("PADDLE_PRICE_PRO"),
  });
}
