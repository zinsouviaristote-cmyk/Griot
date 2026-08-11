"use client";

import Link from "next/link";
import { Cake, Trash2, Wand2 } from "lucide-react";
import { formatDayMonthFr, getDaysUntil, getNextOccurrence } from "@/lib/format/date";
import type { Contact } from "@/lib/types";

function dayLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Aujourd'hui";
  if (daysUntil === 1) return "Demain";
  return `Dans ${daysUntil} jours`;
}

export function ContactCard({
  contact,
  songCount,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  songCount: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const nextDate = getNextOccurrence(contact.birthday);
  const daysUntil = getDaysUntil(nextDate);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(event) => {
        if (event.key === "Enter") onEdit();
      }}
      aria-label={`Modifier la fiche de ${contact.firstName}`}
      className="cursor-pointer rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:shadow-ring-focus"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-ink">{contact.firstName}</p>
          <p className="mt-0.5 text-sm capitalize text-ink-muted">{contact.relationship}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          aria-label={`Supprimer ${contact.firstName}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-all duration-150 ease-magnetic hover:bg-danger/10 hover:text-danger active:scale-90"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-ink">
        <Cake className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-medium">{dayLabel(daysUntil)}</span>
        <span className="text-ink-muted">· {formatDayMonthFr(nextDate)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-ink-muted">
          {songCount} chanson{songCount > 1 ? "s" : ""} offerte{songCount > 1 ? "s" : ""}
        </span>
        <Link
          href={`/creer?proche=${contact.id}`}
          onClick={(event) => event.stopPropagation()}
          className="flex min-h-11 items-center gap-1.5 rounded-control bg-brand-soft px-3.5 text-xs font-semibold text-brand transition-all duration-200 ease-magnetic hover:scale-[1.03] hover:bg-brand hover:text-white active:scale-95"
        >
          <Wand2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          Créer une chanson
        </Link>
      </div>
    </div>
  );
}
