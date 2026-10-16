-- "Onde": the exact spot inside the venue (e.g. a kiosk), shown on the invite card.
alter table public.event_settings
  add column spot text not null default 'Quiosque da amizade' check (length(trim(spot)) > 0);
