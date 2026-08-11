import type { Metadata } from "next";
import { ExplorerFeed } from "@/components/explorer/ExplorerFeed";
import { mockPublishedSongs } from "@/lib/data/mock-explorer";

export const metadata: Metadata = {
  title: "Explorer — Griot",
};

// Plein écran, en dehors du gabarit habituel des pages du tableau de bord :
// Explorer est un défilement immersif, un morceau à la fois, pas une page avec
// un titre et des cartes. Positionné en `fixed`, calé exactement dans l'espace
// que laissent libre les barres du shell (mesures prises sur MobileTopBar,
// BottomNav et TopBar) — la sidebar desktop et la barre basse mobile restent
// intactes, cet écran s'insère seulement entre elles.
export default function ExplorerPage() {
  return (
    <>
      <h1 className="sr-only">Explorer</h1>
      <div className="fixed left-0 right-0 top-[65px] bottom-[65px] lg:bottom-0 lg:left-[280px] lg:right-0 lg:top-[77px]">
        <ExplorerFeed entries={mockPublishedSongs} />
      </div>
    </>
  );
}
