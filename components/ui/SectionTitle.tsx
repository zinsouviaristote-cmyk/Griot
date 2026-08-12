"use client";

import { useInView } from "@/lib/landing/useInView";

/**
 * Élément signature du produit — LE seul détail graphique récurrent de Griot.
 * Un trait irrégulier sous chaque titre, comme la cadence d'une voix qui raconte :
 * jamais parfaitement droit, jamais un simple soulignement. On le retrouve ici et
 * dans la marque (voir Logo.tsx) — la même idée, deux applications, pas trois.
 * Volontairement discret : un seul trait, une seule couleur pleine (brand).
 *
 * `animated` (repris de la landing) fait tracer le trait au moment où la section
 * entre à l'écran, plutôt que de l'afficher déjà plein — même principe que le
 * logo sur l'écran de chargement (voir LoadingScreen), via `pathLength`.
 */
function VoiceMark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  const { ref, inView } = useInView<SVGSVGElement>();
  return (
    <svg
      ref={animated ? ref : undefined}
      width="44"
      height="8"
      viewBox="0 0 44 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 5.5C4 2.2 6.8 2.2 9.5 5.2S15.2 8 18 5.2 23.8 2 26.5 5.2 32.2 8 35 5.2 40.8 2.2 43 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={animated ? 1 : undefined}
        strokeDasharray={animated ? 1 : undefined}
        strokeDashoffset={animated ? (inView ? 0 : 1) : undefined}
        style={animated ? { transition: "stroke-dashoffset 0.7s ease-out" } : undefined}
      />
    </svg>
  );
}

export function SectionTitle({
  children,
  as: Tag = "h2",
  size = "md",
  align = "left",
  animated = false,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2";
  size?: "md" | "lg";
  align?: "left" | "center";
  // Trace le trait ondulé au défilement plutôt que de l'afficher plein d'emblée
  // — réservé aux sections où ce mouvement a un sens (landing) ; le reste de
  // l'app garde le trait toujours plein, immédiat.
  animated?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : undefined}>
      <Tag
        className={`font-display font-semibold text-ink tracking-tight ${
          size === "lg" ? "text-3xl sm:text-4xl" : "text-lg"
        }`}
      >
        {children}
      </Tag>
      <VoiceMark
        animated={animated}
        className={`mt-1.5 text-brand ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
