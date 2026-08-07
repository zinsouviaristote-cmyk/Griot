import Link from "next/link";
import { ChevronRight, Wand2 } from "lucide-react";
import { styleLabels } from "@/lib/data/mock-dashboard";

const STYLE_SAMPLE = `${Object.values(styleLabels).slice(0, 3).join(", ")} et plus`;

/**
 * La carte la plus visible de l'écran mobile — toute la surface est cliquable.
 * Bordure `brand` à 2px (plutôt que le `border-border` 1px des autres cartes) :
 * c'est le seul endroit de l'app qui se permet cette emphase.
 */
export function PrimaryActionCard({ hasSongs }: { hasSongs: boolean }) {
  return (
    <Link
      href="/creer"
      className="flex items-center gap-4 rounded-card border-2 border-brand bg-brand-soft p-4 shadow-card transition-transform duration-200 ease-magnetic active:scale-[0.98]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-card bg-brand-vivid text-white">
        <Wand2 className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold text-ink">
          {hasSongs ? "Créer une chanson" : "Créer ma première chanson"}
        </p>
        <p className="mt-0.5 truncate text-sm text-ink-muted">{STYLE_SAMPLE}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}
