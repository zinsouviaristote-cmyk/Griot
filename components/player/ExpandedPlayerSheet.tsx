"use client";

import { useRef, useState } from "react";
import { ChevronDown, Heart, Share2, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player/PlayerContext";
import { TrackArt } from "@/components/player/TrackArt";
import { TrackPlayButton } from "@/components/player/TrackPlayButton";
import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { Waveform } from "@/components/player/Waveform";
import { LikeButton } from "@/components/explorer/LikeButton";
import { useToast } from "@/components/ui/Toast";

const CLOSE_THRESHOLD = 90;

/**
 * Lecteur plein écran mobile — s'ouvre au tap sur la barre compacte, se ferme
 * au glissement vers le bas (suivi du doigt en direct, pas juste un seuil
 * binaire) ou via le chevron. N'existe jamais sur desktop, où la barre du bas
 * affiche déjà tout en permanence.
 */
export function ExpandedPlayerSheet() {
  const player = usePlayer();
  const showToast = useToast();
  const [dragY, setDragY] = useState(0);
  const dragging = useRef(false);
  const startY = useRef(0);

  const { current } = player;
  if (!current) return null;

  // Pas de `setPointerCapture` ici : capturer le pointeur sur ce conteneur
  // détournerait aussi le clic des boutons enfants (fermer, précédent/suivant,
  // lecture) vers lui — leur `onClick` ne se déclencherait alors plus jamais.
  // Chaque contrôle interactif arrête la propagation de son propre
  // `pointerdown` (voir plus bas) pour ne jamais amorcer un glissement.
  function handlePointerDown(event: React.PointerEvent) {
    dragging.current = true;
    startY.current = event.clientY;
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!dragging.current) return;
    const delta = Math.max(0, event.clientY - startY.current);
    setDragY(delta);
  }

  function handlePointerUp() {
    dragging.current = false;
    if (dragY > CLOSE_THRESHOLD) player.setExpanded(false);
    setDragY(0);
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Lien copié.", "success");
    } catch {
      showToast("Impossible de copier le lien.", "danger");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-page lg:hidden" role="dialog" aria-modal="true">
      <div
        className="flex flex-1 flex-col px-6 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]"
        style={{ transform: `translateY(${dragY}px)`, transition: dragging.current ? "none" : "transform 0.2s ease-out" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => player.setExpanded(false)}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Réduire le lecteur"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-soft/60 active:scale-90"
          >
            <ChevronDown className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <span className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">
            En cours de lecture
          </span>
          <span className="h-11 w-11" aria-hidden="true" />
        </div>

        <div className="mx-auto mt-6 w-full max-w-xs flex-1">
          <TrackArt occasion={current.occasion} className="aspect-square w-full rounded-feature shadow-card-hover" />

          <div className="mt-8 text-center">
            <p className="font-display text-2xl font-semibold text-ink">{current.title}</p>
            <p className="mt-1 text-body-md text-ink-muted">{current.subtitle}</p>
          </div>

          <div className="mt-6 flex h-8 items-center justify-center">
            <Waveform active={player.isPlaying} barClassName="bg-brand" className="h-full" />
          </div>

          <div className="mt-6" onPointerDown={(event) => event.stopPropagation()}>
            <PlayerProgressBar />
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-6"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => player.prev()}
              disabled={!player.hasPrev}
              aria-label="Chanson précédente"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-magnetic active:scale-90 disabled:opacity-30"
            >
              <SkipBack className="h-5 w-5" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </button>
            <TrackPlayButton track={current} queue={player.queue} size="lg" />
            <button
              type="button"
              onClick={() => player.next()}
              disabled={!player.hasNext}
              aria-label="Chanson suivante"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-magnetic active:scale-90 disabled:opacity-30"
            >
              <SkipForward className="h-5 w-5" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </button>
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-8"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {current.publishedId ? (
              <LikeButton publishedSongId={current.publishedId} likes={current.likes ?? 0} />
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted/50">
                <Heart className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Partager le lien"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-brand active:scale-90"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
