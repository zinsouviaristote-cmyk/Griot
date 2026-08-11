"use client";

import { usePathname } from "next/navigation";
import { usePlayer } from "@/lib/player/PlayerContext";

// Réserve, en fin de page, l'espace que le lecteur persistant occupe une fois
// une piste chargée — sans lui, le dernier élément d'une liste resterait caché
// derrière la barre fixe. Hauteur nulle tant qu'aucune piste ne joue : pas de
// vide en réserve pour un lecteur qui n'existe pas encore.
export function PlayerContentSpacer() {
  const { current } = usePlayer();
  const pathname = usePathname();
  // Explorer n'affiche jamais la barre persistante (voir PersistentPlayerBar) :
  // rien à compenser sur cette page plein écran.
  if (!current || pathname === "/explorer") return null;
  return <div aria-hidden="true" className="h-16 lg:h-20" />;
}
