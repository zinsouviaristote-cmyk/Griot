import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

// `secondary` (l'indigo rare, voir tailwind.config.ts) n'apparaît que sur cette
// seule carte, exactement l'usage "1 à 2 éléments" prescrit pour cet accent.
type Tone = "brand" | "secondary" | "warning" | "success";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  secondary: "bg-secondary/10 text-secondary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  variant,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: Tone;
  variant?: "number" | "fcfa";
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="mt-4 text-label-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">
        <CountUp target={value} variant={variant} />
      </p>
    </div>
  );
}
