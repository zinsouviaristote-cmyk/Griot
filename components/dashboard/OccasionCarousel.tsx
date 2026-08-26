"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OccasionCard } from "@/components/dashboard/OccasionCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { occasionCatalog } from "@/lib/songCatalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, occasionTagline } from "@/lib/i18n/catalog";

export function OccasionCarousel() {
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({
      left: direction * 230,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div className="mb-3 flex items-start justify-between">
        <SectionTitle>
          {t("dashboard.occasionCarousel.title")}
        </SectionTitle>

        <div className="hidden gap-1.5 lg:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("dashboard.occasionCarousel.previous")}
            className="group flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink-muted transition-all duration-200 ease-magnetic hover:scale-110 hover:border-brand/40 hover:text-brand active:scale-95"
          >
            <ChevronLeft
              className="h-4 w-4 transition-transform duration-150 ease-magnetic group-hover:-translate-x-0.5"
              strokeWidth={1.5}
            />
          </button>

          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("dashboard.occasionCarousel.next")}
            className="group flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink-muted transition-all duration-200 ease-magnetic hover:scale-110 hover:border-brand/40 hover:text-brand active:scale-95"
          >
            <ChevronRight
              className="h-4 w-4 transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {occasionCatalog.map((occasion, index) => (
          <Reveal
            key={occasion.id}
            delayMs={index * 150}
            className="shrink-0 snap-start"
          >
            <OccasionCard
              occasion={{
                ...occasion,
                label: occasionLabel(t, occasion.id),
                tagline: occasionTagline(t, occasion.id),
              }}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}