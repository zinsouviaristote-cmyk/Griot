"use client";

import Link from "next/link";
import { Menu, Music2, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export function TopBar({
  creditBalance,
  userInitials,
  onMenuClick,
}: {
  creditBalance: number;
  userInitials: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line-800 bg-ink-950/85 px-4 py-3 backdrop-blur-panel lg:px-8 lg:py-4">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control text-paper-300 transition-colors hover:bg-ink-800 hover:text-paper-100 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <label className="relative flex min-w-0 flex-1 items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-paper-600"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Rechercher une chanson…"
          className="w-full min-w-0 rounded-control border border-line-800 bg-ink-900/70 py-2.5 pl-10 pr-3 text-sm text-paper-100 placeholder:text-paper-600 transition-colors focus:border-brand-500/60 focus:outline-none focus:shadow-ring-focus"
        />
      </label>

      <Link
        href="/recharger"
        className="hidden shrink-0 items-center gap-1.5 rounded-full border border-line-700 bg-ink-800/70 px-3.5 py-2 text-xs font-semibold text-paper-100 transition-colors hover:border-brand-500/50 sm:inline-flex"
      >
        <Music2 className="h-3.5 w-3.5 text-brand-400" strokeWidth={2} aria-hidden="true" />
        {creditBalance} {creditBalance > 1 ? "chansons" : "chanson"}
      </Link>

      <Avatar initials={userInitials} size="sm" />
    </header>
  );
}
