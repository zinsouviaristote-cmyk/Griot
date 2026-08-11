"use client";

import { Pause, Play } from "lucide-react";
import { usePlayer, type PlayerTrack } from "@/lib/player/PlayerContext";

const SIZE_CLASSES = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
};

const ICON_SIZE_CLASSES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

/**
 * Bouton lecture/pause réutilisé partout où une piste peut démarrer (carte
 * Explorer, ligne de bibliothèque, fiche détail) — il ne joue jamais localement :
 * il pousse la piste dans le lecteur persistant (lib/player/PlayerContext),
 * seule source de vérité de "qu'est-ce qui joue en ce moment".
 */
export function TrackPlayButton({
  track,
  queue,
  size = "md",
  className = "",
}: {
  track: PlayerTrack;
  queue?: PlayerTrack[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const player = usePlayer();
  const isActive = player.current?.id === track.id;
  const isPlaying = isActive && player.isPlaying;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (isActive) player.toggle();
    else player.play(track, queue);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isPlaying ? "Mettre en pause" : `Écouter la chanson de ${track.title}`}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform duration-150 ease-magnetic hover:brightness-90 active:scale-90 ${SIZE_CLASSES[size]} ${className}`}
    >
      {isPlaying ? (
        <Pause className={ICON_SIZE_CLASSES[size]} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
      ) : (
        <Play className={`${ICON_SIZE_CLASSES[size]} ml-0.5`} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
      )}
    </button>
  );
}
