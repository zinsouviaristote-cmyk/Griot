import type { Metadata } from "next";
import { mockSongs } from "@/lib/data/mock-dashboard";
import { BibliothequePageBody } from "@/components/dashboard/historiques/BibliothequePageBody";

export const metadata: Metadata = {
  title: "Mon historique : Griot",
};

// Ajoutez ?vide=1 pour prévisualiser une bibliothèque sans aucune chanson —
// même convention que ?vide=1 sur le tableau de bord.
export default function HistoriquesPage({ searchParams }: { searchParams: { vide?: string } }) {
  const songs = searchParams.vide === "1" ? [] : mockSongs;

  return <BibliothequePageBody songs={songs} />;
}
