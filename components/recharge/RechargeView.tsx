"use client";

import { useRef, useState } from "react";
import { ChevronDown, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreditHistory } from "@/components/recharge/CreditHistory";
import {
  CREDIT_PACKS,
  formatPackEquivalence,
  packNotes,
  type CreditPack,
} from "@/lib/tunnel/types";
import { formatFcfa } from "@/lib/format/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { CreditTransaction } from "@/lib/types";

// Récupération dynamique des Product IDs Chariow
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
  user?: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
  };
}) {
  const { t, tn } = useLanguage();

  // Pack du milieu sélectionné par défaut
  const [selectedPackId, setSelectedPackId] =
    useState<CreditPack["id"]>(
      CREDIT_PACKS[1]?.id || CREDIT_PACKS[0]?.id
    );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const historyRef = useRef<HTMLDetailsElement>(null);

  // Index du pack sélectionné
  const selectedIndex = CREDIT_PACKS.findIndex(
    (p) => p.id === selectedPackId
  );

  const pack =
    CREDIT_PACKS[selectedIndex] || CREDIT_PACKS[0];

  // ---------------------------------------------------------
  // PAIEMENT CHARIOW
  // ---------------------------------------------------------

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg(null);

    const productId = CHARIOW_KEYS[selectedIndex];

    if (!productId) {
      setErrorMsg(
        `L'identifiant Chariow pour le Pack N°${
          selectedIndex + 1
        } n'est pas configuré dans le .env`
      );

      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
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
        throw new Error(
          data.error ||
            "Erreur lors de la création du paiement"
        );
      }

      // Redirection vers le guichet Chariow
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      console.error(err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Impossible d'initier le paiement";

      setErrorMsg(errorMessage);
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // AFFICHAGE
  // ---------------------------------------------------------

  return (
    <div className="w-full max-w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* =================================================
            EN-TÊTE
        ================================================= */}

        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
            Recharge tes crédits
          </h2>

          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Choisis le pack qui correspond à tes besoins.
          </p>
        </div>

        {/* =================================================
            CARTES DES PACKS
        ================================================= */}

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">

          {CREDIT_PACKS.map((p) => {
            const isSelected = selectedPackId === p.id;
            const notes = packNotes(p);
            const perSong = p.songs > 0 ? p.priceFcfa / p.songs : 0;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPackId(p.id)}
                aria-pressed={isSelected}
                className={`
                  group
                  flex
                  w-full
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  text-left
                  transition-all
                  duration-200
                  ease-magnetic
                  active:scale-[0.98]
                  ${isSelected
                    ? "border-brand bg-brand-soft shadow-card"
                    : "border-border bg-surface hover:border-brand/40"
                  }
                `}
              >

                {/* BADGE */}
                <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        h-2
                        w-2
                        rounded-full
                        ${p.featured ? "bg-brand" : "bg-ink-muted/40"}
                      `}
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                      {p.featured
                        ? `★ ${t("recharge.mostChosen")}`
                        : "Pack"}
                    </span>
                  </div>
                </div>

                {/* PRIX */}
                <div className="mx-4 mt-3 rounded-xl bg-ink/[0.03] px-3 py-3 sm:mx-5">
                  <p className="font-display text-2xl font-bold leading-none text-ink sm:text-3xl">
                    {formatFcfa(p.priceFcfa)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {t("recharge.perSong", {
                      price: formatFcfa(perSong),
                    })}
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                  <p className="text-sm font-medium text-ink">
                    {notes} {tn("credits.unit", notes)}
                  </p>
                  <p className="mt-0.5 min-h-[18px] text-xs text-ink-muted">
                    {formatPackEquivalence(p, tn)}
                  </p>

                  {/* Sélection */}
                  <div
                    className={`
                      mt-4
                      flex
                      h-9
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      text-xs
                      font-semibold
                      transition-all
                      ${isSelected
                        ? "bg-brand text-white shadow-sm"
                        : p.featured
                          ? "bg-brand text-white"
                          : "border border-border text-ink group-hover:bg-brand-soft"
                      }
                    `}
                  >
                    {isSelected ? "Sélectionné" : "Choisir"}
                  </div>
                </div>

              </button>
            );
          })}

        </div>

        {/* =================================================
            ZONE INFÉRIEURE
        ================================================= */}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* PAIEMENT */}
          <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2.5 sm:w-auto sm:min-w-[280px]">

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Smartphone
                className="h-4 w-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink">
                Paiement sécurisé
              </p>
              <p className="truncate text-[10px] text-ink-muted sm:text-xs">
                MTN Mobile Money, Moov, Wave, Carte Bancaire
              </p>
            </div>

          </div>

          {/* BOUTON PAYER */}
          <Button
            onClick={handlePay}
            disabled={loading}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {loading
              ? "Chargement du paiement..."
              : t("recharge.payButton", {
                  price: formatFcfa(pack.priceFcfa),
                })}
          </Button>

        </div>

        {/* =================================================
            MESSAGE D'ERREUR
        ================================================= */}

        {errorMsg && (
          <p className="mt-3 text-center text-xs font-medium text-red-600">
            {errorMsg}
          </p>
        )}

        {/* =================================================
            HISTORIQUE
        ================================================= */}

        <details
          ref={historyRef}
          open={historyOpen}
          onToggle={(event) =>
            setHistoryOpen(event.currentTarget.open)
          }
          className="
            group
            mt-4
            w-full
            rounded-2xl
            border
            border-border
            bg-surface
            open:shadow-card
          "
        >

          <summary
            className="
              flex
              cursor-pointer
              list-none
              items-center
              justify-between
              gap-2
              px-4
              py-3
              text-sm
              font-semibold
              text-ink
              [&::-webkit-details-marker]:hidden
            "
          >

            {t("recharge.historyTitle")}

            <ChevronDown
              className="
                h-4
                w-4
                shrink-0
                text-ink-muted
                transition-transform
                duration-200
                ease-magnetic
                group-open:rotate-180
              "
              strokeWidth={1.5}
              aria-hidden="true"
            />

          </summary>

          <div className="border-t border-border px-4 pb-4 pt-3">

            <CreditHistory
              balance={currentBalance}
              transactions={transactions}
            />

          </div>

        </details>

      </div>
    </div>
  );
}