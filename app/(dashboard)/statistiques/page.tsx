"use client";

import { useEffect, useState } from "react";
import { StatistiquesPageBody } from "@/components/dashboard/stats/StatistiquesPageBody";
import { fetchMyPublishedSongs, fetchUserSongs } from "@/lib/supabase/dataAdapters";
import { fetchRecentActivityEvents } from "@/lib/supabase/statsAdapters";
import { getPublicDisplayName } from "@/lib/explorer/displayName";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ActivityEntry, PublishedSong, Song } from "@/lib/types";

export default function StatistiquesPage({ searchParams }: { searchParams: { vide?: string } }) {
  const { t } = useLanguage();
  const [songs, setSongs] = useState<Song[]>([]);
  const [published, setPublished] = useState<PublishedSong[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    if (searchParams.vide === "1") return;
    Promise.all([fetchUserSongs(), fetchMyPublishedSongs()])
      .then(async ([userSongs, myPublished]) => {
        setSongs(userSongs);
        setPublished(myPublished);

        const events = await fetchRecentActivityEvents(myPublished.map((entry) => entry.id));
        const byId = new Map(myPublished.map((entry) => [entry.id, entry]));
        const now = Date.now();
        setRecentActivity(
          events
            .map((event) => {
              const entry = byId.get(event.publishedSongId);
              if (!entry) return null;
              return {
                id: event.id,
                type: event.type,
                displayName: getPublicDisplayName(entry, t),
                minutesAgo: Math.max(0, Math.round((now - new Date(event.createdAt).getTime()) / 60000)),
              };
            })
            .filter((entry): entry is ActivityEntry => entry !== null),
        );
      })
      .catch(() => {
        setSongs([]);
        setPublished([]);
        setRecentActivity([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.vide]);

  return (
    <StatistiquesPageBody
      isEmptyPreview={searchParams.vide === "1"}
      songs={songs}
      published={published}
      recentActivity={recentActivity}
    />
  );
}
