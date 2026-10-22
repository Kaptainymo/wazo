// POST /api/checkout  { plan: "one"|"pack"|"pro", lang, email?, token }
// Creates a Stripe Checkout Session and returns its URL for the browser to redirect to.
import { env, ready, send, body, cleanEmail, LANGS, clientIp, human, stripe } from "./_lib.js";

const PLANS = ["one", "pack", "pro"];
const CUR = { he: "ils", en: "usd", es: "eur", fr: "eur" };

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  if (!env("STRIPE_SECRET_KEY")) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  const plan = PLANS.includes(b.plan) ? b.plan : null;
  if (!plan) return send(res, 400, { code: "bad_plan" });
  const lang = LANGS.includes(b.lang) ? b.lang : "en";
  const ip = clientIp(req);
  if (!(await human(b.token, ip))) return send(res, 403, { code: "bot" });

  const cur = CUR[lang] || "usd";
  const priceId = env(`STRIPE_PRICE_${plan.toUpperCase()}_${cur.toUpperCase()}`);
  if (!priceId) return send(res, 503, { code: "not_configured" });
  const email = cleanEmail(b.email);
  const origin = env("SITE_URL") || `https://${req.headers.host}`;

  try {
    const params = new URLSearchParams({
      mode: plan === "pro" ? "subscription" : "payment",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/?paid=${plan}#idea`,
      cancel_url: `${origin}/#idea`,
      "metadata[plan]": plan,
      "metadata[lang]": lang,
      allow_promotion_codes: "true",
    });
    if (email) params.set("customer_email", email);
    else if (plan !== "pro") params.set("customer_creation", "always");
    const session = await stripe("checkout/sessions", params);
    return send(res, 200, { url: session.url });
  } catch (e) {
    console.error("checkout", e.message);
    return send(res, 500, { code: "error" });
  }
}
