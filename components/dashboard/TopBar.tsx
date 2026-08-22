"use client";

import Link from "next/link";
import { Music2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { HeaderSearch } from "@/components/dashboard/HeaderSearch";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function TopBar({
  creditBalance,
  userInitials,
  userPhotoUrl,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  userPhotoUrl?: string | null;
}) {
  const { tn } = useLanguage();
  return (
    <header className="sticky top-0 z-20 hidden items-center justify-end gap-3 border-b border-border bg-page/95 px-8 py-2.5 lg:flex">
      <HeaderSearch />

      <Link
        href="/recharger"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-all duration-200 ease-magnetic hover:scale-105 hover:border-brand/50 active:scale-95"
      >
        <Music2 className="h-3.5 w-3.5 text-brand" strokeWidth={1.5} aria-hidden="true" />
        {creditBalance} {tn("credits.unit", creditBalance)}
      </Link>

      <Avatar initials={userInitials} avatarUrl={userPhotoUrl} size="sm" />
    </header>
  );
}