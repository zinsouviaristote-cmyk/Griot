import { OCCASION_GRADIENTS } from "@/lib/occasionTones";
import { occasionCatalog } from "@/lib/data/mock-dashboard";
import type { Occasion } from "@/lib/types";

// Pochette unique pour tout le produit : le lecteur persistant, les lignes de
// la bibliothèque, les cartes Explorer. `imageUrl` — déjà résolu par
// resolveSongArt (lib/songArt.ts), jamais recalculé ici — bascule sur une
// vraie image ; sans elle, le dégradé linéaire par occasion + icône en
// filigrane reste le filet de sécurité : jamais un rectangle gris.
export function TrackArt({
  occasion,
  imageUrl,
  className = "",
}: {
  occasion: Occasion;
  imageUrl?: string | null;
  className?: string;
}) {
  const Icon = occasionCatalog.find((item) => item.id === occasion)?.icon;

  if (imageUrl) {
    return (
      <div className={`relative shrink-0 overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${OCCASION_GRADIENTS[occasion]} ${className}`}
    >
      {Icon && <Icon className="h-[45%] w-[45%] text-white/35" strokeWidth={1.25} aria-hidden="true" />}
    </div>
  );
}
