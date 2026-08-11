import type { Metadata } from "next";
import { CreditsView } from "@/components/credits/CreditsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockUser } from "@/lib/data/mock-dashboard";
import { getCreditTransactionsSortedDesc } from "@/lib/data/mock-credits";

export const metadata: Metadata = {
  title: "Mes Notes — Griot",
};

export default function CreditsPage() {
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Mes Notes
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Votre solde et le détail de chaque mouvement.
      </p>

      <Reveal delayMs={80} className="mt-6">
        <CreditsView balance={mockUser.creditBalance} transactions={getCreditTransactionsSortedDesc()} />
      </Reveal>
    </div>
  );
}
