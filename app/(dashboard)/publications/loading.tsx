"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { LikesFeatureCardSkeleton, SongListItemSkeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PublicationsLoading() {
  const { t } = useLanguage();
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("publications.pageTitle")}
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("publications.pageSubtitle")}</p>

      <div className="mt-6">
        <LikesFeatureCardSkeleton />
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SongListItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
