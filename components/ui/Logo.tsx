/**
 * Marque du produit — un anneau en "G" ouvert à droite, une note à l'intérieur,
 * un petit trait de voix qui s'échappe par l'ouverture. Inspirée du fichier logo
 * fourni, mais reconstruite en un seul violet plein (`brand`) : le fichier source
 * utilisait un dégradé, banni par les règles du produit — on reprend la silhouette,
 * jamais le traitement dégradé. En-tête uniquement : icône à gauche, mot-symbole
 * à côté, rien en dessous.
 */
export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-brand"
      >
        {/* L'anneau : un cercle avec une ouverture à droite, la forme du "G". */}
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="40 13.4"
        />
        {/* La note, pleine — volontairement simple pour rester lisible à 24px. */}
        <circle cx="10.2" cy="14.8" r="2.1" fill="currentColor" />
        <path d="M12.1 14.8V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        {/* Le trait de voix, dans l'ouverture de l'anneau. */}
        <path
          d="M18.3 12.4c.7-.8 1.2-.8 1.9 0s1.2.8 1.9 0"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-tight text-brand">Griot</span>
      )}
    </div>
  );
}
