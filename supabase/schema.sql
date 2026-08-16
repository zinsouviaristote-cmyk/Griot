-- ==========================================
-- SCHEMA INITIAL GRIOT - FULL STACK SUPABASE
-- Région : Europe West (Paris - eu-west-3)
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. TYPES & ENUMS
-- ------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.song_status AS ENUM (
    'draft',
    'generating',
    'preview_ready',
    'awaiting_payment',
    'paid',
    'delivered',
    'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.credit_motif AS ENUM (
    'achat',
    'essai',
    'remboursement'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------
-- 2. TABLE PROFILES (Profils Utilisateurs)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  credit_balance INT NOT NULL DEFAULT 0 CHECK (credit_balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS Profiles
DROP POLICY IF EXISTS "L'utilisateur lit son propre profil" ON public.profiles;
CREATE POLICY "L'utilisateur lit son propre profil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "L'utilisateur modifie ses infos de profil sans toucher au solde" ON public.profiles;
CREATE POLICY "L'utilisateur modifie ses infos de profil sans toucher au solde"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND credit_balance = (SELECT credit_balance FROM public.profiles WHERE id = auth.uid())
  );

-- Déclencheur automatique à l'inscription (Google OAuth / Magic Link)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, photo_url, credit_balance)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    photo_url = COALESCE(public.profiles.photo_url, EXCLUDED.photo_url),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------
-- 3. TABLE CONTACTS (Destinataires / Proches)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  birthday DATE NOT NULL,
  phone TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gestion des contacts par leur proprietaire" ON public.contacts;
CREATE POLICY "Gestion des contacts par leur proprietaire"
  ON public.contacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------
-- 4. TABLE SONGS (Chansons & Brouillons)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  recipient_first_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  occasion TEXT NOT NULL,
  style TEXT NOT NULL,
  status public.song_status NOT NULL DEFAULT 'draft',
  story_prompt TEXT,
  audio_path TEXT,
  preview_audio_path TEXT,
  lyrics TEXT,
  duration_seconds INT,
  listens_count INT NOT NULL DEFAULT 0,
  image_url TEXT,
  first_attempt_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_songs_user_id ON public.songs(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture de ses propres chansons" ON public.songs;
CREATE POLICY "Lecture de ses propres chansons"
  ON public.songs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creation de ses propres chansons en brouillon" ON public.songs;
CREATE POLICY "Creation de ses propres chansons en brouillon"
  ON public.songs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND status = 'draft'
  );

DROP POLICY IF EXISTS "Modification de ses chansons en brouillon" ON public.songs;
CREATE POLICY "Modification de ses chansons en brouillon"
  ON public.songs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND (
      status = (SELECT status FROM public.songs WHERE id = songs.id)
      OR (SELECT status FROM public.songs WHERE id = songs.id) = 'draft'
    )
  );

DROP POLICY IF EXISTS "Suppression de ses propres chansons" ON public.songs;
CREATE POLICY "Suppression de ses propres chansons"
  ON public.songs FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------
-- 5. TABLE GENERATION_ATTEMPTS (Essais de Génération)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.generation_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  prompt_snapshot TEXT NOT NULL,
  lyrics_version TEXT,
  audio_path TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generation_attempts_song ON public.generation_attempts(song_id);
ALTER TABLE public.generation_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture des essais par l'auteur" ON public.generation_attempts;
CREATE POLICY "Lecture des essais par l'auteur"
  ON public.generation_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- ------------------------------------------
-- 6. TABLE CREDIT_TRANSACTIONS (Mouvements de Notes)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  motif public.credit_motif NOT NULL,
  label_key TEXT NOT NULL,
  label_params JSONB DEFAULT '{}'::jsonb,
  delta INT NOT NULL,
  balance_after INT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture de ses mouvements de Notes" ON public.credit_transactions;
CREATE POLICY "Lecture de ses mouvements de Notes"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- AUCUNE POLITIQUE CLIENT POUR INSERT / UPDATE / DELETE

-- ------------------------------------------
-- 7. TABLE PAYMENTS (Paiements FCFA)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
  pack_id TEXT,
  amount_fcfa INT NOT NULL CHECK (amount_fcfa > 0),
  payment_method TEXT NOT NULL,
  provider_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_tx ON public.payments(provider_transaction_id);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture de ses propres paiements" ON public.payments;
