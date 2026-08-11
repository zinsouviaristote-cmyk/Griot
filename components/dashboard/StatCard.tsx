import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { getOccasionLabel } from "@/lib/data/mock-dashboard";
import type { NextOccasion } from "@/lib/types";

type Tone = "secondary" | "success" | "brand";

// Icône discrète : une simple teinte de texte, jamais un chip coloré en fond —
// le chiffre porte la carte, l'icône ne fait que l'identifier au coup d'œil.
const TONE_CLASSES: Record<Tone, string> = {
  secondary: "text-secondary",
  success: "text-success",
  brand: "text-brand",
};

// Carte générique compacte : le chiffre domine, le label est au-dessus et plus
// petit, l'icône reste discrète. Utilisée pour les indicateurs purement numériques
// (chansons offertes, chansons partagées) — "Prochaine occasion" a sa propre
// variante ci-dessous.
export function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: Tone;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label-sm font-medium text-ink-muted">{label}</p>
        <Icon className={`h-4 w-4 shrink-0 ${TONE_CLASSES[tone]}`} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="mt-1.5 font-display text-3xl font-bold text-ink">
        <CountUp target={value} />
      </p>
    </div>
  );
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });

// `new Date("YYYY-MM-DD")` parse en UTC minuit : dans un fuseau à décalage négatif,
// le jour affiché glisse d'une unité. Construction en heure locale à partir des
// composantes pour que la date affichée corresponde toujours au jour saisi.
function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Seule carte non numérique du groupe : pas de CountUp, mais elle suit le même
// fondu en cascade que les autres via le Reveal appliqué dans StatsGrid.
// `occasion` est nul pour un compte tout neuf (aperçu ?vide=1) — pas d'historique,
// donc rien à projeter.
export function NextOccasionCard({ icon: Icon, occasion }: { icon: LucideIcon; occasion: NextOccasion | null }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label-sm font-medium text-ink-muted">Prochaine occasion</p>
        <Icon className="h-4 w-4 shrink-0 text-ink-muted/70" strokeWidth={1.5} aria-hidden="true" />
      </div>
      {occasion ? (
        <>
          <p className="mt-1.5 truncate font-display text-xl font-bold text-ink">
            {getOccasionLabel(occasion.occasion)}
          </p>
          <p className="mt-0.5 truncate text-label-sm text-ink-muted">
            {occasion.recipientFirstName} · {DATE_FORMATTER.format(parseLocalDate(occasion.date))}
          </p>
        </>
      ) : (
        <p className="mt-1.5 text-sm text-ink-muted">Rien de prévu pour l&apos;instant</p>
      )}
    </div>
  );
}
