"use client";

import { StatisticsView } from "@/components/dashboard/stats/StatisticsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong, Song } from "@/lib/types";

const EMPTY_TOTALS = { listens: 0, likes: 0, downloads: 0, listeningSeconds: 0, publishedCount: 0 };

// Ajoutez ?vide=1 pour prévisualiser l'état d'un compte qui n'a encore rien
// publié — même convention que sur la bibliothèque et le tableau de bord.
export function StatistiquesPageBody({
  isEmptyPreview,
  songs,
  published,
}: {
  isEmptyPreview: boolean;
  songs: Song[];
  published: PublishedSong[];
}) {
  const { t } = useLanguage();
  const popularSongs = published
    .map((publication) => songs.find((song) => song.id === publication.sourceSongId))
    .filter((song): song is Song => Boolean(song))
    .sort((a, b) => b.listens - a.listens);
  const totals = published.reduce(
    (result, publication) => {
      const source = songs.find((song) => song.id === publication.sourceSongId);
      return {
        listens: result.listens + publication.listens,
        likes: result.likes + publication.likes,
        downloads: result.downloads + publication.downloads,
        listeningSeconds: result.listeningSeconds + (source?.durationSeconds ?? 150) * publication.listens,
        publishedCount: result.publishedCount + 1,
      };
    },
    { listens: 0, likes: 0, downloads: 0, listeningSeconds: 0, publishedCount: 0 },
  );
  const emptyTotals = { listens: 0, likes: 0, downloads: 0, listeningSeconds: 0, publishedCount: 0 };

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("stats.pageTitle")}
      </SectionTitle>
      <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{t("stats.pageSubtitle")}</p>

      <Reveal delayMs={80} className="mt-5">
        <StatisticsView
          totals={isEmptyPreview ? emptyTotals : totals}
          popularSongs={isEmptyPreview ? [] : popularSongs}
          recentActivity={[]}
          referral={{ pageOpens: 0, songsCreated: 0 }}
        />
      </Reveal>
    </div>
  );
}
