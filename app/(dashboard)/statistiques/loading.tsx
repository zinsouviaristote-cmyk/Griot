"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  ActivityListSkeleton,
  ReferralCardSkeleton,
  SongListItemSkeleton,
  StatCardSkeleton,
  WeeklyChartCardSkeleton,
} from "@/components/ui/Skeleton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function StatistiquesLoading() {
  const { t } = useLanguage();
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("stats.pageTitle")}
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("stats.pageSubtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="mt-8">
        <WeeklyChartCardSkeleton />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <SongListItemSkeleton key={index} />
        ))}
      </div>

      <div className="mt-8">
        <ActivityListSkeleton />
      </div>

      <div className="mt-8">
        <ReferralCardSkeleton />
      </div>
    </div>
  );
}
