-- Guest phones are now stored with the country code: 55 + DDD + number.
alter table public.guests drop constraint if exists guests_phone_check;

update public.guests set phone = '55' || phone where phone ~ '^[0-9]{10,11}$';

alter table public.guests
  add constraint guests_phone_check check (phone ~ '^55[0-9]{10,11}$');

-- The WhatsApp message already adds the street address, so the venue keeps only the place name.
update public.event_settings
set venue = 'Jaraguá Clube Campestre', updated_at = now()
where id = 1 and venue like 'Jaraguá Clube Campestre - %';

update public.event_settings
set spot = 'Quiosque da Amizade', updated_at = now()
where id = 1 and spot = 'Quiosque da amizade';
