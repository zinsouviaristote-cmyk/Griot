import type { Metadata } from "next";
import { RechargeView } from "@/components/recharge/RechargeView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockUser } from "@/lib/data/mock-dashboard";
import { getCreditTransactionsSortedDesc } from "@/lib/data/mock-credits";

export const metadata: Metadata = {
  title: "Recharger — Griot",
};

export default function RechargerPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        Recharger
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">
        Choisissez un pack de Notes — le prix baisse à mesure que le pack grandit.
      </p>

      <Reveal delayMs={80} className="mt-6">
        <RechargeView currentBalance={mockUser.creditBalance} transactions={getCreditTransactionsSortedDesc()} />
      </Reveal>
    </div>
  );
}
