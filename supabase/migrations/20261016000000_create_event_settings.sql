-- Editable party details (date, time, RSVP deadline and venue), managed in the admin area.
-- Single row: id is pinned to 1. Guests read it on the server with the secret key.
create table public.event_settings (
  id int primary key default 1 check (id = 1),
  starts_at timestamptz not null,
  rsvp_deadline timestamptz not null,
  venue text not null check (length(trim(venue)) > 0),
  updated_at timestamptz not null default now(),
  constraint rsvp_deadline_before_start check (rsvp_deadline <= starts_at)
);

alter table public.event_settings enable row level security;

create policy "admins manage event settings"
  on public.event_settings for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke all on public.event_settings from anon;

insert into public.event_settings (id, starts_at, rsvp_deadline, venue)
values (1, '2026-11-07T12:00:00-03:00', '2026-10-31T23:59:59-03:00', 'Clube do Jaraguá')
on conflict (id) do nothing;
