"use client";

import { Sparkles } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { formatDate } from "@/lib/format/date";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { CreditMotif, CreditTransaction } from "@/lib/types";

const MOTIF_LABEL_KEYS: Record<CreditMotif, string> = {
  achat: "recharge.history.motif_achat",
  essai: "recharge.history.motif_essai",
  remboursement: "recharge.history.motif_remboursement",
};

const MOTIF_CLASSES: Record<CreditMotif, string> = {
  achat: "bg-brand/10 text-brand",
  essai: "bg-border text-ink-muted",
  remboursement: "bg-success/10 text-success",
};

function DeltaLabel({ delta }: { delta: number }) {
  const tone = delta > 0 ? "text-success" : delta < 0 ? "text-ink" : "text-ink-muted";
  return (
    <span className={`font-mono text-sm font-semibold tabular-nums ${tone}`}>
      {delta > 0 ? "+" : ""}
      {delta}
    </span>
  );
}

// Solde et historique, réunis sous les packs de /recharger — plus de page
// /credits séparée : tout ce qui touche aux Notes vit désormais ici.
export function CreditHistory({ balance, transactions }: { balance: number; transactions: CreditTransaction[] }) {
  const { t, tn, locale } = useLanguage();
  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">{t("recharge.history.currentBalance")}</p>
        <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="mt-2 font-display text-4xl font-bold text-ink">
        <CountUp target={balance} />
      </p>
      <p className="mt-1 text-sm text-ink-muted">{tn("recharge.history.available", balance)}</p>

      <div className="mt-6">
        {/* Desktop */}
        <div className="hidden overflow-hidden rounded-card border border-border bg-surface shadow-card lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-page text-left text-xs font-medium uppercase tracking-wide text-ink-muted">
                <th className="py-3 pl-5 pr-3 font-medium">{t("recharge.history.date")}</th>
                <th className="px-3 py-3 font-medium">{t("recharge.history.motif")}</th>
                <th className="px-3 py-3 font-medium">{t("recharge.history.variation")}</th>
                <th className="py-3 pl-3 pr-5 font-medium">{t("recharge.history.resultingBalance")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0">
                  <td className="py-3 pl-5 pr-3 text-sm text-ink-muted">{formatDate(tx.date, locale)}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm font-medium ${MOTIF_CLASSES[tx.motif]}`}
                    >
                      {t(MOTIF_LABEL_KEYS[tx.motif])}
                    </span>
                    <span className="ml-2.5 text-sm text-ink">{t(tx.labelKey, tx.labelParams)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <DeltaLabel delta={tx.delta} />
                  </td>
                  <td className="py-3 pl-3 pr-5 text-sm font-medium text-ink">{tx.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile — jamais de tableau à défilement horizontal, des cartes empilées. */}
        <div className="flex flex-col gap-3 lg:hidden">
          {transactions.map((tx) => (
            <div key={tx.id} className="rounded-card border border-border bg-surface p-3.5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm font-medium ${MOTIF_CLASSES[tx.motif]}`}
                >
                  {t(MOTIF_LABEL_KEYS[tx.motif])}
                </span>
                <DeltaLabel delta={tx.delta} />
              </div>
              <p className="mt-2 text-sm text-ink">{t(tx.labelKey, tx.labelParams)}</p>
              <div className="mt-1.5 flex items-center justify-between text-xs text-ink-muted">
                <span>{formatDate(tx.date, locale)}</span>
                <span>{t("recharge.history.balanceLabel", { balance: tx.balanceAfter })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
