"use client";

import { Music4 } from "lucide-react";
import { SongListItem } from "@/components/dashboard/historiques/SongListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { songsToQueue } from "@/lib/player/songToTrack";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong, Song } from "@/lib/types";

// Mêmes lignes que l'historique (voir PublicationsView, qui applique déjà ce
// principe) : `songs` arrive pré-triée par écoutes décroissantes, jamais
// re-triée ici — un seul endroit décide de l'ordre (voir StatistiquesPageBody).
export function PopularSongsList({ songs, publishedSongs }: { songs: Song[]; publishedSongs: PublishedSong[] }) {
  const { t } = useLanguage();
  if (songs.length === 0) {
    return (
      <EmptyState
        icon={Music4}
        title={t("stats.popularSongs.emptyTitle")}
        description={t("stats.popularSongs.emptyDescription")}
        actionLabel={t("stats.popularSongs.emptyAction")}
        actionHref="/historiques"
      />
    );
  }

  const queue = songsToQueue(songs, t, publishedSongs);

  return (
    <div className="flex flex-col gap-3">
      {songs.map((song, index) => (
        <SongListItem
          key={song.id}
          song={song}
          publishedEntry={publishedSongs.find((entry) => entry.sourceSongId === song.id) ?? null}
          index={index}
          queue={queue}
        />
      ))}
    </div>
  );
}
