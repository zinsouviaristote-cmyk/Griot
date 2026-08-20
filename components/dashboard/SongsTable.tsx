"use client";

import { Music4 } from "lucide-react";
import { SongRow } from "@/components/dashboard/SongRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Song } from "@/lib/types";

// Desktop uniquement — sur mobile, RecentSongsList affiche des cartes empilées.
export function SongsTable({
  songs,
  emptyTitle,
  emptyDescription,
}: {
  songs: Song[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const { t } = useLanguage();
  if (songs.length === 0) {
    return (
      <EmptyState
        icon={Music4}
        title={emptyTitle ?? t("dashboard.recentSongs.emptyTitle")}
        description={emptyDescription ?? t("dashboard.recentSongs.emptyDescription")}
        actionLabel={t("dashboard.primaryAction.createFirstSong")}
        actionHref="/creer"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-page text-left text-xs font-medium uppercase tracking-wide text-ink-muted">
            <th className="py-3 pl-5 pr-3 font-medium">{t("history.table.recipient")}</th>
            <th className="px-3 py-3 font-medium">{t("history.table.occasion")}</th>
            <th className="px-3 py-3 font-medium">{t("history.table.style")}</th>
            <th className="px-3 py-3 font-medium">{t("history.table.date")}</th>
            <th className="px-3 py-3 font-medium">{t("history.table.status")}</th>
            <th className="py-3 pl-3 pr-5" />
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <SongRow key={song.id} song={song} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
