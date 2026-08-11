import { OCCASION_GRADIENTS } from "@/lib/occasionTones";
import { occasionCatalog } from "@/lib/data/mock-dashboard";
import type { Occasion } from "@/lib/types";

// Même langage que ExplorerThumbnail (dégradé linéaire par occasion + icône en
// filigrane) — jamais de photo. Une seule pochette pour tout le produit : le
// lecteur persistant, les lignes de la bibliothèque, les cartes Explorer.
export function TrackArt({ occasion, className = "" }: { occasion: Occasion; className?: string }) {
  const Icon = occasionCatalog.find((item) => item.id === occasion)?.icon;
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${OCCASION_GRADIENTS[occasion]} ${className}`}
    >
      {Icon && <Icon className="h-[45%] w-[45%] text-white/35" strokeWidth={1.25} aria-hidden="true" />}
    </div>
  );
}
