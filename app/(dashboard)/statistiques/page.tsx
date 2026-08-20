"use client";

import { useEffect, useState } from "react";
import { StatistiquesPageBody } from "@/components/dashboard/stats/StatistiquesPageBody";
import { fetchPublishedExplorerSongs, fetchUserSongs } from "@/lib/supabase/dataAdapters";
import type { PublishedSong, Song } from "@/lib/types";

export default function StatistiquesPage({ searchParams }: { searchParams: { vide?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [published, setPublished] = useState<PublishedSong[]>([]);

  useEffect(() => {
    if (searchParams.vide === "1") return;
    Promise.all([fetchUserSongs(), fetchPublishedExplorerSongs()])
      .then(([userSongs, publications]) => {
        setSongs(userSongs);
        setPublished(publications.filter((publication) => publication.mine));
      })
      .catch(() => {
        setSongs([]);
        setPublished([]);
      });
  }, [searchParams.vide]);

  return <StatistiquesPageBody isEmptyPreview={searchParams.vide === "1"} songs={songs} published={published} />;
}
