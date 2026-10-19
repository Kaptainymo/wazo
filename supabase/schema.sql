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
  unlocked   boolean     not null default false
);

create index if not exists wazos_ip_time on wazos (ip_hash, created_at desc);
create index if not exists wazos_time    on wazos (created_at desc);

alter table leads enable row level security;
alter table wazos enable row level security;
