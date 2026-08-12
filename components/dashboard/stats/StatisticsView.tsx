"use client";

import { Download, Ear, Heart, Megaphone, Music4 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PopularSongsList } from "@/components/dashboard/stats/PopularSongsList";
import { RecentActivityList } from "@/components/dashboard/stats/RecentActivityList";
import { ReferralCard } from "@/components/dashboard/stats/ReferralCard";
import { WeeklyListensChart } from "@/components/dashboard/stats/WeeklyListensChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ActivityEntry, MyStatsTotals, ReferralStats, WeeklyListenPoint } from "@/lib/data/mock-stats";
import type { Song } from "@/lib/types";

// Cette page ne parle que des chansons publiées — jamais des brouillons, des
// extraits privés ou des chansons jamais partagées, qui n'ont ni public ni
// bouche-à-oreille à mesurer. Chaque bloc gère son propre état vide (une
// invitation à publier), plutôt qu'un graphique ou une liste plate à zéro.
export function StatisticsView({
  totals,
  weeklyListens,
  popularSongs,
  recentActivity,
  referral,
}: {
  totals: MyStatsTotals;
  weeklyListens: WeeklyListenPoint[];
  popularSongs: Song[];
  recentActivity: ActivityEntry[];
  referral: ReferralStats;
}) {
  const { t } = useLanguage();
  const hasListens = weeklyListens.some((point) => point.count > 0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Reveal delayMs={0}>
          <StatCard icon={Ear} label={t("stats.cards.listens")} value={totals.listens} tone="brand" />
        </Reveal>
        <Reveal delayMs={90}>
          <StatCard icon={Heart} label={t("stats.cards.likes")} value={totals.likes} tone="secondary" />
        </Reveal>
        <Reveal delayMs={180}>
          <StatCard icon={Download} label={t("stats.cards.downloads")} value={totals.downloads} tone="success" />
        </Reveal>
        <Reveal delayMs={270}>
          <StatCard icon={Music4} label={t("stats.cards.listeningTime")} value={totals.listeningSeconds} tone="brand" variant="duration" />
        </Reveal>
        <Reveal delayMs={360}>
          <StatCard icon={Megaphone} label={t("stats.cards.publishedSongs")} value={totals.publishedCount} tone="secondary" />
        </Reveal>
      </div>

      <Reveal delayMs={80} className="mt-8">
        <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
          <SectionTitle>{t("stats.weeklyChart.title")}</SectionTitle>
          <div className="mt-5">
            {hasListens ? (
              <WeeklyListensChart points={weeklyListens} />
            ) : (
              <EmptyState icon={Ear} title={t("stats.weeklyChart.emptyTitle")} description={t("stats.weeklyChart.emptyDescription")} />
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delayMs={120} className="mt-8">
        <SectionTitle>{t("stats.popularSongs.title")}</SectionTitle>
        <div className="mt-5">
          <PopularSongsList songs={popularSongs} />
        </div>
      </Reveal>

      <Reveal delayMs={160} className="mt-8">
        <SectionTitle>{t("stats.recentActivity.title")}</SectionTitle>
        <div className="mt-5">
          <RecentActivityList entries={recentActivity} />
        </div>
      </Reveal>

      <Reveal delayMs={200} className="mt-8">
        <ReferralCard stats={referral} />
      </Reveal>
    </div>
  );
}
