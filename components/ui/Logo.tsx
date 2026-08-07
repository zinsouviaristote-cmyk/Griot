/**
 * Marque compacte, pour l'en-tête. Même dessin que /public/logo-mark.svg (inline
 * ici pour éviter une requête réseau supplémentaire sur un élément présent sur
 * toute page) : un anneau ouvert, une seule onde à l'intérieur — la note a été
 * retirée, trop générique. L'onde est l'élément signature du produit (le trait
 * sous les titres de section) : cette icône en est la source, le système visuel
 * se tient. Aplat `brand`, sans dégradé, épaisseur de trait constante.
 */
export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-brand"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="42.7 10.7"
        />
        <path
          d="M5.5 12.5c1.8-2.6 3.5-2.6 5.3 0s3.5 2.6 5.3 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-brand">Griot</span>
      )}
    </div>
  );
}
