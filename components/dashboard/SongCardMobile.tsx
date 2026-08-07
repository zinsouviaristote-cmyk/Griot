import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSongAction } from "@/components/dashboard/songAction";
import { getOccasionLabel, styleLabels } from "@/lib/data/mock-dashboard";
import { formatDateFr } from "@/lib/format/date";
import type { Song } from "@/lib/types";

export function SongCardMobile({ song }: { song: Song }) {
  const action = getSongAction(song);

  return (
    <div className="rounded-card border border-line-800 bg-ink-900/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-paper-100">
            Pour {song.recipientFirstName}
          </p>
          <p className="mt-0.5 text-xs text-paper-500">
            {getOccasionLabel(song.occasion)} · {styleLabels[song.style]}
          </p>
        </div>
        <StatusBadge status={song.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-800 pt-3">
        <span className="font-mono text-xs text-paper-500">{formatDateFr(song.createdAt)}</span>
        <Link
          href={action.href}
          aria-disabled={action.disabled}
          className={`inline-flex items-center gap-1.5 rounded-control px-3 py-1.5 text-xs font-semibold transition-colors ${
            action.disabled
              ? "pointer-events-none bg-ink-800 text-paper-600"
              : "bg-ink-800 text-paper-100 hover:bg-line-700"
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
