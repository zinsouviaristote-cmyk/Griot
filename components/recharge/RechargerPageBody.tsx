"use client";

import { RechargeView } from "@/components/recharge/RechargeView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { CreditTransaction } from "@/lib/types";

export function RechargerPageBody({
  currentBalance,
  transactions,
}: {
  currentBalance: number;
  transactions: CreditTransaction[];
}) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        {t("recharge.pageTitle")}
      </SectionTitle>
      <p className="mt-1.5 text-sm text-ink-muted">{t("recharge.pageSubtitle")}</p>

      <Reveal delayMs={80} className="mt-5">
        <RechargeView currentBalance={currentBalance} transactions={transactions} />
      </Reveal>
    </div>
  );
}
