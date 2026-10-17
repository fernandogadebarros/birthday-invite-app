-- Venue naming for the invite: only rewrites the original defaults, so values edited in the admin are kept.
update public.event_settings
set venue = 'Jaraguá Clube Campestre', updated_at = now()
where id = 1 and venue = 'Clube do Jaraguá';

update public.event_settings
set spot = 'Quiosque da Amizade', updated_at = now()
where id = 1 and spot = 'Quiosque da amizade';

alter table public.event_settings
  alter column spot set default 'Quiosque da Amizade';
