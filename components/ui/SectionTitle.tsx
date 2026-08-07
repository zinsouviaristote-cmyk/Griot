/**
 * Élément signature du produit — LE seul détail graphique récurrent de Griot.
 * Un trait irrégulier sous chaque titre, comme la cadence d'une voix qui raconte :
 * jamais parfaitement droit, jamais un simple soulignement. On le retrouve ici et
 * dans la marque (voir Logo.tsx) — la même idée, deux applications, pas trois.
 * Volontairement discret : un seul trait, une seule couleur pleine (brand).
 */
function VoiceMark({ className = "" }: { className?: string }) {
  return (
    <svg
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
      />
    </svg>
  );
}

export function SectionTitle({
  children,
  as: Tag = "h2",
  size = "md",
  align = "left",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2";
  size?: "md" | "lg";
  align?: "left" | "center";
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
      <VoiceMark className={`mt-1.5 text-brand ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
