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
      <div className="mx-auto max-w-5xl">
        <SectionTitle as="h2" size="lg" align="center" animated>
          Trois minutes, <span className="text-brand">et c&apos;est fait</span>
        </SectionTitle>

        <div ref={ref} className="relative mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {/* Trait qui relie les trois étapes sur ordinateur, tracé de gauche à
              droite au moment où la section entre à l'écran — même technique de
              stroke-dashoffset que le trait sous les titres. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-9 hidden w-full sm:block"
            width="100%"
            height="2"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <line
              x1="16"
              y1="1"
              x2="84"
              y2="1"
              stroke="currentColor"
              strokeWidth="1"
              className="text-brand/30"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={inView ? 0 : 1}
              style={{ transition: "stroke-dashoffset 1s ease-out 0.3s" }}
            />
          </svg>

          {STEPS.map((step, index) => (
            <Reveal key={step.number} delayMs={index * 120} className="relative">
              <div className="relative rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 ease-magnetic hover:-translate-y-0.5 hover:shadow-card-hover">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-extrabold text-brand-soft"
                >
                  {step.number}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <step.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="relative mt-4 font-display text-lg font-semibold text-ink">{step.title}</p>
                <p className="relative mt-1.5 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
