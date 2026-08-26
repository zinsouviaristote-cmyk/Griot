"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart3, ChevronRight, LogOut, Megaphone, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CreditCard } from "@/components/dashboard/CreditCard";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface MenuItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

// Équivalent, pour un écran sans sidebar, de la seule section « Moi » du bloc
// desktop — Paramètres et Aide restent réservés au menu de l'avatar (voir
// MobileTopBar), un seul chemin pour chacun.
const ITEMS: MenuItem[] = [
  { labelKey: "dashboard.profileMenu.statistics", href: "/statistiques", icon: BarChart3 },
  { labelKey: "dashboard.profileMenu.myPublications", href: "/publications", icon: Megaphone },
];

/**
 * Hub de l'onglet mobile "Profil" — l'équivalent, pour un écran sans sidebar,
 * du bloc « Moi » sur desktop.
 */
export function ProfileMenu({
  initials,
  name,
  email,
  creditBalance,
  avatarUrl,
}: {
  initials: string;
  name: string;
  email: string;
  creditBalance: number;
  avatarUrl?: string | null;
}) {
  const { t } = useLanguage();
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar initials={initials} avatarUrl={avatarUrl} size="lg" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold text-ink">{name}</p>
          <p className="truncate text-sm text-ink-muted">{email}</p>
        </div>
      </div>

      <div className="mt-6">
        <CreditCard balance={creditBalance} />
      </div>

      <nav className="mt-6 overflow-hidden rounded-card border border-border bg-surface shadow-card">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[52px] items-center gap-3 border-b border-border px-4 text-sm font-medium text-ink transition-colors last:border-0 hover:bg-page"
          >
            <item.icon
              className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="flex-1">{t(item.labelKey)}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted/60" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="mt-3 flex min-h-[52px] w-full items-center gap-3 rounded-card border border-border bg-surface px-4 text-left text-sm font-semibold text-danger shadow-card transition-colors hover:bg-danger/5"
      >
        <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        {t("dashboard.profileMenu.logout")}
      </button>
      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}
