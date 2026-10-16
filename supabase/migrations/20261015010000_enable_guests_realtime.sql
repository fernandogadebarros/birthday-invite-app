-- Admin dashboard listens to guest changes (new RSVPs, invites sent).
-- Realtime respects RLS, so only allowlisted admins receive events.
alter publication supabase_realtime add table public.guests;
