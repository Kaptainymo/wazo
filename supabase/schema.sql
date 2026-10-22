-- Wazo database. Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Only the server (service key) touches these tables. Row level security is on
-- with no policies, so the public anon key can read or write nothing.

create table if not exists leads (
  email            text primary key,
  name             text,
  marketing        boolean     not null default false,
  lang             text,
  free_used        boolean     not null default false,
  plan             text,                 -- '' | 'pro'  (set by the payment webhook later)
  plan_interest    text,                 -- what they tapped on "hold my launch price"
  plan_interest_at timestamptz,
  delete_requested boolean     not null default false,
  delete_at        timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists wazos (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ip_hash    text,
  email      text references leads(email) on delete set null,
  lang       text,
  idea       text,
  verdict    text,
  result     jsonb,
  unlocked   boolean     not null default false,
  unlock_ip_hash text,
  unlocked_at    timestamptz
);

create index if not exists wazos_ip_time on wazos (ip_hash, created_at desc);
create index if not exists wazos_time    on wazos (created_at desc);
create index if not exists wazos_unlock  on wazos (unlock_ip_hash, unlocked_at desc);

-- If you already ran an older version of this file, these two lines add the new columns:
alter table wazos add column if not exists unlock_ip_hash text;
alter table wazos add column if not exists unlocked_at timestamptz;

-- How many free wazos a lead has claimed so far (replaces the old free_used flag).
alter table leads add column if not exists free_claimed integer not null default 0;

alter table leads enable row level security;
alter table wazos enable row level security;

-- Atomically claim one free wazo for this email, up to p_limit total. Returns the
-- updated row if it claimed one, or nothing if the lead is already at the limit.
create or replace function claim_free_wazo(p_email text, p_limit int)
returns setof leads
language sql
as $$
  update leads set free_claimed = free_claimed + 1
  where email = p_email and free_claimed < p_limit
  returning *;
$$;

-- Give back a free wazo claim if the analysis that used it failed.
create or replace function release_free_wazo(p_email text)
returns void
language sql
as $$
  update leads set free_claimed = greatest(free_claimed - 1, 0) where email = p_email;
$$;

-- Purchased wazo credits (from the 5-pack). Never expire, separate from the free count.
alter table leads add column if not exists paid_credits integer not null default 0;
alter table leads add column if not exists stripe_customer_id text;

-- Add n purchased credits, creating the lead row if it doesn't exist yet
-- (someone can buy before ever signing up through the normal flow).
create or replace function add_paid_credits(p_email text, p_n int)
returns setof leads
language sql
as $$
  insert into leads (email, paid_credits) values (p_email, p_n)
  on conflict (email) do update set paid_credits = leads.paid_credits + excluded.paid_credits
  returning *;
$$;

-- Atomically spend one purchased credit. Only succeeds if at least one is left.
create or replace function claim_paid_wazo(p_email text)
returns setof leads
language sql
as $$
  update leads set paid_credits = paid_credits - 1
  where email = p_email and paid_credits > 0
  returning *;
$$;
