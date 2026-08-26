"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  CreditCard, 
  FileMusic, 
  Megaphone, 
  Users, 
  ChevronDown,
  ChevronUp,
  type LucideIcon 
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CreditCard as CreditCardView } from "@/components/dashboard/CreditCard";
import { SidebarUserMenu } from "@/components/dashboard/SidebarUserMenu";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { usePathname } from "next/navigation";

// Fonction cn simple pour combiner les classes
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

const ADMIN_ITEMS: Array<{ labelKey: string; href: string; icon: LucideIcon }> = [
  { labelKey: "admin.nav.dashboard", href: "/admin", icon: BarChart3 },
  { labelKey: "admin.nav.users", href: "/admin/utilisateurs", icon: Users },
  { labelKey: "admin.nav.songs", href: "/admin/chansons", icon: FileMusic },
  { labelKey: "admin.nav.payments", href: "/admin/paiements", icon: CreditCard },
  { labelKey: "admin.nav.publications", href: "/admin/publications", icon: Megaphone },
];

export function AdminSidebarContent({
  creditBalance,
  userInitials,
  userName,
  userEmail,
  userPhotoUrl,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  userPhotoUrl?: string | null;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Version desktop - sidebar complète
  const DesktopSidebar = () => (
    <div className="hidden h-full flex-col gap-6 px-4 py-5 lg:flex">
      <Link href="/admin" className="inline-block px-3">
        <Logo />
      </Link>

      <nav aria-label={t("admin.nav.title")} className="flex flex-col gap-1.5 overflow-y-auto">
        <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
          {t("admin.nav.title")}
        </p>
        {ADMIN_ITEMS.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-soft text-brand"
                  : "text-ink-muted hover:bg-brand-soft/60 hover:text-ink"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-1 items-center px-3" aria-hidden="true">
        <div className="h-px w-full bg-border" />
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <CreditCardView balance={creditBalance} />
      </div>

      <div className="border-t border-border pt-3">
        <SidebarUserMenu initials={userInitials} name={userName} email={userEmail} avatarUrl={userPhotoUrl} />
      </div>
    </div>
  );

  // Version mobile : le logo redirige vers /admin et ferme le menu déroulant
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {/* En-tête avec logo qui pointe vers le tableau de bord /admin */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <Link 
          href="/admin" 
          onClick={() => setAdminMenuOpen(false)} 
          className="inline-block"
        >
          <Logo className="h-8 w-auto" />
        </Link>
        
        <button
          onClick={() => setAdminMenuOpen(!adminMenuOpen)}
          className="flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand-soft/80"
        >
          Administration
          {adminMenuOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Menu déroulant */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-magnetic bg-surface border-b border-border",
          adminMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          {ADMIN_ITEMS.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAdminMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-soft text-brand"
                    : "text-ink-muted hover:bg-brand-soft/60 hover:text-ink"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Carte de crédit et profil */}
      <div className="flex flex-col gap-3 border-t border-border bg-surface p-4">
        <CreditCardView balance={creditBalance} />
        <SidebarUserMenu initials={userInitials} name={userName} email={userEmail} avatarUrl={userPhotoUrl} />
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}