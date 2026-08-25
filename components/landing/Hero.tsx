"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Heart, Shuffle, SkipBack, SkipForward, Repeat } from "lucide-react";
import { PrenomForm } from "@/components/landing/PrenomForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ROTATING_WORD_KEYS = [
  "landing.hero.rotatingWord1",
  "landing.hero.rotatingWord2",
  "landing.hero.rotatingWord3",
  "landing.hero.rotatingWord4",
  "landing.hero.rotatingWord5",
];

const WORD_INTERVAL_MS = 2000;

function RotatingWord() {
  const { t } = useLanguage();
  const words = ROTATING_WORD_KEYS.map((key) => t(key));
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    if (query.matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, WORD_INTERVAL_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="relative inline-grid text-brand">
      <span
        key={reducedMotion ? "static" : index}
        className="col-start-1 row-start-1 animate-reveal-up"
      >
        {words[reducedMotion ? 0 : index]}
      </span>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((longest, word) => (word.length > longest.length ? word : longest))}
      </span>
    </span>
  );
}

{/* SVG Portée musicale et notes de musique inspiré d'Avada */}
function MusicStaffDecoration() {
  return (
    <svg
      viewBox="0 0 500 500"
      className="pointer-events-none absolute left-5 -top-10 h-[480px] w-[480px] text-brand/40"
      fill="none"
      aria-hidden="true"
    >
      {/* Lignes de portée ondulées */}
      <path
        d="M 60 260 C 90 120, 220 100, 310 210 C 370 280, 440 180, 480 150"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.6"
      />
      <path
        d="M 50 275 C 80 135, 210 115, 300 225 C 360 295, 430 195, 470 165"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M 40 290 C 70 150, 200 130, 290 240 C 350 310, 420 210, 460 180"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Clé de Sol stylisée (Gauche) */}
      <path
        d="M 95 320 C 75 300, 75 260, 105 240 C 135 220, 145 170, 125 130 C 110 100, 95 120, 95 140 C 95 230, 115 360, 95 400 C 85 420, 65 410, 70 395 C 75 380, 90 385, 95 400"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />

      {/* Notes de musique dispersées le long de la portée */}
      {/* Croche 1 */}
      <g opacity="0.8" transform="translate(130, 150) rotate(-15)">
        <ellipse cx="10" cy="20" rx="7" ry="5" fill="currentColor" />
        <path d="M 17 20 V 2 L 27 5 V 15" stroke="currentColor" strokeWidth="2.5" fill="none" />
      </g>

      {/* Croche 2 */}
      <g opacity="0.75" transform="translate(180, 120) rotate(10)">
        <ellipse cx="10" cy="20" rx="7" ry="5" fill="currentColor" />
        <path d="M 17 20 V 2" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 17 2 C 22 5, 25 10, 25 15" stroke="currentColor" strokeWidth="2.5" fill="none" />
      </g>

      {/* Double croche liée (Haut centre) */}
      <g opacity="0.85" transform="translate(230, 135) rotate(-10)">
        <ellipse cx="8" cy="22" rx="6" ry="4.5" fill="currentColor" />
        <ellipse cx="28" cy="18" rx="6" ry="4.5" fill="currentColor" />
        <path d="M 14 22 V 4 M 34 18 V 0" stroke="currentColor" strokeWidth="2" />
        <polygon points="14,4 34,0 34,4 14,8" fill="currentColor" />
        <polygon points="14,10 34,6 34,10 14,14" fill="currentColor" />
      </g>

      {/* Note simple à droite */}
      <g opacity="0.7" transform="translate(440, 220) rotate(15)">
        <ellipse cx="10" cy="20" rx="7" ry="5" fill="currentColor" />
        <path d="M 17 20 V 2" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 17 2 C 24 6, 26 12, 25 18" stroke="currentColor" strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  );
}

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative scroll-mt-[var(--nav-clearance)] overflow-hidden bg-white px-4 pb-10 pt-16 sm:pb-14 sm:pt-20 lg:pt-24">
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">

        {/* Colonne Gauche */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            {t("landing.hero.badge")}
          </div>

          <h1 className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
            {t("landing.hero.titlePrefix")}
            <br className="hidden sm:block" /> <RotatingWord />
          </h1>

          <p className="mt-3 max-w-md text-body-lg text-ink-muted">
            {t("landing.hero.subtitle")}
          </p>

          <div className="mt-6 w-full lg:mt-8">
            <PrenomForm size="lg" />
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            {t("landing.hero.freeTrialNote")}
          </p>
        </div>

        {/* Colonne Droite : Image Circulaire & Lecteur avec Portée Avada */}
        <div className="relative flex flex-col items-center justify-center animate-fade-in duration-1000">
          
          {/* Décoration musicale SVG (Clé de sol + portées) */}
          <MusicStaffDecoration />

          {/* Badge de statut flottant */}
          <div className="absolute right-8 top-0 z-20 flex items-center gap-2 rounded-xl border border-border bg-surface/95 px-3 py-1.5 shadow-md backdrop-blur-sm transition-transform hover:scale-105">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-ink">{t("landing.hero.playerBadgeTitle")}</p>
              <p className="text-[9px] font-medium text-brand">{t("landing.hero.playerBadgeSubtitle")}</p>
            </div>
          </div>

          {/* Image principale dans un cercle */}
          <div className="relative z-10 h-72 w-72 overflow-hidden rounded-full border-4 border-surface shadow-xl sm:h-80 sm:w-80 transition-transform duration-500 hover:scale-105">
            <Image
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
              alt={t("landing.hero.imageAlt")}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 288px, 320px"
            />
          </div>

          {/* Lecteur Audio Flottant */}
          <div className="relative z-20 -mt-7 w-full max-w-xs rounded-2xl border border-border bg-surface/90 p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-bold text-ink-muted">
              <span>0:37</span>
              <div className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-border">
                <div className="h-full w-1/3 rounded-full bg-brand" />
              </div>
              <span>2:45</span>
            </div>

            <div className="mt-2 flex items-center justify-between px-2">
              <button type="button" className="text-ink-muted transition-colors hover:text-brand">
                <Shuffle className="h-3 w-3" />
              </button>
              <button type="button" className="text-ink transition-colors hover:text-brand">
                <SkipBack className="h-3 w-3 fill-current" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-md transition-transform hover:scale-110 active:scale-95"
              >
                <Play className="ml-0.5 h-3 w-3 fill-current" />
              </button>
              <button type="button" className="text-ink transition-colors hover:text-brand">
                <SkipForward className="h-3 w-3 fill-current" />
              </button>
              <button type="button" className="text-ink-muted transition-colors hover:text-brand">
                <Repeat className="h-3 w-3" />
              </button>
            </div>

            <button
              type="button"
              className="absolute bottom-3 right-3 text-brand transition-transform hover:scale-125"
            >
              <Heart className="h-4 w-4 fill-brand" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}