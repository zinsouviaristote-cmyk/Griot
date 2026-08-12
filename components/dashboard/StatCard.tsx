import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

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
  variant = "number",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: Tone;
  // "duration" pour un cumul de secondes (Statistiques, "Temps d'écoute") — voir
  // CountUp, seul autre endroit où ce formatage existe.
  variant?: "number" | "duration";
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label-sm font-medium text-ink-muted">{label}</p>
        <Icon className={`h-4 w-4 shrink-0 ${TONE_CLASSES[tone]}`} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p
        className={`mt-1.5 truncate font-display font-bold text-ink ${
          variant === "duration" ? "text-xl" : "text-3xl"
        }`}
      >
        <CountUp target={value} variant={variant} className={variant === "duration" ? "tabular-nums" : "font-mono tabular-nums"} />
      </p>
    </div>
  );
}
