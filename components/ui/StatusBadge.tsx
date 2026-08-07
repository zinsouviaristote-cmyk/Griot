import type { SongStatus } from "@/lib/types";

// La palette du produit n'a qu'une seule couleur de marque : `brand` (profond) et
// `brand-vivid` (vif) en donnent deux nuances distinctes pour les deux statuts
// "en mouvement" (generating / preview_ready), sans inventer de teinte hors palette.
const STATUS_CONFIG: Record<SongStatus, { label: string; text: string; bg: string; dot: string }> = {
  draft: {
    label: "Brouillon",
    text: "text-ink-muted",
    bg: "bg-border",
    dot: "bg-ink-muted",
  },
  generating: {
    label: "En cours",
    text: "text-brand-vivid",
    bg: "bg-brand-vivid/10",
    dot: "bg-brand-vivid",
  },
  preview_ready: {
    label: "Extrait prêt",
    text: "text-brand",
    bg: "bg-brand/10",
    dot: "bg-brand",
  },
  awaiting_payment: {
    label: "En attente de paiement",
    text: "text-warning",
    bg: "bg-warning/10",
    dot: "bg-warning",
  },
  paid: {
    label: "Payée",
    text: "text-success",
    bg: "bg-success/10",
    dot: "bg-success",
  },
  delivered: {
    label: "Payée",
    text: "text-success",
    bg: "bg-success/10",
    dot: "bg-success",
  },
  failed: {
    label: "Échec",
    text: "text-danger",
    bg: "bg-danger/10",
    dot: "bg-danger",
  },
};

export function StatusBadge({ status }: { status: SongStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}
