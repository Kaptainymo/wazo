# Wazo launch runbook: for Claude Code

You are Claude Code, running on the owner's Mac. Execute the three steps below **in order** to take Wazo live on Vercel with its own backend. Stop and ask the owner whenever a step says **ASK**. Report a short status line after each step.

## Context

| Item | Value |
|---|---|
| GitHub repo | `Kaptainymo/wazo` |
| PR to ship | **#11**, branch `feat/standalone` (currently a draft) |
| Vercel project | `wazo` (team `nimrodmozes-gmailcoms-projects`, project id `prj_hGLEyvHlcOixQJxo5AfLAbJhvySl`) |
| Vercel root directory | `site` (already set) |
| Live URL | https://wazo-one.vercel.app |
| Database schema | `supabase/schema.sql` on branch `feat/standalone` |

## Safety rules (follow these throughout)

1. **Never print, echo, log or commit a secret value.** Read secrets from the owner with a hidden prompt (`read -s`) and pipe them straight into the target command.
2. **Never write secrets to a file in the repo**: no `.env`, no notes. If a temp file is unavoidable, create it with `mktemp` outside the repo and delete it right after.
3. Do not modify application code. This runbook only configures settings, runs the schema, and merges PR #11.
4. If any command fails twice, stop and show the owner the error (with secrets redacted).

## Step 0: Prepare

```bash
# Tools
node -v            # needs 18+
gh --version || brew install gh
gh auth status || gh auth login            # owner logs in to GitHub in the browser
npx --yes vercel@latest --version
npx vercel login                            # owner logs in to Vercel in the browser (skip if already)

# Get the code
mkdir -p ~/Desktop/"08 Wazo" && cd ~/Desktop/"08 Wazo"
[ -d wazo/.git ] || gh repo clone Kaptainymo/wazo
cd wazo && git fetch origin && git checkout feat/standalone && git pull --ff-only

# Link this folder to the existing Vercel project (do NOT create a new project)
npx vercel link --yes --project wazo --scope nimrodmozes-gmailcoms-projects
```

## Step 1: Add the environment variables in Vercel

Six variables, each added to **production, preview and development**.

**ASK** the owner for each value, one at a time, with a hidden prompt. Tell them where to find it:

| Name | Secret? | Where the owner finds it |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | console.anthropic.com → API Keys (and set a monthly spend limit under Settings → Limits) |
| `SUPABASE_URL` | no | Supabase → Project Settings → API → Project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | yes | Supabase → Project Settings → API → `service_role` key |
| `TURNSTILE_SECRET` | yes | Cloudflare → Turnstile → the Wazo widget → Secret key |
| `TURNSTILE_SITEKEY` | no | Same widget → Site key |
| `IP_SALT` | yes | **Generate it, don't ask**: `openssl rand -hex 32` |

Use this helper. It never shows the value:

```bash
add_env () {  # usage: add_env NAME   (prompts hidden, adds to all three environments)
  local name="$1" val
  if [ "$name" = "IP_SALT" ]; then val="$(openssl rand -hex 32)"; else
    printf "Paste %s (hidden), then Enter: " "$name"; read -rs val; echo; fi
  [ -z "$val" ] && { echo "Empty value, skipped $name"; return 1; }
  for target in production preview development; do
    npx vercel env rm "$name" "$target" --yes >/dev/null 2>&1 || true
    printf "%s" "$val" | npx vercel env add "$name" "$target" >/dev/null && echo "✓ $name → $target"
  done
  unset val
}
for n in ANTHROPIC_API_KEY SUPABASE_URL SUPABASE_SERVICE_KEY TURNSTILE_SECRET TURNSTILE_SITEKEY IP_SALT; do add_env "$n"; done
```

Verify (names only, values stay hidden):

```bash
npx vercel env ls
```

Expected: all six names listed for Production, Preview and Development. Optional extras the owner may want later: `UMAMI_WEBSITE_ID`, `WAZO_MODEL`, `DAILY_CAP`.

## Step 2: Create the database tables in Supabase

Pick **one** route.

### Route A: owner pastes it (no database password needed). Recommended.
1. Print the file so the owner can copy it: `cat supabase/schema.sql`
2. Tell the owner: *Supabase → SQL Editor → New query → paste → Run.* It should say "Success. No rows returned".
3. **ASK** the owner to confirm it ran.

### Route B: run it from the terminal
**ASK** the owner for the database connection string (Supabase → **Connect** → "Session pooler" URI, with the database password filled in). Read it hidden and run:

```bash
command -v psql >/dev/null || brew install libpq && brew link --force libpq
printf "Paste the Supabase connection string (hidden): "; read -rs DBURL; echo
psql "$DBURL" -v ON_ERROR_STOP=1 -f supabase/schema.sql && \
psql "$DBURL" -Atc "select table_name from information_schema.tables where table_schema='public' and table_name in ('leads','wazos') order by 1;"
unset DBURL
```

Expected output: `leads` and `wazos`.

## Step 3: Ship it

The code goes live only after Steps 1 and 2 are done.

```bash
gh pr ready 11 --repo Kaptainymo/wazo
gh pr checks 11 --repo Kaptainymo/wazo --watch || true   # Vercel preview check, if shown
gh pr merge 11 --repo Kaptainymo/wazo --merge
```

Vercel deploys `main` automatically. Wait about a minute, then verify:

```bash
sleep 60
curl -s https://wazo-one.vercel.app/api/config
```

Expected: `{"ready":true,"siteKey":"0x…","umami":""}`

- `"ready":false` means a variable is missing or misspelled. Re-run Step 1 for it, then redeploy with `npx vercel --prod`.
- A 404 means the deploy isn't finished. Wait and retry.

### Final check (owner, on the phone)
1. Open https://wazo-one.vercel.app in a **private** window.
2. Type an idea → **Analyze**. Expect the receipt within about 30 seconds, with the verdict locked.
3. Review the lines, then sign up with a real email. Expect the verdict and the 7-day test to open.
4. In Supabase → Table Editor → `leads`: the email should be there with `free_used = true`.

Report back to the owner with: the env vars set (names only), schema done, PR #11 merged, `/api/config` result, and anything that failed.

## Rollback

If the live site misbehaves after the merge: Vercel → wazo → Deployments → the previous production deployment → **Promote to Production**. Nothing in the database needs undoing.
