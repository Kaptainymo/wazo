# Wazo

A blunt, honest verdict on your startup idea. English, Spanish, French and Hebrew, mobile first.

Type an idea and get a smart analysis: four scores with evidence grades, the money in three scenarios, a 7-day test, and a verdict: BUILD, PIVOT or KILL.

## How it works

- `site/index.html` is the whole front end, in one file. Vercel serves `site/`.
- `site/api/*.js` are Vercel functions, with no npm dependencies:
  - `analyze`: Turnstile check, rate limits, calls Claude through the Anthropic API, and stores the result. Before an email is given it returns **only the idea, scores and money**. The 7-day test, fine print and verdict stay on the server.
  - `unlock`: saves the lead (name, email, marketing opt-in). If this email still has its free wazo, or is Pro, it returns the full result.
  - `lead`: records "hold my launch price" interest and deletion requests.
  - `config`: public settings for the page (the Turnstile site key and the Umami website ID).
- `supabase/schema.sql`: the database (tables `leads` and `wazos`). Run it once in the Supabase SQL editor.

### Rules

| Who | Can analyze | Sees |
|---|---|---|
| New visitor (no email) | 2 per day per IP (`ANON_PER_DAY`) | Scores and money. Everything else unlocks with an email |
| Email, free wazo unused | Yes | Everything, once. That uses up the free wazo |
| Email, free wazo used | No (Pro needed) | "Hold my launch price" |
| Pro (`leads.plan = 'pro'`) | 30 per day (`PRO_PER_DAY`) | Everything |

Everyone is limited to 12 analyses per IP per day (`IP_PER_DAY`), and the whole site to 300 per day (`DAILY_CAP`).

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Secret | What |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | console.anthropic.com. Set a monthly spend limit there |
| `SUPABASE_URL` | no | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | yes | Supabase → Project Settings → API → service_role key |
| `TURNSTILE_SECRET` | yes | Cloudflare → Turnstile → your widget → Secret key |
| `TURNSTILE_SITEKEY` | no | Cloudflare → Turnstile → your widget → Site key |
| `IP_SALT` | yes | Any long random string. Visitor IPs are stored only as salted hashes |
| `UMAMI_WEBSITE_ID` | no | Optional. cloud.umami.is → your website |
| `WAZO_MODEL` | no | Optional. Defaults to `claude-sonnet-5-5` |
| `ANON_PER_DAY`, `IP_PER_DAY`, `PRO_PER_DAY`, `DAILY_CAP` | no | Optional limits |

The site shows "warming up" until the first four are set.

## Leads

Supabase → Table Editor → `leads` → Export to CSV. Emails never go into this repo (`data/` and `*.csv` are git-ignored).

## Making someone Pro (until payments are wired)

Supabase → Table Editor → `leads` → set `plan` to `pro` on their row.

## Folders

- `site/`: what Vercel serves
- `versions/`: numbered snapshots, `wazo-index-vNN.html`
- `supabase/`: database schema

Built by WAZO.
