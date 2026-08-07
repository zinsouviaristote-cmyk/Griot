import Link from "next/link";
import { Music2, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

// Desktop uniquement — sur mobile, MobileTopBar prend le relais (voir DashboardShell).
export function TopBar({
  creditBalance,
  userInitials,
}: {
  creditBalance: number;
  userInitials: string;
}) {
  return (
    <header className="sticky top-0 z-20 hidden items-center gap-3 border-b border-border bg-page/95 px-8 py-4 lg:flex">
      <label className="relative flex min-w-0 flex-1 items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-muted"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Rechercher une chanson…"
          className="w-full min-w-0 rounded-card border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-brand-vivid focus:outline-none focus:shadow-ring-focus"
        />
      </label>

      <Link
        href="/recharger"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand-vivid/50"
      >
        <Music2 className="h-3.5 w-3.5 text-brand-vivid" strokeWidth={2} aria-hidden="true" />
        {creditBalance} {creditBalance > 1 ? "chansons" : "chanson"}
      </Link>

      <Avatar initials={userInitials} size="sm" />
    </header>
  );
}
