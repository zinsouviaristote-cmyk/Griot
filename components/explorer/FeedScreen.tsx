"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  FileText,
  Headphones,
  Repeat,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayer, type PlayerTrack } from "@/lib/player/PlayerContext";
import { TrackArt } from "@/components/player/TrackArt";
import { TrackPlayButton } from "@/components/player/TrackPlayButton";
import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { Waveform } from "@/components/player/Waveform";
import { LikeButton } from "@/components/explorer/LikeButton";
import { LyricsSheet } from "@/components/explorer/LyricsSheet";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { hasCountedListen, recordListen } from "@/lib/explorer/listens";
import { getPublicDisplayName } from "@/lib/data/mock-explorer";
import { formatDuration } from "@/lib/format/duration";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { PublishedSong } from "@/lib/types";

const LISTEN_THRESHOLD_SECONDS = 5;

// Un écran par chanson, occupant tout le viewport disponible (voir ExplorerFeed
// pour le calcul exact de cette hauteur, qui tient compte des barres fixes du
// shell) — jamais de scroll interne, tout tient dans l'écran comme un card
// vidéo courte.
export function FeedScreen({
  entry,
  index,
  isFirst,
  isActive,
  isLast,
  queue,
  onGoPrev,
  onGoNext,
}: {
  entry: PublishedSong;
  index: number;
  isFirst: boolean;
  isActive: boolean;
  isLast: boolean;
  queue: PlayerTrack[];
  onGoPrev: () => void;
  onGoNext: () => void;
}) {
  const { t } = useLanguage();
  const player = usePlayer();
  const showToast = useToast();
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const elapsedRef = useRef(0);
  const countedRef = useRef(hasCountedListen(entry.id));

  const displayName = getPublicDisplayName(entry, t);
  const isCurrent = player.current?.id === entry.id;
  const isPlayingHere = isCurrent && player.isPlaying;

  const track: PlayerTrack = {
    id: entry.id,
    title: displayName,
    subtitle: `${occasionLabel(t, entry.occasion)} · ${styleLabel(t, entry.style)}`,
    occasion: entry.occasion,
    audioUrl: entry.audioUrl,
    publishedId: entry.id,
    likes: entry.likes,
    imageUrl: entry.imageUrl,
    origin: "explorer",
  };

  // Écoute comptée après 5 secondes de lecture EFFECTIVE, cumulées même si la
  // piste a été mise en pause en chemin (elapsedRef survit aux allers-retours
  // play/pause, ne se remet à zéro que si l'écran change de chanson).
  useEffect(() => {
    if (!isActive || !isCurrent || !player.isPlaying || countedRef.current) return;
    const interval = window.setInterval(() => {
      elapsedRef.current += 0.5;
      if (elapsedRef.current >= LISTEN_THRESHOLD_SECONDS && !countedRef.current) {
        countedRef.current = true;
        recordListen(entry.id);
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, [isActive, isCurrent, player.isPlaying, entry.id]);

  // Referme le panneau des paroles quand on quitte cet écran — jamais rouvert
  // par surprise en revenant dessus plus tard.
  useEffect(() => {
    if (!isActive) setLyricsOpen(false);
  }, [isActive]);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/chanson/${entry.id}`);
      showToast(t("explorer.linkCopied"), "success");
    } catch {
      showToast(t("explorer.linkCopyFailed"), "danger");
    }
  }

  return (
    <section
      className="relative flex h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-page"
      aria-label={t("explorer.screenAriaLabel", { position: index + 1, name: displayName })}
    >
      <div className="flex h-full min-w-0 flex-1 flex-col items-center px-5 pb-2 pt-14 lg:pb-8 lg:pt-10">
        <p className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-muted">
          <Headphones className="h-3.5 w-3.5 animate-breathe" strokeWidth={1.5} aria-hidden="true" />
          {t("explorer.listensCount", { count: entry.listens })}
        </p>

        <div className="flex w-full max-w-[300px] flex-1 flex-col items-center justify-center gap-3 py-2 lg:max-w-xs lg:gap-4">
          <div className="relative w-full max-w-[210px] lg:max-w-[240px]">
            <TrackArt occasion={entry.occasion} imageUrl={entry.imageUrl} className="aspect-square w-full rounded-feature shadow-card-hover" />
          </div>

          <div className="flex items-center gap-2">
            <Avatar initials={entry.authorName.slice(0, 1).toUpperCase()} size="sm" />
            <span className="text-sm font-medium text-ink">{entry.authorName}</span>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
              {styleLabel(t, entry.style)}
            </span>
          </div>

          <div className="max-w-full text-center">
            <p className="truncate font-display text-xl font-semibold text-ink">{displayName}</p>
            <p className="mt-1 truncate text-sm text-ink-muted">{entry.lyrics[0]}</p>
          </div>

          <Waveform active={isPlayingHere} barClassName="bg-brand" className="h-4" />
        </div>

        <div className="w-full max-w-sm shrink-0 space-y-2.5 lg:max-w-md lg:space-y-4">
          {isCurrent ? (
            <PlayerProgressBar />
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-muted">0:00</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-border" />
              <span className="w-9 shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
                {formatDuration(0)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={onGoPrev}
              disabled={isFirst}
              aria-label={t("explorer.previousSong")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-magnetic active:scale-90 disabled:opacity-30"
            >
              <SkipBack className="h-5 w-5" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </button>
            <TrackPlayButton track={track} queue={queue} size="lg" />
            <button
              type="button"
              onClick={onGoNext}
              disabled={isLast}
              aria-label={t("explorer.nextSong")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-magnetic active:scale-90 disabled:opacity-30"
            >
              <SkipForward className="h-5 w-5" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2.5 sm:gap-5">
            <button
              type="button"
              onClick={() => player.toggleRepeatOne()}
              aria-pressed={player.repeatOne}
              aria-label={player.repeatOne ? t("explorer.repeatOn") : t("explorer.repeatOff")}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150 active:scale-90 ${
                player.repeatOne ? "text-brand" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Repeat className={`h-4 w-4 ${player.repeatOne ? "animate-spin-slow" : ""}`} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <LikeButton publishedSongId={entry.id} likes={entry.likes} />

            <button
              type="button"
              onClick={handleShare}
              aria-label={t("explorer.shareLink")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:text-ink active:scale-90"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setLyricsOpen((open) => !open)}
              aria-pressed={lyricsOpen}
              aria-expanded={lyricsOpen}
              className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors duration-150 active:scale-90 ${
                lyricsOpen ? "text-brand" : "text-ink-muted hover:text-ink"
              }`}
            >
              <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {t("explorer.lyrics")}
            </button>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => player.setVolume(player.volume > 0 ? 0 : 1)}
                aria-label={player.volume > 0 ? t("explorer.mute") : t("explorer.unmute")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:text-ink active:scale-90"
              >
                {player.volume > 0 ? (
                  <Volume2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <VolumeX className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={player.volume}
                onChange={(event) => player.setVolume(Number(event.target.value))}
                aria-label={t("explorer.volume")}
                className="hidden w-16 accent-brand sm:block"
              />
            </div>
          </div>
        </div>

        {/* Desktop seulement : sur mobile le glissement au doigt suffit (voir
            snap-y sur le conteneur parent). Visible à chaque morceau — jamais
            réservée au premier — légèrement animée pour signaler qu'elle se
            clique, désactivée seulement en fin de file. */}
        <div className="mt-8 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={onGoNext}
            disabled={isLast}
            aria-label="Chanson suivante"
            className="flex h-9 w-9 animate-breathe items-center justify-center rounded-full bg-brand-soft text-brand transition-transform duration-150 ease-magnetic hover:scale-110 active:scale-95 disabled:animate-none disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {lyricsOpen && (
        <LyricsSheet entry={entry} displayName={displayName} onClose={() => setLyricsOpen(false)} />
      )}
    </section>
  );
}
