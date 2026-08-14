"use client";

import { useState } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { MusicStyle, Occasion } from "@/lib/types";

export interface PublishModalOutput {
  hideFirstName: boolean;
  publicTitle: string | null;
  // Pochette à figer sur la publication (voir PublishedSong.imageUrl) — déjà
  // résolue ici, jamais recalculée ailleurs : `null` veut dire "dégradé
  // d'occasion", explicitement choisi ou faute d'image disponible.
  imageUrl: string | null;
}

// Utilisée depuis la fiche d'une chanson (bibliothèque) et depuis l'écran de
// livraison du tunnel — jamais activée par défaut, jamais de case pré-cochée :
// c'est un choix que la personne doit poser elle-même, à chaque fois.
export function PublishModal({
  open,
  onClose,
  recipientFirstName,
  occasion,
  style,
  songImageUrl,
  profilePhotoUrl,
  onPublish,
}: {
  open: boolean;
  onClose: () => void;
  recipientFirstName: string;
  occasion: Occasion;
  style: MusicStyle;
  // La chanson a-t-elle sa propre pochette, et l'auteur a-t-il une photo de
  // profil ? Décide si l'avertissement "votre visage devient visible" a lieu
  // d'être : seulement quand la pochette de repli serait un vrai visage.
  songImageUrl: string | null;
  profilePhotoUrl: string | null;
  onPublish: (output: PublishModalOutput) => void;
}) {
  const { t } = useLanguage();
  const [hideFirstName, setHideFirstName] = useState(false);
  const [publicTitle, setPublicTitle] = useState("");
  const wouldExposeProfilePhoto = !songImageUrl && !!profilePhotoUrl;
  const [useProfilePhoto, setUseProfilePhoto] = useState(true);

  function handlePublish() {
    const imageUrl = songImageUrl ?? (wouldExposeProfilePhoto && useProfilePhoto ? profilePhotoUrl : null);
    onPublish({ hideFirstName, publicTitle: publicTitle.trim() || null, imageUrl });
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="publish-modal-title" size="md">
      <p id="publish-modal-title" className="font-display text-lg font-semibold text-ink">
        {t("publish.title")}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{t("publish.subtitle")}</p>

      <div className="mt-4 rounded-card border border-border bg-page p-4">
        <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">
          {t("publish.whatBecomesPublic")}
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink">
          <li>
            {t("publish.recipientFirstName")}:{" "}
            <span className="font-medium">{hideFirstName ? t("publish.hidden") : recipientFirstName}</span>
          </li>
          <li>{t("publish.fullLyrics")}</li>
          <li>{t("publish.songAudio")}</li>
          <li>
            {occasionLabel(t, occasion)} · {styleLabel(t, style)}
          </li>
        </ul>
      </div>

      <div className="mt-4 flex w-full items-center justify-between gap-3 rounded-card border border-border bg-surface p-3.5">
        <span className="flex items-center gap-2.5">
          {hideFirstName ? (
            <EyeOff className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-ink">{t("publish.hideFirstName")}</span>
        </span>
        <Toggle
          checked={hideFirstName}
          onChange={() => setHideFirstName((current) => !current)}
          label={t("publish.hideFirstName")}
        />
      </div>

      <label className="mt-4 block">
        <span className="text-label-sm font-medium text-ink-muted">{t("publish.publicTitleLabel")}</span>
        <input
          type="text"
          value={publicTitle}
          onChange={(event) => setPublicTitle(event.target.value)}
          placeholder={
            hideFirstName
              ? t("publish.publicTitlePlaceholderHidden")
              : t("publish.publicTitlePlaceholderNamed", { name: recipientFirstName })
          }
          maxLength={60}
          className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus-visible:outline-none focus-visible:shadow-ring-focus"
        />
      </label>

      {wouldExposeProfilePhoto && (
        <div className="mt-4 rounded-card border border-warning/30 bg-warning/10 p-3.5">
          <div className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm text-ink">{t("publish.profilePhotoWarning")}</p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-warning/20 pt-3">
            <span className="text-sm font-medium text-ink">{t("publish.useProfilePhoto")}</span>
            <Toggle
              checked={useProfilePhoto}
              onChange={() => setUseProfilePhoto((current) => !current)}
              label={t("publish.useProfilePhoto")}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2.5 rounded-card border border-warning/30 bg-warning/10 p-3.5">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm text-ink">{t("publish.warning")}</p>
      </div>

      <div className="mt-5 flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          {t("publish.cancel")}
        </Button>
        <Button onClick={handlePublish} className="flex-1">
          {t("publish.publish")}
        </Button>
      </div>
    </Modal>
  );
}
