import Link from "next/link";
import { BarChart3, ChevronRight, CircleHelp, LogOut, Megaphone, Settings, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CreditCard } from "@/components/dashboard/CreditCard";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ITEMS: MenuItem[] = [
  { label: "Paramètres", href: "/parametres", icon: Settings },
  { label: "Statistiques", href: "/statistiques", icon: BarChart3 },
  { label: "Mes publications", href: "/publications", icon: Megaphone },
  { label: "Aide", href: "/aide", icon: CircleHelp },
];

/**
 * Hub de l'onglet mobile "Profil" — l'équivalent, pour un écran sans sidebar,
 * du bloc « Moi » + bas de sidebar sur desktop. Sans cette page, Paramètres,
 * Statistiques, Mes publications et Aide ne restaient atteignables que par le
 * menu de l'avatar, que personne ne pense à ouvrir.
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
