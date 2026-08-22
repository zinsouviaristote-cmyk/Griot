"use client";

import Link from "next/link";
import { BarChart3, CreditCard, FileMusic, Megaphone, Users, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CreditCard as CreditCardView } from "@/components/dashboard/CreditCard";
import { SidebarUserMenu } from "@/components/dashboard/SidebarUserMenu";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { usePathname } from "next/navigation";

const ITEMS: Array<{ labelKey: string; href: string; icon: LucideIcon }> = [
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

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <Link href="/admin" className="inline-block px-3">
        <Logo />
      </Link>

      <nav aria-label={t("admin.nav.title")} className="flex flex-col gap-1.5 overflow-y-auto">
        <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-ink-muted">{t("admin.nav.title")}</p>
        {ITEMS.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-soft text-brand" : "text-ink-muted hover:bg-brand-soft/60 hover:text-ink"
              }`}
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
}