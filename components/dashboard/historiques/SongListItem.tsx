"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Ear, Heart, Share2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Reveal } from "@/components/ui/Reveal";
import { LikeButton } from "@/components/explorer/LikeButton";
import { PublishModal, type PublishModalOutput } from "@/components/publish/PublishModal";
import { TrackArt } from "@/components/player/TrackArt";
import { TrackPlayButton } from "@/components/player/TrackPlayButton";
import { getSongAction } from "@/components/dashboard/songAction";
import { mockUser } from "@/lib/data/mock-dashboard";
import { resolveSongArt } from "@/lib/songArt";
import { formatDate } from "@/lib/format/date";
import { SongActionsMenu } from "./SongActionsMenu";
import { formatDuration } from "@/lib/format/duration";
import { getPublishedEntryForSong } from "@/lib/data/mock-explorer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, relationshipLabel, styleLabel } from "@/lib/i18n/catalog";
import type { PlayerTrack } from "@/lib/player/PlayerContext";
import type { PublishedSong, Song } from "@/lib/types";
import { mockDeleteSong } from "@/lib/data/mockHistoryActions";

function tunnelHref(song: Song): string {
  const params = new URLSearchParams({
    prenom: song.recipientFirstName,
    lien: song.relationship,
    occasion: song.occasion,
  });
  return `/creer?${params.toString()}`;
}

/**
 * Ligne dense de la bibliothèque — remplace l'ancien tableau (SongRow/SongsTable,
 * conservés uniquement pour "Dernières chansons" sur l'accueil, hors de ce
 * changement). Sert aussi de base à Mes publications : mêmes lignes, un
 * sous-ensemble de chansons (voir PublicationsView).
 */
