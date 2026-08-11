import { getOccasionLabel, styleLabels } from "@/lib/data/mock-dashboard";
import { getPublishedEntryForSong } from "@/lib/data/mock-explorer";
import type { PlayerTrack } from "@/lib/player/PlayerContext";
import type { Song } from "@/lib/types";

// Un seul endroit pour construire une piste à partir d'une chanson — utilisé à
// la fois par une ligne isolée (SongListItem) et par la file d'attente qui
// l'entoure (LibraryView, PublicationsView), pour que précédent/suivant
// retrouvent exactement les mêmes métadonnées (like compris) que le clic direct.
export function songToTrack(song: Song): PlayerTrack | null {
  if (!song.audioUrl) return null;
  const published = getPublishedEntryForSong(song.id);
  return {
    id: song.id,
    title: song.recipientFirstName,
    subtitle: `${getOccasionLabel(song.occasion)} · ${styleLabels[song.style]}`,
    occasion: song.occasion,
    audioUrl: song.audioUrl,
    publishedId: published?.id,
    likes: published?.likes,
  };
}

export function songsToQueue(songs: Song[]): PlayerTrack[] {
  return songs.map(songToTrack).filter((track): track is PlayerTrack => track !== null);
}
