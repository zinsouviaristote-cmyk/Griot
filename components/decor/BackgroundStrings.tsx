// Le décor de fond de Griot — des cordes de kora, ou une onde étirée à l'extrême.
// Cinq courbes longues et régulières traversent la page en diagonale douce,
// jamais parallèles à intervalle constant, jamais aléatoires : des traits
// dessinés, pas un halo flou. C'est l'extension du trait sous les titres de
// section (voir SectionTitle) — le même système, à l'échelle de l'écran.
//
// Trois d'entre elles (L2, L3, L4) se resserrent volontairement dans la bande
// centrale, là où le bloc principal de création se trouve sur desktop — comme
// si l'action attirait les cordes. L1 et L5 restent à l'écart.
//
// Mobile : deux courbes seulement (L1, L5), aucune animation — batterie et GPU.
// `prefers-reduced-motion` fige tout (règle globale, voir globals.css).
// `[data-decor-paused="true"]` sur <html> met la dérive en pause — prêt pour un
// futur écran de génération/chargement, non déclenché nulle part pour l'instant.

interface Curve {
  id: string;
  d: string;
  opacity: number;
  strokeWidth: number;
  onMobile: boolean;
  animationClass: string;
  delay: string;
}

const CURVES: Curve[] = [
  {
    id: "l1",
    d: "M0,50 C480,10 960,90 1440,40",
    opacity: 0.08,
    strokeWidth: 1.1,
    onMobile: true,
    animationClass: "lg:animate-drift-a",
    delay: "0s",
  },
  {
    id: "l2",
    d: "M0,160 C400,240 700,260 1440,180",
    opacity: 0.1,
    strokeWidth: 1.3,
    onMobile: false,
    animationClass: "lg:animate-drift-b",
    delay: "-6s",
  },
  {
    id: "l3",
    d: "M0,380 C350,300 750,300 1440,420",
    opacity: 0.12,
    strokeWidth: 1.4,
    onMobile: false,
    animationClass: "lg:animate-drift-c",
    delay: "-3s",
  },
  {
    id: "l4",
    d: "M0,520 C500,420 850,380 1440,300",
    opacity: 0.1,
    strokeWidth: 1.2,
    onMobile: false,
    animationClass: "lg:animate-drift-a",
    delay: "-12s",
  },
  {
    id: "l5",
    d: "M0,760 C550,830 900,700 1440,780",
    opacity: 0.07,
    strokeWidth: 1,
    onMobile: true,
    animationClass: "lg:animate-drift-b",
    delay: "-9s",
  },
];

export function BackgroundStrings() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg
        className="h-full w-full text-brand"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        {CURVES.map((curve) => (
          <path
            key={curve.id}
            d={curve.d}
            stroke="currentColor"
            strokeWidth={curve.strokeWidth}
            strokeLinecap="round"
            style={{ opacity: curve.opacity, animationDelay: curve.delay }}
            className={`decor-string ${curve.onMobile ? "" : "hidden lg:block"} ${curve.animationClass}`}
          />
        ))}
      </svg>
    </div>
  );
}
