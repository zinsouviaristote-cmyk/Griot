import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { OccasionMeta } from "@/lib/types";

export function OccasionCard({ occasion }: { occasion: OccasionMeta }) {
  return (
    <Link
      href={`/creer?occasion=${occasion.id}`}
      className="group flex h-40 w-[210px] shrink-0 snap-start flex-col justify-between rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
          <occasion.icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-all duration-200 ease-magnetic group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-ink">{occasion.label}</p>
        <p className="mt-1 text-xs leading-snug text-ink-muted">{occasion.tagline}</p>
      </div>
    </Link>
  );
}
