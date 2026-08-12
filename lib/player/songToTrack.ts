import { getPublishedEntryForSong } from "@/lib/data/mock-explorer";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { PlayerTrack } from "@/lib/player/PlayerContext";
import type { Song } from "@/lib/types";

type Translate = (key: string, vars?: Record<string, string | number>) => string;

// Un seul endroit pour construire une piste à partir d'une chanson — utilisé à
// la fois par une ligne isolée (SongListItem) et par la file d'attente qui
// l'entoure (LibraryView, PublicationsView), pour que précédent/suivant
// retrouvent exactement les mêmes métadonnées (like compris) que le clic direct.
export function songToTrack(song: Song, t: Translate): PlayerTrack | null {
  if (!song.audioUrl) return null;
  const published = getPublishedEntryForSong(song.id);
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

export function songsToQueue(songs: Song[], t: Translate): PlayerTrack[] {
  return songs.map((song) => songToTrack(song, t)).filter((track): track is PlayerTrack => track !== null);
}
