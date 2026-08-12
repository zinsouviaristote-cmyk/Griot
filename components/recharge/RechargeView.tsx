"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, CreditCard as CardIcon, Smartphone, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CreditHistory } from "@/components/recharge/CreditHistory";
import { CREDIT_PACKS, formatPackEquivalence, packNotes, type CreditPack } from "@/lib/tunnel/types";
import { mockCheckPaymentStatus, mockInitiatePayment, type PaymentMethod } from "@/lib/payment/mockPayment";
import { formatFcfa } from "@/lib/format/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { CreditTransaction } from "@/lib/types";

type Phase = "select" | "processing" | "success";

export function RechargeView({
  currentBalance,
  transactions,
}: {
  currentBalance: number;
  transactions: CreditTransaction[];
}) {
  const { t, tn } = useLanguage();
  const [selectedPack, setSelectedPack] = useState<CreditPack["id"]>("pack3");
  const [method, setMethod] = useState<PaymentMethod>("mobile_money");
  const [phase, setPhase] = useState<Phase>("select");
  const [messageIndex, setMessageIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDetailsElement>(null);

  const MOBILE_MONEY_MESSAGES = [
    t("recharge.mobileMoneyMessage1"),
    t("recharge.mobileMoneyMessage2"),
    t("recharge.mobileMoneyMessage3"),
  ];
  const CARD_MESSAGES = [t("recharge.cardMessage1"), t("recharge.cardMessage2"), t("recharge.cardMessage3")];

  function openHistory() {
    setHistoryOpen(true);
    requestAnimationFrame(() => historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const pack = CREDIT_PACKS.find((p) => p.id === selectedPack)!;
  const messages = method === "mobile_money" ? MOBILE_MONEY_MESSAGES : CARD_MESSAGES;

  useEffect(() => {
    if (phase !== "processing") return;
    let cancelled = false;
    let attempt = 0;

    async function poll() {
      await mockInitiatePayment(method, selectedPack);
      while (!cancelled) {
        const status = await mockCheckPaymentStatus(attempt);
        if (cancelled) return;
        if (status === "confirmed") {
          setPhase("success");
          return;
        }
        attempt += 1;
        setMessageIndex(attempt % messages.length);
      }
    }
    poll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "processing") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
          <Sparkles className="h-7 w-7 animate-breathe text-brand" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="mt-6 font-display text-headline-md text-ink">{t("recharge.processingTitle")}</p>
        <p key={messageIndex} aria-live="polite" className="mt-2 min-h-[24px] animate-field-in text-body-md text-ink-muted">
          {messages[messageIndex]}
        </p>
        <p className="mt-6 text-xs text-ink-muted">{t("recharge.processingHint")}</p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="mt-6 font-display text-headline-md text-ink">{t("recharge.successTitle")}</p>
        <p className="mt-2 text-body-md text-ink-muted">
          {tn("recharge.successBody", packNotes(pack), { total: currentBalance + packNotes(pack) })}
        </p>
        <ButtonLink href="/tableau-de-bord" variant="primary" className="mt-8 w-full sm:w-auto">
          {t("recharge.backToDashboard")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {CREDIT_PACKS.map((p) => {
          const isSelected = selectedPack === p.id;
          const notes = packNotes(p);
          const perSong = p.priceFcfa / p.songs;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPack(p.id)}
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
      <p className="mt-3 text-label-sm text-ink-muted">{t("recharge.notesNeverExpire")}</p>

      <div className="mt-8">
        <p className="text-label-md uppercase tracking-wide text-ink-muted">{t("recharge.paymentMethod")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod("mobile_money")}
            aria-pressed={method === "mobile_money"}
            className={`flex items-center gap-3 rounded-card border-2 p-4 text-left transition-all duration-150 ease-magnetic active:scale-[0.98] ${
              method === "mobile_money" ? "border-brand bg-brand-soft" : "border-border bg-surface hover:border-brand/40"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Smartphone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{t("recharge.mobileMoney")}</span>
              <span className="block text-xs text-ink-muted">{t("recharge.mobileMoneyOperators")}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMethod("carte")}
            aria-pressed={method === "carte"}
            className={`flex items-center gap-3 rounded-card border-2 p-4 text-left transition-all duration-150 ease-magnetic active:scale-[0.98] ${
              method === "carte" ? "border-brand bg-brand-soft" : "border-border bg-surface hover:border-brand/40"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <CardIcon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{t("recharge.card")}</span>
              <span className="block text-xs text-ink-muted">{t("recharge.cardBrands")}</span>
            </span>
          </button>
        </div>
      </div>

      <Button onClick={() => setPhase("processing")} className="mt-8 w-full sm:w-auto">
        {t("recharge.payButton", { price: formatFcfa(pack.priceFcfa) })}
      </Button>

      {!historyOpen && (
        <button
          type="button"
          onClick={openHistory}
          className="mt-6 text-xs font-medium text-brand hover:underline"
        >
          {t("recharge.viewHistory")}
        </button>
      )}

      {/* Remplace l'ancienne page /credits — solde et historique rejoignent
          Recharger, repliés par défaut : une seule page pour tout ce qui
          touche aux Notes. */}
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
