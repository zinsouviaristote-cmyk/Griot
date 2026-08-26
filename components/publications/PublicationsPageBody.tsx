"use client";

import { PublicationsView } from "@/components/publications/PublicationsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong, Song } from "@/lib/types";

export function PublicationsPageBody({
  songs,
  publishedSongs,
  onPublishedSongsChange,
}: {
  songs: Song[];
  publishedSongs: PublishedSong[];
  onPublishedSongsChange: (next: PublishedSong[]) => void;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("publications.pageTitle")}
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("publications.pageSubtitle")}</p>

      <Reveal delayMs={80} className="mt-6">
        <PublicationsView songs={songs} publishedSongs={publishedSongs} onPublishedSongsChange={onPublishedSongsChange} />
      </Reveal>
    </div>
  );
}
