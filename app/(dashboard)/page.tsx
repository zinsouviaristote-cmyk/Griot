import { CreateSongHero } from "@/components/dashboard/CreateSongHero";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { OccasionCarousel } from "@/components/dashboard/OccasionCarousel";
import { SongsTable } from "@/components/dashboard/SongsTable";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { dashboardStats, mockSongs } from "@/lib/data/mock-dashboard";

// Ajoutez ?vide=1 à l'URL pour prévisualiser l'état d'un tout nouvel utilisateur,
// sans chanson ni crédit — c'est le premier écran qu'il verra, il mérite le même soin.
export default function DashboardPage({
  searchParams,
}: {
  searchParams: { vide?: string };
}) {
  const isEmptyPreview = searchParams.vide === "1";
  const songs = isEmptyPreview ? [] : mockSongs;
  const stats = isEmptyPreview
    ? { creditsRestants: 0, chansonsCreees: 0, chansonsOffertes: 0, totalDepenseFcfa: 0 }
    : dashboardStats;

  return (
    <div className="space-y-10">
      <Reveal>
        <CreateSongHero />
      </Reveal>

      <Reveal delayMs={80}>
        <StatsGrid stats={stats} />
      </Reveal>

      <Reveal delayMs={120}>
        <OccasionCarousel />
      </Reveal>

      <Reveal delayMs={160}>
        <section>
          <div className="mb-3">
            <SectionTitle>Dernières chansons</SectionTitle>
          </div>
          <SongsTable songs={songs} />
        </section>
      </Reveal>
    </div>
  );
}
