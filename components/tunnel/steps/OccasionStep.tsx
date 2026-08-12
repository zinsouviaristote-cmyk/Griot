"use client";

import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { occasionCatalog } from "@/lib/data/mock-dashboard";
import { OCCASION_TONES } from "@/lib/occasionTones";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel } from "@/lib/i18n/catalog";
import type { Occasion } from "@/lib/types";

export function OccasionStep() {
  const { t } = useLanguage();
  const { data, update, goNext } = useTunnel();

  function choose(id: Occasion) {
    update({ occasion: id });
    goNext();
  }

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("tunnel.occasion.title")}
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">{t("tunnel.occasion.subtitle")}</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {occasionCatalog.map((item) => {
          const tone = OCCASION_TONES[item.id];
          const isSelected = data.occasion === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => choose(item.id)}
              aria-pressed={isSelected}
              className={`group flex min-h-[132px] flex-col items-start justify-between rounded-card border-x border-b border-t-[3px] border-x-border border-b-border bg-surface p-4 text-left shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:scale-[0.98] active:shadow-card ${tone.accentBorder} ${
                isSelected ? "ring-2 ring-brand ring-offset-2 ring-offset-page" : ""
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 ease-magnetic group-hover:scale-110 ${tone.chip}`}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="font-display text-base font-semibold text-ink">{occasionLabel(t, item.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
