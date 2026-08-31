import { createClient } from "@/lib/supabase/client";
import type { Song, Contact, DashboardUser, PublishedSong, CreditTransaction, Occasion, MusicStyle, SongStatus } from "@/lib/types";

interface DBProfile {
  id: string;
  first_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  credit_balance: number;
  is_admin: boolean | null;
}

interface DBCreditTransaction {
  id: string;
  created_at: string;
  motif: "achat" | "essai" | "remboursement";
  label_key: string;
  label_params: Record<string, string | number> | null;
  delta: number;
  balance_after: number;
}

interface DBContact {
  id: string;
  first_name: string;
  phone: string | null;
  note: string | null;
}

interface DBSong {
  id: string;
  recipient_first_name: string;
  occasion: string;
  style: string;
  status: string;
  created_at: string;
  duration_seconds: number | null;
  audio_path: string | null;
  preview_audio_path: string | null;
  lyrics: string | null;
  contact_id: string | null;
  listens_count: number;
  image_url: string | null;
}

interface DBPublishedSong {
  id: string;
  user_id: string;
  source_song_id: string | null;
  recipient_first_name: string;
  hide_first_name: boolean;
  public_title: string | null;
  occasion: string;
  style: string;
  audio_url: string;
  image_url: string | null;
  lyrics: string[] | null;
  likes_count: number;
  listens_count: number;
  downloads_count: number;
  published_at: string;
  author_name: string;
  author_photo_url: string | null;
}

// `audio_path` (fichier maître) vit dans le bucket privé song-masters, sans
// URL publique exploitable côté client (voir schema.sql) : l'utiliser tel
// quel comme <audio src> pointait vers un chemin relatif inexistant, d'où un
// 404 silencieux et une durée qui ne se chargeait jamais (loadedmetadata
// jamais déclenché). Seul l'extrait public (song-previews) est effectivement
// lisible ici — cohérent avec la promesse "Écoutez avant de payer" — même
// résolution que resolvePreviewAudioUrl (generationAdapters.ts), utilisée
// juste après la génération.
function resolveSongAudioUrl(previewPath: string | null): string | null {
  if (!previewPath) return null;
  const supabase = createClient();
  return supabase.storage.from("song-previews").getPublicUrl(previewPath).data.publicUrl;
}

function mapDbSong(s: DBSong): Song {
  return {
    id: s.id,
    recipientFirstName: s.recipient_first_name,
    occasion: s.occasion as Occasion,
    style: s.style as MusicStyle,
    status: s.status as SongStatus,
    createdAt: s.created_at.split("T")[0],
    durationSeconds: s.duration_seconds,
    audioUrl: resolveSongAudioUrl(s.preview_audio_path),
    audioMasterPath: s.audio_path,
    lyrics: s.lyrics,
    contactId: s.contact_id,
    listens: s.listens_count,
    imageUrl: s.image_url,
  };
}

function mapDbPublishedSong(p: DBPublishedSong, mine: boolean): PublishedSong {
  return {
    id: p.id,
    sourceSongId: p.source_song_id,
    mine,
    recipientFirstName: p.recipient_first_name,
    hideFirstName: p.hide_first_name,
    publicTitle: p.public_title,
    occasion: p.occasion as Occasion,
    style: p.style as MusicStyle,
    audioUrl: p.audio_url,
    likes: p.likes_count,
    listens: p.listens_count,
    downloads: p.downloads_count,
    publishedAt: p.published_at.split("T")[0],
    authorName: p.author_name,
    authorPhotoUrl: p.author_photo_url,
    imageUrl: p.image_url,
    lyrics: p.lyrics || [],
  };
}

// ==========================================
// ADAPTATEURS PROFIL UTILISATEUR & NOTES
// ==========================================
export async function fetchUserProfile(): Promise<DashboardUser | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const fallbackName = user.email ? user.email.split("@")[0] : "Utilisateur";

    if (error || !data) {
      return {
        id: user.id,
        firstName: user.user_metadata?.full_name || user.user_metadata?.first_name || fallbackName,
        initials: (user.email?.slice(0, 2) || fallbackName.slice(0, 2)).toUpperCase(),
        email: user.email || "",
        creditBalance: 0,
        phone: null,
        photoUrl: user.user_metadata?.avatar_url || null,
        isAdmin: user.email === "zinsouviaristote@gmail.com",
      };
    }

    const profile = data as unknown as DBProfile;
    const name = profile.first_name || user.user_metadata?.full_name || fallbackName;

    // "" = l'utilisateur a explicitement retiré sa photo — on respecte ce
    // choix, jamais de repli sur Google dans ce cas précis. `null` (colonne
    // jamais touchée) reste le seul cas qui retombe sur avatar_url.
    const resolvedPhotoUrl =
      profile.photo_url === "" ? null : profile.photo_url || user.user_metadata?.avatar_url || null;

    return {
      id: user.id,
      firstName: name,
      initials: name.slice(0, 2).toUpperCase(),
      email: profile.email || user.email || "",
      creditBalance: profile.credit_balance ?? 0,
      phone: profile.phone,
      photoUrl: resolvedPhotoUrl,
      isAdmin: profile.is_admin === true || (profile.email || user.email) === "zinsouviaristote@gmail.com",
    };
  } catch {
    return null;
  }
}

