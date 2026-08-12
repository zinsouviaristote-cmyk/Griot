import { Ear, Heart, Radio } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTimeFr } from "@/lib/format/date";
import type { ActivityEntry } from "@/lib/data/mock-stats";

// Jamais "qui" a aimé ou écouté (voir LikeButton — Griot ne suit aucune
// identité côté auditeur), seulement quoi et quand : chaque ligne nomme la
// chanson, jamais une personne.
export function RecentActivityList({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Radio}
        title="Aucune activité pour l'instant"
        description="Les likes et écoutes reçus sur vos chansons publiées apparaîtront ici, au fil de l'eau."
        actionLabel="Publier une chanson"
        actionHref="/bibliotheque"
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
            {entry.type === "like" ? "Nouveau like sur " : "Nouvelle écoute sur "}
            <span className="font-medium">« {entry.displayName} »</span>
          </p>
          <span className="shrink-0 text-xs text-ink-muted">{formatRelativeTimeFr(entry.minutesAgo)}</span>
        </div>
      ))}
    </div>
  );
}
