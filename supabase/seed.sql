-- Local development data: the 7 guests from the design mockup + one admin.

insert into public.guests (code, name, phone, status, companions_count, companions_names, sent_at, responded_at, created_at) values
  ('marina-k7q2', 'Marina Costa', '5511987650001', 'pending', 0, '{}', now() - interval '2 days', null, now() - interval '6 days'),
  ('rafael-m3vd', 'Rafael Moreira', '5511987650002', 'yes', 2, '{"Luiza Moreira","Theo Moreira"}', now() - interval '4 days', now() - interval '3 hours', now() - interval '6 days'),
  ('carla-p8xa', 'Carla Nunes', '5511987650003', 'yes', 0, '{}', now() - interval '4 days', now() - interval '1 day', now() - interval '6 days'),
  ('bruno-t2hn', 'Bruno Alves', '5521987650004', 'no', 0, '{}', now() - interval '4 days', now() - interval '2 days', now() - interval '6 days'),
  ('julia-w5ke', 'Júlia e família Pires', '5511987650005', 'yes', 3, '{"Pedro Pires","Ana Clara Pires","Dona Rosa"}', now() - interval '6 days', now() - interval '5 days', now() - interval '6 days'),
  ('diego-r9fc', 'Diego Santana', '5511987650006', 'pending', 0, '{}', null, null, now() - interval '1 day'),
  ('fernanda-b4zu', 'Fernanda Lima', '5531987650007', 'pending', 0, '{}', null, null, now() - interval '1 day');

-- Local admin: admin@festa.local / festa123
insert into public.admins (email) values ('admin@festa.local');

do $$
declare
  admin_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
    'admin@festa.local', crypt('festa123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(),
    '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), admin_id, admin_id::text,
    jsonb_build_object('sub', admin_id::text, 'email', 'admin@festa.local', 'email_verified', true),
    'email', now(), now(), now()
  );
end $$;
