"use client";

import Link from "next/link";
import { Bell, Music2, Plus } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AvatarMenu } from "@/components/dashboard/mobile/AvatarMenu";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function MobileTopBar({
  creditBalance,
  userInitials,
  userName,
  userEmail,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
}) {
  const { t } = useLanguage();
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border bg-page/95 px-4 py-2.5 lg:hidden">
      <Link
        href="/tableau-de-bord"
        aria-label={t("dashboard.topBar.homeAriaLabel")}
        className="inline-block transition-transform duration-200 ease-magnetic hover:scale-105 active:scale-95"
      >
        <Logo withWordmark={false} />
      </Link>

      <div className="flex items-center gap-2">
        {/* La pastille de crédits est l'élément le plus important de cette barre :
            c'est ce qui ramène l'utilisateur ouvrir l'app. */}
        <Link
          href="/recharger"
          className="group flex items-center gap-1.5 rounded-full bg-brand-soft py-1 pl-3 pr-1 text-sm font-semibold text-brand transition-transform duration-200 ease-magnetic active:scale-95"
        >
          <Music2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          {creditBalance}
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white transition-transform duration-200 ease-magnetic group-hover:scale-110 group-hover:rotate-90"
            aria-hidden="true"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </Link>

        <button
          type="button"
          aria-label={t("dashboard.topBar.notifications")}
          className="group flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 active:scale-90"
        >
          <Bell
            className="h-5 w-5 transition-transform duration-300 ease-magnetic group-hover:-rotate-12 group-hover:scale-110"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        <AvatarMenu initials={userInitials} name={userName} email={userEmail} />
      </div>
    </header>
  );
}
