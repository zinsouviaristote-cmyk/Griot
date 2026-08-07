import { Download, Loader2, Play, RotateCcw, Wand2, type LucideIcon } from "lucide-react";
import type { Song } from "@/lib/types";

interface SongAction {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  spin?: boolean;
}

export function getSongAction(song: Song): SongAction {
  switch (song.status) {
    case "draft":
      return { label: "Continuer", href: `/creer?song=${song.id}`, icon: Wand2 };
    case "generating":
      return {
        label: "En cours…",
        href: `/creer?song=${song.id}`,
        icon: Loader2,
        disabled: true,
        spin: true,
      };
    case "preview_ready":
      return { label: "Écouter l'extrait", href: `/chansons/${song.id}/extrait`, icon: Play };
    case "awaiting_payment":
      return { label: "Payer", href: `/chansons/${song.id}/paiement`, icon: Wand2 };
    case "paid":
    case "delivered":
      return { label: "Télécharger", href: `/chansons/${song.id}/telecharger`, icon: Download };
    case "failed":
      return { label: "Réessayer", href: `/creer?song=${song.id}`, icon: RotateCcw };
  }
}
