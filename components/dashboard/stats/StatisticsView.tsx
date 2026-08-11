import { Gift, Megaphone, Music4, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { STATUS_CONFIG } from "@/components/ui/StatusBadge";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { getOccasionLabel, occasionCatalog } from "@/lib/data/mock-dashboard";
import { OCCASION_TONES } from "@/lib/occasionTones";
import type { CreditTransaction, Occasion, PublishedSong, Song, SongStatus } from "@/lib/types";

// Les 7 statuts bruts se regroupent en 6 lignes : paid/delivered partagent déjà
// le même badge "Payée" partout ailleurs (StatusBadge) — la répartition suit
// cette même lecture, jamais une distinction que l'utilisateur ne voit nulle part.
const STATUS_ROWS: { key: string; label: string; statuses: SongStatus[] }[] = [
  { key: "draft", label: STATUS_CONFIG.draft.label, statuses: ["draft"] },
  { key: "generating", label: STATUS_CONFIG.generating.label, statuses: ["generating"] },
  { key: "preview_ready", label: STATUS_CONFIG.preview_ready.label, statuses: ["preview_ready"] },
  { key: "awaiting_payment", label: STATUS_CONFIG.awaiting_payment.label, statuses: ["awaiting_payment"] },
  { key: "paid", label: STATUS_CONFIG.paid.label, statuses: ["paid", "delivered"] },
  { key: "failed", label: STATUS_CONFIG.failed.label, statuses: ["failed"] },
];

function ProportionRow({
  label,
  count,
  total,
  dotClassName,
  barClassName,
}: {
  label: string;
  count: number;
  total: number;
  dotClassName: string;
  barClassName: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-ink">
          <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} aria-hidden="true" />
          {label}
        </span>
        <span className="font-mono text-xs text-ink-muted">{count}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-page">
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatisticsView({
  songs,
  publishedSongs,
  creditTransactions,
}: {
  songs: Song[];
  publishedSongs: PublishedSong[];
  creditTransactions: CreditTransaction[];
}) {
  const totalSongs = songs.length;
  const chansonsOffertes = songs.filter((s) => s.status === "paid" || s.status === "delivered").length;
  const notesUtilisees = creditTransactions
    .filter((t) => t.delta < 0)
    .reduce((sum, t) => sum + Math.abs(t.delta), 0);
  const totalLikes = publishedSongs.reduce((sum, p) => sum + p.likes, 0);
  const totalListens = publishedSongs.reduce((sum, p) => sum + p.listens, 0);

  const occasionCounts = occasionCatalog.map((meta) => ({
    id: meta.id,
    count: songs.filter((s) => s.occasion === meta.id).length,
  }));

  if (totalSongs === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
          <Sparkles className="h-6 w-6 text-brand" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="max-w-sm space-y-1.5">
          <p className="font-display text-lg font-semibold text-ink">Rien à mesurer pour l&apos;instant</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Créez votre première chanson et vos statistiques apparaîtront ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal delayMs={0}>
          <StatCard icon={Music4} label="Chansons créées" value={totalSongs} tone="brand" />
        </Reveal>
        <Reveal delayMs={150}>
          <StatCard icon={Gift} label="Chansons offertes" value={chansonsOffertes} tone="secondary" />
        </Reveal>
        <Reveal delayMs={300}>
          <StatCard icon={Sparkles} label="Notes utilisées" value={notesUtilisees} tone="brand" />
        </Reveal>
        <Reveal delayMs={450}>
          <StatCard icon={Megaphone} label="Publications actives" value={publishedSongs.length} tone="success" />
        </Reveal>
      </div>

      <Reveal delayMs={80} className="mt-8">
        <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
          <p className="text-label-md uppercase tracking-wide text-ink-muted">Par état</p>
          <div className="mt-4 flex flex-col gap-4">
            {STATUS_ROWS.map((row) => {
              const count = songs.filter((s) => row.statuses.includes(s.status)).length;
              const config = STATUS_CONFIG[row.statuses[0]];
              return (
                <ProportionRow
                  key={row.key}
                  label={row.label}
                  count={count}
                  total={totalSongs}
                  dotClassName={config.dot}
                  barClassName={config.dot}
                />
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal delayMs={120} className="mt-6">
        <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
          <p className="text-label-md uppercase tracking-wide text-ink-muted">Par occasion</p>
          <div className="mt-4 flex flex-col gap-4">
            {occasionCounts.map(({ id, count }) => (
              <ProportionRow
                key={id}
                label={getOccasionLabel(id as Occasion)}
                count={count}
                total={totalSongs}
                dotClassName={OCCASION_TONES[id as Occasion].dot}
                barClassName={OCCASION_TONES[id as Occasion].dot}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {publishedSongs.length > 0 && (
        <Reveal delayMs={160} className="mt-6">
          <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
            <p className="text-label-md uppercase tracking-wide text-ink-muted">Publications</p>
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="font-display text-3xl font-bold text-ink">
                  <CountUp target={publishedSongs.length} />
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  publiée{publishedSongs.length > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-ink">
                  <CountUp target={totalLikes} />
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">likes reçus</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-ink">
                  <CountUp target={totalListens} />
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">écoutes</p>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
