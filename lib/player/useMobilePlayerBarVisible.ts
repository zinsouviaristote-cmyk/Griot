"use client";

import { usePathname } from "next/navigation";
import { usePlayer } from "@/lib/player/PlayerContext";

// Vrai exactement quand PersistentPlayerBar affiche sa barre compacte mobile —
// même condition qu'elle, dupliquée ici plutôt qu'exportée depuis un composant,
// pour que tout élément sticky/fixe en bas d'écran (voir StoryStep, LyricsStep)
// puisse se décaler au-dessus d'elle et ne jamais se superposer.
export function useMobilePlayerBarVisible(): boolean {
  const { current } = usePlayer();
  const pathname = usePathname();
  return Boolean(current) && pathname !== "/explorer";
}
