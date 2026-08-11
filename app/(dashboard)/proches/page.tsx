import type { Metadata } from "next";
import { ProchesView } from "@/components/proches/ProchesView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockContacts } from "@/lib/data/mock-contacts";

export const metadata: Metadata = {
  title: "Mes proches — Griot",
};

// Ajoutez ?vide=1 pour prévisualiser un compte sans aucun proche enregistré —
// même convention que ?vide=1 ailleurs dans l'app.
export default function ProchesPage({ searchParams }: { searchParams: { vide?: string } }) {
  const contacts = searchParams.vide === "1" ? [] : mockContacts;

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Mes proches
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Leurs anniversaires, à portée de main — on vous prévient avant, vous n&apos;improvisez plus.
      </p>

      <Reveal delayMs={80} className="mt-6">
        <ProchesView contacts={contacts} />
      </Reveal>
    </div>
  );
}
