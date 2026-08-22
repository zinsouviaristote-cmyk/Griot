import { createClient } from "@/lib/supabase/client";
import type { Song, Contact, DashboardUser, PublishedSong, CreditTransaction, Occasion, MusicStyle, SongStatus, Relationship } from "@/lib/types";

interface DBProfile {
  id: string;
  first_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  credit_balance: number;
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
  relationship: string;
  birthday: string;
  phone: string | null;
  note: string | null;
}

interface DBSong {
  id: string;
  recipient_first_name: string;
  relationship: string;
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
        firstName: user.user_metadata?.full_name || user.user_metadata?.first_name || fallbackName,
        initials: (user.email?.slice(0, 2) || fallbackName.slice(0, 2)).toUpperCase(),
        email: user.email || "",
        creditBalance: 0,
        phone: null,
        photoUrl: user.user_metadata?.avatar_url || null,
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
      firstName: name,
      initials: name.slice(0, 2).toUpperCase(),
      email: profile.email || user.email || "",
      creditBalance: profile.credit_balance ?? 0,
      phone: profile.phone,
      photoUrl: resolvedPhotoUrl,
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
      relationship: c.relationship as Relationship,
      birthday: c.birthday,
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
        relationship: contact.relationship,
        birthday: contact.birthday,
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
      relationship: c.relationship as Relationship,
      birthday: c.birthday,
      phone: c.phone,
      note: c.note,
    };
  } else {
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        user_id: user.id,
        first_name: contact.firstName,
        relationship: contact.relationship,
        birthday: contact.birthday,
        phone: contact.phone,
        note: contact.note,
      })
      .select()
      .single();

    if (error) throw error;
    const c = data as unknown as DBContact;
    return {
      id: c.id,
      firstName: c.first_name,
      relationship: c.relationship as Relationship,
      birthday: c.birthday,
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

  const songs = data as unknown as DBSong[];
  return songs.map((s) => ({
    id: s.id,
    recipientFirstName: s.recipient_first_name,
    relationship: s.relationship,
    occasion: s.occasion as Occasion,
    style: s.style as MusicStyle,
    status: s.status as SongStatus,
    createdAt: s.created_at.split("T")[0],
    durationSeconds: s.duration_seconds,
    audioUrl: s.audio_path || s.preview_audio_path || null,
    lyrics: s.lyrics,
    contactId: s.contact_id,
    listens: s.listens_count,
    imageUrl: s.image_url,
  }));
}

export async function createSongDraft(song: {
  recipientFirstName: string;
  relationship: string;
  occasion: string;
  style: string;
  contactId?: string | null;
  storyPrompt?: string;
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
      relationship: song.relationship,
      occasion: song.occasion,
      style: song.style,
      contact_id: song.contactId || null,
      story_prompt: song.storyPrompt || null,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;

  const s = data as unknown as DBSong;
  return {
    id: s.id,
    recipientFirstName: s.recipient_first_name,
    relationship: s.relationship,
    occasion: s.occasion as Occasion,
    style: s.style as MusicStyle,
    status: s.status as SongStatus,
    createdAt: s.created_at.split("T")[0],
    durationSeconds: s.duration_seconds,
    audioUrl: s.audio_path || s.preview_audio_path || null,
    lyrics: s.lyrics,
    contactId: s.contact_id,
    listens: s.listens_count,
    imageUrl: s.image_url,
  };
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
  return publications.map((p) => ({
    id: p.id,
    sourceSongId: p.source_song_id,
    mine: user ? p.user_id === user.id : false,
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
    authorName: "Griot",
    imageUrl: p.image_url,
    lyrics: p.lyrics || [],
  }));
}