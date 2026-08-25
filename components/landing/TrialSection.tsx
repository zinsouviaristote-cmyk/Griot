"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useInView } from "@/lib/landing/useInView";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const POINT_KEYS = ["landing.trial.point1", "landing.trial.point2", "landing.trial.point3"];

// Coche pleine, pas l'ancien tracé pâle : cette section porte la seule vraie
// différenciation du produit, elle ne peut pas se fondre dans le reste.
function SolidCheck({ delayMs }: { delayMs: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-all duration-300 ease-magnetic ${
        inView ? "scale-100 opacity-100" : "scale-50 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

// La section la plus importante de la page : elle lève la seule objection qui
// compte (« et si je n'aime pas le résultat ? ») avant même qu'elle soit
// posée. Traitement délibérément différent du reste (fond teinté, bordure
// affirmée, plus gros bouton de la page) — elle ne doit ressembler à aucune
// autre carte du site.
export function TrialSection() {
  const { t } = useLanguage();
  return (
    <section className="scroll-mt-[var(--nav-clearance)] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl rounded-feature border-2 border-brand/40 bg-brand-soft/30 p-8 text-center sm:p-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-label-sm font-bold uppercase tracking-wide text-white">
          {t("landing.trial.badge")}
        </span>

        <p className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
          {t("landing.trial.title")}
        </p>

        <ul className="mx-auto mt-8 flex max-w-sm flex-col gap-4 text-left">
          {POINT_KEYS.map((key, index) => (
            <li key={key} className="flex items-start gap-3">
              <SolidCheck delayMs={index * 150} />
              <span className="text-body-lg text-ink-muted">{t(key)}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/creer"
          className="mt-10 inline-flex min-h-16 items-center justify-center rounded-control bg-brand px-10 text-base font-bold text-white transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:brightness-90 hover:shadow-card active:scale-[0.98] sm:min-h-[4.5rem] sm:px-12 sm:text-lg">
          {t("landing.trial.cta")}
        </Link>
      </div>
    </section>
  );
}
