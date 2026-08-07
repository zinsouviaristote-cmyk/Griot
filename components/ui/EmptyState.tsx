import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-line-700 bg-ink-900/40 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-signature-soft">
        <Icon className="h-6 w-6 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="max-w-sm space-y-1.5">
        <p className="font-display text-lg font-semibold text-paper-100">{title}</p>
        <p className="text-sm leading-relaxed text-paper-500">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} variant="primary" className="mt-1">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
