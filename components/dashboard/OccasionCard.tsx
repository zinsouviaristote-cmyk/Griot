"use client";

import { ArrowUpRight } from "lucide-react";
import { OCCASION_TONES } from "@/lib/occasionTones";
import type { OccasionMeta } from "@/lib/types";

type TranslatedOccasion = OccasionMeta & {
  label: string;
  tagline: string;
};

export function OccasionCard({
  occasion,
}: {
  occasion: TranslatedOccasion;
}) {
  const tone = OCCASION_TONES[occasion.id] || {
    accentBorder: "border-brand",
    chip: "bg-brand/10 text-brand",
    hoverArrow: "bg-brand/10 text-brand",
  };

  return (
    <div
      className={`flex h-40 w-[210px] shrink-0 snap-start flex-col justify-between rounded-card border-x border-b border-t-[3px] border-x-border border-b-border bg-surface p-4 text-left shadow-card ${tone.accentBorder}`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${tone.chip}`}
        >
          <occasion.icon
            className="h-4 w-4"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>

        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-ink-muted ${tone.hoverArrow}`}
        >
          <ArrowUpRight
            className="h-4 w-4"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
      </div>

      <div>
        <p className="font-display text-lg font-semibold text-ink">
          {occasion.label}
        </p>
        <p className="mt-1 text-xs leading-snug text-ink-muted">
          {occasion.tagline}
        </p>
      </div>
    </div>
  );
}