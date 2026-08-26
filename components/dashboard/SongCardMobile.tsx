"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrackArt } from "@/components/player/TrackArt";
import { getSongAction } from "@/components/dashboard/songAction";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";
import { resolveSongArt } from "@/lib/songArt";
import { formatDate } from "@/lib/format/date";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { Song } from "@/lib/types";

export function SongCardMobile({ song }: { song: Song }) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const user = useDashboardUser();
  const action = getSongAction(song, t);
  const detailHref = `/historiques/${song.id}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(detailHref)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(detailHref);
      }}
      aria-label={t("history.item.viewSongAriaLabel", { name: song.recipientFirstName })}
      className="cursor-pointer rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:shadow-ring-focus"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TrackArt
            occasion={song.occasion}
            imageUrl={resolveSongArt(song.imageUrl, user.photoUrl)}
            className="h-11 w-11 rounded-control"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">
              {song.recipientFirstName}
            </p>
          </div>
        </div>
        <StatusBadge status={song.status} />
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        {occasionLabel(t, song.occasion)} · {styleLabel(t, song.style)}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-sm text-ink-muted">{formatDate(song.createdAt, locale)}</span>
        {/* En cours de génération : rien à ouvrir, donc un `span` plutôt qu'un lien —
            un élément non interactif ne doit jamais avoir l'air cliquable. Même
            traitement "désactivé" que partout ailleurs dans l'app : 50% d'opacité
            uniforme sur tout le contenu (icône + texte), jamais une teinte isolée
            qui fait deviner un contraste différent à chaque endroit. */}
        {action.disabled ? (
          <span className="inline-flex min-h-[44px] cursor-not-allowed items-center gap-1.5 rounded-control bg-page px-4 text-sm font-semibold text-ink-muted opacity-50">
            <action.icon
              className={action.spin ? "h-4 w-4 animate-spin-slow" : "h-4 w-4"}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {action.label}
          </span>
        ) : (
          <Link
            href={action.href}
            onClick={(event) => event.stopPropagation()}
            className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-control bg-brand-soft px-4 text-sm font-semibold text-brand transition-all duration-200 ease-magnetic hover:scale-[1.03] hover:bg-brand hover:text-white active:scale-95"
          >
            <action.icon
              className="h-4 w-4 transition-transform duration-200 ease-magnetic group-hover:translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
