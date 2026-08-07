/**
 * Marque du produit : le même trait de voix irrégulière que SectionTitle
 * (voir ce fichier pour le principe), en blanc sur un disque violet plein —
 * aucun dégradé. C'est la seconde et dernière application du motif signature.
 */
export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-vivid"
        aria-hidden="true"
      >
        <svg width="18" height="8" viewBox="0 0 44 8" fill="none">
          <path
            d="M1 5.5C4 2.2 6.8 2.2 9.5 5.2S15.2 8 18 5.2 23.8 2 26.5 5.2 32.2 8 35 5.2 40.8 2.2 43 5"
            stroke="white"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Griot
        </span>
      )}
    </div>
  );
}
