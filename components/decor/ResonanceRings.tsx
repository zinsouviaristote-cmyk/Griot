// La caisse de résonance de l'instrument — un seul moment de ce type par écran,
// autour de l'élément principal (le bloc de création). Deux arcs de cercle très
// fins et incomplets, statiques, en `brand` à faible opacité. Se place derrière
// l'élément englobant : le composant parent doit être `position: relative` pour
// que le débordement (les arcs dépassent le cadre) reste visible, et l'ordre DOM
// (ce composant en premier) garantit que le fond opaque de l'élément recouvre la
// portion des arcs qui traverserait son intérieur.
//
// Largeur/hauteur explicites (pas seulement `inset` négatif) : un <svg> est un
// élément remplacé — sans `height` explicite, un positionnement absolu ne
// dérive pas la hauteur de `top`/`bottom` comme un <div>, il retombe sur le
// ratio intrinsèque du viewBox appliqué à la largeur calculée. Sur un viewBox
// carré (100×100), ça donnait un carré démesuré au lieu d'un cadre qui suit
// la carte.
export function ResonanceRings() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -left-[10%] -top-[16%] h-[132%] w-[120%] text-brand"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="130 45"
        opacity="0.1"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="95 65"
        opacity="0.08"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
