import { Download, Loader2, Play, RotateCcw, Wand2, type LucideIcon } from "lucide-react";
import type { Song } from "@/lib/types";

interface SongAction {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  spin?: boolean;
}

// Reprend le tunnel là où il a du sens de reprendre : prénom + lien toujours
// connus, occasion connue elle aussi pour un brouillon ou un échec (on sait déjà
// pour quelle occasion, inutile de le redemander) — direction l'écran 3.
function resumeTunnelHref(song: Song): string {
  const params = new URLSearchParams({
    prenom: song.recipientFirstName,
    occasion: song.occasion,
    lien: song.relationship,
  });
  return `/creer?${params.toString()}`;
}

export function getSongAction(song: Song): SongAction {
  switch (song.status) {
    case "draft":
      return { label: "Continuer", href: resumeTunnelHref(song), icon: Wand2 };
    case "generating":
      return {
        label: "En cours…",
        href: `/bibliotheque/${song.id}`,
        icon: Loader2,
        disabled: true,
        spin: true,
      };
    case "preview_ready":
      return { label: "Écouter l'extrait", href: `/bibliotheque/${song.id}`, icon: Play };
    case "awaiting_payment":
      return { label: "Payer", href: `/bibliotheque/${song.id}`, icon: Wand2 };
    case "paid":
    case "delivered":
      return { label: "Télécharger", href: `/bibliotheque/${song.id}`, icon: Download };
    case "failed":
      return { label: "Réessayer", href: resumeTunnelHref(song), icon: RotateCcw };
  }
}
