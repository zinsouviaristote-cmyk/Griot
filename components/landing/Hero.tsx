"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PrenomForm } from "@/components/landing/PrenomForm";

const ROTATING_WORDS = [
  "son anniversaire",
  "votre mariage",
  "lui dire je t'aime",
  "sa réussite",
  "honorer sa mémoire",
];

const WORD_INTERVAL_MS = 2000;

interface FloatingBadge {
  label: string;
  dotClassName: string;
  position: string;
  durationS: number;
  delayS: number;
}

// Positionnées en périphérie du titre, jamais dessus : ce sont des touches
// discrètes, pas des éléments qu'on doit lire. Durées et délais tous
// différents pour qu'aucune paire ne dérive en même temps.
const FLOATING_BADGES: FloatingBadge[] = [
  { label: "Anniversaire", dotClassName: "bg-occasion-anniversaire", position: "left-0 top-4", durationS: 3.4, delayS: 0 },
  { label: "Mariage", dotClassName: "bg-brand-light", position: "left-6 top-56 sm:left-10", durationS: 4.1, delayS: 0.6 },
  { label: "Baptême", dotClassName: "bg-secondary", position: "right-0 top-16", durationS: 3.8, delayS: 0.3 },
  { label: "Hommage", dotClassName: "bg-occasion-hommage", position: "right-6 top-56 sm:right-10", durationS: 3.5, delayS: 0.9 },
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    if (query.matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % ROTATING_WORDS.length);
    }, WORD_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid text-brand">
      <span
        key={reducedMotion ? "static" : index}
        className="col-start-1 row-start-1 animate-reveal-up"
      >
        {ROTATING_WORDS[reducedMotion ? 0 : index]}
      </span>
      {/* Réserve la largeur du mot le plus long pour qu'aucun changement de mot
          ne fasse sauter le bouton ou les pastilles voisines. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {ROTATING_WORDS.reduce((longest, word) => (word.length > longest.length ? word : longest))}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* Pastilles flottantes — décor pur, retirées du DOM sur mobile plutôt que
            juste masquées visuellement : rien à télécharger ni à faire flotter
            inutilement sur un petit écran en 3G. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          {FLOATING_BADGES.map((badge) => (
            <span
              key={badge.label}
              className={`absolute ${badge.position} flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium text-ink shadow-card animate-[float_4s_ease-in-out_infinite]`}
              style={{ animationDuration: `${badge.durationS}s`, animationDelay: `${badge.delayS}s` }}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClassName}`} aria-hidden="true" />
              {badge.label}
            </span>
          ))}
        </div>

        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          L&apos;émotion en musique
        </div>

        <h1 className="relative z-10 mt-6 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
          Une chanson pour
          <br className="hidden sm:block" /> <RotatingWord />
        </h1>

        <p className="relative z-10 mt-5 max-w-md text-body-lg text-ink-muted">
          Racontez son histoire. Recevez une chanson chantée, prête à offrir.
        </p>

        <div className="relative z-10 mt-8 flex w-full justify-center">
          <PrenomForm />
        </div>

        <p className="relative z-10 mt-5 flex items-center gap-2 text-sm text-ink-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
          Le premier essai est offert. Vous écoutez avant de payer.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 hidden text-ink-muted/50 sm:block">
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.5} aria-hidden="true" />
      </div>
    </section>
  );
}
