"use client";

import { Ear, Heart, Radio } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/lib/format/date";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ActivityEntry } from "@/lib/data/mock-stats";

// Jamais "qui" a aimé ou écouté (voir LikeButton — Griot ne suit aucune
// identité côté auditeur), seulement quoi et quand : chaque ligne nomme la
// chanson, jamais une personne.
export function RecentActivityList({ entries }: { entries: ActivityEntry[] }) {
  const { t, locale } = useLanguage();
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Radio}
        title={t("stats.recentActivity.emptyTitle")}
        description={t("stats.recentActivity.emptyDescription")}
        actionLabel={t("stats.recentActivity.emptyAction")}
        actionHref="/historiques"
      />
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-feature border border-border bg-surface px-5 shadow-card">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center gap-3 py-3.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              entry.type === "like" ? "bg-brand-soft text-brand" : "bg-page text-ink-muted"
            }`}
            aria-hidden="true"
          >
            {entry.type === "like" ? (
              <Heart className="h-4 w-4" strokeWidth={1.5} fill="currentColor" />
            ) : (
              <Ear className="h-4 w-4" strokeWidth={1.5} />
            )}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm text-ink">
            {entry.type === "like" ? t("stats.recentActivity.newLikeOn") : t("stats.recentActivity.newListenOn")}{" "}
            <span className="font-medium">« {entry.displayName} »</span>
          </p>
          <span className="shrink-0 text-xs text-ink-muted">{formatRelativeTime(entry.minutesAgo, locale)}</span>
        </div>
      ))}
    </div>
  );
}
