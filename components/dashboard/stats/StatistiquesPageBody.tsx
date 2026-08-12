"use client";

import { StatisticsView } from "@/components/dashboard/stats/StatisticsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  getMyPopularSongs,
  getMyStatsTotals,
  getRecentActivity,
  getReferralStats,
  getWeeklyListens,
} from "@/lib/data/mock-stats";

const EMPTY_TOTALS = { listens: 0, likes: 0, downloads: 0, listeningSeconds: 0, publishedCount: 0 };

// Ajoutez ?vide=1 pour prévisualiser l'état d'un compte qui n'a encore rien
// publié — même convention que sur la bibliothèque et le tableau de bord.
export function StatistiquesPageBody({ isEmptyPreview }: { isEmptyPreview: boolean }) {
  const { t, locale } = useLanguage();

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("stats.pageTitle")}
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("stats.pageSubtitle")}</p>

      <Reveal delayMs={80} className="mt-6">
        <StatisticsView
          totals={isEmptyPreview ? EMPTY_TOTALS : getMyStatsTotals()}
          weeklyListens={isEmptyPreview ? [] : getWeeklyListens(locale)}
          popularSongs={isEmptyPreview ? [] : getMyPopularSongs()}
          recentActivity={isEmptyPreview ? [] : getRecentActivity(t)}
          referral={isEmptyPreview ? { pageOpens: 0, songsCreated: 0 } : getReferralStats()}
        />
      </Reveal>
    </div>
  );
}
