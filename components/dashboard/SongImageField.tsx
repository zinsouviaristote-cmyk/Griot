"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { TrackArt } from "@/components/player/TrackArt";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Occasion } from "@/lib/types";

// Même mécanique que ProfilePhotoField (téléversement + recadrage carré
// simple, zoom centré) — utilisée depuis la fiche d'une chanson et depuis
// l'écran de livraison du tunnel. `fallbackImageUrl` (la photo de profil)
// n'est qu'un aperçu de ce qui sera réellement utilisé faute d'image propre :
// "Retirer" n'agit jamais sur elle, seulement sur l'image de la chanson.
export function SongImageField({
  occasion,
  imageUrl,
  fallbackImageUrl,
  onChange,
}: {
  occasion: Occasion;
  imageUrl: string | null;
  fallbackImageUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const showToast = useToast();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setZoom(1);
    setPendingUrl(URL.createObjectURL(file));
  }

  function handleCancelCrop() {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPendingUrl(null);
  }

  function handleConfirmCrop() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    onChange(pendingUrl);
    setPendingUrl(null);
    showToast(t("songImage.updated"), "success");
  }

  function handleRemove() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    onChange(null);
    showToast(t("songImage.removed"), "default");
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
          <span
            className="absolute inset-0 bg-ink/0 transition-colors duration-150 group-hover:bg-ink/20"
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

      <Modal open={pendingUrl !== null} onClose={handleCancelCrop} labelledBy="crop-song-image-title">
        <p id="crop-song-image-title" className="font-display text-lg font-semibold text-ink">
          {t("songImage.adjustTitle")}
        </p>
        {pendingUrl && (
          <>
            <div className="mx-auto mt-4 h-56 w-56 max-w-full overflow-hidden rounded-card border border-border bg-page">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingUrl}
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
          <Button variant="ghost" onClick={handleCancelCrop} className="flex-1">
            {t("songImage.cancel")}
          </Button>
          <Button onClick={handleConfirmCrop} className="flex-1">
            {t("songImage.useThisImage")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
