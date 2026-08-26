"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProfilePhotoField({
  initials,
  photoUrl,
  onChange,
}: {
  initials: string;
  photoUrl: string | null;
  onChange: (url: string | null, file: File | null) => void;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setZoom(1);
    setPendingFile(file);
    setPendingUrl(URL.createObjectURL(file));
  }

  function handleCancelCrop() {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPendingFile(null);
    setPendingUrl(null);
  }

  function handleConfirmCrop() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    onChange(pendingUrl, pendingFile);
    setPendingUrl(null);
    setPendingFile(null);
  }

  function handleRemove() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    onChange(null, null);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={photoUrl ? t("settings.photo.changePhoto") : t("settings.photo.addPhoto")}
          className="group relative block h-16 w-16 overflow-hidden rounded-full transition-transform duration-150 ease-magnetic active:scale-95"
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Avatar initials={initials} size="lg" />
          )}
          {/* `bg-black`, jamais `bg-ink` : ce voile assombrit une photo au
              survol, il doit rester sombre dans les deux thèmes. */}
          <span
            className="absolute inset-0 rounded-full bg-black/0 transition-colors duration-150 group-hover:bg-black/20"
            aria-hidden="true"
          />
        </button>
        <span
          className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-brand text-white"
          aria-hidden="true"
        >
          <Camera className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
      </div>

      {photoUrl && (
        <button
          type="button"
          onClick={handleRemove}
          className="min-h-11 text-xs font-medium text-ink-muted transition-colors hover:text-danger hover:underline"
        >
          {t("settings.photo.removePhoto")}
        </button>
      )}

      <Modal open={pendingUrl !== null} onClose={handleCancelCrop} labelledBy="crop-photo-title">
        <p id="crop-photo-title" className="font-display text-lg font-semibold text-ink">
          {t("settings.photo.adjustTitle")}
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
              <span className="text-xs font-medium text-ink-muted">{t("settings.photo.zoom")}</span>
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
            {t("settings.photo.cancel")}
          </Button>
          <Button onClick={handleConfirmCrop} className="flex-1">
            {t("settings.photo.useThisPhoto")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
