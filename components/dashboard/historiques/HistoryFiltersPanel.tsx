"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { SongStatus } from "@/lib/types";

const STATUS_OPTIONS: { status: SongStatus; labelKey: string }[] = [
  { status: "draft", labelKey: "history.status.draft" },
  { status: "generating", labelKey: "history.status.generating" },
  { status: "preview_ready", labelKey: "history.status.previewReady" },
  { status: "paid", labelKey: "history.status.paid" },
  { status: "failed", labelKey: "history.status.failed" },
];

/**
 * Panneau de filtres par état — multi-sélection, contrairement aux puces à
 * choix unique d'avant. Le bouton affiche le nombre de filtres actifs plutôt
 * que leurs noms : à plus de deux ou trois cochés, les lister rendrait le
 * bouton plus large que ce qu'il déclenche.
 */
export function HistoryFiltersPanel({
  active,
  onChange,
}: {
  active: Set<SongStatus>;
  onChange: (next: Set<SongStatus>) => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  function toggle(status: SongStatus) {
    const next = new Set(active);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    onChange(next);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
          active.size > 0
            ? "border-brand bg-brand-soft text-brand"
            : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        {active.size > 0 ? t("history.filters.buttonWithCount", { count: active.size }) : t("history.filters.button")}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label={t("history.filters.close")}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-64 animate-pop-in rounded-card border border-border bg-surface p-3 shadow-card-hover sm:left-auto sm:right-0">
            <div className="flex items-center justify-between px-1">
              <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">{t("history.filters.stateLabel")}</p>
              {active.size > 0 && (
                <button
                  type="button"
                  onClick={() => onChange(new Set())}
                  className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                >
                  <X className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                  {t("history.filters.reset")}
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-col">
              {STATUS_OPTIONS.map(({ status, labelKey }) => (
                <label
                  key={status}
                  className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-control px-2 text-sm text-ink transition-colors hover:bg-page"
                >
                  <input
                    type="checkbox"
                    checked={active.has(status)}
                    onChange={() => toggle(status)}
                    className="h-4 w-4 shrink-0 rounded border-border text-brand focus-visible:outline-none focus-visible:shadow-ring-focus"
                  />
                  {t(labelKey)}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
