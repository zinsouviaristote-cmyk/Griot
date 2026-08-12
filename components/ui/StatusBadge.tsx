"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { SongStatus } from "@/lib/types";

// Les boutons et états actifs n'ont qu'un seul violet plein (`brand`). Ici, seule
// exception sanctionnée par la palette : `brand-light` (la "variante claire" du
// design system) distingue les deux statuts "en mouvement" sans inventer de teinte.
export const STATUS_CONFIG: Record<
  SongStatus,
  { labelKey: string; text: string; bg: string; dot: string; pulse?: boolean }
> = {
  draft: {
    labelKey: "library.status.draft",
    text: "text-ink-muted",
    bg: "bg-border",
    dot: "bg-ink-muted",
  },
  generating: {
    labelKey: "library.status.generating",
    text: "text-brand-light",
    bg: "bg-brand-light/10",
    dot: "bg-brand-light",
    // Seul statut qui représente un traitement réellement en cours côté serveur :
    // la pulsation dit "ça travaille", discrètement, sans texte qui clignote.
    pulse: true,
  },
  preview_ready: {
    labelKey: "library.status.previewReady",
    text: "text-brand",
    bg: "bg-brand/10",
    dot: "bg-brand",
  },
  awaiting_payment: {
    labelKey: "library.status.awaitingPayment",
    text: "text-warning",
    bg: "bg-warning/10",
    dot: "bg-warning",
  },
  paid: {
    labelKey: "library.status.paid",
    text: "text-success",
    bg: "bg-success/10",
    dot: "bg-success",
  },
  delivered: {
    labelKey: "library.status.paid",
    text: "text-success",
    bg: "bg-success/10",
    dot: "bg-success",
  },
  failed: {
    labelKey: "library.status.failed",
    text: "text-danger",
    bg: "bg-danger/10",
    dot: "bg-danger",
  },
};

export function StatusBadge({ status }: { status: SongStatus }) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-sm font-medium transition-colors ${config.bg} ${config.text}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        {config.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dot} opacity-60`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dot}`} />
      </span>
      {t(config.labelKey)}
    </span>
  );
}
