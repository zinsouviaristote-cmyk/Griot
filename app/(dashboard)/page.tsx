import { CreateSongHero } from "@/components/dashboard/CreateSongHero";
import { OccasionCarousel } from "@/components/dashboard/OccasionCarousel";
import { SongsTable } from "@/components/dashboard/SongsTable";
import { MobileGreeting } from "@/components/dashboard/mobile/MobileGreeting";
import { PrimaryActionCard } from "@/components/dashboard/mobile/PrimaryActionCard";
import { RecentSongsList } from "@/components/dashboard/mobile/RecentSongsList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { mockSongs, mockUser } from "@/lib/data/mock-dashboard";

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

  return (
    <>
      {/* Mobile — écran d'app dédié : pas de sidebar, pas de grille de stats, pas de
          carrousel d'occasions. Juste la salutation, l'action principale et les
          chansons récentes (voir la conversation : « conçue comme une application,
          pas comme un site réduit »). */}
      <div className="space-y-6 lg:hidden">
        <Reveal>
          <MobileGreeting firstName={mockUser.firstName} creditBalance={creditBalance} />
        </Reveal>
        <Reveal delayMs={80}>
          <PrimaryActionCard hasSongs={songs.length > 0} />
        </Reveal>
        <Reveal delayMs={160}>
          <RecentSongsList songs={songs} />
        </Reveal>
      </div>

      {/* Desktop — respirations volontairement inégales entre sections : un
          intervalle plus large avant les dernières chansons (mt-12, 48px) qu'avant
          les occasions (mt-8, 32px) — 1,5x, sous le plafond du double, pour que le
          rythme se sente sans se remarquer. */}
      <div className="hidden lg:block">
        <Reveal>
          <CreateSongHero />
        </Reveal>

        <Reveal delayMs={80} className="mt-8">
          <OccasionCarousel />
        </Reveal>

        {/* Pas de Reveal ici (contrairement aux sections au-dessus) : cette
            section démarre sous la ligne de flottaison sur la hauteur d'écran de
            référence (960px). La gater au scroll la laissait à opacity-0 tant que
            personne n'avait défilé — un grand vide blanc, pas une respiration. Le
            fondu en cascade reste bien réel : chaque ligne du tableau (SongRow)
            porte son propre Reveal et se révèle à son tour au défilement. */}
        <section className="mt-12">
          <div className="mb-3">
            <SectionTitle>Dernières chansons</SectionTitle>
          </div>
          <SongsTable songs={songs} />
        </section>
      </div>
    </>
  );
}
