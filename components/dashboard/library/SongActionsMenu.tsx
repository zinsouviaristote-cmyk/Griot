"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Megaphone, Trash2, Wand2 } from "lucide-react";

/**
 * Menu « … » d'une ligne de bibliothèque — regroupe les actions secondaires
 * (publier/dépublier, refaire, supprimer) pour ne pas surcharger la rangée
 * d'icônes toujours visible. Même mécanique de fermeture au clic extérieur que
 * AvatarMenu : un bouton plein écran invisible sous le panneau, pas de listener
 * global sur `document`.
 */
export function SongActionsMenu({
  isPublished,
  redoHref,
  redoLabel,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  isPublished: boolean;
  redoHref: string;
  redoLabel: string;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Plus d'actions"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-page hover:text-ink active:scale-90"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            }}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 origin-top-right animate-pop-in overflow-hidden rounded-card border border-border bg-surface py-1.5 shadow-card-hover">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                if (isPublished) onUnpublish();
                else onPublish();
              }}
              className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm text-ink transition-colors hover:bg-brand-soft"
            >
              <Megaphone className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              {isPublished ? "Dépublier" : "Publier dans Explorer"}
            </button>
            <Link
              href={redoHref}
              onClick={(event) => event.stopPropagation()}
              className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm text-ink transition-colors hover:bg-brand-soft"
            >
              <Wand2 className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              {redoLabel}
            </Link>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm text-danger transition-colors hover:bg-danger/5"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