export async function updateUserProfile({
  firstName,
  phone,
  photoFile,
  photoUrl,
}: {
  firstName: string;
  phone: string;
  photoFile: File | null;
  photoUrl?: string | null;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentification requise pour modifier le profil.");

  let storedPhotoUrl = photoUrl;
  if (photoFile) {
    if (!photoFile.type.startsWith("image/")) throw new Error("Le fichier doit être une image.");
    if (photoFile.size > 5 * 1024 * 1024) throw new Error("La photo doit faire moins de 5 Mo.");

    const extension = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("profile-photos").upload(path, photoFile, {
      cacheControl: "3600",
      contentType: photoFile.type,
      upsert: false,
    });

    if (uploadError) throw uploadError;
    storedPhotoUrl = supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
  }

  const updates: {
    first_name: string;
    phone: string | null;
    photo_url?: string | null;
  } = {
    first_name: firstName.trim(),
    phone: phone.trim() || null,
  };
  if (photoUrl !== undefined || photoFile) {
    // "" (chaîne vide) = suppression volontaire, distincte de `null` ("jamais
    // configuré, retomber sur la photo Google"). Sans cette distinction,
    // fetchUserProfile ne peut pas savoir si `null` signifie "pas encore
    // choisi" ou "l'utilisateur a explicitement retiré sa photo" — et
    // retombait à tort sur Google dans le second cas.
    updates.photo_url = storedPhotoUrl === null ? "" : (storedPhotoUrl ?? "");
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) throw error;
}

export async function fetchCreditTransactions(): Promise<CreditTransaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const transactions = data as unknown as DBCreditTransaction[];
  return transactions.map((t) => ({
    id: t.id,
    date: t.created_at.split("T")[0],
    motif: t.motif,
    labelKey: t.label_key,
    labelParams: t.label_params || undefined,
    delta: t.delta,
    balanceAfter: t.balance_after,
  }));
}

// ==========================================
// ADAPTATEURS CONTACTS / DESTINATAIRES
// ==========================================

export async function fetchUserContacts(): Promise<Contact[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    const contacts = data as unknown as DBContact[];
    return contacts.map((c) => ({
      id: c.id,
      firstName: c.first_name,
      phone: c.phone,
      note: c.note,
    }));
  } catch {
    return [];
  }
}

export async function saveUserContact(contact: Omit<Contact, "id"> & { id?: string }): Promise<Contact> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentification requise pour enregistrer un proche.");
  }

  if (contact.id) {
    const { data, error } = await supabase
      .from("contacts")
      .update({
        first_name: contact.firstName,
        phone: contact.phone,
        note: contact.note,
      })
      .eq("id", contact.id)
      .select()
      .single();

    if (error) throw error;
    const c = data as unknown as DBContact;
    return {
      id: c.id,
      firstName: c.first_name,
      phone: c.phone,
      note: c.note,
    };
  } else {
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        user_id: user.id,
        first_name: contact.firstName,
        phone: contact.phone,
        note: contact.note,
        // Colonnes encore NOT NULL en base mais retirées de Contact — le
        // produit ne les collecte plus, voir lib/types.ts.
        relationship: "",
        birthday: "",
      })
      .select()
      .single();

    if (error) throw error;
    const c = data as unknown as DBContact;
    return {
      id: c.id,
      firstName: c.first_name,
      phone: c.phone,
      note: c.note,
    };
  }
}

// ==========================================
// ADAPTATEURS CHANSONS & TUNNEL
// ==========================================

export async function fetchUserSongs(): Promise<Song[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as DBSong[]).map(mapDbSong);
}

// Fichier maître complet (pas l'extrait) — n'aboutit que si le viewer a le
// droit de lire ce chemin dans le bucket privé song-masters (politique
// storage.objects "Admin lit tous les fichiers maitres", voir schema.sql) ;
// sinon Supabase Storage refuse la signature et on renvoie simplement null.
export async function resolveSongMasterUrl(masterPath: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("song-masters").createSignedUrl(masterPath, 3600);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function fetchSongById(id: string): Promise<Song | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("songs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapDbSong(data as unknown as DBSong);
}

export async function deleteSong(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) throw error;
}

