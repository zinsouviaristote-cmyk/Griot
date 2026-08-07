import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSongAction } from "@/components/dashboard/songAction";
import { getOccasionLabel, styleLabels } from "@/lib/data/mock-dashboard";
import { formatDateFr } from "@/lib/format/date";
import type { Song } from "@/lib/types";

export function SongRow({ song }: { song: Song }) {
  const action = getSongAction(song);

  return (
    <tr className="group border-b border-line-800 last:border-0 transition-colors hover:bg-ink-800/40">
      <td className="py-3.5 pl-5 pr-3 text-sm font-medium text-paper-100">
        {song.recipientFirstName}
        <span className="block text-xs font-normal text-paper-600">{song.relationship}</span>
      </td>
      <td className="px-3 py-3.5 text-sm text-paper-400">{getOccasionLabel(song.occasion)}</td>
      <td className="px-3 py-3.5 text-sm text-paper-400">{styleLabels[song.style]}</td>
      <td className="px-3 py-3.5 font-mono text-xs text-paper-500">
        {formatDateFr(song.createdAt)}
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={song.status} />
      </td>
      <td className="py-3.5 pl-3 pr-5 text-right">
        <Link
          href={action.href}
          aria-disabled={action.disabled}
          className={`inline-flex items-center gap-1.5 rounded-control px-3 py-1.5 text-xs font-semibold transition-colors ${
            action.disabled
              ? "pointer-events-none text-paper-600"
              : "text-paper-300 hover:bg-ink-800 hover:text-paper-100"
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
