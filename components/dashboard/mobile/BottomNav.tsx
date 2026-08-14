"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, LibraryBig, Plus, UserRound, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface TabItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

const LEFT_TABS: TabItem[] = [
  { labelKey: "dashboard.bottomNav.home", href: "/tableau-de-bord", icon: Home },
  { labelKey: "dashboard.bottomNav.explore", href: "/explorer", icon: Compass },
];

const RIGHT_TABS: TabItem[] = [
  { labelKey: "dashboard.bottomNav.library", href: "/bibliotheque", icon: LibraryBig },
  { labelKey: "dashboard.bottomNav.profile", href: "/profil", icon: UserRound },
];

function TabLink({ item, isActive }: { item: TabItem; isActive: boolean }) {
  const { t } = useLanguage();
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className="flex min-h-[44px] flex-col items-center justify-center gap-1 text-ink-muted transition-transform duration-150 ease-magnetic active:scale-90"
    >
      <item.icon
        className={`transition-transform duration-200 ease-magnetic ${isActive ? "scale-110 text-brand" : "text-ink-muted"}`}
        width={22}
        height={22}
        strokeWidth={isActive ? 2 : 1.5}
        fill={isActive ? "currentColor" : "none"}
        fillOpacity={isActive ? 0.15 : 1}
        aria-hidden="true"
      />
      <span className={`text-xs font-medium transition-colors ${isActive ? "text-brand" : "text-ink-muted"}`}>
        {t(item.labelKey)}
      </span>
    </Link>
  );
}

/**
 * Barre de navigation basse, fixe — le shell d'app remplace complètement la sidebar
 * sur mobile (voir DashboardShell : la sidebar est `hidden` sous `lg`). Le bouton
 * central « Créer » vit désormais sur la même ligne que les autres onglets, jamais
 * surélevé au-dessus de la barre : posé à cheval sur la bordure, il gênait.
 */
export function BottomNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <div className="border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-16 grid-cols-5 items-center px-1">
          {LEFT_TABS.map((item) => (
            <TabLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
          <div className="flex items-center justify-center">
            <Link
              href="/creer"
              aria-label={t("dashboard.bottomNav.create")}
              className="group flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-card transition-transform duration-200 ease-magnetic hover:scale-110 active:scale-95"
            >
              <Plus
                className="h-5 w-5 transition-transform duration-300 ease-magnetic group-hover:rotate-90"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
          {RIGHT_TABS.map((item) => (
            <TabLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>
      </div>
    </nav>
  );
}
