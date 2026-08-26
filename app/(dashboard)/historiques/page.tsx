"use client";

import { useEffect, useState } from "react";
import { BibliothequePageBody } from "@/components/dashboard/historiques/BibliothequePageBody";
import { fetchMyPublishedSongs, fetchUserSongs } from "@/lib/supabase/dataAdapters";
import type { PublishedSong, Song } from "@/lib/types";

// Ajoutez ?vide=1 pour prévisualiser une bibliothèque sans aucune chanson —
// même convention que ?vide=1 sur le tableau de bord.
export default function HistoriquesPage({ searchParams }: { searchParams: { vide?: string; recherche?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [publishedSongs, setPublishedSongs] = useState<PublishedSong[]>([]);

  useEffect(() => {
    if (searchParams.vide === "1") return;
    Promise.all([fetchUserSongs(), fetchMyPublishedSongs()])
      .then(([userSongs, published]) => {
        setSongs(userSongs);
        setPublishedSongs(published);
      })
      .catch(() => {
        setSongs([]);
        setPublishedSongs([]);
      });
  }, [searchParams.vide]);

  return (
    <BibliothequePageBody
      songs={searchParams.vide === "1" ? [] : songs}
      publishedSongs={searchParams.vide === "1" ? [] : publishedSongs}
      onPublishedSongsChange={setPublishedSongs}
      onSongDeleted={(songId) => setSongs((current) => current.filter((song) => song.id !== songId))}
      initialSearch={searchParams.recherche ?? ""}
    />
  );
}
