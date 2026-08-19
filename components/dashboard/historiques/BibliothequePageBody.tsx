"use client";

import { HistoryView } from "./HistoryView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Song } from "@/lib/types";


export function BibliothequePageBody({ songs }: { songs: Song[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <div>
        <SectionTitle as="h1" size="lg">
          {t("history.pageTitle")}
        </SectionTitle>
        <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("history.pageSubtitle")}</p>
      </div>

      <Reveal delayMs={80} className="mt-6">
        <HistoryView songs={songs} />
      </Reveal>
    </div>
  );
}