CREATE POLICY "Lecture de ses propres paiements"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- AUCUNE POLITIQUE CLIENT POUR INSERT / UPDATE / DELETE

-- ------------------------------------------
-- 8. TABLES EXPLORER (Chansons Publiées, Likes & Écoutes)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.published_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
  recipient_first_name TEXT NOT NULL,
  hide_first_name BOOLEAN NOT NULL DEFAULT FALSE,
  public_title TEXT,
  occasion TEXT NOT NULL,
  style TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  lyrics TEXT[] NOT NULL DEFAULT '{}',
  likes_count INT NOT NULL DEFAULT 0,
  listens_count INT NOT NULL DEFAULT 0,
  downloads_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.published_songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique d'Explorer" ON public.published_songs;
CREATE POLICY "Lecture publique d'Explorer"
  ON public.published_songs FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Gestion de la publication par son auteur" ON public.published_songs;
CREATE POLICY "Gestion de la publication par son auteur"
  ON public.published_songs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Table des Likes
CREATE TABLE IF NOT EXISTS public.song_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published_song_id UUID NOT NULL REFERENCES public.published_songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, published_song_id)
);

ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des likes" ON public.song_likes;
CREATE POLICY "Lecture publique des likes"
  ON public.song_likes FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Gestion de ses propres likes" ON public.song_likes;
CREATE POLICY "Gestion de ses propres likes"
  ON public.song_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Journal d'écoutes
CREATE TABLE IF NOT EXISTS public.song_listens_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  published_song_id UUID REFERENCES public.published_songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.song_listens_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enregistrement anonyme ou authentifie d'ecoute" ON public.song_listens_log;
CREATE POLICY "Enregistrement anonyme ou authentifie d'ecoute"
  ON public.song_listens_log FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lecture du journal d'ecoute" ON public.song_listens_log;
CREATE POLICY "Lecture du journal d'ecoute"
  ON public.song_listens_log FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- ------------------------------------------
-- 9. VUE SECURISEE POUR PAGES PUBLIQUES PARTAGÉES
-- ------------------------------------------
CREATE OR REPLACE VIEW public.public_shared_songs AS
SELECT 
  s.id,
  s.recipient_first_name,
  s.relationship,
  s.occasion,
  s.style,
  s.duration_seconds,
  s.preview_audio_path,
  s.image_url,
  s.created_at
FROM public.songs s
WHERE s.status IN ('preview_ready', 'awaiting_payment', 'paid', 'delivered');

GRANT SELECT ON public.public_shared_songs TO anon, authenticated;

-- ------------------------------------------
-- 10. FONCTIONS RPC SERVEUR D'AUTORITÉ
-- ------------------------------------------

