import { CalendarHeart, Gift, Heart, Share2 } from "lucide-react";
import { NextOccasionCard, StatCard } from "@/components/dashboard/StatCard";
import { Reveal } from "@/components/ui/Reveal";
import type { DashboardStats } from "@/lib/types";

// Le solde de Notes ne figure plus ici — il vit déjà sur la pastille du haut
// et sur la carte de la barre latérale (voir CreditCard) : une troisième
// apparition n'ajoutait rien, seulement de la redondance dans cette rangée.
export function StatsGrid({ stats }: { stats: DashboardStats }) {
  // La 4e carte n'existe que pour quelqu'un qui a déjà publié au moins une
  // chanson — `null` (jamais publié) la distingue de `0` (publiée, pas encore
  // aimée), qui doit lui rester visible.
  const hasPublished = stats.likesRecus !== null;

  return (
    <div className={`grid grid-cols-2 gap-4 ${hasPublished ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {/* Cascade de cartes : 150ms d'écart entre chacune (contre 80ms pour du texte
          — voir SongRow, plus dense et plus rapide à parcourir). */}
      <Reveal delayMs={0}>
        <StatCard icon={Gift} label="Chansons offertes" value={stats.chansonsOffertes} tone="secondary" />
      </Reveal>
      <Reveal delayMs={150}>
        <StatCard icon={Share2} label="Chansons partagées" value={stats.chansonsPartagees} tone="success" />
      </Reveal>
      <Reveal delayMs={300}>
        <NextOccasionCard icon={CalendarHeart} occasion={stats.nextOccasion} />
      </Reveal>
      {hasPublished && (
        <Reveal delayMs={450}>
          <StatCard icon={Heart} label="Likes reçus" value={stats.likesRecus as number} tone="brand" />
        </Reveal>
      )}
    </div>
  );
}
