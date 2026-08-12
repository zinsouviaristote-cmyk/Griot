"use client";

import { PublicationsView } from "@/components/publications/PublicationsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Song } from "@/lib/types";

export function PublicationsPageBody({ songs }: { songs: Song[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("publications.pageTitle")}
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("publications.pageSubtitle")}</p>

      <Reveal delayMs={80} className="mt-6">
        <PublicationsView songs={songs} />
      </Reveal>
    </div>
  );
}
