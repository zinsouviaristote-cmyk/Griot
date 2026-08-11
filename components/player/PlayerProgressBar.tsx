"use client";

import { useRef } from "react";
import { formatDuration } from "@/lib/format/duration";
import { usePlayer } from "@/lib/player/PlayerContext";

/**
 * Barre de progression fine avec les temps de part et d'autre — cliquable et
 * glissable (pointer capture, un seul écouteur, pas de listener global sur
 * `window` qui traînerait après le relâchement).
 */
export function PlayerProgressBar({ className = "" }: { className?: string }) {
  const { currentTime, duration, seekTo } = usePlayer();
  const trackRef = useRef<HTMLDivElement>(null);
  const fraction = duration > 0 ? currentTime / duration : 0;

  function fractionAt(clientX: number): number {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekTo(fractionAt(event.clientX));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;
    seekTo(fractionAt(event.clientX));
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-muted">
        {formatDuration(currentTime)}
      </span>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Progression de la lecture"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fraction * 100)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") seekTo(Math.min(1, fraction + 0.05));
          if (event.key === "ArrowLeft") seekTo(Math.max(0, fraction - 0.05));
        }}
        className="group relative h-4 flex-1 cursor-pointer touch-none"
      >
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-100 ease-linear"
            style={{ width: `${fraction * 100}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand opacity-0 shadow-card transition-opacity group-hover:opacity-100"
          style={{ left: `${fraction * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="w-9 shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
        {formatDuration(duration)}
      </span>
    </div>
  );
}
