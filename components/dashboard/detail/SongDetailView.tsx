"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cake,
  Check,
  Copy,
  Download,
  Loader2,
  Pencil,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { PublishModal, type PublishModalOutput } from "@/components/publish/PublishModal";
import { TrackHeroPlayer } from "@/components/player/TrackHeroPlayer";
import { SongImageField } from "@/components/dashboard/SongImageField";
import type { PlayerTrack } from "@/lib/player/PlayerContext";
import { mockUser } from "@/lib/data/mock-dashboard";
import { resolveSongArt } from "@/lib/songArt";
import { formatDate, formatDayMonth, parseLocalDate } from "@/lib/format/date";
import { formatFcfa } from "@/lib/format/currency";
import { generateUnlockedLyrics, mockDeleteSong, mockPaySong } from "@/lib/data/mockHistoryActions";
import { getPublishedEntryForSong } from "@/lib/data/mock-explorer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { PublishedSong, Song, SongStatus } from "@/lib/types";

const UNLOCK_PRICE_FCFA = 1900;

function tunnelHref(song: Song, includeOccasion: boolean): string {
  const params = new URLSearchParams({ prenom: song.recipientFirstName });
  if (includeOccasion) params.set("occasion", song.occasion);
  return `/creer?${params.toString()}`;
}

