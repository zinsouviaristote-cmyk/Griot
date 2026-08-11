import type { Metadata } from "next";
import { PublicationsView } from "@/components/publications/PublicationsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockSongs } from "@/lib/data/mock-dashboard";

export const metadata: Metadata = {
  title: "Mes publications — Griot",
};

export default function PublicationsPage() {
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Mes publications
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Les chansons que vous avez choisi de partager dans Explorer.
      </p>

      <Reveal delayMs={80} className="mt-6">
        <PublicationsView songs={mockSongs} />
      </Reveal>
    </div>
  );
}
