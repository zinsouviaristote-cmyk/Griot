import type { Metadata } from "next";
import { BibliothequePageBody } from "@/components/dashboard/library/BibliothequePageBody";
import { mockSongs } from "@/lib/data/mock-dashboard";

export const metadata: Metadata = {
  title: "Ma bibliothèque : Griot",
};

// Ajoutez ?vide=1 pour prévisualiser une bibliothèque sans aucune chanson —
// même convention que ?vide=1 sur le tableau de bord.
export default function BibliothequePage({ searchParams }: { searchParams: { vide?: string } }) {
  const songs = searchParams.vide === "1" ? [] : mockSongs;

  return <BibliothequePageBody songs={songs} />;
}
