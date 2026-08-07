import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSongAction } from "@/components/dashboard/songAction";
import { getOccasionLabel, styleLabels } from "@/lib/data/mock-dashboard";
import { formatDateFr } from "@/lib/format/date";
import type { Song } from "@/lib/types";

export function SongRow({ song }: { song: Song }) {
  const action = getSongAction(song);

  return (
    <tr className="group border-b border-border last:border-0 transition-colors hover:bg-page">
      <td className="py-3.5 pl-5 pr-3 text-sm font-medium text-ink">
        {song.recipientFirstName}
        <span className="block text-xs font-normal text-ink-muted">{song.relationship}</span>
      </td>
      <td className="px-3 py-3.5 text-sm text-ink-muted">{getOccasionLabel(song.occasion)}</td>
      <td className="px-3 py-3.5 text-sm text-ink-muted">{styleLabels[song.style]}</td>
      <td className="px-3 py-3.5 font-mono text-xs text-ink-muted">
        {formatDateFr(song.createdAt)}
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={song.status} />
      </td>
      <td className="py-3.5 pl-3 pr-5 text-right">
        <Link
          href={action.href}
          aria-disabled={action.disabled}
          className={`inline-flex items-center gap-1.5 rounded-card px-3 py-1.5 text-xs font-semibold transition-colors ${
            action.disabled
              ? "pointer-events-none text-ink-muted/50"
              : "text-brand-vivid hover:bg-brand-soft"
          }`}
        >
          <action.icon
            className={`h-3.5 w-3.5 ${action.spin ? "animate-spin-slow" : ""}`}
            strokeWidth={2}
            aria-hidden="true"
          />
          {action.label}
        </Link>
      </td>
    </tr>
  );
}
