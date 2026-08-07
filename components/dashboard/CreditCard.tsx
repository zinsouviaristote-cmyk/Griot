import { Sparkle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

/**
 * L'élément le plus important de la sidebar : remplace la carte d'abonnement
 * qu'on trouve d'habitude ici. Un utilisateur qui revient dépenser un crédit
 * doit voir son solde avant tout le reste.
 */
export function CreditCard({ balance }: { balance: number }) {
  const isLow = balance <= 1;

  return (
    <div className="relative overflow-hidden rounded-card border border-line-700 bg-ink-800 p-4">
      <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-gradient-signature opacity-20 blur-2xl" />
      <div className="relative flex items-center gap-2 text-paper-500">
        <Sparkle className="h-3.5 w-3.5 text-gold-400" strokeWidth={2} aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide">Vos crédits</span>
      </div>
      <p className="relative mt-2 font-display text-3xl font-semibold text-paper-100">
        {balance}{" "}
        <span className="font-sans text-base font-normal text-paper-400">
          {balance > 1 ? "chansons" : "chanson"}
        </span>
      </p>
      <p className="relative mt-1 text-xs text-paper-500">
        {isLow
          ? "Il vous en reste peu — rechargez pour ne pas être bloqué."
          : "Prêtes à être utilisées quand vous voulez."}
      </p>
      <ButtonLink href="/recharger" variant="primary" className="relative mt-3.5 w-full">
        Recharger
      </ButtonLink>
    </div>
  );
}
