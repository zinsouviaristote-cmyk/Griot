const OCCASIONS = ["Baptême", "Réussite", "Hommage", "Déclaration", "Encouragement", "Anniversaire", "Mariage"];

function MarqueeContent() {
  return (
    <>
      {OCCASIONS.map((occasion) => (
        <span key={occasion} className="flex items-center gap-6 sm:gap-8">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-muted">{occasion}</span>
          <span className="text-brand" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </>
  );
}

// Boucle infinie sans à-coup : le contenu est dupliqué une seule fois, le
// keyframe "marquee" glisse d'exactement -50% (la largeur d'une copie), donc
// la jonction entre les deux copies est invisible. Se met en pause au survol
// (desktop) via le groupe ; plus lent sur mobile, jamais interactif.
export function MarqueeBanner() {
  return (
    <div className="group relative overflow-hidden border-y border-border bg-surface py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface to-transparent sm:w-24" />
      <div className="flex w-max animate-[marquee_46s_linear_infinite] gap-6 group-hover:[animation-play-state:paused] sm:animate-[marquee_28s_linear_infinite] sm:gap-8">
        <div className="flex gap-6 sm:gap-8">
          <MarqueeContent />
        </div>
        <div className="flex gap-6 sm:gap-8" aria-hidden="true">
          <MarqueeContent />
        </div>
      </div>
    </div>
  );
}
