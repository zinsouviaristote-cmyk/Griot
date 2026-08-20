"use client";

import { useEffect, useState } from "react";
import { BibliothequePageBody } from "@/components/dashboard/historiques/BibliothequePageBody";
import { fetchUserSongs } from "@/lib/supabase/dataAdapters";
import type { Song } from "@/lib/types";

// Ajoutez ?vide=1 pour prévisualiser une bibliothèque sans aucune chanson —
// même convention que ?vide=1 sur le tableau de bord.
export default function HistoriquesPage({ searchParams }: { searchParams: { vide?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  useEffect(() => {
    if (searchParams.vide === "1") return;
    fetchUserSongs().then(setSongs).catch(() => setSongs([]));
  }, [searchParams.vide]);

  return <BibliothequePageBody songs={searchParams.vide === "1" ? [] : songs} />;
}
