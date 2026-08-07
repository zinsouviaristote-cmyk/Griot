import { Music4 } from "lucide-react";
import { SongRow } from "@/components/dashboard/SongRow";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Song } from "@/lib/types";

// Desktop uniquement — sur mobile, RecentSongsList affiche des cartes empilées.
export function SongsTable({ songs }: { songs: Song[] }) {
  if (songs.length === 0) {
    return (
      <EmptyState
        icon={Music4}
        title="Aucune chanson pour l'instant"
        description="Votre première chanson apparaîtra ici dès que vous l'aurez commencée. Ça prend deux minutes."
        actionLabel="Créer ma première chanson"
        actionHref="/creer"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-page text-left text-xs font-medium uppercase tracking-wide text-ink-muted">
            <th className="py-3 pl-5 pr-3 font-medium">Destinataire</th>
            <th className="px-3 py-3 font-medium">Occasion</th>
            <th className="px-3 py-3 font-medium">Style</th>
            <th className="px-3 py-3 font-medium">Date</th>
            <th className="px-3 py-3 font-medium">État</th>
            <th className="py-3 pl-3 pr-5" />
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <SongRow key={song.id} song={song} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
