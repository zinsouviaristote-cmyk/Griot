"use client";

import { LibraryView } from "@/components/dashboard/library/LibraryView";
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
          {t("library.pageTitle")}
        </SectionTitle>
        <p className="mt-2 max-w-xl text-body-md text-ink-muted">{t("library.pageSubtitle")}</p>
      </div>

      <Reveal delayMs={80} className="mt-6">
        <LibraryView songs={songs} />
      </Reveal>
    </div>
  );
}
