"use client";

import { useEffect, useState } from "react";
import { Music4 } from "lucide-react";
import { SongDetailView } from "@/components/dashboard/detail/SongDetailView";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchMyPublishedSongs, fetchSongById } from "@/lib/supabase/dataAdapters";
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
