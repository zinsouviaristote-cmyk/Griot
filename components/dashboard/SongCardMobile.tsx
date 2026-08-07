import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSongAction } from "@/components/dashboard/songAction";
import { getOccasionLabel, styleLabels } from "@/lib/data/mock-dashboard";
import { formatDateFr } from "@/lib/format/date";
import type { Song } from "@/lib/types";

export function SongCardMobile({ song }: { song: Song }) {
  const action = getSongAction(song);

  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-ink">
            {song.recipientFirstName}
          </p>
          <p className="mt-0.5 text-sm text-ink-muted">{song.relationship}</p>
        </div>
        <StatusBadge status={song.status} />
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        {getOccasionLabel(song.occasion)} · {styleLabels[song.style]}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-sm text-ink-muted">{formatDateFr(song.createdAt)}</span>
        <Link
          href={action.href}
          aria-disabled={action.disabled}
          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-control px-4 text-sm font-semibold transition-colors ${
            action.disabled
              ? "pointer-events-none bg-page text-ink-muted/50"
              : "bg-brand-soft text-brand hover:bg-brand hover:text-white"
          }`}
        >
          <action.icon
            className={`h-4 w-4 ${action.spin ? "animate-spin-slow" : ""}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {action.label}
        </Link>
      </div>
    </div>
  );
}
