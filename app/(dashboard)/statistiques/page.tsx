import type { Metadata } from "next";
import { StatisticsView } from "@/components/dashboard/stats/StatisticsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockSongs } from "@/lib/data/mock-dashboard";
import { mockCreditTransactions } from "@/lib/data/mock-credits";
import { getMyPublishedSongs } from "@/lib/data/mock-explorer";

export const metadata: Metadata = {
  title: "Statistiques — Griot",
};

export default function StatistiquesPage() {
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Statistiques
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Un coup d&apos;œil sur vos chansons et vos publications.
      </p>

      <Reveal delayMs={80} className="mt-6">
        <StatisticsView
          songs={mockSongs}
          publishedSongs={getMyPublishedSongs()}
          creditTransactions={mockCreditTransactions}
        />
      </Reveal>
    </div>
  );
}
