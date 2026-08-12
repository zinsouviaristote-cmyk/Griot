"use client";

import { Music4 } from "lucide-react";
import { SongCardMobile } from "@/components/dashboard/SongCardMobile";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Song } from "@/lib/types";

export function RecentSongsList({ songs }: { songs: Song[] }) {
  const { t } = useLanguage();
  if (songs.length === 0) {
    return (
      <EmptyState
        icon={Music4}
        title={t("dashboard.recentSongs.emptyTitle")}
        description={t("dashboard.recentSongs.emptyDescription")}
        actionLabel={t("dashboard.primaryAction.createFirstSong")}
        actionHref="/creer"
      />
    );
  }

  return (
    <div>
      <SectionTitle>{t("dashboard.recentSongs.title")}</SectionTitle>
      <div className="mt-3 flex flex-col gap-3">
        {songs.map((song, index) => (
          <Reveal key={song.id} delayMs={index * 150}>
            <SongCardMobile song={song} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
