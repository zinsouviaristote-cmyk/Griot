"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Home, Library, Megaphone, Wand2, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CreditCard } from "@/components/dashboard/CreditCard";
import { SidebarUserMenu } from "@/components/dashboard/SidebarUserMenu";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

const DISCOVER_ITEMS: NavItem[] = [
  { labelKey: "nav.home", href: "/tableau-de-bord", icon: Home },
  { labelKey: "nav.explore", href: "/explorer", icon: Compass },
  { labelKey: "nav.library", href: "/bibliotheque", icon: Library },
];

const CREATE_ITEMS: NavItem[] = [{ labelKey: "nav.newSong", href: "/creer", icon: Wand2 }];

const ME_ITEMS: NavItem[] = [
  { labelKey: "nav.myPublications", href: "/publications", icon: Megaphone },
  { labelKey: "nav.statistics", href: "/statistiques", icon: BarChart3 },
];

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <p className="px-3 text-xs font-medium uppercase tracking-wide text-ink-muted">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-magnetic active:scale-[0.98] ${
                  isActive
                    ? "bg-brand-soft text-brand"
                    : "text-ink-muted hover:translate-x-0.5 hover:bg-brand-soft/60 hover:text-ink"
                }`}
              >
                <span
                  className={`absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand transition-transform duration-200 ease-magnetic ${
                    isActive ? "scale-y-100" : "scale-y-0"
                  }`}
                  aria-hidden="true"
                />
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ease-magnetic group-hover:scale-110 ${
                    isActive ? "text-brand" : ""
                  }`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {t(item.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SidebarContent({
  creditBalance,
  userInitials,
  userName,
  userEmail,
  onNavigate,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <Link
        href="/tableau-de-bord"
        onClick={onNavigate}
        className="inline-block px-3 transition-transform duration-200 ease-magnetic hover:scale-[1.03]"
      >
        <Logo />
      </Link>

      <nav className="flex flex-col gap-6 overflow-y-auto">
        <NavSection title={t("nav.discover")} items={DISCOVER_ITEMS} pathname={pathname} onNavigate={onNavigate} />
        <NavSection title={t("nav.create")} items={CREATE_ITEMS} pathname={pathname} onNavigate={onNavigate} />
        <NavSection title={t("nav.me")} items={ME_ITEMS} pathname={pathname} onNavigate={onNavigate} />
      </nav>

      {/* Absorbe l'espace restant sur un grand écran plutôt que de le laisser filer
          en un seul bloc vide : un simple trait, centré dans ce qui reste, jamais
          un second système de séparation. Sur un écran court, flex-1 vaut ~0 et ce
          conteneur s'efface — seul le border-t du bloc crédits en dessous marque
          la coupure, sans doublon visible. */}
      <div className="flex flex-1 items-center px-3" aria-hidden="true">
        <div className="h-px w-full bg-border" />
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <CreditCard balance={creditBalance} />
      </div>

      <div className="border-t border-border pt-3">
        <SidebarUserMenu initials={userInitials} name={userName} email={userEmail} />
      </div>
    </div>
  );
}
