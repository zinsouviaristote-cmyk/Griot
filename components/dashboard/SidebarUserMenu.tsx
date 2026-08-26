"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Globe,
  LogOut,
  MoreHorizontal,
  SunMedium,
  User,
  ShieldCheck,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/i18n/ThemeContext";
import type { Locale } from "@/lib/i18n/locale";

type Panel = "root" | "langue" | "theme";

const ADMIN_EMAIL = "zinsouviaristote@gmail.com";

interface OptionRow {
  key: string;
  label: string;
  active: boolean;
  soon?: boolean;
  onSelect?: () => void;
}

function OptionList({ options }: { options: OptionRow[] }) {
  return (
    <div className="py-1.5">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          role="menuitemradio"
          aria-checked={option.active}
          disabled={option.soon}
          onClick={option.onSelect}
          className={`flex min-h-[44px] w-full items-center justify-between gap-3 px-4 text-left text-sm transition-colors ${
            option.soon ? "cursor-not-allowed text-ink-muted/50" : "text-ink hover:bg-page"
          }`}
        >
          <span className="flex items-center gap-2">
            {option.label}
            {option.soon && <SoonBadge />}
          </span>
          {option.active && <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

function SoonBadge() {
  const { t } = useLanguage();
  return <span className="text-label-sm text-ink-muted/60">({t("accountMenu.comingSoon")})</span>;
}

export function SidebarUserMenu({
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
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("root");
  const containerRef = useRef<HTMLDivElement>(null);
  const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL;

  const languageOptions: OptionRow[] = [
    {
      key: "fr",
      label: t("accountMenu.languageFrench"),
      active: locale === "fr",
      onSelect: () => setLocale("fr" as Locale),
    },
    {
      key: "en",
      label: t("accountMenu.languageEnglish"),
      active: locale === "en",
      onSelect: () => setLocale("en" as Locale),
    },
  ];

  const themeOptions: OptionRow[] = [
    { key: "light", label: t("accountMenu.themeLight"), active: theme === "light", onSelect: () => setTheme("light") },
    { key: "dark", label: t("accountMenu.themeDark"), active: theme === "dark", onSelect: () => setTheme("dark") },
    { key: "system", label: t("accountMenu.themeSystem"), active: theme === "system", onSelect: () => setTheme("system") },
  ];

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setPanel("root");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-full items-center gap-2.5 rounded-control px-2 py-2 text-left transition-colors duration-150 hover:bg-page"
      >
        <Avatar initials={initials} avatarUrl={avatarUrl} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">{name}</span>
          <span className="block truncate text-xs text-ink-muted">{email}</span>
        </span>
        <MoreHorizontal className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={
            panel === "root"
              ? t("accountMenu.rootLabel")
              : panel === "langue"
                ? t("accountMenu.languageAriaLabel")
                : t("accountMenu.themeAriaLabel")
          }
          className="absolute inset-x-0 bottom-full z-50 mb-2 animate-pop-in overflow-hidden rounded-card border border-border bg-surface shadow-card-hover"
        >
          {panel === "root" && (
            <div className="py-1.5">
              <Link
                href="/parametres"
                onClick={close}
                role="menuitem"
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-page"
              >
                <User className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                {t("accountMenu.account")}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={close}
                  role="menuitem"
                  className="flex min-h-[44px] items-center gap-3 px-4 text-sm font-semibold text-brand transition-colors hover:bg-page"
                >
                  <ShieldCheck className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
                  Administration
                </Link>
              )}
              <button
                type="button"
                onClick={() => setPanel("langue")}
                role="menuitem"
                className="flex w-full min-h-[44px] items-center justify-between gap-3 px-4 text-sm text-ink transition-colors hover:bg-page"
              >
                <span className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                  {t("accountMenu.language")}
                </span>
                <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPanel("theme")}
                role="menuitem"
                className="flex w-full min-h-[44px] items-center justify-between gap-3 px-4 text-sm text-ink transition-colors hover:bg-page"
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
                role="menuitem"
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-page"
              >
                <CircleHelp className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                {t("accountMenu.help")}
              </Link>
              <div className="border-t border-border pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    setLogoutOpen(true);
                  }}
                  role="menuitem"
                  className="flex min-h-[44px] w-full items-center gap-3 px-4 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  {t("accountMenu.logout")}
                </button>
              </div>
            </div>
          )}

          {panel !== "root" && (
            <div>
              <button
                type="button"
                onClick={() => setPanel("root")}
                className="flex min-h-[44px] w-full items-center gap-2 border-b border-border px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {panel === "langue" ? t("accountMenu.language") : t("accountMenu.theme")}
              </button>
              <OptionList options={panel === "langue" ? languageOptions : themeOptions} />
            </div>
          )}
        </div>
      )}
      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}