export function SongDetailView({ song }: { song: Song }) {
  const { t, tn, locale } = useLanguage();
  const router = useRouter();
  const showToast = useToast();

  // État local, optimiste : "payer" ici est un raccourci rapide (crédit déjà en
  // poche), pas le tunnel de paiement complet — le changement ne survit pas au
  // rechargement, cohérent avec "aucun appel réel" du reste du produit en phase 1.
  const [status, setStatus] = useState<SongStatus>(song.status);
  const [lyrics, setLyrics] = useState(song.lyrics);
  const [payPhase, setPayPhase] = useState<"idle" | "confirm" | "paying">("idle");
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishedEntry, setPublishedEntry] = useState<PublishedSong | null>(
    () => getPublishedEntryForSong(song.id) ?? null,
  );
  const [publishOpen, setPublishOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(song.imageUrl);

  // Seul endroit du produit où cette date se modifie — aucune page de gestion
  // de contacts : elle vit ici, rattachée à la chanson concernée, et alimente
  // la carte "Prochaine occasion" du tableau de bord et les rappels.
  const [birthday, setBirthday] = useState<string | null>(null);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [birthdayDraft, setBirthdayDraft] = useState(birthday ?? "");

  function handleSaveBirthday() {
    setEditingBirthday(false);
    if (!birthdayDraft) {
      setBirthday(null);
      return;
    }
    setBirthday(birthdayDraft);
    showToast(t("history.detail.birthdayReminderToast", { name: song.recipientFirstName }), "success");
  }

  const isUnlocked = status === "paid" || status === "delivered";
  const isAwaitingPayment = status === "preview_ready" || status === "awaiting_payment";

  const resolvedArt = resolveSongArt(imageUrl, mockUser.photoUrl);

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

  async function handleConfirmPay() {
    setPayPhase("paying");
    await mockPaySong(song.id);
    setStatus("paid");
    setLyrics((current) => current ?? generateUnlockedLyrics(song));
    setPayPhase("idle");
    showToast(t("history.detail.unlockedToast"), "success");
  }

  async function handleCopyLyrics() {
    if (!lyrics) return;
    try {
      await navigator.clipboard.writeText(lyrics);
      setCopied(true);
      showToast(t("history.detail.lyricsCopied"), "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(t("history.detail.copyFailed"), "danger");
    }
  }

  async function handleShare() {
    // Publiée : le lien public (voir app/chanson/[id]) est ce qu'un destinataire
    // sans compte peut réellement ouvrir. Sinon, repli sur le lien de la page
    // elle-même, seul lien qui existe encore pour cette chanson.
    const url = publishedEntry
      ? `${window.location.origin}/chanson/${publishedEntry.id}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast(t("history.item.linkCopied"), "success");
    } catch {
      showToast(t("history.item.linkCopyFailed"), "danger");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await mockDeleteSong(song.id);
    showToast(t("history.item.deletedToast", { name: song.recipientFirstName }), "default");
    router.push("/historiques");
  }

  function handlePublish({ hideFirstName, publicTitle, imageUrl: publishedImageUrl }: PublishModalOutput) {
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
      imageUrl: publishedImageUrl,
      lyrics: song.lyrics ? song.lyrics.split("\n").filter(Boolean) : [],
    });
    setPublishOpen(false);
    showToast(t("history.detail.publishedToast"), "success");
  }

  // Aucune confirmation ici, volontairement — le risque à éviter est la
  // publication accidentelle, pas le retrait.
  function handleUnpublish() {
    setPublishedEntry(null);
    showToast(t("history.detail.unpublishedToast"), "default");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/historiques"
        className="-my-3.5 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        {t("history.detail.backToHistory")}
      </Link>

      <div className="mt-5">
        <p className="font-display text-display-lg text-ink">{song.recipientFirstName}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <span className="text-sm text-ink-muted">
            {occasionLabel(t, song.occasion)} · {styleLabel(t, song.style)} · {formatDate(song.createdAt, locale)}
          </span>
        </div>

        <div className="mt-3">
          {editingBirthday ? (
            <label className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <Cake className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <input
                type="date"
                autoFocus
                value={birthdayDraft}
                onChange={(event) => setBirthdayDraft(event.target.value)}
                onBlur={handleSaveBirthday}
                className="min-h-11 rounded-control border border-border bg-surface px-3 text-sm text-ink focus:border-brand focus:outline-none focus:shadow-ring-focus"
              />
              <span className="text-xs text-ink-muted">{t("history.detail.birthdayEditHint")}</span>
            </label>
          ) : (
            <button
              type="button"
              onClick={() => {
                setBirthdayDraft(birthday ?? "");
                setEditingBirthday(true);
              }}
              className="group -my-3.5 flex min-h-11 items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <Cake className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {birthday ? (
                <span>{t("history.detail.birthdayOn", { date: formatDayMonth(parseLocalDate(birthday), locale) })}</span>
              ) : (
                <span className="text-brand">{t("history.detail.addBirthday")}</span>
              )}
              <Pencil
                className="h-3.5 w-3.5 shrink-0 text-ink-muted/60 opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <div className="mt-5">
          <SongImageField
            occasion={song.occasion}
            imageUrl={imageUrl}
            fallbackImageUrl={mockUser.photoUrl}
            onChange={setImageUrl}
          />
        </div>
      </div>

      {/* Contenu principal — l'élément dominant de la page, adapté à l'état. */}
      <div className="mt-8 rounded-feature border border-border bg-surface p-6 shadow-card sm:p-8">
        {status === "draft" && (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Wand2 className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-ink">{t("history.detail.draftTitle")}</p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">{t("history.detail.draftBody")}</p>
            <ButtonLink href={tunnelHref(song, true)} variant="primary" className="mt-5">
              {t("history.detail.continueCreating")}
            </ButtonLink>
          </div>
        )}

        {status === "generating" && (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
              <Sparkles className="h-6 w-6 animate-breathe text-brand" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-ink">{t("history.detail.generatingTitle")}</p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">
              {t("history.detail.generatingBody", { name: song.recipientFirstName })}
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
              <RotateCcw className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-ink">{t("history.detail.failedTitle")}</p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">{t("history.detail.failedBody")}</p>
            <ButtonLink href={tunnelHref(song, true)} variant="primary" className="mt-5">
              {t("history.detail.retry")}
            </ButtonLink>
          </div>
        )}

        {(isAwaitingPayment || isUnlocked) && track && (
          <div>
            <TrackHeroPlayer track={track} durationSeconds={song.durationSeconds} />

            {isAwaitingPayment && (
              <div className="mt-6">
                <p className="text-sm text-ink-muted">{t("history.detail.paymentHint")}</p>
                {payPhase === "confirm" ? (
                  <div className="mt-3 rounded-card border border-border bg-page p-4">
                    <p className="text-sm text-ink">
                      {t("history.detail.unlockConfirm", { price: formatFcfa(UNLOCK_PRICE_FCFA) })}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={handleConfirmPay} disabled={payPhase !== "confirm"} className="flex-1">
                        {t("history.detail.confirm")}
                      </Button>
                      <Button variant="ghost" onClick={() => setPayPhase("idle")} className="flex-1">
                        {t("history.detail.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setPayPhase("confirm")} className="mt-3 w-full sm:w-auto">
                    {t("history.detail.payButton", { price: formatFcfa(UNLOCK_PRICE_FCFA) })}
                  </Button>
                )}
              </div>
            )}

            {isUnlocked && (
              <>
                <a
                  href={track.audioUrl}
                  download={`griot-${song.recipientFirstName}.wav`}
                  className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-brand px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:brightness-90 active:scale-[0.98] sm:w-auto"
                >
                  <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  {t("history.detail.downloadMp3")}
                </a>

                {lyrics && (
                  <div className="mt-6 border-t border-border pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-label-md uppercase tracking-wide text-ink-muted">{t("history.detail.lyricsTitle")}</p>
                      <button
                        type="button"
                        onClick={handleCopyLyrics}
                        className="-my-3.5 flex min-h-11 items-center gap-1.5 text-label-sm font-medium text-brand hover:underline"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                        )}
                        {copied ? t("history.detail.copied") : t("history.detail.copy")}
                      </button>
                    </div>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
                      {lyrics}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {payPhase === "paying" && (
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin-slow" strokeWidth={1.5} aria-hidden="true" />
            {t("history.detail.processing")}
          </div>
        )}
      </div>

      {/* Point d'entrée pour la publication dans Explorer — jamais activée par
          défaut. Pour un hommage, l'action reste possible mais n'est pas mise en
          avant : un simple lien parmi les actions secondaires, pas cette carte —
          une fois publié cependant, sa gestion (likes, dépublier) redevient
          identique aux autres occasions, rien à cacher à ce stade. */}
      {isUnlocked && (publishedEntry || song.occasion !== "hommage") && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-card border border-dashed border-border bg-page p-4">
          {publishedEntry ? (
            <>
              <div>
                <p className="text-sm font-medium text-ink">{t("history.detail.publishedBadge")}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{tn("history.detail.likes", publishedEntry.likes)}</p>
              </div>
              <button
                type="button"
                onClick={handleUnpublish}
                className="shrink-0 rounded-control border border-border px-3.5 py-2 text-xs font-semibold text-ink-muted transition-all duration-150 ease-magnetic hover:border-danger/40 hover:text-danger active:scale-95"
              >
                {t("history.detail.unpublish")}
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-ink">{t("history.detail.publishToExplore")}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{t("history.detail.publishHint")}</p>
              </div>
              <button
                type="button"
                onClick={() => setPublishOpen(true)}
                className="shrink-0 rounded-control border border-brand/40 px-3.5 py-2 text-xs font-semibold text-brand transition-all duration-150 ease-magnetic hover:bg-brand-soft active:scale-95"
              >
                {t("history.detail.publish")}
              </button>
            </>
          )}
        </div>
      )}
      {isUnlocked && !publishedEntry && song.occasion === "hommage" && (
        <button
          type="button"
          onClick={() => setPublishOpen(true)}
          className="mt-6 text-sm font-medium text-ink-muted hover:text-brand hover:underline"
        >
          {t("history.detail.publishTribute")}
        </button>
      )}

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        recipientFirstName={song.recipientFirstName}
        occasion={song.occasion}
        style={song.style}
        songImageUrl={imageUrl}
        profilePhotoUrl={mockUser.photoUrl}
        onPublish={handlePublish}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {isUnlocked && (
          <Button variant="secondary" onClick={handleShare}>
            <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            {t("history.detail.shareLink")}
          </Button>
        )}
        <ButtonLink variant="secondary" href={tunnelHref(song, false)}>
          <Wand2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t("history.detail.redoFor", { name: song.recipientFirstName })}
        </ButtonLink>
        <Button variant="ghost" onClick={() => setDeleteOpen(true)} className="text-danger hover:bg-danger/10">
          <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t("history.detail.delete")}
        </Button>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} labelledBy="delete-song-title">
        <p id="delete-song-title" className="font-display text-lg font-semibold text-ink">
          {t("history.item.deleteTitle", { name: song.recipientFirstName })}
        </p>
        <p className="mt-2 text-sm text-ink-muted">{t("history.item.deleteBody", { name: song.recipientFirstName })}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="flex-1" disabled={deleting}>
            {t("history.detail.cancel")}
          </Button>
          <Button onClick={handleDelete} disabled={deleting} className="flex-1 !bg-danger hover:!brightness-90">
            {deleting ? t("history.item.deleting") : t("history.detail.delete")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
