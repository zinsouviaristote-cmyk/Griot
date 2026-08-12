import type { Metadata } from "next";
import { LibraryView } from "@/components/dashboard/library/LibraryView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockSongs } from "@/lib/data/mock-dashboard";

export const metadata: Metadata = {
  title: "Ma bibliothèque — Griot",
};

// Ajoutez ?vide=1 pour prévisualiser une bibliothèque sans aucune chanson —
// même convention que ?vide=1 sur le tableau de bord.
export default function BibliothequePage({ searchParams }: { searchParams: { vide?: string } }) {
  const songs = searchParams.vide === "1" ? [] : mockSongs;

  return (
    <div>
      <div>
        <SectionTitle as="h1" size="lg">
          Ma bibliothèque
        </SectionTitle>
        <p className="mt-2 max-w-xl text-body-md text-ink-muted">
          Toutes vos chansons, à un seul endroit — cherchez, filtrez, ouvrez.
        </p>
      </div>

      <Reveal delayMs={80} className="mt-6">
        <LibraryView songs={songs} />
      </Reveal>
    </div>
  );
}
