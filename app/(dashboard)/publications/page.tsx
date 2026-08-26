"use client";

import { useEffect, useState } from "react";
import { PublicationsPageBody } from "@/components/publications/PublicationsPageBody";
import { fetchMyPublishedSongs, fetchUserSongs } from "@/lib/supabase/dataAdapters";
import type { PublishedSong, Song } from "@/lib/types";

export default function PublicationsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [publishedSongs, setPublishedSongs] = useState<PublishedSong[]>([]);

  useEffect(() => {
    Promise.all([fetchUserSongs(), fetchMyPublishedSongs()])
      .then(([userSongs, published]) => {
        setSongs(userSongs);
        setPublishedSongs(published);
      })
      .catch(() => {
        setSongs([]);
        setPublishedSongs([]);
      });
  }, []);

  return <PublicationsPageBody songs={songs} publishedSongs={publishedSongs} onPublishedSongsChange={setPublishedSongs} />;
}
