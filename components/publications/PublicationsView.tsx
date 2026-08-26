"use client";

import { Heart, Megaphone } from "lucide-react";
import { SongListItem } from "@/components/dashboard/historiques/SongListItem";
import { CountUp } from "@/components/ui/CountUp";
import { EmptyState } from "@/components/ui/EmptyState";
import { songsToQueue } from "@/lib/player/songToTrack";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong, Song } from "@/lib/types";

/**
 * Mêmes lignes que l'historique (SongListItem), un sous-ensemble de
 * chansons : celles présentes dans `publishedSongs` (les publications
 * Explorer réelles de l'utilisateur courant).
 */
export function PublicationsView({
  songs,
  publishedSongs,
  onPublishedSongsChange,
}: {
  songs: Song[];
  publishedSongs: PublishedSong[];
  onPublishedSongsChange: (next: PublishedSong[]) => void;
}) {
  const { t, tn } = useLanguage();
  const published = songs.filter((song) => publishedSongs.some((entry) => entry.sourceSongId === song.id));

  if (published.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title={t("publications.emptyTitle")}
        description={t("publications.emptyDescription")}
        actionLabel={t("publications.emptyAction")}
        actionHref="/historiques"
      />
    );
  }

  const totalLikes = publishedSongs.reduce((sum, entry) => sum + entry.likes, 0);
  const queue = songsToQueue(published, t, publishedSongs);

  return (
    <div>
      <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">{t("publications.likesReceived")}</p>
          <Heart className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="mt-2 font-display text-5xl font-bold text-ink">
          <CountUp target={totalLikes} />
        </p>
        <p className="mt-1 text-sm text-ink-muted">{tn("publications.publishedCount", published.length)}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {published.map((song, index) => (
          <SongListItem
            key={song.id}
            song={song}
            publishedEntry={publishedSongs.find((entry) => entry.sourceSongId === song.id) ?? null}
            index={index}
            queue={queue}
            onPublishedChange={(entry) => {
              const withoutThisSong = publishedSongs.filter((item) => item.sourceSongId !== song.id);
              onPublishedSongsChange(entry ? [...withoutThisSong, entry] : withoutThisSong);
            }}
          />
        ))}
      </div>
    </div>
  );
}
