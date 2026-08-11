import { Heart, Megaphone } from "lucide-react";
import { SongListItem } from "@/components/dashboard/library/SongListItem";
import { CountUp } from "@/components/ui/CountUp";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedEntryForSong } from "@/lib/data/mock-explorer";
import { songsToQueue } from "@/lib/player/songToTrack";
import type { Song } from "@/lib/types";

/**
 * Mêmes lignes que la bibliothèque (SongListItem), un sous-ensemble de
 * chansons : celles qui ont un enregistrement dans mock-explorer.ts. Dépublier
 * une ligne (menu « … ») retire son enregistrement local, exactement comme
 * avant — seule la présentation a changé, pas la mécanique.
 */
export function PublicationsView({ songs }: { songs: Song[] }) {
  const published = songs.filter((song) => getPublishedEntryForSong(song.id));

  if (published.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Rien de publié pour l'instant"
        description="Depuis la fiche d'une chanson débloquée, choisissez de la partager dans Explorer — vous gardez la main pour la retirer à tout moment."
        actionLabel="Voir ma bibliothèque"
        actionHref="/bibliotheque"
      />
    );
  }

  const totalLikes = published.reduce((sum, song) => sum + (getPublishedEntryForSong(song.id)?.likes ?? 0), 0);
  const queue = songsToQueue(published);

  return (
    <div>
      <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">Likes reçus</p>
          <Heart className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="mt-2 font-display text-5xl font-bold text-ink">
          <CountUp target={totalLikes} />
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Sur {published.length} chanson{published.length > 1 ? "s" : ""} publiée{published.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {published.map((song, index) => (
          <SongListItem key={song.id} song={song} index={index} queue={queue} />
        ))}
      </div>
    </div>
  );
}
