"use client";

import { useState } from "react";
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

  const [customText, setCustomText] = useState(data.customOccasion || "");
  const [error, setError] = useState(false);

  function handleSelect(id: Occasion) {
    if (id === "autre") {
      // Sélectionne l'occasion "autre" et attend la saisie utilisateur
      update({ occasion: "autre" });
    } else {
      // Réinitialise customOccasion si une occasion prédéfinie est choisie
      update({ occasion: id, customOccasion: "" });
      goNext();
    }
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = customText.trim();

    if (!trimmed) {
      setError(true);
      return;
    }

    setError(false);
    update({ occasion: "autre", customOccasion: trimmed });
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
              onClick={() => handleSelect(item.id)}
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
              <span className="font-display text-base font-semibold text-ink">
                {occasionLabel(t, item.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bloc de saisie textuelle pour l'occasion "Autre" */}
      {data.occasion === "autre" && (
        <form onSubmit={handleCustomSubmit} className="mt-6 space-y-4 rounded-card border border-border bg-surface p-4 shadow-card">
          <label htmlFor="custom-occasion" className="block text-body-sm font-medium text-ink">
            {t("tunnel.occasion.customLabel") ?? "Précisez votre occasion :"}
          </label>
          <input
            id="custom-occasion"
            type="text"
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              if (error) setError(false);
            }}
            placeholder={t("tunnel.occasion.customPlaceholder") ?? "Ex: Promotion, Départ en retraite..."}
            className="w-full rounded-lg border border-border bg-page px-3 py-2 text-body-sm text-ink outline-none focus:ring-2 focus:ring-brand"
            autoFocus
          />
          {error && (
            <p className="text-body-xs text-red-500">
              {t("tunnel.occasion.customError") ?? "Veuillez entrer du texte pour continuer."}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-body-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
          >
            {t("tunnel.common.continue") ?? "Continuer"}
          </button>
        </form>
      )}
    </div>
  ); 
}