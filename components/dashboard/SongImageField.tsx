"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { TrackArt } from "@/components/player/TrackArt";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { updateSongImage, uploadSongCover } from "@/lib/supabase/dataAdapters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Occasion } from "@/lib/types";

// Même mécanique que ProfilePhotoField (téléversement + recadrage carré
// simple, zoom centré) — utilisée depuis la fiche d'une chanson et depuis
// l'écran de livraison du tunnel. `fallbackImageUrl` (la photo de profil)
// n'est qu'un aperçu de ce qui sera réellement utilisé faute d'image propre :
// "Retirer" n'agit jamais sur elle, seulement sur l'image de la chanson.
// `songId` : la chanson doit déjà exister en base (brouillon ou au-delà) —
// c'est là qu'atterrit réellement le fichier, dans le bucket `song-covers`.
export function SongImageField({
  songId,
  occasion,
  imageUrl,
  fallbackImageUrl,
  onChange,
}: {
  songId: string;
  occasion: Occasion;
  imageUrl: string | null;
  fallbackImageUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const showToast = useToast();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setZoom(1);
    setPendingFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  }

  function handleCancelCrop() {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(null);
    setPendingPreviewUrl(null);
  }

  async function handleConfirmCrop() {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const publicUrl = await uploadSongCover(songId, pendingFile);
      onChange(publicUrl);
      showToast(t("songImage.updated"), "success");
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
      setPendingFile(null);
      setPendingPreviewUrl(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t("songImage.updated"), "danger");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    try {
      await updateSongImage(songId, null);
      onChange(null);
      showToast(t("songImage.removed"), "default");
    } catch (error) {
      showToast(error instanceof Error ? error.message : t("songImage.removed"), "danger");
    }
  }

  const displayed = imageUrl ?? fallbackImageUrl;
  const hint = imageUrl
    ? t("songImage.hintCustom")
    : fallbackImageUrl
      ? t("songImage.hintProfileFallback")
      : t("songImage.hintGradientFallback");

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={imageUrl ? t("songImage.change") : t("songImage.add")}
          className="group relative block h-20 w-20 overflow-hidden rounded-feature transition-transform duration-150 ease-magnetic active:scale-95"
        >
          <TrackArt occasion={occasion} imageUrl={displayed} className="h-full w-full" />
          {/* `bg-black`, jamais `bg-ink` : ce voile assombrit une photo au
              survol, il doit rester sombre dans les deux thèmes. */}
          <span
            className="absolute inset-0 bg-black/0 transition-colors duration-150 group-hover:bg-black/20"
            aria-hidden="true"
          />
        </button>
        <span
          className="pointer-events-none absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-brand text-white"
          aria-hidden="true"
        >
          <Camera className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
      </div>

      <div className="flex min-w-0 flex-col items-start gap-1">
        <p className="text-sm font-medium text-ink">{t("songImage.title")}</p>
        <p className="text-xs text-ink-muted">{hint}</p>
        {imageUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="-my-2 min-h-11 text-xs font-medium text-ink-muted transition-colors hover:text-danger hover:underline"
          >
            {t("songImage.remove")}
          </button>
        )}
      </div>

      <Modal open={pendingPreviewUrl !== null} onClose={handleCancelCrop} labelledBy="crop-song-image-title">
        <p id="crop-song-image-title" className="font-display text-lg font-semibold text-ink">
          {t("songImage.adjustTitle")}
        </p>
        {pendingPreviewUrl && (
          <>
            <div className="mx-auto mt-4 h-56 w-56 max-w-full overflow-hidden rounded-card border border-border bg-page">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingPreviewUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-medium text-ink-muted">{t("songImage.zoom")}</span>
              <input
                type="range"
                min={1}
                max={2}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-2 h-11 w-full accent-brand"
              />
            </label>
          </>
        )}
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" onClick={handleCancelCrop} className="flex-1" disabled={uploading}>
            {t("songImage.cancel")}
          </Button>
          <Button onClick={handleConfirmCrop} className="flex-1" disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin-slow" strokeWidth={1.5} aria-hidden="true" /> : t("songImage.useThisImage")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