export function SongListItem({ song, index = 0, queue }: { song: Song; index?: number; queue: PlayerTrack[] }) {
  const { t, locale } = useLanguage();
  const showToast = useToast();
  const [publishedEntry, setPublishedEntry] = useState<PublishedSong | null>(
    () => getPublishedEntryForSong(song.id) ?? null,
  );
  const [publishOpen, setPublishOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const detailHref = `/bibliotheque/${song.id}`;
  const action = getSongAction(song, t);
  const isUnlocked = song.status === "paid" || song.status === "delivered";

  const resolvedArt = resolveSongArt(song.imageUrl, mockUser.photoUrl);

  const track: PlayerTrack | null = song.audioUrl
    ? {
        id: song.id,
        title: song.recipientFirstName,
        subtitle: `${occasionLabel(t, song.occasion)} · ${styleLabel(t, song.style)}`,
        occasion: song.occasion,
        audioUrl: song.audioUrl,
        publishedId: publishedEntry?.id,
        likes: publishedEntry?.likes,
        imageUrl: resolvedArt,
      }
    : null;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${detailHref}`);
      showToast(t("library.item.linkCopied"), "success");
    } catch {
      showToast(t("history.item.linkCopyFailed"), "danger");
    }
  }

  function handlePublish({ hideFirstName, publicTitle, imageUrl }: PublishModalOutput) {
    setPublishedEntry({
      id: `pub_local_${song.id}`,
      sourceSongId: song.id,
      mine: true,
      recipientFirstName: song.recipientFirstName,
      hideFirstName,
      publicTitle,
      occasion: song.occasion,
      style: song.style,
      audioUrl: song.audioUrl ?? "/mock-audio.wav",
      likes: 0,
      listens: 0,
      downloads: 0,
      publishedAt: new Date().toISOString().slice(0, 10),
      authorName: mockUser.firstName,
      imageUrl,
      lyrics: song.lyrics ? song.lyrics.split("\n").filter(Boolean) : [],
    });
    setPublishOpen(false);
    showToast(t("history.item.publishedToast"), "success");
  }

  function handleUnpublish() {
    setPublishedEntry(null);
    showToast(t("history.item.unpublishedToast", { name: song.recipientFirstName }), "default");
  }

  async function handleDelete() {
    setDeleting(true);
    await mockDeleteSong(song.id);
    showToast(t("history.item.deletedToast", { name: song.recipientFirstName }), "default");
    setDeleteOpen(false);
    setDeleted(true);
  }

  if (deleted) return null;

  // Les deux modales vivent hors du `<Reveal>` : son animation applique un
  // `transform` à l'élément qu'il enveloppe (y compris en repos, "both"), ce qui
  // en ferait le bloc de référence de tout enfant `fixed` — un `<Modal>` imbriqué
  // se retrouverait cadré dans la ligne au lieu de couvrir l'écran.
  return (
    <>
      <Reveal delayMs={Math.min(index, 10) * 60}>
      <div className="group relative rounded-card border border-border bg-surface p-3 shadow-card transition-shadow duration-200 hover:shadow-card-hover lg:pr-36">
        <div className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-control">
            <TrackArt occasion={song.occasion} imageUrl={resolvedArt} className="h-full w-full" />
            {song.durationSeconds != null && (
              <span className="absolute bottom-1 right-1 rounded bg-ink/70 px-1 py-0.5 font-mono text-[10px] leading-none text-white">
                {formatDuration(song.durationSeconds)}
              </span>
            )}
            {track && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-150 group-hover:bg-ink/25">
                <TrackPlayButton
                  track={track}
                  queue={queue}
                  size="md"
                  className="opacity-90 lg:opacity-0 lg:group-hover:opacity-100"
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={detailHref}
                className="-my-3.5 inline-flex min-h-11 items-center truncate font-display text-sm font-semibold text-ink hover:text-brand"
              >
                {song.recipientFirstName}
              </Link>
              <StatusBadge status={song.status} />
            </div>
            <p className="truncate text-xs text-ink-muted">{relationshipLabel(t, song.relationship)}</p>
            <p className="mt-1 truncate text-xs text-ink-muted">
              {occasionLabel(t, song.occasion)} · {styleLabel(t, song.style)} · {formatDate(song.createdAt, locale)}
            </p>

            <div className="-mx-1 mt-1 flex flex-wrap items-center">
              <span className="flex min-h-11 items-center gap-1 px-1 text-xs text-ink-muted" aria-label={t("history.item.listensAriaLabel", { count: song.listens })}>
                <Ear className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {song.listens}
              </span>
              {publishedEntry ? (
                <LikeButton publishedSongId={publishedEntry.id} likes={publishedEntry.likes} size="sm" />
              ) : (
                <span className="flex min-h-11 items-center gap-1.5 px-2 text-xs text-ink-muted/40" aria-hidden="true">
                  <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              )}
              <button
                type="button"
                onClick={handleShare}
                aria-label={t("history.item.shareAriaLabel")}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-page hover:text-brand active:scale-90"
              >
                <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              {isUnlocked && track ? (
                <a
                  href={track.audioUrl}
                  download={`griot-${song.recipientFirstName}.wav`}
                  aria-label={t("history.item.downloadAriaLabel")}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-page hover:text-brand active:scale-90"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : (
                <span className="flex h-11 w-11 items-center justify-center text-ink-muted/30" aria-hidden="true">
                  <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              )}

              <span className="ml-auto">
                <SongActionsMenu
                  isPublished={!!publishedEntry}
                  redoHref={tunnelHref(song)}
                  redoLabel={t("history.item.redoLabel", { name: song.recipientFirstName })}
                  onPublish={() => setPublishOpen(true)}
                  onUnpublish={handleUnpublish}
                  onDelete={() => setDeleteOpen(true)}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Action principale au survol — desktop uniquement, adaptée à l'état. */}
        <div className="pointer-events-none absolute inset-y-0 right-3 hidden items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 lg:flex">
          {action.disabled ? (
            <span className="pointer-events-auto inline-flex cursor-not-allowed items-center gap-1.5 rounded-control bg-page px-3.5 py-2 text-xs font-semibold text-ink-muted opacity-60">
              <action.icon className={action.spin ? "h-3.5 w-3.5 animate-spin-slow" : "h-3.5 w-3.5"} strokeWidth={1.5} aria-hidden="true" />
              {action.label}
            </span>
          ) : (
            <Link
              href={action.href}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-control bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-card transition-all duration-150 ease-magnetic hover:brightness-90 active:scale-95"
            >
              <action.icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {action.label}
            </Link>
          )}
        </div>
      </div>
      </Reveal>

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        recipientFirstName={song.recipientFirstName}
        occasion={song.occasion}
        style={song.style}
        songImageUrl={song.imageUrl}
        profilePhotoUrl={mockUser.photoUrl}
        onPublish={handlePublish}
      />

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} labelledBy={`delete-${song.id}-title`}>
        <p id={`delete-${song.id}-title`} className="font-display text-lg font-semibold text-ink">
          {t("history.item.deleteTitle", { name: song.recipientFirstName })}
        </p>
        <p className="mt-2 text-sm text-ink-muted">{t("history.item.deleteBody", { name: song.recipientFirstName })}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="flex-1" disabled={deleting}>
            {t("history.item.cancel")}
          </Button>
          <Button onClick={handleDelete} disabled={deleting} className="flex-1 !bg-danger hover:!brightness-90">
            {deleting ? t("history.item.deleting") : t("history.item.delete")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
