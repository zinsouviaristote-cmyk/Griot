"use client";

import { useEffect, useState } from "react";
import { ParametresPageBody } from "@/components/settings/ParametresPageBody";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";
import { fetchUserSongs, fetchPublishedExplorerSongs } from "@/lib/supabase/dataAdapters";

export default function ParametresPage() {
  const user = useDashboardUser();
  const [songCount, setSongCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    Promise.all([fetchUserSongs(), fetchPublishedExplorerSongs()])
      .then(([songs, published]) => {
        setSongCount(songs.length);
        setPublishedCount(published.filter((entry) => entry.mine).length);
      })
      .catch(() => {
        setSongCount(0);
        setPublishedCount(0);
      });
  }, []);

  return <ParametresPageBody user={user} songCount={songCount} publishedCount={publishedCount} />;
}
