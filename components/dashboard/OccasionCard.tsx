import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { OccasionMeta } from "@/lib/types";

export function OccasionCard({ occasion }: { occasion: OccasionMeta }) {
  return (
    <Link
      href={`/creer?occasion=${occasion.id}`}
      className={`group relative flex h-40 w-[210px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-card p-4 ${occasion.gradientClass} transition-transform duration-200 ease-out hover:-translate-y-1`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-black/10 blur-2xl transition-opacity duration-200 group-hover:opacity-70" />
      <span className="relative flex h-8 w-8 items-center justify-center self-end rounded-full bg-black/20 text-white/90 transition-transform duration-200 ease-magnetic group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="relative">
        <p className="font-display text-lg font-semibold text-white">{occasion.label}</p>
        <p className="mt-1 text-xs leading-snug text-white/80">{occasion.tagline}</p>
      </div>
    </Link>
  );
}
