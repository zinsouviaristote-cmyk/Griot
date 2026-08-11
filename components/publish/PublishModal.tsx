"use client";

import { useState } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { getOccasionLabel, styleLabels } from "@/lib/data/mock-dashboard";
import type { MusicStyle, Occasion } from "@/lib/types";

export interface PublishModalOutput {
  hideFirstName: boolean;
  publicTitle: string | null;
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
  onPublish,
}: {
  open: boolean;
  onClose: () => void;
  recipientFirstName: string;
  occasion: Occasion;
  style: MusicStyle;
  onPublish: (output: PublishModalOutput) => void;
}) {
  const [hideFirstName, setHideFirstName] = useState(false);
  const [publicTitle, setPublicTitle] = useState("");

  function handlePublish() {
    onPublish({ hideFirstName, publicTitle: publicTitle.trim() || null });
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="publish-modal-title" size="md">
      <p id="publish-modal-title" className="font-display text-lg font-semibold text-ink">
        Publier dans Explorer
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Visible par tous, sans compte requis. Vous pouvez retirer cette publication à tout moment.
      </p>

      <div className="mt-4 rounded-card border border-border bg-page p-4">
        <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">
          Ce qui deviendra public
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink">
          <li>
            Prénom du destinataire :{" "}
            <span className="font-medium">{hideFirstName ? "masqué" : recipientFirstName}</span>
          </li>
          <li>Les paroles complètes</li>
          <li>L&apos;audio de la chanson</li>
          <li>
            {getOccasionLabel(occasion)} · {styleLabels[style]}
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
          <span className="text-sm font-medium text-ink">Masquer le prénom</span>
        </span>
        <Toggle
          checked={hideFirstName}
          onChange={() => setHideFirstName((current) => !current)}
          label="Masquer le prénom"
        />
      </div>

      <label className="mt-4 block">
        <span className="text-label-sm font-medium text-ink-muted">Titre public (facultatif)</span>
        <input
          type="text"
          value={publicTitle}
          onChange={(event) => setPublicTitle(event.target.value)}
          placeholder={hideFirstName ? "ex. Une surprise pour un ami" : `Pour ${recipientFirstName}`}
          maxLength={60}
          className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus-visible:outline-none focus-visible:shadow-ring-focus"
        />
      </label>

      <div className="mt-4 flex items-start gap-2.5 rounded-card border border-warning/30 bg-warning/10 p-3.5">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm text-ink">
          Cette chanson est personnelle. Une fois publiée, elle sera visible par tout le monde sur Explorer —
          vérifiez que rien ne vous gêne avant de confirmer.
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          Annuler
        </Button>
        <Button onClick={handlePublish} className="flex-1">
          Publier
        </Button>
      </div>
    </Modal>
  );
}
