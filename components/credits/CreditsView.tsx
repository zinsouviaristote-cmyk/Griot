import { Sparkles } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { ButtonLink } from "@/components/ui/Button";
import { formatDateFr } from "@/lib/format/date";
import type { CreditMotif, CreditTransaction } from "@/lib/types";

const MOTIF_LABELS: Record<CreditMotif, string> = {
  achat: "Achat",
  essai: "Essai",
  remboursement: "Remboursement",
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

export function CreditsView({ balance, transactions }: { balance: number; transactions: CreditTransaction[] }) {
  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 rounded-feature border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-label-sm font-medium uppercase tracking-wide text-ink-muted">Solde actuel</p>
            <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-5xl font-bold text-ink">
            <CountUp target={balance} />
          </p>
          <p className="mt-1 text-sm text-ink-muted">Note{balance > 1 ? "s" : ""} disponible{balance > 1 ? "s" : ""}</p>
        </div>
        <ButtonLink href="/recharger" variant="primary">
          Recharger
        </ButtonLink>
      </div>

      <div className="mt-6">
        <p className="text-label-md uppercase tracking-wide text-ink-muted">Historique</p>

        {/* Desktop */}
        <div className="mt-3 hidden overflow-hidden rounded-card border border-border bg-surface shadow-card lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-page text-left text-xs font-medium uppercase tracking-wide text-ink-muted">
                <th className="py-3 pl-5 pr-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Motif</th>
                <th className="px-3 py-3 font-medium">Variation</th>
                <th className="py-3 pl-3 pr-5 font-medium">Solde résultant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0">
                  <td className="py-3 pl-5 pr-3 text-sm text-ink-muted">{formatDateFr(tx.date)}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm font-medium ${MOTIF_CLASSES[tx.motif]}`}
                    >
                      {MOTIF_LABELS[tx.motif]}
                    </span>
                    <span className="ml-2.5 text-sm text-ink">{tx.label}</span>
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
        <div className="mt-3 flex flex-col gap-3 lg:hidden">
          {transactions.map((tx) => (
            <div key={tx.id} className="rounded-card border border-border bg-surface p-3.5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-label-sm font-medium ${MOTIF_CLASSES[tx.motif]}`}
                >
                  {MOTIF_LABELS[tx.motif]}
                </span>
                <DeltaLabel delta={tx.delta} />
              </div>
              <p className="mt-2 text-sm text-ink">{tx.label}</p>
              <div className="mt-1.5 flex items-center justify-between text-xs text-ink-muted">
                <span>{formatDateFr(tx.date)}</span>
                <span>Solde : {tx.balanceAfter}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
