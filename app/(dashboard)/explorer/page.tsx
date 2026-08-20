"use client";

import { useEffect, useState } from "react";
import { ExplorerFeed } from "@/components/explorer/ExplorerFeed";
import { ExplorerHeading } from "@/components/explorer/ExplorerHeading";
import { fetchPublishedExplorerSongs } from "@/lib/supabase/dataAdapters";
import type { PublishedSong } from "@/lib/types";

// Plein écran, en dehors du gabarit habituel des pages du tableau de bord :
// Explorer est un défilement immersif, un morceau à la fois, pas une page avec
// un titre et des cartes. Positionné en `fixed`, calé exactement dans l'espace
// que laissent libre les barres du shell (mesures prises sur MobileTopBar,
// BottomNav et TopBar) — la sidebar desktop et la barre basse mobile restent
// intactes, cet écran s'insère seulement entre elles.
export default function ExplorerPage() {
  const [entries, setEntries] = useState<PublishedSong[]>([]);
  useEffect(() => {
    fetchPublishedExplorerSongs().then(setEntries).catch(() => setEntries([]));
  }, []);

  return (
    <>
      <ExplorerHeading />
      <div className="fixed left-0 right-0 top-[65px] bottom-[65px] lg:bottom-0 lg:left-[280px] lg:right-0 lg:top-[77px]">
        <ExplorerFeed entries={entries} />
      </div>
    </>
  );
}
