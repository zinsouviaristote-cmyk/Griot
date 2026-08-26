import { createClient } from "@/lib/supabase/server";
import type { Occasion, MusicStyle, PublishedSong } from "@/lib/types";

interface DBPublishedSong {
  id: string;
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

// Lecture publique (page /chanson/[id], sans compte) — la RLS de
// published_songs autorise déjà `SELECT` à `public`, donc le client anonyme
// suffit, sans clé de service.
export async function fetchPublicSongById(id: string): Promise<PublishedSong | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("published_songs").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;

  const p = data as unknown as DBPublishedSong;
  return {
    id: p.id,
    sourceSongId: p.source_song_id,
    mine: false,
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
