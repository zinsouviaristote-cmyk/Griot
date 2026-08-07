"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  Compass,
  Home,
  Library,
  Music2,
  PartyPopper,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CreditCard } from "@/components/dashboard/CreditCard";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const DISCOVER_ITEMS: NavItem[] = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Explorer", href: "/explorer", icon: Compass },
  { label: "Ma bibliothèque", href: "/bibliotheque", icon: Library },
];

const CREATE_ITEMS: NavItem[] = [
  { label: "Nouvelle chanson", href: "/creer", icon: Wand2 },
  { label: "Occasions", href: "/occasions", icon: PartyPopper },
  { label: "Styles", href: "/styles", icon: Music2 },
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
                {item.label}
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
  onNavigate,
}: {
  creditBalance: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <Link
        href="/"
        onClick={onNavigate}
        className="inline-block px-3 transition-transform duration-200 ease-magnetic hover:scale-[1.03]"
      >
        <Logo />
      </Link>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <NavSection title="Découvrir" items={DISCOVER_ITEMS} pathname={pathname} onNavigate={onNavigate} />
        <NavSection title="Créer" items={CREATE_ITEMS} pathname={pathname} onNavigate={onNavigate} />
      </nav>

      <div className="space-y-3 border-t border-border pt-4">
        <CreditCard balance={creditBalance} />
        <Link
          href="/aide"
          onClick={onNavigate}
          className="group flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <CircleHelp
            className="h-4 w-4 transition-transform duration-200 ease-magnetic group-hover:scale-110 group-hover:rotate-12"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          Besoin d&apos;aide ?
        </Link>
      </div>
    </div>
  );
}
