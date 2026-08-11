"use client";

import { usePlayer, type PlayerTrack } from "@/lib/player/PlayerContext";
import { TrackPlayButton } from "@/components/player/TrackPlayButton";
import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { Waveform } from "@/components/player/Waveform";
import { formatDuration } from "@/lib/format/duration";

/**
 * Le lecteur mis en avant de la fiche d'une chanson — gros bouton rond, forme
 * d'onde, progression. Même moteur que la barre persistante (lib/player/PlayerContext) :
 * jouer ici alimente aussi la barre du bas, jamais un second audio parallèle.
 * Tant que ce n'est pas CETTE piste qui joue (l'utilisateur a peut-être laissé
 * une autre chanson tourner ailleurs), la progression reste figée à 0 — jamais
 * celle, trompeuse, d'une piste différente.
 */
export function TrackHeroPlayer({ track, durationSeconds }: { track: PlayerTrack; durationSeconds: number | null }) {
  const player = usePlayer();
  const isActive = player.current?.id === track.id;

  return (
    <div className="flex items-center gap-4 rounded-card border border-border bg-page p-4">
      <TrackPlayButton track={track} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex h-7 items-center">
          <Waveform active={isActive && player.isPlaying} barClassName="bg-brand" className="h-full" />
        </div>
        <div className="mt-2">
          {isActive ? (
            <PlayerProgressBar />
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-muted">
                0:00
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-border" />
              <span className="w-9 shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
                {formatDuration(durationSeconds ?? 0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
