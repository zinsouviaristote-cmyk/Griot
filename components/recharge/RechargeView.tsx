"use client";

import { useRef, useState } from "react";
import { ChevronDown, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreditHistory } from "@/components/recharge/CreditHistory";
import { CREDIT_PACKS, formatPackEquivalence, packNotes, type CreditPack } from "@/lib/tunnel/types";
import { formatFcfa } from "@/lib/format/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { CreditTransaction } from "@/lib/types";

// Récupération dynamique des Product IDs par index dans le tableau (0 = Pack 1, 1 = Pack 2, 2 = Pack 3)
const CHARIOW_KEYS = [
  process.env.NEXT_PUBLIC_CHARIOW_PACK1,
  process.env.NEXT_PUBLIC_CHARIOW_PACK2,
  process.env.NEXT_PUBLIC_CHARIOW_PACK3,
];

export function RechargeView({
  currentBalance,
  transactions,
  user,
}: {
  currentBalance: number;
  transactions: CreditTransaction[];
  user?: { id: string; email: string; name?: string; phone?: string };
}) {
  const { t, tn } = useLanguage();

  // On sélectionne par défaut le pack au milieu (Pack 2 / Creator) ou le premier
  const [selectedPackId, setSelectedPackId] = useState<CreditPack["id"]>(
    CREDIT_PACKS[1]?.id || CREDIT_PACKS[0]?.id
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDetailsElement>(null);

  // Trouve l'index exact du pack sélectionné (0, 1 ou 2)
  const selectedIndex = CREDIT_PACKS.findIndex((p) => p.id === selectedPackId);
  const pack = CREDIT_PACKS[selectedIndex] || CREDIT_PACKS[0];

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg(null);

    // Récupère l'ID Chariow correspondant à la position du pack
    const productId = CHARIOW_KEYS[selectedIndex];

    if (!productId) {
      setErrorMsg(`L'identifiant Chariow pour le Pack N°${selectedIndex + 1} n'est pas configuré dans le .env`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          userId: user?.id || "guest_user",
          email: user?.email || "client@griot.com",
          firstName: user?.name || "Utilisateur",
          phone: user?.phone || "",
          packId: pack.id,
          notesAmount: packNotes(pack),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      // Redirection vers le guichet Chariow
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Impossible d'initier le paiement";
      setErrorMsg(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Sélection du Pack */}
      <div className="grid gap-3 sm:grid-cols-3">
        {CREDIT_PACKS.map((p) => {
          const isSelected = selectedPackId === p.id;
          const notes = packNotes(p);
          const perSong = p.priceFcfa / p.songs;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPackId(p.id)}
              aria-pressed={isSelected}
              className={`rounded-card border-2 p-5 text-left transition-all duration-150 ease-magnetic active:scale-[0.98] ${
                isSelected ? "border-brand bg-brand-soft" : "border-border bg-surface hover:border-brand/40"
              }`}
            >
              {p.featured && <p className="text-label-sm font-semibold text-brand">★ {t("recharge.mostChosen")}</p>}
              <p className={`font-display text-3xl font-bold text-ink ${p.featured ? "mt-1" : ""}`}>
                {notes} {tn("credits.unit", notes)}
              </p>
              <p className="text-sm text-ink-muted">{formatPackEquivalence(p, tn)}</p>
              <p className="mt-3 font-display text-xl font-semibold text-ink">{formatFcfa(p.priceFcfa)}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{t("recharge.perSong", { price: formatFcfa(perSong) })}</p>
            </button>
          );
        })}
      </div>

      {/* Information Paiement Chariow */}
      <div className="mt-8 flex items-center gap-3 rounded-card border border-border bg-surface p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Smartphone className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Paiement sécurisé via Chariow</p>
          <p className="text-xs text-ink-muted">MTN Mobile Money, Moov, Wave, Carte Bancaire</p>
        </div>
      </div>

      {errorMsg && <p className="mt-3 text-sm font-medium text-red-600">{errorMsg}</p>}

      {/* Bouton Payer */}
      <Button onClick={handlePay} disabled={loading} className="mt-8 w-full sm:w-auto">
        {loading ? "Chargement du paiement..." : t("recharge.payButton", { price: formatFcfa(pack.priceFcfa) })}
      </Button>

      {/* Historique des crédits */}
      <details
        ref={historyRef}
        open={historyOpen}
        onToggle={(event) => setHistoryOpen(event.currentTarget.open)}
        className="group mt-6 scroll-mt-8 rounded-feature border border-border bg-surface open:shadow-card"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          {t("recharge.historyTitle")}
          <ChevronDown
            className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ease-magnetic group-open:rotate-180"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-border px-5 pb-6 pt-5">
          <CreditHistory balance={currentBalance} transactions={transactions} />
        </div>
      </details>
    </div>
  );
}