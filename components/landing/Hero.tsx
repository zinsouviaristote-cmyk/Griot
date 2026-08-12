"use client";

import { useEffect, useState } from "react";
import { PrenomForm } from "@/components/landing/PrenomForm";
import { PhoneMockup } from "@/components/landing/PhoneMockup";

const ROTATING_WORDS = [
  "son anniversaire",
  "votre mariage",
  "lui dire je t'aime",
  "sa réussite",
  "honorer sa mémoire",
];

const WORD_INTERVAL_MS = 2000;

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
    <section className="relative scroll-mt-[var(--nav-clearance)] overflow-hidden px-4 pb-10 pt-24 sm:pb-14 sm:pt-28 lg:pt-32">
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            L&apos;émotion en musique
          </div>

          <h1 className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
            Une chanson pour
            <br className="hidden sm:block" /> <RotatingWord />
          </h1>

          <p className="mt-3 max-w-md text-body-lg text-ink-muted">
            Racontez son histoire. Recevez une chanson chantée, prête à offrir.
          </p>

          <div className="mt-5 flex w-full justify-center lg:justify-start">
            <PrenomForm size="lg" />
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            Le premier essai est offert. Vous écoutez avant de payer.
          </p>
        </div>

        <div className="flex justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
