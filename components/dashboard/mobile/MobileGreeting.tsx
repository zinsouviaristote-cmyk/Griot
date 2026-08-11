import { CountUp } from "@/components/ui/CountUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getTimeBasedGreeting } from "@/lib/format/greeting";

export function MobileGreeting({
  firstName,
  creditBalance,
}: {
  firstName: string;
  creditBalance: number;
}) {
  const greeting = getTimeBasedGreeting();

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {greeting}, {firstName}
      </SectionTitle>
      <p className="mt-2 text-sm text-ink-muted">
        <CountUp target={creditBalance} className="tabular-nums" />{" "}
        {creditBalance > 1 ? "Notes restantes" : "Note restante"}
      </p>
    </div>
  );
}
