"use client";

import { BookOpenText, Headphones, Gift } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useInView } from "@/lib/landing/useInView";

const STEPS = [
  {
    number: "01",
    icon: BookOpenText,
    title: "Racontez votre histoire",
    body: "Quelques phrases suffisent, pas besoin d'être écrivain.",
  },
  {
    number: "02",
    icon: Headphones,
    title: "Écoutez la chanson",
    body: "Le premier essai est offert, vous jugez par vous-même.",
  },
  {
    number: "03",
    icon: Gift,
    title: "Offrez-la",
    body: "Le fichier est à vous, à envoyer où vous voulez.",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section
      id="comment-ca-marche"
      className="scroll-mt-[var(--nav-clearance)] px-4 py-10 sm:py-14"
    >
      <div className="mx-auto max-w-4xl">
        <SectionTitle as="h2" size="lg" align="center" animated>
          Trois minutes, <span className="text-brand">et c&apos;est fait</span>
        </SectionTitle>

        <div ref={ref} className="relative mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {/* Trait qui relie les trois étapes sur ordinateur, tracé de gauche à
              droite au moment où la section entre à l'écran — même technique de
              stroke-dashoffset que le trait sous les titres. Aligné sur le centre
              vertical des icônes ; passe derrière les cartes (même ordre de DOM,
              aucun z-index), visible dans les deux interstices qui les séparent. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[52px] hidden w-full sm:block"
            width="100%"
            height="3"
            viewBox="0 0 100 3"
            preserveAspectRatio="none"
          >
            <line
              x1="16"
              y1="1.5"
              x2="84"
              y2="1.5"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-brand/50"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={inView ? 0 : 1}
              style={{ transition: "stroke-dashoffset 1s ease-out 0.3s" }}
            />
          </svg>

          {STEPS.map((step, index) => (
            <Reveal key={step.number} delayMs={index * 120} className="relative">
              <div className="relative rounded-feature border border-border bg-surface p-7 shadow-card transition-all duration-200 ease-magnetic hover:-translate-y-0.5 hover:shadow-card-hover sm:p-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-4 font-display text-4xl font-extrabold text-brand-soft"
                >
                  {step.number}
                </span>
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <step.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="relative mt-5 font-display text-lg font-semibold text-ink">{step.title}</p>
                <p className="relative mt-1.5 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
