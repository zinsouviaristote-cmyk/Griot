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
      <label className="group relative flex min-w-0 flex-1 items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-muted transition-colors duration-200 group-focus-within:text-brand"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Rechercher une chanson…"
          className="w-full min-w-0 rounded-control border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 focus:border-brand focus:outline-none focus:shadow-ring-focus"
        />
      </label>

      <Link
        href="/recharger"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-all duration-200 ease-magnetic hover:scale-105 hover:border-brand/50 active:scale-95"
      >
        <Music2 className="h-3.5 w-3.5 text-brand" strokeWidth={1.5} aria-hidden="true" />
        {creditBalance} {creditBalance > 1 ? "chansons" : "chanson"}
      </Link>

      <span className="inline-block transition-transform duration-200 ease-magnetic hover:scale-105">
        <Avatar initials={userInitials} size="sm" />
      </span>
    </header>
  );
}