-- 10.1 RPC: Demande de génération musicale (Vérification et Déduction Notes)
CREATE OR REPLACE FUNCTION public.request_song_generation(
  p_song_id UUID,
  p_prompt TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_song RECORD;
  v_balance INT;
  v_is_free BOOLEAN := FALSE;
  v_attempt_count INT;
  v_attempt_id UUID;
  v_new_balance INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NON_AUTHENTIFIE';
  END IF;

  SELECT * INTO v_song FROM public.songs WHERE id = p_song_id AND user_id = v_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CHANSON_INTROUVABLE';
  END IF;

  SELECT credit_balance INTO v_balance FROM public.profiles WHERE id = v_user_id FOR UPDATE;

  -- Vérifie si 1er essai offert
  IF v_song.first_attempt_used = FALSE THEN
    v_is_free := TRUE;
    v_new_balance := v_balance;
    UPDATE public.songs SET first_attempt_used = TRUE, status = 'generating', story_prompt = COALESCE(p_prompt, story_prompt) WHERE id = p_song_id;
    
    INSERT INTO public.credit_transactions (user_id, motif, label_key, label_params, delta, balance_after, reference_id)
    VALUES (v_user_id, 'essai', 'recharge.history.transactions.essay_free', jsonb_build_object('recipient', v_song.recipient_first_name), 0, v_balance, p_song_id::text);
  ELSE
    IF v_balance < 1 THEN
      RAISE EXCEPTION 'SOLDE_NOTES_INSUFFISANT';
    END IF;
    
    v_new_balance := v_balance - 1;
    UPDATE public.profiles SET credit_balance = v_new_balance WHERE id = v_user_id;
    UPDATE public.songs SET status = 'generating', story_prompt = COALESCE(p_prompt, story_prompt) WHERE id = p_song_id;

    INSERT INTO public.credit_transactions (user_id, motif, label_key, label_params, delta, balance_after, reference_id)
    VALUES (v_user_id, 'essai', 'recharge.history.transactions.essay_paid', jsonb_build_object('recipient', v_song.recipient_first_name), -1, v_new_balance, p_song_id::text);
  END IF;

  SELECT COUNT(*) + 1 INTO v_attempt_count FROM public.generation_attempts WHERE song_id = p_song_id;

  INSERT INTO public.generation_attempts (song_id, user_id, attempt_number, is_free, prompt_snapshot, status)
  VALUES (p_song_id, v_user_id, v_attempt_count, v_is_free, COALESCE(p_prompt, v_song.story_prompt, ''), 'processing')
  RETURNING id INTO v_attempt_id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'is_free', v_is_free,
    'new_balance', v_new_balance,
    'status', 'generating'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10.2 RPC: Webhook de paiement idempotent
CREATE OR REPLACE FUNCTION public.process_payment_webhook(
  p_provider_tx_id TEXT,
  p_user_id UUID,
  p_amount INT,
  p_pack_id TEXT DEFAULT NULL,
  p_song_id UUID DEFAULT NULL,
  p_payment_method TEXT DEFAULT 'mobile_money'
)
RETURNS JSONB AS $$
DECLARE
  v_existing_payment RECORD;
  v_notes_to_add INT := 0;
  v_current_balance INT;
  v_new_balance INT;
BEGIN
  -- 1. Vérification Idempotence
  SELECT * INTO v_existing_payment FROM public.payments WHERE provider_transaction_id = p_provider_tx_id;
  IF FOUND AND v_existing_payment.status = 'completed' THEN
    RETURN jsonb_build_object('success', true, 'already_processed', true);
  END IF;

  -- 2. Traitement d'achat de Pack de Notes
  IF p_pack_id IS NOT NULL THEN
    IF p_pack_id = 'pack_2' THEN v_notes_to_add := 2;
    ELSIF p_pack_id = 'pack_6' THEN v_notes_to_add := 6;
    ELSIF p_pack_id = 'pack_10' THEN v_notes_to_add := 10;
    ELSE RAISE EXCEPTION 'PACK_INVALIDE';
    END IF;

    SELECT credit_balance INTO v_current_balance FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    v_new_balance := v_current_balance + v_notes_to_add;

    UPDATE public.profiles SET credit_balance = v_new_balance WHERE id = p_user_id;

    INSERT INTO public.credit_transactions (user_id, motif, label_key, label_params, delta, balance_after, reference_id)
    VALUES (p_user_id, 'achat', 'recharge.history.transactions.purchase_pack', jsonb_build_object('pack', p_pack_id, 'notes', v_notes_to_add), v_notes_to_add, v_new_balance, p_provider_tx_id);
  END IF;

  -- 3. Traitement du paiement direct d'une Chanson
  IF p_song_id IS NOT NULL THEN
    UPDATE public.songs SET status = 'paid' WHERE id = p_song_id;
  END IF;

  -- 4. Enregistrement du paiement
  IF FOUND AND v_existing_payment.id IS NOT NULL THEN
    UPDATE public.payments 
    SET status = 'completed', completed_at = now()
    WHERE id = v_existing_payment.id;
  ELSE
    INSERT INTO public.payments (user_id, song_id, pack_id, amount_fcfa, payment_method, provider_transaction_id, status, completed_at)
    VALUES (p_user_id, p_song_id, p_pack_id, p_amount, p_payment_method, p_provider_tx_id, 'completed', now());
  END IF;

  RETURN jsonb_build_object('success', true, 'already_processed', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10.3 RPC: Increment d'écoutes
CREATE OR REPLACE FUNCTION public.increment_listen(
  p_song_id UUID DEFAULT NULL,
  p_published_song_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF p_song_id IS NOT NULL THEN
    UPDATE public.songs SET listens_count = listens_count + 1 WHERE id = p_song_id;
  END IF;
  
  IF p_published_song_id IS NOT NULL THEN
    UPDATE public.published_songs SET listens_count = listens_count + 1 WHERE id = p_published_song_id;
  END IF;

  INSERT INTO public.song_listens_log (user_id, song_id, published_song_id)
  VALUES (auth.uid(), p_song_id, p_published_song_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
