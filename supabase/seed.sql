-- ==========================================
-- SEED DATA DEMO - GRIOT
-- Reproduit fidèlement les données factices existantes (mockUser, mockSongs, etc.)
-- ==========================================

DO $$
DECLARE
  v_demo_user_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
  v_c1 UUID := '11111111-1111-1111-1111-111111111111'::UUID;
  v_c2 UUID := '22222222-2222-2222-2222-222222222222'::UUID;
  v_c3 UUID := '33333333-3333-3333-3333-333333333333'::UUID;
  v_c4 UUID := '44444444-4444-4444-4444-444444444444'::UUID;
  v_c5 UUID := '55555555-5555-5555-5555-555555555555'::UUID;
  v_c6 UUID := '66666666-6666-6666-6666-666666666666'::UUID;
  v_c7 UUID := '77777777-7777-7777-7777-777777777777'::UUID;

  v_s1 UUID := 'a1111111-1111-1111-1111-111111111111'::UUID;
  v_s2 UUID := 'a2222222-2222-2222-2222-222222222222'::UUID;
  v_s3 UUID := 'a3333333-3333-3333-3333-333333333333'::UUID;
  v_s4 UUID := 'a4444444-4444-4444-4444-444444444444'::UUID;
  v_s5 UUID := 'a5555555-5555-5555-5555-555555555555'::UUID;
  v_s6 UUID := 'a6666666-6666-6666-6666-666666666666'::UUID;
  v_s7 UUID := 'a7777777-7777-7777-7777-777777777777'::UUID;