export async function updateSongImage(id: string, imageUrl: string | null): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("songs").update({ image_url: imageUrl }).eq("id", id);
  if (error) throw error;
}

export async function uploadSongCover(songId: string, file: File): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentification requise pour changer la pochette.");

  if (!file.type.startsWith("image/")) throw new Error("Le fichier doit être une image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("La pochette doit faire moins de 5 Mo.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${songId}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("song-covers").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const publicUrl = supabase.storage.from("song-covers").getPublicUrl(path).data.publicUrl;
  await updateSongImage(songId, publicUrl);
  return publicUrl;
}

export async function createSongDraft(song: {
  recipientFirstName: string;
  occasion: string;
  style: string;
  contactId?: string | null;
  storyPrompt?: string;
  durationSeconds?: number; // <--- Ajouté
}): Promise<Song> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentification requise pour créer un brouillon.");
  }

  const { data, error } = await supabase
    .from("songs")
    .insert({
      user_id: user.id,
      recipient_first_name: song.recipientFirstName,
      relationship: "",
      occasion: song.occasion,
      style: song.style,
      contact_id: song.contactId || null,
      story_prompt: song.storyPrompt || null,
      duration_seconds: song.durationSeconds ?? 120, // <--- Ajouté (ex: 120 secondes par défaut)
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbSong(data as unknown as DBSong);
}
// ==========================================
// ADAPTATEURS EXPLORER & PUBLICATIONS
// ==========================================

export async function fetchPublishedExplorerSongs(): Promise<PublishedSong[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("published_songs")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const { data: { user } } = await supabase.auth.getUser();

  const publications = data as unknown as DBPublishedSong[];
  return publications.map((p) => mapDbPublishedSong(p, user ? p.user_id === user.id : false));
}

export async function fetchMyPublishedSongs(): Promise<PublishedSong[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("published_songs")
    .select("*")
    .eq("user_id", user.id)
    .order("published_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as DBPublishedSong[]).map((p) => mapDbPublishedSong(p, true));
}

export async function publishSong(input: {
  sourceSongId: string;
  recipientFirstName: string;
  hideFirstName: boolean;
  publicTitle: string | null;
  occasion: string;
  style: string;
  audioUrl: string;
  imageUrl: string | null;
  lyrics: string[];
}): Promise<PublishedSong> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentification requise pour publier une chanson.");

  const { data: profileData } = await supabase.from("profiles").select("first_name, photo_url").eq("id", user.id).maybeSingle();
  const profile = profileData as unknown as { first_name?: string; photo_url?: string | null } | null;
  const authorName =
    profile?.first_name ||
    user.user_metadata?.full_name ||
    (user.email ?? "").split("@")[0] ||
    "";
  // Même résolution que fetchUserProfile : "" = photo explicitement retirée
  // (jamais de repli sur Google dans ce cas), `null` = jamais configurée.
  const authorPhotoUrl =
    profile?.photo_url === "" ? null : profile?.photo_url || user.user_metadata?.avatar_url || null;

  const { data, error } = await supabase
    .from("published_songs")
    .insert({
      user_id: user.id,
      source_song_id: input.sourceSongId,
      recipient_first_name: input.recipientFirstName,
      hide_first_name: input.hideFirstName,
      public_title: input.publicTitle,
      occasion: input.occasion,
      style: input.style,
      audio_url: input.audioUrl,
      image_url: input.imageUrl,
      lyrics: input.lyrics,
      author_name: authorName,
      author_photo_url: authorPhotoUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbPublishedSong(data as unknown as DBPublishedSong, true);
}

export async function unpublishSong(publishedSongId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("published_songs").delete().eq("id", publishedSongId);
  if (error) throw error;
}

export async function fetchMyLikedPublishedSongIds(): Promise<Set<string>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase.from("song_likes").select("published_song_id").eq("user_id", user.id);
  if (error) throw error;
  return new Set((data as unknown as { published_song_id: string }[] | null)?.map((row) => row.published_song_id) ?? []);
}

export async function toggleSongLike(publishedSongId: string): Promise<{ liked: boolean; likesCount: number }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("toggle_song_like", { p_published_song_id: publishedSongId });
  if (error) throw error;
  const result = data as unknown as { liked: boolean; likes_count: number };
  return { liked: result.liked, likesCount: result.likes_count };
}

export async function recordSongListen(input: { songId?: string; publishedSongId?: string }): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("increment_listen", {
    p_song_id: input.songId,
    p_published_song_id: input.publishedSongId,
  });
  if (error) throw error;
}

export async function recordSongDownload(publishedSongId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("increment_download", { p_published_song_id: publishedSongId });
  if (error) throw error;
}