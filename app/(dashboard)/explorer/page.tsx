"use client";

import { useCallback, useEffect, useState } from "react";
import { ExplorerFeed } from "@/components/explorer/ExplorerFeed";
import { ExplorerHeading } from "@/components/explorer/ExplorerHeading";
import { FeedScreenSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { fetchMyLikedPublishedSongIds, fetchPublishedExplorerSongs } from "@/lib/supabase/dataAdapters";
import { createResilientChannel } from "@/lib/supabase/realtimeChannel";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong } from "@/lib/types";

type LoadStatus = "loading" | "error" | "ready";

interface DBPublishedSongCountersRow {
  id: string;
  likes_count: number;
  listens_count: number;
  downloads_count: number;
}

// Plein écran, en dehors du gabarit habituel des pages du tableau de bord :
// Explorer est un défilement immersif, un morceau à la fois, pas une page avec
// un titre et des cartes. Positionné en `fixed`, calé exactement dans l'espace
// que laissent libre les barres du shell (mesures prises sur MobileTopBar,
// BottomNav et TopBar) — la sidebar desktop et la barre basse mobile restent
// intactes, cet écran s'insère seulement entre elles.
export default function ExplorerPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<PublishedSong[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<LoadStatus>("loading");

  const load = useCallback(() => {
    setStatus("loading");
    Promise.all([fetchPublishedExplorerSongs(), fetchMyLikedPublishedSongIds()])
      .then(([published, liked]) => {
        setEntries(published);
        setLikedIds(liked);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Réconciliation en direct des compteurs sociaux (likes, écoutes,
  // téléchargements) d'Explorer : un seul canal pour tout l'écran, ouvert
  // tant qu'il est affiché et fermé en le quittant — jamais un abonnement par
  // carte, qui saturerait vite un forfait 3G payé au mégaoctet.
  useEffect(() => {
    const unsubscribe = createResilientChannel<DBPublishedSongCountersRow>({
      channelName: "explorer-published-songs",
      table: "published_songs",
      event: "UPDATE",
      onChange: (row) => {
        setEntries((current) =>
          current.map((entry) =>
            entry.id === row.id
              ? { ...entry, likes: row.likes_count, listens: row.listens_count, downloads: row.downloads_count }
              : entry,
          ),
        );
      },
      onResync: () => {
        // Ne touche jamais à `status` : une resynchronisation silencieuse en
        // fond ne doit jamais faire réapparaître le squelette de chargement
        // sur un écran déjà affiché.
        fetchPublishedExplorerSongs()
          .then((published) => setEntries(published))
          .catch(() => {
            // Pas grave ici : le prochain événement Realtime ou la prochaine
            // reconnexion réessaiera de lui-même.
          });
      },
    });
    return unsubscribe;
  }, []);

  if (status === "loading") {
    return (
      <>
        <ExplorerHeading />
        <div className="fixed left-0 right-0 top-[65px] bottom-[65px] lg:bottom-0 lg:left-[280px] lg:right-0 lg:top-[95px]">
          <FeedScreenSkeleton />
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <ExplorerHeading />
        <div className="fixed left-0 right-0 top-[65px] bottom-[65px] flex items-center justify-center px-6 lg:bottom-0 lg:left-[280px] lg:right-0 lg:top-[95px]">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="max-w-xs text-sm text-ink-muted">{t("explorer.loadError.description")}</p>
            <Button type="button" variant="primary" onClick={load}>
              {t("explorer.loadError.retry")}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ExplorerHeading />
      <div className="fixed left-0 right-0 top-[65px] bottom-[65px] lg:bottom-0 lg:left-[280px] lg:right-0 lg:top-[95px]">
        <ExplorerFeed entries={entries} likedIds={likedIds} />
      </div>
    </>
  );
}
