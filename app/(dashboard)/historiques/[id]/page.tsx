"use client";

import { useEffect, useState } from "react";
import { Music4 } from "lucide-react";
import { SongDetailView } from "@/components/dashboard/detail/SongDetailView";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchMyPublishedSongs, fetchSongById } from "@/lib/supabase/dataAdapters";
import { createResilientChannel } from "@/lib/supabase/realtimeChannel";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong, Song } from "@/lib/types";

export default function SongDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [song, setSong] = useState<Song | null>(null);
  const [publishedEntry, setPublishedEntry] = useState<PublishedSong | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSongById(params.id), fetchMyPublishedSongs()])
      .then(([fetchedSong, published]) => {
        if (cancelled) return;
        setSong(fetchedSong);
        setPublishedEntry(published.find((entry) => entry.sourceSongId === params.id) ?? null);
      })
      .catch(() => {
        if (!cancelled) setSong(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // `songs` n'est pas suivi en Realtime (seul generation_attempts l'est,
  // voir schema.sql) : pendant la generation, on ecoute la fin de l'essai en
  // cours et on relit la chanson a ce moment-la, plutot que de laisser cet
  // ecran fige sur "Génération en cours" jusqu'a un rafraichissement manuel.
  useEffect(() => {
    if (!song || song.status !== "generating") return;
    let cancelled = false;
    function refetch() {
      fetchSongById(params.id).then((fetched) => {
        if (!cancelled && fetched) setSong(fetched);
      });
    }
    const unsubscribe = createResilientChannel<{ status: string }>({
      channelName: `song-generation-${params.id}`,
      table: "generation_attempts",
      event: "UPDATE",
      filter: `song_id=eq.${params.id}`,
      onChange: refetch,
      onResync: refetch,
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [song?.id, song?.status, params.id]);

  if (loading) return null;

  if (!song) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon={Music4}
          title={t("history.notFound.title")}
          description={t("history.notFound.description")}
          actionLabel={t("history.notFound.action")}
          actionHref="/historiques"
        />
      </div>
    );
  }

  return <SongDetailView song={song} publishedEntry={publishedEntry} />;
}
