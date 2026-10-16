-- Guests of the party. Guests never touch this table directly: the public
-- invite flow runs on the server with the secret key, and the admin area uses
-- the logged-in session (RLS below).
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null check (length(trim(name)) > 0),
  phone text check (phone ~ '^[0-9]{10,11}$'),
  source text not null default 'invite' check (source in ('invite', 'generic')),
  status text not null default 'pending' check (status in ('pending', 'yes', 'no')),
  companions_count int not null default 0 check (companions_count between 0 and 5),
  companions_names text[] not null default '{}',
  sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  constraint companions_names_fit check (cardinality(companions_names) <= companions_count)
);

-- Allowlist of admin emails (parents). Auth users must also exist in auth.users.
create table public.admins (
  email text primary key check (email = lower(email))
);

alter table public.guests enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "admins manage guests"
  on public.guests for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admins read allowlist"
  on public.admins for select
  to authenticated
  using ((select public.is_admin()));

revoke all on public.guests, public.admins from anon;
