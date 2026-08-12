"use client";

import Link from "next/link";
import { useInView } from "@/lib/landing/useInView";

const POINTS = [
  "Le premier essai de chaque chanson ne coûte rien.",
  "Vous l'écoutez en entier avant de décider.",
  "Vous ne payez que si vous voulez la garder.",
];

function DrawnCheck({ delayMs }: { delayMs: number }) {
  const { ref, inView } = useInView<SVGSVGElement>();
  return (
    <svg
      ref={ref}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-brand"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path
        d="M5.5 10.2l3 3 6-6.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={inView ? 0 : 1}
        style={{ transition: `stroke-dashoffset 0.5s ease-out ${delayMs}ms` }}
      />
    </svg>
  );
}

// La section la plus importante de la page : elle lève la seule objection qui
// compte (« et si je n'aime pas le résultat ? ») avant même qu'elle soit
// posée. Volontairement seule sur fond blanc — aucun tarif, aucun comparatif,
// rien qui rouvre le doute qu'elle vient de fermer.
export function TrialSection() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl rounded-feature border border-brand/25 bg-surface p-8 text-center sm:p-14">
        <p className="font-display text-2xl font-bold text-ink sm:text-3xl">Vous n&apos;achetez rien à l&apos;aveugle</p>

        <ul className="mx-auto mt-8 flex max-w-sm flex-col gap-4 text-left">
          {POINTS.map((point, index) => (
            <li key={point} className="flex items-start gap-3">
              <DrawnCheck delayMs={index * 150} />
              <span className="text-body-md text-ink-muted">{point}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/creer"
          className="mt-9 inline-flex min-h-11 items-center justify-center rounded-control bg-brand px-6 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:brightness-90 hover:shadow-card active:scale-[0.98]"
        >
          Créer ma chanson
        </Link>
      </div>
    </section>
  );
}
