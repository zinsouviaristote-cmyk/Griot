import Link from "next/link";
import { Sparkle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

/**
 * L'élément le plus important de la sidebar : remplace la carte d'abonnement
 * qu'on trouve d'habitude ici. Un utilisateur qui revient dépenser un crédit
 * doit voir son solde avant tout le reste. Le solde est lui-même un lien vers
 * l'historique des mouvements (/credits) — sinon cette page reste, comme avant,
 * introuvable en dehors du menu de l'avatar.
 */
export function CreditCard({ balance }: { balance: number }) {
  const isLow = balance <= 1;

  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <Link href="/credits" className="group block">
        <div className="flex items-center gap-2 text-ink-muted">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft">
            <Sparkle className="h-3.5 w-3.5 animate-pulse text-brand" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wide transition-colors group-hover:text-ink">
            Vos Notes
          </span>
        </div>
        <p className="mt-2.5 font-display text-3xl font-semibold text-ink">
          {balance} <span className="font-sans text-base font-normal text-ink-muted">{balance > 1 ? "Notes" : "Note"}</span>
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          {isLow
            ? "Il vous en reste peu — rechargez pour ne pas être bloqué."
            : "Une Note = un essai de génération. Le premier essai de chaque chanson est offert."}
        </p>
      </Link>
      <ButtonLink href="/recharger" variant="primary" className="mt-3.5 w-full">
        Recharger
      </ButtonLink>
    </div>
  );
}
