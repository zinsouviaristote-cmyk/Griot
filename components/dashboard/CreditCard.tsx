"use client";

import Link from "next/link";
import { Sparkle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * L'élément le plus important de la sidebar : remplace la carte d'abonnement
 * qu'on trouve d'habitude ici. Un utilisateur qui revient dépenser un crédit
 * doit voir son solde avant tout le reste. Toute la carte pointe vers
 * /recharger — solde, historique et rechargement y vivent tous les trois,
 * un seul chemin, jamais une page /credits séparée.
 */
export function CreditCard({ balance }: { balance: number }) {
  const { t, tn } = useLanguage();
  const isLow = balance <= 1;

  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <Link href="/recharger" className="group block">
        <div className="flex items-center gap-2 text-ink-muted">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft">
            <Sparkle className="h-3.5 w-3.5 animate-pulse text-brand" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wide transition-colors group-hover:text-ink">
            {t("credits.label")}
          </span>
        </div>
        <p className="mt-2.5 font-display text-3xl font-semibold text-ink">
          {balance} <span className="font-sans text-base font-normal text-ink-muted">{tn("credits.unit", balance)}</span>
        </p>
        <p className="mt-1 text-xs text-ink-muted">{isLow ? t("credits.lowBalance") : t("credits.explainer")}</p>
      </Link>
      <ButtonLink href="/recharger" variant="primary" className="mt-3.5 w-full">
        {t("credits.recharge")}
      </ButtonLink>
    </div>
  );
}