BEGIN

  -- 1. Inscription utilisateur auth.users de test (Aïcha)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  VALUES (
    v_demo_user_id,
    '00000000-0000-0000-0000-000000000000',
    'aicha.k@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz012345',
    now(),
    '{"provider":"google","providers":["google"]}',
    '{"full_name":"Aïcha","name":"Aïcha"}',
    now(),
    now(),
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Profil utilisateur (Aïcha) avec solde de 6 Notes
  INSERT INTO public.profiles (id, first_name, email, phone, photo_url, credit_balance)
  VALUES (
    v_demo_user_id,
    'Aïcha',
    'aicha.k@example.com',
    '07 00 00 00 00',
    NULL,
    6
  )
  ON CONFLICT (id) DO UPDATE SET credit_balance = 6;

  -- 3. Contacts de test
  INSERT INTO public.contacts (id, user_id, first_name, relationship, birthday, phone, note) VALUES
  (v_c1, v_demo_user_id, 'Fatou', 'ma mère', '1965-08-18', '07 01 02 03 04', 'Aime le zouglou et les chansons douces'),
  (v_c2, v_demo_user_id, 'Moussa', 'mon ami·e', '1992-09-05', '07 05 06 07 08', 'Vient d obtenir sa promotion'),
  (v_c3, v_demo_user_id, 'Awa', 'ma femme', '1995-11-12', '07 09 10 11 12', 'Notre anniversaire de rencontre'),
  (v_c4, v_demo_user_id, 'Ibrahim', 'mon père', '1960-04-22', NULL, NULL),
  (v_c5, v_demo_user_id, 'Aminata', 'ma sœur', '1998-01-30', NULL, NULL),
  (v_c6, v_demo_user_id, 'Kader', 'mon collègue', '1990-06-15', NULL, NULL),
  (v_c7, v_demo_user_id, 'Yacouba', 'mon grand-père', '1945-12-01', NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- 4. Chansons de test (Reprend les 7 statuts)
  INSERT INTO public.songs (id, user_id, contact_id, recipient_first_name, relationship, occasion, style, status, duration_seconds, audio_path, preview_audio_path, lyrics, listens_count, first_attempt_used, created_at) VALUES
  (v_s1, v_demo_user_id, v_c1, 'Fatou', 'ma mère', 'anniversaire', 'afrobeat', 'delivered', 138, '/mock-audio.wav', '/mock-audio.wav', 'Fatou, ma mère,\ndepuis toujours tu illumines mes jours.\n\n[Refrain]\nFatou, Fatou,\ncette chanson est pour toi.', 24, true, '2026-08-02'),
  (v_s2, v_demo_user_id, v_c2, 'Moussa', 'mon ami·e', 'reussite', 'coupe_decale', 'paid', 121, '/mock-audio.wav', '/mock-audio.wav', 'Moussa, mon ami,\nte voilà arrivé au sommet.\n\n[Refrain]\nMoussa, Moussa,\nbravo pour cette victoire.', 17, true, '2026-07-28'),
  (v_s3, v_demo_user_id, v_c3, 'Awa', 'ma femme', 'amour', 'zouk', 'preview_ready', NULL, '/mock-audio.wav', '/mock-audio.wav', NULL, 5, true, '2026-07-24'),
  (v_s4, v_demo_user_id, v_c4, 'Ibrahim', 'mon père', 'hommage', 'gospel', 'awaiting_payment', NULL, '/mock-audio.wav', '/mock-audio.wav', NULL, 2, true, '2026-07-19'),
  (v_s5, v_demo_user_id, v_c5, 'Aminata', 'ma sœur', 'mariage', 'ballade_acoustique', 'generating', NULL, NULL, NULL, NULL, 0, true, '2026-07-15'),
  (v_s6, v_demo_user_id, v_c6, 'Kader', 'mon collègue', 'reussite', 'afrobeat', 'failed', NULL, NULL, NULL, NULL, 0, true, '2026-07-10'),
  (v_s7, v_demo_user_id, v_c7, 'Yacouba', 'mon grand-père', 'anniversaire', 'ballade_acoustique', 'draft', NULL, NULL, NULL, NULL, 0, false, '2026-08-06')
  ON CONFLICT (id) DO NOTHING;

  -- 5. Historique des mouvements de Notes (mouvements cohérents avec le solde de 6)
  INSERT INTO public.credit_transactions (user_id, motif, label_key, label_params, delta, balance_after, created_at) VALUES
  (v_demo_user_id, 'achat', 'recharge.history.transactions.purchase_pack', '{"notes":6}'::jsonb, 6, 6, '2026-08-01 10:00:00+00'),
  (v_demo_user_id, 'essai', 'recharge.history.transactions.essay_paid', '{"recipient":"Awa"}'::jsonb, -1, 5, '2026-08-03 14:30:00+00'),
  (v_demo_user_id, 'achat', 'recharge.history.transactions.purchase_pack', '{"notes":2}'::jsonb, 2, 7, '2026-08-04 09:15:00+00'),
  (v_demo_user_id, 'essai', 'recharge.history.transactions.essay_paid', '{"recipient":"Fatou"}'::jsonb, -1, 6, '2026-08-05 16:45:00+00')
  ON CONFLICT (id) DO NOTHING;

  -- 6. Publications Explorer
  INSERT INTO public.published_songs (id, user_id, source_song_id, recipient_first_name, hide_first_name, public_title, occasion, style, audio_url, lyrics, likes_count, listens_count, downloads_count, published_at) VALUES
  ('b1111111-1111-1111-1111-111111111111'::UUID, v_demo_user_id, v_s1, 'Fatou', false, 'Une maman en or', 'anniversaire', 'afrobeat', '/mock-audio.wav', ARRAY['Fatou, ma mère, depuis toujours tu illumines mes jours.'], 14, 182, 3, '2026-08-03 12:00:00+00'),
  ('b2222222-2222-2222-2222-222222222222'::UUID, v_demo_user_id, v_s2, 'Moussa', false, 'Félicitations Moussa !', 'reussite', 'coupe_decale', '/mock-audio.wav', ARRAY['Moussa, mon ami, te voilà arrivé au sommet.'], 8, 95, 1, '2026-07-29 15:30:00+00')
  ON CONFLICT (id) DO NOTHING;

END $$;
