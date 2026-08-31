import { createClient } from "@/lib/supabase/client";
import type { Song } from "@/lib/types";

export interface AdminStats {
  totalSongs: number;
  totalUsers: number;
  totalRevenueFcfa: number;
  totalNotesSold: number;
  totalListens: number;
  totalPublications: number;
}

export interface AdminOverview {
  users: Array<{ id: string; name: string; email: string; credits: number; createdAt: string }>;
  songs: Array<{ id: string; recipient: string; status: string; createdAt: string; listens: number }>;
  payments: Array<{ id: string; email: string; amount: number; status: string; createdAt: string }>;
  publications: Array<{ id: string; title: string; authorEmail: string; likes: number; listens: number; publishedAt: string }>;
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    if (user.email === "zinsouviaristote@gmail.com") return true;

    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    return (data as unknown as { is_admin?: boolean })?.is_admin === true;
  } catch {
    return false;
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_admin_stats");

  if (error) throw new Error(`Impossible de récupérer les statistiques réelles : ${error.message}`);
  if (!data) throw new Error("Aucune statistique réelle n'a été renvoyée par Supabase.");

  const res = data as unknown as {
    total_songs: number;
    total_users: number;
    total_revenue_fcfa: number;
    total_notes_sold: number;
    total_listens: number;
    total_publications: number;
  };

  return {
    totalSongs: res.total_songs,
    totalUsers: res.total_users,
    totalRevenueFcfa: res.total_revenue_fcfa,
    totalNotesSold: res.total_notes_sold,
    totalListens: res.total_listens,
    totalPublications: res.total_publications,
  };
}

export async function fetchAdminRecentSongs(): Promise<Song[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_admin_recent_songs");
  if (error) throw new Error(`Impossible de récupérer les chansons récentes : ${error.message}`);
  if (!data) return [];

  return (data as unknown as Array<{
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
  }>).map((song) => ({
    id: song.id,
    recipientFirstName: song.recipient_first_name,
    occasion: song.occasion as Song["occasion"],
    style: song.style as Song["style"],
    status: song.status as Song["status"],
    createdAt: song.created_at.split("T")[0],
    durationSeconds: song.duration_seconds,
    // Meme resolution que dataAdapters.ts::mapDbSong : audio_path (bucket
    // prive song-masters) n'a pas d'URL publique exploitable cote client,
    // seul l'extrait public (song-previews) est effectivement lisible.
    audioUrl: song.preview_audio_path
      ? supabase.storage.from("song-previews").getPublicUrl(song.preview_audio_path).data.publicUrl
      : null,
    lyrics: song.lyrics,
    contactId: song.contact_id,
    listens: song.listens_count,
    imageUrl: song.image_url,
  }));
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_admin_overview_data");
  if (error) throw new Error(`Impossible de récupérer les données détaillées : ${error.message}`);

  const overview = (data ?? {}) as unknown as {
    users?: AdminOverview["users"];
    songs?: AdminOverview["songs"];
    payments?: AdminOverview["payments"];
    publications?: AdminOverview["publications"];
  };

  return {
    users: overview.users ?? [],
    songs: overview.songs ?? [],
    payments: overview.payments ?? [],
    publications: overview.publications ?? [],
  };
}
