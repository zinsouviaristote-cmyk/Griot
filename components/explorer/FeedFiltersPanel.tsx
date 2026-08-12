"use client";

import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { occasionCatalog, MUSIC_STYLE_IDS } from "@/lib/data/mock-dashboard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { MusicStyle, Occasion } from "@/lib/types";

// Un panneau, pas une barre permanente : les filtres n'ont droit qu'à l'espace
// qu'on leur ouvre volontairement, jamais une bande fixe qui grignoterait
// l'écran de lecture (voir la consigne du produit pour Explorer).
export function FeedFiltersPanel({
  open,
  onClose,
  occasionFilter,
  onOccasionChange,
  styleFilter,
  onStyleChange,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  occasionFilter: Occasion | "toutes";
  onOccasionChange: (value: Occasion | "toutes") => void;
  styleFilter: MusicStyle | "tous";
  onStyleChange: (value: MusicStyle | "tous") => void;
  resultCount: number;
}) {
  const { t, tn } = useLanguage();
  const isFiltering = occasionFilter !== "toutes" || styleFilter !== "tous";

  return (
    <Modal open={open} onClose={onClose} labelledBy="explorer-filters-title" size="md">
      <div className="flex items-start justify-between">
        <p id="explorer-filters-title" className="font-display text-lg font-semibold text-ink">
          {t("explorer.filters.title")}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("explorer.filters.close")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-page hover:text-ink active:scale-90"
        >
          <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 text-label-md uppercase tracking-wide text-ink-muted">{t("explorer.filters.occasion")}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOccasionChange("toutes")}
          aria-pressed={occasionFilter === "toutes"}
          className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
            occasionFilter === "toutes"
              ? "border-brand bg-brand text-white"
              : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
          }`}
        >
          {t("explorer.filters.allOccasions")}
        </button>
        {occasionCatalog.map((occasion) => (
          <button
            key={occasion.id}
            type="button"
            onClick={() => onOccasionChange(occasion.id)}
            aria-pressed={occasionFilter === occasion.id}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
              occasionFilter === occasion.id
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
            }`}
          >
            {occasionLabel(t, occasion.id)}
          </button>
        ))}
      </div>

      <p className="mt-5 text-label-md uppercase tracking-wide text-ink-muted">{t("explorer.filters.style")}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onStyleChange("tous")}
          aria-pressed={styleFilter === "tous"}
          className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
            styleFilter === "tous"
              ? "border-brand bg-brand text-white"
              : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
          }`}
        >
          {t("explorer.filters.allStyles")}
        </button>
        {MUSIC_STYLE_IDS.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => onStyleChange(style)}
            aria-pressed={styleFilter === style}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
              styleFilter === style
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
            }`}
          >
            {styleLabel(t, style)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        {isFiltering ? (
          <button
            type="button"
            onClick={() => {
              onOccasionChange("toutes");
              onStyleChange("tous");
            }}
            className="text-sm font-medium text-brand hover:underline"
          >
            {t("explorer.filters.reset")}
          </button>
        ) : (
          <span />
        )}
        <Button type="button" variant="primary" onClick={onClose}>
          {tn("explorer.filters.seeResults", resultCount)}
        </Button>
      </div>
    </Modal>
  );
}
