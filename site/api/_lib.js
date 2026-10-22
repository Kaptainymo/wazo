// Shared server helpers. Files starting with "_" are not routes on Vercel.
import crypto from "node:crypto";

export const env = (k, d = "") => (process.env[k] ?? d).toString().trim();
export const LANGS = ["en", "es", "fr", "he"];
export const ready = () => !!(env("ANTHROPIC_API_KEY") && env("SUPABASE_URL") && env("SUPABASE_SERVICE_KEY") && (env("TURNSTILE_SECRET") || env("WAZO_DEV") === "1"));

export function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

export async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 20000) break; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
}

export const str = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
export const cleanEmail = (v) => { const e = str(v, 200).toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : ""; };

export function clientIp(req) {
  const h = req.headers || {};
  return String(h["x-real-ip"] || String(h["x-forwarded-for"] || "").split(",")[0] || req.socket?.remoteAddress || "0.0.0.0").trim();
}
export const ipHash = (ip) => crypto.createHash("sha256").update(ip + "|" + env("IP_SALT", "wazo")).digest("hex").slice(0, 32);

// ---------- Cloudflare Turnstile ----------
export async function human(token, ip) {
  const secret = env("TURNSTILE_SECRET");
  if (!secret) return env("WAZO_DEV") === "1";            // local testing only
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: String(token).slice(0, 2048), remoteip: ip }),
    });
    const j = await r.json();
    return !!j.success;
  } catch { return false; }
}

// ---------- Supabase (REST, service key; server only) ----------
async function sb(path, { method = "GET", body: b, headers = {} } = {}) {
  const url = env("SUPABASE_URL").replace(/\/+$/, "") + "/rest/v1/" + path;
  const key = env("SUPABASE_SERVICE_KEY");
  const r = await fetch(url, {
    method,
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", ...headers },
    body: b === undefined ? undefined : JSON.stringify(b),
  });
  if (!r.ok) throw new Error("db " + r.status + " " + (await r.text()).slice(0, 200));
  return r;
}
export async function count(table, filter) {
  const r = await sb(`${table}?select=id&${filter}`, { headers: { Prefer: "count=exact", Range: "0-0" } });
  const cr = r.headers.get("content-range") || "*/0";
  return Number(cr.split("/")[1]) || 0;
}
export async function getLead(email) {
  const r = await sb(`leads?email=eq.${encodeURIComponent(email)}&select=*`);
  const rows = await r.json(); return rows[0] || null;
}
export async function upsertLead(row) {
  const r = await sb("leads", { method: "POST", body: row, headers: { Prefer: "resolution=merge-duplicates,return=representation" } });
  const rows = await r.json(); return rows[0] || null;
}
export async function patchLead(email, patch) {
  await sb(`leads?email=eq.${encodeURIComponent(email)}`, { method: "PATCH", body: patch, headers: { Prefer: "return=minimal" } });
}
export async function insertWazo(row) {
  const r = await sb("wazos", { method: "POST", body: row, headers: { Prefer: "return=representation" } });
  const rows = await r.json(); return rows[0];
}
export async function getWazo(id) {
  if (!/^[0-9a-f-]{36}$/i.test(String(id))) return null;
  const r = await sb(`wazos?id=eq.${id}&select=*`);
  const rows = await r.json(); return rows[0] || null;
}
export async function patchWazo(id, patch) {
  await sb(`wazos?id=eq.${id}`, { method: "PATCH", body: patch, headers: { Prefer: "return=minimal" } });
}
export const sinceISO = (hours) => new Date(Date.now() - hours * 3600e3).toISOString();

// What a visitor sees before giving an email: the idea, scores and money.
export const partial = (w) => ({ idea: w.idea, title: w.title, scores: w.scores, money: w.money });

// ---------- Paddle (REST, API key; server only) ----------
const paddleBase = () => (env("PADDLE_ENV", "sandbox") === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com");
export async function paddleGet(path) {
  const r = await fetch(`${paddleBase()}/${path}`, {
    headers: { Authorization: "Bearer " + env("PADDLE_API_KEY") },
  });
  const j = await r.json();
  if (!r.ok) throw Object.assign(new Error(j?.error?.detail || "paddle " + r.status), { code: "paddle" });
  return j.data;
}
// The raw request bytes, needed to verify a webhook signature before parsing JSON.
export async function rawBody(req) {
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 200000) break; chunks.push(c); }
  return Buffer.concat(chunks);
}
// Paddle-Signature: "ts=<unix>;h1=<hex>", signed payload is "ts:rawBody".
export function verifyPaddleSig(raw, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(String(header).split(";").map((p) => p.split("=")));
  const ts = parts.ts, h1 = parts.h1;
  if (!ts || !h1) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 30) return false; // small clock-skew tolerance
  const expected = crypto.createHmac("sha256", secret).update(`${ts}:${raw}`).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(h1, "hex")); } catch { return false; }
}
