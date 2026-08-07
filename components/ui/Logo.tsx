/**
 * Marque du produit : un disque en dégradé signature avec un sillon, rappel discret
 * du vinyle — répété en plus petit comme accent de coin sur certaines cartes.
 * Pur CSS (aucune image), pour rester dans le budget de poids réseau.
 */
export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-signature shadow-glow-brand"
        aria-hidden="true"
      >
        <span className="h-3 w-3 rounded-full bg-ink-950" />
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-paper-100">
          Griot
        </span>
      )}
    </div>
  );
}
