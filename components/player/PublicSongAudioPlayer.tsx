"use client";

import { useRef } from "react";
import { hasCountedListen, recordListen } from "@/lib/explorer/listens";
import { recordSongListen } from "@/lib/supabase/dataAdapters";

const LISTEN_THRESHOLD_SECONDS = 5;

// Même élément <audio> natif qu'avant — seule différence, invisible à l'œil :
// une écoute réelle (5 secondes cumulées de lecture effective, comme dans
// Explorer) déclenche `increment_listen` en base, une seule fois par session
// et par visiteur (voir lib/explorer/listens.ts).
export function PublicSongAudioPlayer({ publishedSongId, audioUrl }: { publishedSongId: string; audioUrl: string }) {
  const elapsedRef = useRef(0);
  const countedRef = useRef(hasCountedListen(publishedSongId));
  const intervalRef = useRef<number | null>(null);

  function stopTracking() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function handlePlay() {
    if (countedRef.current || intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      elapsedRef.current += 0.5;
      if (elapsedRef.current >= LISTEN_THRESHOLD_SECONDS && !countedRef.current) {
        countedRef.current = true;
        recordListen(publishedSongId);
        recordSongListen({ publishedSongId }).catch(() => {});
        stopTracking();
      }
    }, 500);
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio
      controls
      preload="metadata"
      src={audioUrl}
      className="w-full"
      onPlay={handlePlay}
      onPause={stopTracking}
      onEnded={stopTracking}
    />
  );
}
