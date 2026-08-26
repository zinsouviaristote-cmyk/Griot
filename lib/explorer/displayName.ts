import type { PublishedSong } from "@/lib/types";

// Nom affiché publiquement pour une publication Explorer : le titre choisi
// prime, sinon le prénom du destinataire, sinon "Chanson surprise" si
// l'auteur l'a explicitement masqué.
export function getPublicDisplayName(entry: PublishedSong, t: (key: string) => string): string {
  if (entry.publicTitle) {
    return entry.publicTitle;
  }

  if (!entry.hideFirstName) {
    return entry.recipientFirstName;
  }

  return t("explorer.surpriseSong");
}
