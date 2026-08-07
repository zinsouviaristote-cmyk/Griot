import type { SongStatus } from "@/lib/types";

const STATUS_CONFIG: Record<SongStatus, { label: string; text: string; bg: string; dot: string }> = {
  draft: {
    label: "Brouillon",
    text: "text-paper-400",
    bg: "bg-signal-neutral-bg",
    dot: "bg-signal-neutral",
  },
  generating: {
    label: "En cours",
    text: "text-signal-info",
    bg: "bg-signal-info-bg",
    dot: "bg-signal-info",
  },
  preview_ready: {
    label: "Extrait prêt",
    text: "text-signal-preview",
    bg: "bg-signal-preview-bg",
    dot: "bg-signal-preview",
  },
  awaiting_payment: {
    label: "En attente de paiement",
    text: "text-gold-400",
    bg: "bg-signal-warn-bg",
    dot: "bg-signal-warn",
  },
  paid: {
    label: "Payée",
    text: "text-signal-success",
    bg: "bg-signal-success-bg",
    dot: "bg-signal-success",
  },
  delivered: {
    label: "Payée",
    text: "text-signal-success",
    bg: "bg-signal-success-bg",
    dot: "bg-signal-success",
  },
  failed: {
    label: "Échec",
    text: "text-signal-error",
    bg: "bg-signal-error-bg",
    dot: "bg-signal-error",
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
