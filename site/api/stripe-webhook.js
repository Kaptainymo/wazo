// POST /api/stripe-webhook  (called by Stripe, not the browser)
// Activates or cancels the Pro subscription once Stripe confirms it. Verifies the signature first.
import { env, send, rawBody, verifyStripeSig, upsertLead, patchLead, stripeGet } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  const secret = env("STRIPE_WEBHOOK_SECRET");
  if (!secret) return send(res, 503, { code: "not_configured" });
  const raw = await rawBody(req);
  if (!verifyStripeSig(raw, req.headers["stripe-signature"], secret)) return send(res, 400, { code: "bad_sig" });

  let event;
  try { event = JSON.parse(raw.toString("utf8")); } catch { return send(res, 400, { code: "bad_json" }); }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      const email = (s.customer_details?.email || s.customer_email || "").toLowerCase().trim();
      if (email && s.metadata?.plan === "pro") {
        await upsertLead({ email, plan: "pro", stripe_customer_id: s.customer || null });
      }
    } else if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
      const sub = event.data.object;
      const cancelled = event.type === "customer.subscription.deleted" || ["canceled", "unpaid", "incomplete_expired"].includes(sub.status);
      if (cancelled && sub.customer) {
        try {
          const customer = await stripeGet(`customers/${sub.customer}`);
          const email = (customer.email || "").toLowerCase().trim();
          if (email) await patchLead(email, { plan: "" });
        } catch {}
      }
    }
    return send(res, 200, { received: true });
  } catch (e) {
    console.error("stripe-webhook", e.message);
    return send(res, 500, { code: "error" });
  }
}
