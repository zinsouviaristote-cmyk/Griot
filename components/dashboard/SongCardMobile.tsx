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
        <div>
          <p className="font-display text-base font-semibold text-ink">
            Pour {song.recipientFirstName}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {getOccasionLabel(song.occasion)} · {styleLabels[song.style]}
          </p>
        </div>
        <StatusBadge status={song.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-xs text-ink-muted">{formatDateFr(song.createdAt)}</span>
        <Link
          href={action.href}
          aria-disabled={action.disabled}
          className={`inline-flex items-center gap-1.5 rounded-card px-3 py-1.5 text-xs font-semibold transition-colors ${
            action.disabled
              ? "pointer-events-none bg-page text-ink-muted/50"
              : "bg-brand-soft text-brand-vivid hover:bg-brand-vivid hover:text-white"
          }`}
        >
          <action.icon
            className={`h-3.5 w-3.5 ${action.spin ? "animate-spin-slow" : ""}`}
            strokeWidth={2}
            aria-hidden="true"
          />
          {action.label}
        </Link>
      </div>
    </div>
  );
}
