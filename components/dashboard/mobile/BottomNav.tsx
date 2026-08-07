"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, LibraryBig, Plus, UserRound, type LucideIcon } from "lucide-react";

interface TabItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const LEFT_TABS: TabItem[] = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Explorer", href: "/explorer", icon: Compass },
];

const RIGHT_TABS: TabItem[] = [
  { label: "Bibliothèque", href: "/bibliotheque", icon: LibraryBig },
  { label: "Profil", href: "/profil", icon: UserRound },
];

function TabLink({ item, isActive }: { item: TabItem; isActive: boolean }) {
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
        {item.label}
      </span>
    </Link>
  );
}

/**
 * Barre de navigation basse, fixe — le shell d'app remplace complètement la sidebar
 * sur mobile (voir DashboardShell : la sidebar est `hidden` sous `lg`). Le bouton
 * central « Créer » est surélevé et pose à cheval sur la bordure haute de la barre.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <div className="relative border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-16 grid-cols-5 items-center px-1">
          {LEFT_TABS.map((item) => (
            <TabLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
          <div aria-hidden="true" />
          {RIGHT_TABS.map((item) => (
            <TabLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>

        <Link
          href="/creer"
          aria-label="Créer une chanson"
          className="group absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-card-hover transition-transform duration-200 ease-magnetic hover:scale-110 active:scale-95"
        >
          <Plus
            className="h-6 w-6 transition-transform duration-300 ease-magnetic group-hover:rotate-90"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      </div>
    </nav>
  );
}
