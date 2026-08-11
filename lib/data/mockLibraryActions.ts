import type { Song } from "@/lib/types";

// Adaptateurs factices pour la fiche chanson — même esprit que lib/tunnel/mockAdapters.ts :
// un délai simulé, aucun appel réseau réel. Le paiement ici suppose un règlement
// rapide (carte/Mobile Money déjà enregistré) — le choix de pack complet reste
// le rôle du tunnel, pas de la fiche d'une chanson déjà générée.
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockPaySong(songId: string): Promise<void> {
  await wait(1200);
  void songId;
}

export async function mockDeleteSong(songId: string): Promise<void> {
  await wait(900);
  void songId;
}

// Paroles débloquées au moment du paiement pour une chanson qui n'en avait pas
// encore (preview_ready/awaiting_payment) — le texte d'origine ("story") n'est
// pas conservé sur l'enregistrement Song, donc un gabarit plus simple que celui
// du tunnel, sans citation du récit.
export function generateUnlockedLyrics(song: Song): string {
  const name = song.recipientFirstName;
  return `${name},
cette chanson existait déjà avant les mots — elle attendait son heure.

[Couplet 1]
On m'a parlé de toi, de ce que tu représentes,
et j'en ai fait une mélodie, la plus sincère qui soit.
Chaque note porte un peu de ce que je ressens,
pour ${name}, aujourd'hui et pour longtemps.

[Refrain]
${name}, ${name},
cette chanson est pour toi,
${name}, ${name},
un cadeau qui reste, une fois pour toutes.`;
}
