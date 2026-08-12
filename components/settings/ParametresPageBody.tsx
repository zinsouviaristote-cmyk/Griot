"use client";

import { SettingsView } from "@/components/settings/SettingsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { DashboardUser } from "@/lib/types";

export function ParametresPageBody({
  user,
  songCount,
  publishedCount,
}: {
  user: DashboardUser;
  songCount: number;
  publishedCount: number;
}) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        {t("settings.pageTitle")}
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">{t("settings.pageSubtitle")}</p>

      <Reveal delayMs={80} className="mt-6">
        <SettingsView user={user} songCount={songCount} publishedCount={publishedCount} />
      </Reveal>
    </div>
  );
}
