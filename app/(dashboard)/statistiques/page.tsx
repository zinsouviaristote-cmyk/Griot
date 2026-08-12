import type { Metadata } from "next";
import { StatisticsView } from "@/components/dashboard/stats/StatisticsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import {
  getMyPopularSongs,
  getMyStatsTotals,
  getRecentActivity,
  getReferralStats,
  getWeeklyListens,
} from "@/lib/data/mock-stats";

export const metadata: Metadata = {
  title: "Statistiques — Griot",
};

const EMPTY_TOTALS = { listens: 0, likes: 0, downloads: 0, listeningSeconds: 0, publishedCount: 0 };

// Ajoutez ?vide=1 pour prévisualiser l'état d'un compte qui n'a encore rien
// publié — même convention que sur la bibliothèque et le tableau de bord.
export default function StatistiquesPage({ searchParams }: { searchParams: { vide?: string } }) {
  const isEmptyPreview = searchParams.vide === "1";

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Statistiques
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Comment vos chansons publiées voyagent, au-delà de vous.
      </p>

      <Reveal delayMs={80} className="mt-6">
        <StatisticsView
          totals={isEmptyPreview ? EMPTY_TOTALS : getMyStatsTotals()}
          weeklyListens={isEmptyPreview ? [] : getWeeklyListens()}
          popularSongs={isEmptyPreview ? [] : getMyPopularSongs()}
          recentActivity={isEmptyPreview ? [] : getRecentActivity()}
          referral={isEmptyPreview ? { pageOpens: 0, songsCreated: 0 } : getReferralStats()}
        />
      </Reveal>
    </div>
  );
}
