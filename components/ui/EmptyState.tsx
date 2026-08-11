import type { LucideIcon } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  // Pour une action qui ouvre une modale plutôt qu'une page (ex. Mes proches) —
  // fourni à la place de `actionHref`, jamais les deux ensemble.
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="flex h-14 w-14 animate-breathe items-center justify-center rounded-full bg-brand-soft">
        <Icon className="h-6 w-6 text-brand" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="max-w-sm space-y-1.5">
        <p className="font-display text-lg font-semibold text-ink">{title}</p>
        <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} variant="primary" className="mt-1">
          {actionLabel}
        </ButtonLink>
      )}
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction} variant="primary" className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
