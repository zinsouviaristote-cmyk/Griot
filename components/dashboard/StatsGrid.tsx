import { Disc3, Gift, Sparkles, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Reveal } from "@/components/ui/Reveal";
import type { dashboardStats } from "@/lib/data/mock-dashboard";

export function StatsGrid({ stats }: { stats: typeof dashboardStats }) {
  const cards = [
    { icon: Sparkles, label: "Crédits restants", value: stats.creditsRestants, tone: "brand" as const },
    { icon: Disc3, label: "Chansons créées", value: stats.chansonsCreees, tone: "secondary" as const },
    { icon: Gift, label: "Chansons offertes", value: stats.chansonsOffertes, tone: "warning" as const },
    {
      icon: Wallet,
      label: "Total dépensé",
      value: stats.totalDepenseFcfa,
      tone: "success" as const,
      variant: "fcfa" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Reveal key={card.label} delayMs={index * 80}>
          <StatCard {...card} />
        </Reveal>
      ))}
    </div>
  );
}
