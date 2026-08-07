"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OccasionCard } from "@/components/dashboard/OccasionCard";
import { occasionCatalog } from "@/lib/data/mock-dashboard";

export function OccasionCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 230, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-paper-100">Par occasion</h2>
        <div className="hidden gap-1.5 lg:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Précédent"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line-700 text-paper-400 transition-colors hover:border-line-600 hover:text-paper-100"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Suivant"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line-700 text-paper-400 transition-colors hover:border-line-600 hover:text-paper-100"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {occasionCatalog.map((occasion) => (
          <OccasionCard key={occasion.id} occasion={occasion} />
        ))}
      </div>
    </div>
  );
}
