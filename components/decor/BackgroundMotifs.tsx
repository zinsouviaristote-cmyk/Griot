// Habillage du fond clair : de petites illustrations musicales en trait fin,
// violet très clair, dispersées dans les marges et les coins — jamais au centre
// du contenu. Le but n'est pas d'être vu, c'est d'éviter que le fond soit un
// blanc neutre et sans vie. Aucune photo, aucun aplat : que du trait, cohérent
// avec le reste du système (logo, icônes 1.5px).
//
// Deux jeux de motifs, un par rupture desktop/mobile — pas un seul viewBox étiré
// sur les deux : les zones vides d'un écran empilé (mobile) et d'un écran avec
// sidebar (desktop) ne sont pas aux mêmes coordonnées, et un même viewBox
// recadré en préserveAspectRatio="slice" tronque des pans entiers d'un côté ou
// l'autre selon le ratio d'écran réel.

function Vinyl({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity} stroke="currentColor" fill="none" strokeWidth="1.4">
      <circle r="17" />
      <circle r="9.5" strokeWidth="1" />
      <circle r="2" fill="currentColor" stroke="none" />
    </g>
  );
}

function Note({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="-4" cy="10" r="3.4" fill="currentColor" stroke="none" />
      <path d="M-0.8 10V-8" fill="none" />
    </g>
  );
}

function TwinNotes({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
      <circle cx="-9" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="3" fill="currentColor" stroke="none" />
      <path d="M-6 12V-6l15 -3v14" />
    </g>
  );
}

function EqBars({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M-12 6V-6" />
      <path d="M-4 10V-14" />
      <path d="M4 10V-2" />
      <path d="M12 6V-10" />
    </g>
  );
}

function Wave({ opacity }: { opacity: number }) {
  return (
    <path
      d="M-21 2.5C-18 -0.8 -15.2 -0.8 -12.5 2.2S-6.8 5 -4 2.2 1.8 -0.8 4.5 2.2 10.2 5 13 2.2 18.8 -0.8 21 2"
      opacity={opacity}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  );
}

interface Motif {
  Component: typeof Vinyl;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
}

function MotifLayer({ motifs, viewBox }: { motifs: Motif[]; viewBox: string }) {
  return (
    // `preserveAspectRatio="none"` : "slice" (le défaut si omis) recadre le viewBox
    // pour remplir le cadre, ce qui grignote 50 à 100 unités sur les bords sans
    // prévenir — des motifs placés près d'un bord se retrouvaient hors-écran.
    // "none" applique un facteur d'échelle direct par axe, sans recadrage : plus
    // prévisible pour positionner, quitte à étirer très légèrement les cercles.
    <svg className="h-full w-full text-brand" viewBox={viewBox} preserveAspectRatio="none">
      {motifs.map(({ Component, x, y, scale, rotate, opacity }, index) => (
        <g key={index} transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`}>
          <Component opacity={opacity} />
        </g>
      ))}
    </svg>
  );
}

// Desktop (viewBox calé sur 1440×960, la taille réellement vérifiée) — zones
// vides confirmées à l'écran : sous la nav de la sidebar (avant la carte de
// crédits), et les bandes entre l'en-tête, le bloc de création, les
// statistiques et le carrousel d'occasions.
const DESKTOP_MOTIFS: Motif[] = [
  { Component: Vinyl, x: 150, y: 500, scale: 1.1, rotate: -8, opacity: 0.06 },
  { Component: EqBars, x: 195, y: 630, scale: 0.85, rotate: 0, opacity: 0.06 },
  { Component: Note, x: 1380, y: 86, scale: 0.5, rotate: 6, opacity: 0.07 },
  { Component: Wave, x: 1320, y: 540, scale: 0.65, rotate: 0, opacity: 0.07 },
  { Component: TwinNotes, x: 1360, y: 726, scale: 0.5, rotate: -4, opacity: 0.06 },
];

// Mobile (viewBox calé sur 375×812, la taille réellement vérifiée) — zones
// vides confirmées : la bande sous la barre haute avant la salutation, et
// celle entre la carte d'action et la liste des chansons.
// Un `Wave` en fond, si placé trop près d'un titre de section, se confondrait avec
// le trait signature de SectionTitle — un autre motif y prend systématiquement sa place.
const MOBILE_MOTIFS: Motif[] = [
  { Component: Note, x: 330, y: 70, scale: 0.4, rotate: 8, opacity: 0.07 },
  { Component: EqBars, x: 300, y: 296, scale: 0.4, rotate: 0, opacity: 0.06 },
  { Component: Vinyl, x: 45, y: 178, scale: 0.35, rotate: -6, opacity: 0.06 },
];

export function BackgroundMotifs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="hidden h-full w-full lg:block">
        <MotifLayer motifs={DESKTOP_MOTIFS} viewBox="0 0 1440 960" />
      </div>
      <div className="h-full w-full lg:hidden">
        <MotifLayer motifs={MOBILE_MOTIFS} viewBox="0 0 375 812" />
      </div>
    </div>
  );
}
