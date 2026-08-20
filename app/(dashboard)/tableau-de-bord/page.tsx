"use client";

import { useEffect, useState } from "react";

import { CreateSongHero } from "@/components/dashboard/CreateSongHero";
import { OccasionCarousel } from "@/components/dashboard/OccasionCarousel";
import { SongsTable } from "@/components/dashboard/SongsTable";
import { MobileGreeting } from "@/components/dashboard/mobile/MobileGreeting";
import { PrimaryActionCard } from "@/components/dashboard/mobile/PrimaryActionCard";
import { RecentSongsList } from "@/components/dashboard/mobile/RecentSongsList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";
import { fetchUserSongs } from "@/lib/supabase/dataAdapters";
import type { Song } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Ajoutez ?vide=1 à l'URL pour prévisualiser l'état d'un tout nouvel utilisateur,
// sans chanson ni crédit — c'est le premier écran qu'il verra, il mérite le même soin.
export default function DashboardPage({
  searchParams,
}: {
  searchParams: { vide?: string };
}) {
  const { t } = useLanguage();
  const user = useDashboardUser();
  const [songs, setSongs] = useState<Song[]>([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const isEmptyPreview = searchParams.vide === "1";
  useEffect(() => {
    fetchUserSongs()
      .then((userSongs) => setSongs(userSongs.slice(0, 3)))
      .finally(() => setSongsLoading(false));
  }, []);
  const visibleSongs = isEmptyPreview ? [] : songs;
  const creditBalance = isEmptyPreview ? 0 : user.creditBalance;

  return (
    <>
        {/* Mobile — écran d'app dédié : salutation et action principale. */}
      <div className="space-y-6 lg:hidden">
        <Reveal>
          <MobileGreeting firstName={user.firstName} creditBalance={creditBalance} />
        </Reveal>
        <Reveal delayMs={80}>
          <PrimaryActionCard hasSongs={visibleSongs.length > 0} />
        </Reveal>
        <Reveal delayMs={160}>
          <RecentSongsList songs={songsLoading ? [] : visibleSongs} />
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
            <SectionTitle>{t("dashboard.latestSongs")}</SectionTitle>
          </div>
          <SongsTable songs={songsLoading ? [] : visibleSongs} />
        </section>
      </div>
    </>
  );
}
