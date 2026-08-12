"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSongAction } from "@/components/dashboard/songAction";
import { Reveal } from "@/components/ui/Reveal";
import { formatDate } from "@/lib/format/date";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, relationshipLabel, styleLabel } from "@/lib/i18n/catalog";
import type { Song } from "@/lib/types";

export function SongRow({ song, index = 0 }: { song: Song; index?: number }) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const action = getSongAction(song, t);
  const detailHref = `/bibliotheque/${song.id}`;

  return (
    <Reveal
      as="tr"
      delayMs={index * 80}
      tabIndex={0}
      aria-label={t("library.item.viewSongAriaLabel", { name: song.recipientFirstName })}
      onClick={() => router.push(detailHref)}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === "Enter") router.push(detailHref);
      }}
      className="group cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-page focus-visible:bg-page focus-visible:outline-none"
    >
      <td className="py-3.5 pl-5 pr-3 text-sm font-medium text-ink">
        {song.recipientFirstName}
        <span className="block text-xs font-normal text-ink-muted">{relationshipLabel(t, song.relationship)}</span>
      </td>
      <td className="px-3 py-3.5 text-sm text-ink-muted">{occasionLabel(t, song.occasion)}</td>
      <td className="px-3 py-3.5 text-sm text-ink-muted">{styleLabel(t, song.style)}</td>
      <td className="px-3 py-3.5 font-mono text-xs text-ink-muted">
        {formatDate(song.createdAt, locale)}
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={song.status} />
      </td>
      <td className="py-3.5 pl-3 pr-5 text-right">
        {action.disabled ? (
          <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-control px-3 py-1.5 text-xs font-semibold text-ink-muted opacity-50">
            <action.icon
              className={action.spin ? "h-3.5 w-3.5 animate-spin-slow" : "h-3.5 w-3.5"}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {action.label}
          </span>
        ) : (
          <Link
            href={action.href}
            onClick={(event) => event.stopPropagation()}
            className="group/action inline-flex items-center gap-1.5 rounded-control px-3 py-1.5 text-xs font-semibold text-brand transition-all duration-150 ease-magnetic hover:bg-brand-soft active:scale-95"
          >
            <action.icon
              className="h-3.5 w-3.5 transition-transform duration-150 ease-magnetic group-hover/action:translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {action.label}
          </Link>
        )}
      </td>
    </Reveal>
  );
}
