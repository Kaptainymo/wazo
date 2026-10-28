// POST /api/auth  { action, email, ... }
//   start  { email, lang, token } -> sends a 6-digit code to the email, but only if it has a Pro subscription. Always answers ok.
//   verify { email, code }        -> checks the code and sets the verified-session cookie
//   me     {}                     -> { email } of the verified session, if any
//   logout {}                     -> clears the session
//   plan   { email }              -> { pro, verified }: true only for a verified Pro subscriber (the email has a subscription AND this browser proved it owns it)
import crypto from "node:crypto";
import { ready, send, body, cleanEmail, LANGS, clientIp, human, getLead, putAuthCode, getAuthCode, bumpAuthAttempts, delAuthCode, mailReady, sendMail, sessionCookie, clearSessionCookie, verifiedEmail, proVerified, enforceVerify, open, env } from "./_lib.js";

const CODE_MINUTES = 10, COOLDOWN_SECONDS = 60, MAX_ATTEMPTS = 5;
const codeHash = (email, code) => crypto.createHash("sha256").update(email + "|" + code + "|" + (env("SESSION_SECRET") || env("SUPABASE_SERVICE_KEY"))).digest("hex");

const TEXT = {
  he: (c) => ({ subject: "קוד האימות שלכם ל־Wazo", text: `הקוד שלכם: ${c}\n\nהוא תקף ל־${CODE_MINUTES} דקות. אם לא ביקשתם אותו, אפשר להתעלם מהמייל.` }),
  en: (c) => ({ subject: "Your Wazo verification code", text: `Your code: ${c}\n\nIt is valid for ${CODE_MINUTES} minutes. If you did not ask for it, you can ignore this email.` }),
  es: (c) => ({ subject: "Tu código de verificación de Wazo", text: `Tu código: ${c}\n\nEs válido durante ${CODE_MINUTES} minutos. Si no lo pediste, puedes ignorar este correo.` }),
  fr: (c) => ({ subject: "Votre code de vérification Wazo", text: `Votre code : ${c}\n\nIl est valable ${CODE_MINUTES} minutes. Si vous ne l'avez pas demandé, ignorez cet e-mail.` }),
};

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  try {
    if (b.action === "me") return send(res, 200, { email: verifiedEmail(req) });
    if (b.action === "logout") { res.setHeader("Set-Cookie", clearSessionCookie()); return send(res, 200, { ok: true }); }

    if (b.action === "plan") {
      if (open()) return send(res, 200, { pro: true, verified: true });
      const pe = cleanEmail(b.email), v = verifiedEmail(req);
      if (enforceVerify() && (!pe || !v || v !== pe)) return send(res, 200, { pro: false, verified: !!v && v === pe });
      if (!pe) return send(res, 200, { pro: false, verified: false });
      return send(res, 200, { pro: proVerified(await getLead(pe), pe, req), verified: true });
    }

    const email = cleanEmail(b.email);
    if (!email) return send(res, 400, { code: "bad_email" });

    if (b.action === "start") {
      if (!mailReady() && env("WAZO_MOCK_MAIL") !== "1") return send(res, 503, { code: "mail_not_configured" });
      if (!(await human(b.token, clientIp(req), req, res))) return send(res, 403, { code: "bot" });
      const lead = await getLead(email);
      if (lead?.plan === "pro") {                                   // for anyone else we send nothing, and answer the same
        const prev = await getAuthCode(email);
        if (prev && Date.now() - new Date(prev.created_at).getTime() < COOLDOWN_SECONDS * 1000) return send(res, 429, { code: "wait" });
        const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
        await putAuthCode(email, codeHash(email, code), new Date(Date.now() + CODE_MINUTES * 60000).toISOString());
        const lang = LANGS.includes(b.lang) ? b.lang : "en";
        await sendMail({ to: email, ...TEXT[lang](code) });
      }
      return send(res, 200, { ok: true });
    }

    if (b.action === "verify") {
      const code = String(b.code || "").replace(/\D/g, "").slice(0, 6);
      const row = await getAuthCode(email);
      if (!row || new Date(row.expires_at).getTime() < Date.now()) return send(res, 400, { code: "bad_code" });
      if (row.attempts >= MAX_ATTEMPTS) return send(res, 429, { code: "too_many" });
      const ok = code.length === 6 && crypto.timingSafeEqual(Buffer.from(codeHash(email, code)), Buffer.from(row.code_hash));
      if (!ok) { await bumpAuthAttempts(email, row.attempts + 1); return send(res, 400, { code: "bad_code" }); }
      await delAuthCode(email);
      const lead = await getLead(email);
      if (lead?.plan !== "pro") return send(res, 400, { code: "bad_code" });
      res.setHeader("Set-Cookie", sessionCookie(email));
      return send(res, 200, { ok: true, pro: true });
    }
    return send(res, 400, { code: "bad_action" });
  } catch (e) {
    console.error("auth", e.message);
    return send(res, 500, { code: "error" });
  }
}
