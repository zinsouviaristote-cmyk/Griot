import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

type Tone = "brand" | "info" | "gold" | "success";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-500/15 text-brand-400",
  info: "bg-signal-info/15 text-signal-info",
  gold: "bg-gold-500/15 text-gold-400",
  success: "bg-signal-success/15 text-signal-success",
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
    <div className="rounded-card border border-line-800 bg-ink-900/70 p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-line-700 hover:shadow-card-hover">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs font-medium text-paper-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-paper-100">
        <CountUp target={value} variant={variant} />
      </p>
    </div>
  );
}
