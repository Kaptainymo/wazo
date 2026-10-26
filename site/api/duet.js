// POST /api/duet  { action, ... }
//   create { idea, answers, lang, email?, token }  -> { token, key, expires_at, talk_open }   (owner, bot check)
//   get    { token }                               -> the idea and whether it was answered     (invited person)
//   answer { token, answers }                      -> both sets of answers                      (invited person, once)
//   status { token, key }                          -> { answered, answers... }                  (owner)
//   remove { token, key }                          -> deletes the duet                          (owner)
// The link token and the owner key are random; only their hashes are stored.
import crypto from "node:crypto";
import { ready, send, body, str, cleanEmail, LANGS, clientIp, ipHash, human, open, count, sinceISO, getLead, proVerified, insertDuet, getDuet, answerDuet, deleteDuet, purgeDuets } from "./_lib.js";

const MAX = [2, 2, 4];                         // highest option index for each of the three questions
const DAILY_LIMIT = 10;
const hash = (v) => crypto.createHash("sha256").update(String(v) + "|duet").digest("hex");
const rand = () => crypto.randomBytes(24).toString("base64url");
const cleanAnswers = (a) => Array.isArray(a) && a.length === 3 && a.every((v, i) => Number.isInteger(v) && v >= 0 && v <= MAX[i]) ? a : null;
const safeEq = (a, b) => { try { return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; } };
const tokenOk = (t) => /^[A-Za-z0-9_-]{32}$/.test(String(t || ""));

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { code: "method" });
  if (!ready()) return send(res, 503, { code: "not_configured" });
  const b = await body(req);
  try {
    if (b.action === "create") {
      const idea = str(b.idea, 1200), answers = cleanAnswers(b.answers);
      if (idea.length < 2 || !answers) return send(res, 400, { code: "bad_input" });
      const ip = clientIp(req);
      if (!(await human(b.token, ip, req, res))) return send(res, 403, { code: "bot" });
      const ih = ipHash(ip);
      if ((await count("duets", `ip_hash=eq.${ih}&created_at=gte.${encodeURIComponent(sinceISO(24))}`)) >= DAILY_LIMIT) return send(res, 429, { code: "limit" });
      await purgeDuets();
      const email = cleanEmail(b.email);
      const talk_open = open() || (!!email && proVerified(await getLead(email), email, req));
      const token = rand(), key = rand();
      const row = await insertDuet({ token_hash: hash(token), key_hash: hash(key), ip_hash: ih, lang: LANGS.includes(b.lang) ? b.lang : "en", idea, owner_answers: answers, talk_open });
      return send(res, 200, { token, key, expires_at: row.expires_at, talk_open });
    }
    if (!tokenOk(b.token)) return send(res, 404, { code: "not_found" });
    const d = await getDuet(hash(b.token));
    if (!d) return send(res, 404, { code: "not_found" });

    if (b.action === "get") return send(res, 200, { idea: d.idea, lang: d.lang, answered: !!d.partner_answers, talk_open: d.talk_open, expires_at: d.expires_at });

    if (b.action === "answer") {
      const answers = cleanAnswers(b.answers);
      if (!answers) return send(res, 400, { code: "bad_input" });
      const row = await answerDuet(d.id, answers);
      if (!row) return send(res, 409, { code: "answered" });
      return send(res, 200, { idea: d.idea, lang: d.lang, owner_answers: d.owner_answers, partner_answers: answers, talk_open: d.talk_open });
    }

    if (!safeEq(hash(b.key || ""), d.key_hash)) return send(res, 404, { code: "not_found" });
    if (b.action === "status") return send(res, 200, { answered: !!d.partner_answers, owner_answers: d.owner_answers, partner_answers: d.partner_answers, talk_open: d.talk_open, expires_at: d.expires_at });
    if (b.action === "remove") { await deleteDuet(d.id); return send(res, 200, { ok: true }); }
    return send(res, 400, { code: "bad_action" });
  } catch (e) {
    console.error("duet", e.message);
    return send(res, 500, { code: "error" });
  }
}
