import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { PlayerTrack } from "@/lib/player/PlayerContext";
import type { PublishedSong, Song } from "@/lib/types";

type Translate = (key: string, vars?: Record<string, string | number>) => string;

// Un seul endroit pour construire une piste à partir d'une chanson — utilisé à
// la fois par une ligne isolée (SongListItem) et par la file d'attente qui
// l'entoure (HistoryView, PublicationsView), pour que précédent/suivant
// retrouvent exactement les mêmes métadonnées (like compris) que le clic direct.
// `publishedSongs` : les publications Explorer de l'utilisateur courant, déjà
// chargées par la page appelante — jamais recalculées ici.
export function songToTrack(song: Song, t: Translate, publishedSongs: PublishedSong[] = []): PlayerTrack | null {
  if (!song.audioUrl) return null;
  const published = publishedSongs.find((entry) => entry.sourceSongId === song.id);
  return {
    id: song.id,
    title: song.recipientFirstName,
    subtitle: `${occasionLabel(t, song.occasion)} · ${styleLabel(t, song.style)}`,
    occasion: song.occasion,
    audioUrl: song.audioUrl,
    publishedId: published?.id,
    likes: published?.likes,
  };
}

export function songsToQueue(songs: Song[], t: Translate, publishedSongs: PublishedSong[] = []): PlayerTrack[] {
  return songs.map((song) => songToTrack(song, t, publishedSongs)).filter((track): track is PlayerTrack => track !== null);
}
