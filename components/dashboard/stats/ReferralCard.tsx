import { ArrowRight, Share2, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { CountUp } from "@/components/ui/CountUp";
import type { ReferralStats } from "@/lib/data/mock-stats";

// L'indicateur le plus important du produit : pas l'audience, mais si elle se
// reproduit — chaque ouverture de page partagée qui débouche sur une nouvelle
// chanson est la preuve que le bouche-à-oreille fonctionne. Traitement visuel
// distinct (bordure teintée) plutôt qu'un simple SectionTitle : il ne se lit
// pas comme les autres blocs, il se remarque.
export function ReferralCard({ stats }: { stats: ReferralStats }) {
  if (stats.pageOpens === 0) {
    return (
      <EmptyState
        icon={Share2}
        title="Le bouche-à-oreille n'a pas encore commencé"
        description="Partagez le lien d'une chanson publiée — chaque ouverture, et chaque nouvelle chanson qu'elle inspire, apparaîtra ici."
        actionLabel="Voir ma bibliothèque"
        actionHref="/bibliotheque"
      />
    );
  }

  const conversionRate = Math.round((stats.songsCreated / stats.pageOpens) * 100);

  return (
    <div className="rounded-feature border-2 border-brand/20 bg-surface p-6 shadow-card sm:p-8">
      <p className="flex items-center gap-2 text-label-md uppercase tracking-wide text-brand">
        <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        Effet bouche-à-oreille
      </p>
      <div className="mt-4 flex items-center gap-4 sm:gap-8">
        <div className="min-w-0">
          <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
            <CountUp target={stats.pageOpens} />
          </p>
          <p className="mt-1 text-sm text-ink-muted">Ouvertures de vos pages partagées</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted/40" strokeWidth={1.5} aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-display text-3xl font-bold text-brand sm:text-4xl">
            <CountUp target={stats.songsCreated} />
          </p>
          <p className="mt-1 text-sm text-ink-muted">Chansons créées grâce à vos partages</p>
        </div>
      </div>
      <p className="mt-5 text-sm text-ink-muted">
        Environ {conversionRate}&nbsp;% des personnes qui ouvrent une chanson que vous avez partagée en créent une à
        leur tour.
      </p>
    </div>
  );
}
