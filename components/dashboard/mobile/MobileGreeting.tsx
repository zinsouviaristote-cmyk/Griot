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
        {creditBalance} {creditBalance > 1 ? "chansons restantes" : "chanson restante"}
      </p>
    </div>
  );
}
