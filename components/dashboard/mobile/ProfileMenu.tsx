import Link from "next/link";
import { BarChart3, ChevronRight, LogOut, Megaphone, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CreditCard } from "@/components/dashboard/CreditCard";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Équivalent, pour un écran sans sidebar, de la seule section « Moi » du bloc
// desktop — Paramètres et Aide restent réservés au menu de l'avatar (voir
// MobileTopBar), un seul chemin pour chacun.
const ITEMS: MenuItem[] = [
  { label: "Statistiques", href: "/statistiques", icon: BarChart3 },
  { label: "Mes publications", href: "/publications", icon: Megaphone },
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
}: {
  initials: string;
  name: string;
  email: string;
  creditBalance: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar initials={initials} size="lg" />
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
            className="group flex min-h-[52px] items-center gap-3 border-b border-border px-4 text-sm font-medium text-ink transition-colors last:border-0 hover:bg-brand-soft"
          >
            <item.icon
              className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted/60" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <Link
        href="/connexion"
        className="mt-3 flex min-h-[52px] items-center gap-3 rounded-card border border-border bg-surface px-4 text-sm font-semibold text-danger shadow-card transition-colors hover:bg-danger/5"
      >
        <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        Déconnexion
      </Link>
    </div>
  );
}
