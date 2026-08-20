import { Download, Loader2, Play, RotateCcw, Wand2, type LucideIcon } from "lucide-react";
import type { Song } from "@/lib/types";

interface SongAction {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  spin?: boolean;
}

type Translate = (key: string) => string;

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

export function getSongAction(song: Song, t: Translate): SongAction {
  switch (song.status) {
    case "draft":
      return { label: t("history.action.continue"), href: resumeTunnelHref(song), icon: Wand2 };
    case "generating":
      return {
        label: t("history.action.inProgress"),
        href: `/historiques/${song.id}`,
        icon: Loader2,
        disabled: true,
        spin: true,
      };
    case "preview_ready":
      return { label: t("history.action.listenPreview"), href: `/historiques/${song.id}`, icon: Play };
    case "awaiting_payment":
      return { label: t("history.action.pay"), href: `/historiques/${song.id}`, icon: Wand2 };
    case "paid":
    case "delivered":
      return { label: t("history.action.download"), href: `/historiques/${song.id}`, icon: Download };
    case "failed":
      return { label: t("history.action.retry"), href: resumeTunnelHref(song), icon: RotateCcw };
  }
}
