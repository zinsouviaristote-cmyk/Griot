import { Music4 } from "lucide-react";
import { SongListItem } from "@/components/dashboard/library/SongListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { songsToQueue } from "@/lib/player/songToTrack";
import type { Song } from "@/lib/types";

// Mêmes lignes que la bibliothèque (voir PublicationsView, qui applique déjà ce
// principe) : `songs` arrive pré-triée par écoutes décroissantes, jamais
// re-triée ici — un seul endroit décide de l'ordre (voir mock-stats.ts).
export function PopularSongsList({ songs }: { songs: Song[] }) {
  if (songs.length === 0) {
    return (
      <EmptyState
        icon={Music4}
        title="Rien à classer pour l'instant"
        description="Publiez une chanson dans Explorer pour voir ici celles qui touchent le plus de monde."
        actionLabel="Voir ma bibliothèque"
        actionHref="/bibliotheque"
      />
    );
  }

  const queue = songsToQueue(songs);

  return (
    <div className="flex flex-col gap-3">
      {songs.map((song, index) => (
        <SongListItem key={song.id} song={song} index={index} queue={queue} />
      ))}
    </div>
  );
}
