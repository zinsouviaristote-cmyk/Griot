"use client";

import { CountUp } from "@/components/ui/CountUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getTimeBasedGreeting } from "@/lib/format/greeting";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function MobileGreeting({
  firstName,
  creditBalance,
}: {
  firstName: string;
  creditBalance: number;
}) {
  const { t, tn } = useLanguage();
  const greeting = getTimeBasedGreeting(t);

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {greeting}, {firstName}
      </SectionTitle>
      <p className="mt-2 text-sm text-ink-muted">
        <CountUp target={creditBalance} className="tabular-nums" /> {tn("dashboard.greeting.creditBalance", creditBalance)}
      </p>
    </div>
  );
}
