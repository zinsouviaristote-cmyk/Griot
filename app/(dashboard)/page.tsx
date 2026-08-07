import { CreateSongHero } from "@/components/dashboard/CreateSongHero";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { OccasionCarousel } from "@/components/dashboard/OccasionCarousel";
import { SongsTable } from "@/components/dashboard/SongsTable";
import { MobileGreeting } from "@/components/dashboard/mobile/MobileGreeting";
import { PrimaryActionCard } from "@/components/dashboard/mobile/PrimaryActionCard";
import { RecentSongsList } from "@/components/dashboard/mobile/RecentSongsList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { dashboardStats, mockSongs, mockUser } from "@/lib/data/mock-dashboard";

// Ajoutez ?vide=1 à l'URL pour prévisualiser l'état d'un tout nouvel utilisateur,
// sans chanson ni crédit — c'est le premier écran qu'il verra, il mérite le même soin.
export default function DashboardPage({
  searchParams,
}: {
  searchParams: { vide?: string };
}) {
  const isEmptyPreview = searchParams.vide === "1";
  const songs = isEmptyPreview ? [] : mockSongs;
  const creditBalance = isEmptyPreview ? 0 : mockUser.creditBalance;
  const stats = isEmptyPreview
    ? { creditsRestants: 0, chansonsCreees: 0, chansonsOffertes: 0, totalDepenseFcfa: 0 }
    : dashboardStats;

  return (
    <>
      {/* Mobile — écran d'app dédié : pas de sidebar, pas de grille de stats, pas de
          carrousel d'occasions. Juste la salutation, l'action principale et les
          chansons récentes (voir la conversation : « conçue comme une application,
          pas comme un site réduit »). */}
      <div className="space-y-6 lg:hidden">
        <MobileGreeting firstName={mockUser.firstName} creditBalance={creditBalance} />
        <PrimaryActionCard hasSongs={songs.length > 0} />
        <RecentSongsList songs={songs} />
      </div>

      {/* Desktop */}
      <div className="hidden space-y-10 lg:block">
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
    </>
  );
}
