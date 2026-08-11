"use client";

import { usePathname } from "next/navigation";
import { Heart, Share2, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/lib/player/PlayerContext";
import { TrackArt } from "@/components/player/TrackArt";
import { TrackPlayButton } from "@/components/player/TrackPlayButton";
import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { ExpandedPlayerSheet } from "@/components/player/ExpandedPlayerSheet";
import { LikeButton } from "@/components/explorer/LikeButton";
import { useToast } from "@/components/ui/Toast";

/**
 * Lecteur persistant — un seul montage, à la racine du shell connecté (voir
 * DashboardShell), jamais à l'intérieur d'une page : c'est ce qui lui permet de
 * survivre à la navigation. Deux présentations distinctes, jamais une seule
 * redimensionnée : la barre desktop affiche tout en permanence ; la barre mobile
 * compacte ne montre que l'essentiel et s'agrandit en plein écran au tap (voir
 * ExpandedPlayerSheet).
 */
export function PersistentPlayerBar() {
  const player = usePlayer();
  const showToast = useToast();
  const pathname = usePathname();
  const { current } = player;

  // Explorer affiche déjà, plein écran, des contrôles complets pour la piste en
  // cours (voir FeedScreen) — une seconde barre superposée y ferait doublon.
  if (!current || pathname === "/explorer") return null;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Lien copié.", "success");
    } catch {
      showToast("Impossible de copier le lien.", "danger");
    }
  }

  return (
    <>
      {/* Desktop — barre pleine, toujours dépliée, décalée après la sidebar. */}
      <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-border bg-surface lg:left-[280px] lg:flex lg:h-20 lg:items-center lg:gap-6 lg:px-6">
        <div className="flex w-64 min-w-0 shrink-0 items-center gap-3">
          <TrackArt occasion={current.occasion} className="h-12 w-12 rounded-control" />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">{current.title}</p>
            <p className="truncate text-xs text-ink-muted">{current.subtitle}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => player.prev()}
              disabled={!player.hasPrev}
              aria-label="Chanson précédente"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-transform duration-150 ease-magnetic hover:text-ink active:scale-90 disabled:opacity-30"
            >
              <SkipBack className="h-4 w-4" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </button>
            <TrackPlayButton track={current} queue={player.queue} size="sm" />
            <button
              type="button"
              onClick={() => player.next()}
              disabled={!player.hasNext}
              aria-label="Chanson suivante"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-transform duration-150 ease-magnetic hover:text-ink active:scale-90 disabled:opacity-30"
            >
              <SkipForward className="h-4 w-4" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </button>
          </div>
          <PlayerProgressBar className="w-full max-w-md" />
        </div>

        <div className="flex w-40 shrink-0 items-center justify-end gap-1">
          {current.publishedId ? (
            <LikeButton publishedSongId={current.publishedId} likes={current.likes ?? 0} />
          ) : (
            <span className="flex min-h-8 items-center px-2.5 text-ink-muted/40" aria-hidden="true">
              <Heart className="h-4 w-4" strokeWidth={1.5} />
            </span>
          )}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Partager le lien"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-brand active:scale-90"
          >
            <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => player.setVolume(player.volume > 0 ? 0 : 1)}
            aria-label={player.volume > 0 ? "Couper le son" : "Rétablir le son"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-brand active:scale-90"
          >
            {player.volume > 0 ? (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile — barre compacte au-dessus de la barre de navigation basse (voir
          BottomNav, h-16) : jamais superposées, chacune sa bande. Tap n'importe où
          hors des boutons agrandit en plein écran. */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => player.setExpanded(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") player.setExpanded(true);
        }}
        aria-label={`Agrandir le lecteur — ${current.title}`}
        className="fixed inset-x-0 bottom-16 z-40 flex h-16 cursor-pointer items-center gap-3 border-t border-border bg-surface px-3 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <TrackArt occasion={current.occasion} className="h-10 w-10 shrink-0 rounded-control" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-ink">{current.title}</p>
          <p className="truncate text-xs text-ink-muted">{current.subtitle}</p>
        </div>
        <TrackPlayButton track={current} queue={player.queue} size="sm" className="shrink-0" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border" aria-hidden="true">
          <div
            className="h-full bg-brand transition-[width] duration-100 ease-linear"
            style={{ width: `${player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {player.expanded && <ExpandedPlayerSheet />}
    </>
  );
}
