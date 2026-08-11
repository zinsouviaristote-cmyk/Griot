import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone } from "lucide-react";
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle as="h1" size="lg">
            Ma bibliothèque
          </SectionTitle>
          <p className="mt-2 max-w-xl text-body-md text-ink-muted">
            Toutes vos chansons, à un seul endroit — cherchez, filtrez, ouvrez.
          </p>
        </div>
        <Link
          href="/publications"
          className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <Megaphone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Voir mes publications
        </Link>
      </div>

      <Reveal delayMs={80} className="mt-6">
        <LibraryView songs={songs} />
      </Reveal>
    </div>
  );
}
