// POST /api/paddle-webhook  (called by Paddle, not the browser)
// Activates or cancels the Pro subscription once Paddle confirms it. Verifies the signature first.
import { env, send, rawBody, verifyPaddleSig, paddleGet, upsertLead, patchLead } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  const secret = env("PADDLE_WEBHOOK_SECRET");
  if (!secret) return send(res, 503, { code: "not_configured" });
  const raw = await rawBody(req);
  if (!verifyPaddleSig(raw, req.headers["paddle-signature"], secret)) return send(res, 400, { code: "bad_sig" });

  let event;
  try { event = JSON.parse(raw.toString("utf8")); } catch { return send(res, 400, { code: "bad_json" }); }

  try {
    const type = event.event_type, d = event.data || {};
    if (type === "subscription.activated" || (type === "subscription.updated" && d.status === "active")) {
      const customer = await paddleGet(`customers/${d.customer_id}`);
      const email = (customer?.email || "").toLowerCase().trim();
      if (email) await upsertLead({ email, plan: "pro", paddle_customer_id: d.customer_id || null });
    } else if (type === "subscription.canceled" || (type === "subscription.updated" && ["paused", "past_due"].includes(d.status))) {
      const customer = await paddleGet(`customers/${d.customer_id}`);
      const email = (customer?.email || "").toLowerCase().trim();
      if (email) await patchLead(email, { plan: "" });
    }
    return send(res, 200, { received: true });
  } catch (e) {
    console.error("paddle-webhook", e.message);
    return send(res, 500, { code: "error" });
  }
}
