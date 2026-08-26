"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  CircleHelp, 
  Globe, 
  LogOut, 
  Music, 
  Settings, 
  SunMedium, 
  ShieldCheck,
  BarChart3,
  Users,
  FileMusic,
  CreditCard,
  Megaphone
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme, type Theme } from "@/lib/i18n/ThemeContext";
import type { Locale } from "@/lib/i18n/locale";
import { usePathname } from "next/navigation";

type Panel = "root" | "langue" | "theme" | "admin";

const ADMIN_EMAIL = "zinsouviaristote@gmail.com";

// Tous les liens admin - COMPLETS
const ADMIN_ITEMS = [
  { label: "Tableau de bord", href: "/admin", icon: BarChart3 },
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
  { label: "Chansons", href: "/admin/chansons", icon: FileMusic },
  { label: "Paiements", href: "/admin/paiements", icon: CreditCard },
  { label: "Publications", href: "/admin/publications", icon: Megaphone },
];

export function AvatarMenu({
  initials,
  name,
  email,
  avatarUrl,
}: {
  initials: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}) {
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("root");

  const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL;

  function close() {
    setIsOpen(false);
    setPanel("root");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={t("accountMenu.openProfileMenu")}
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 ease-magnetic hover:scale-105 active:scale-95"
      >
        <Avatar initials={initials} avatarUrl={avatarUrl} size="sm" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label={t("accountMenu.closeMenu")}
            onClick={close}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-pop-in overflow-hidden rounded-card border border-border bg-surface shadow-card-hover">
            {panel === "root" ? (
              <>
                <div className="border-b border-border px-4 py-3">
                  <p className="truncate text-sm font-semibold text-ink">{name}</p>
                  <p className="truncate text-xs text-ink-muted">{email}</p>
                </div>
                <nav className="py-1.5">
                  {/* Administration - avec sous-menu */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setPanel("admin")}
                      className="group flex w-full min-h-[44px] items-center justify-between gap-3 border-b border-brand/20 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
                    >
                      <span className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4 text-brand transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                        Administration
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] text-brand">Admin</span>
                        <ChevronRight className="h-4 w-4 text-brand/60" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                    </button>
                  )}

                  <Link
                    href="/parametres"
                    onClick={close}
                    className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
                  >
                    <Settings className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                    {t("accountMenu.settings")}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setPanel("langue")}
                    className="group flex w-full min-h-[44px] items-center justify-between gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
                  >
                    <span className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                      {t("accountMenu.language")}
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("theme")}
                    className="group flex w-full min-h-[44px] items-center justify-between gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
                  >
                    <span className="flex items-center gap-3">
                      <SunMedium className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                      {t("accountMenu.theme")}
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <Link
                    href="/aide"
                    onClick={close}
                    className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
                  >
                    <CircleHelp className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                    {t("accountMenu.help")}
                  </Link>
                </nav>
                <div className="border-t border-border py-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setLogoutOpen(true);
                    }}
                    className="group flex min-h-[44px] w-full items-center gap-3 px-4 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                  >
                    <LogOut className="h-4 w-4 transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                    {t("accountMenu.logout")}
                  </button>
                </div>
              </>
            ) : panel === "admin" ? (
              // SOUS-MENU ADMIN - TOUS LES LIENS
              <div>
                <button
                  type="button"
                  onClick={() => setPanel("root")}
                  className="flex min-h-[44px] w-full items-center gap-2 border-b border-border px-3 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Administration
                </button>
                <div className="py-1.5">
                  {ADMIN_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className={`flex min-h-[44px] items-center gap-3 px-4 text-sm transition-colors ${
                          isActive
                            ? "bg-brand-soft text-brand font-semibold"
                            : "text-ink hover:bg-brand-soft"
                        }`}
                      >
                        <item.icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Panneau Langue ou Thème
              <div>
                <button
                  type="button"
                  onClick={() => setPanel("root")}
                  className="flex min-h-[44px] w-full items-center gap-2 border-b border-border px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  {panel === "langue" ? t("accountMenu.language") : t("accountMenu.theme")}
                </button>
                <div className="py-1.5">
                  {panel === "langue" && (["fr", "en"] as Locale[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="menuitemradio"
                      aria-checked={locale === option}
                      onClick={() => {
                        setLocale(option);
                        close();
                      }}
                      className="flex min-h-[44px] w-full items-center justify-between gap-3 px-4 text-left text-sm text-ink transition-colors hover:bg-brand-soft"
                    >
                      <span>{t(option === "fr" ? "accountMenu.languageFrench" : "accountMenu.languageEnglish")}</span>
                      {locale === option && <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />}
                    </button>
                  ))}
                  {panel === "theme" && (["light", "dark", "system"] as Theme[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="menuitemradio"
                      aria-checked={theme === option}
                      onClick={() => {
                        setTheme(option);
                        close();
                      }}
                      className="flex min-h-[44px] w-full items-center justify-between gap-3 px-4 text-left text-sm text-ink transition-colors hover:bg-brand-soft"
                    >
                      <span>{t(`accountMenu.theme${option === "light" ? "Light" : option === "dark" ? "Dark" : "System"}`)}</span>
                      {theme === option && <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}