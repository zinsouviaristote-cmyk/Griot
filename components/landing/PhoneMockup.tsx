import { Play } from "lucide-react";
import { Waveform } from "@/components/player/Waveform";

interface Pochette {
  name: string;
  occasion: string;
  from: string;
  to: string;
  position: string;
  durationS: number;
  delayS: number;
}

// Dégradés dérivés du violet de marque uniquement (voir tailwind.config.ts) —
// jamais une couleur hors de cette famille, même sur un élément aussi mineur.
const POCHETTES: Pochette[] = [
  { name: "Moussa", occasion: "Anniversaire", from: "#630ed4", to: "#7c3aed", position: "-left-6 -top-4 sm:-left-9 sm:-top-6", durationS: 4.2, delayS: 0 },
  { name: "Aïcha", occasion: "Mariage", from: "#4b41e1", to: "#630ed4", position: "-right-4 top-1/3 sm:-right-8", durationS: 3.8, delayS: 0.5 },
  { name: "Koffi", occasion: "Baptême", from: "#a855f7", to: "#630ed4", position: "-left-3 bottom-2 sm:-left-6 sm:bottom-8", durationS: 4.6, delayS: 1 },
];

function PochetteCard({ pochette }: { pochette: Pochette }) {
  return (
    <div
      className={`absolute ${pochette.position} flex w-[88px] flex-col gap-4 rounded-card p-2.5 text-white shadow-card animate-[float_4s_ease-in-out_infinite]`}
      style={{
        background: `linear-gradient(135deg, ${pochette.from}, ${pochette.to})`,
        animationDuration: `${pochette.durationS}s`,
        animationDelay: `${pochette.delayS}s`,
      }}
    >
      <span className="truncate text-xs font-semibold">{pochette.name}</span>
      <span className="truncate text-[10px] font-medium uppercase tracking-wide text-white/75">
        {pochette.occasion}
      </span>
    </div>
  );
}

// Maquette du produit, entièrement CSS/SVG — aucune image. Montre l'écran
// d'écoute réel (voir TrackHeroPlayer) plutôt qu'une interface inventée : ce
// qu'on montre ici, c'est vraiment ce que le visiteur recevra. Les pochettes
// flottantes autour ne sont que décor, retirées du DOM sous lg comme les
// anciennes pastilles — rien à faire flotter inutilement sur un petit écran.
export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[196px] sm:w-[228px] lg:w-[248px]" aria-hidden="true">
      <div className="relative z-10 rounded-feature border-[6px] border-ink bg-ink p-1.5 shadow-card-hover [transform:rotate(-5deg)]">
        <div className="overflow-hidden rounded-card bg-surface">
          <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-ink/15" />
          <div className="flex flex-col items-center gap-5 px-5 pb-8 pt-6 text-center">
            <div>
              <p className="font-display text-2xl font-bold text-ink sm:text-[28px]">Fatou</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-muted sm:text-sm">
                Anniversaire · Afrobeat
              </p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white sm:h-16 sm:w-16">
              <Play className="ml-0.5 h-6 w-6" strokeWidth={1.5} fill="currentColor" />
            </span>
            <Waveform active barClassName="bg-brand" className="h-8 sm:h-9" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        {POCHETTES.map((pochette) => (
          <PochetteCard key={pochette.name} pochette={pochette} />
        ))}
      </div>
    </div>
  );
}
