"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Globe } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Locale } from "@/lib/i18n/locale";

const LINKS = [
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#questions", label: "Questions" },
];

// Même mécanique et mêmes classes que le sélecteur de langue de la sidebar
// (voir SidebarUserMenu) — juste sans le sous-menu imbriqué, un seul niveau
// suffit ici. Masqué sous sm comme "Se connecter" : la pilule mobile reste
// compacte, seul "Commencer" y est indispensable.
function LanguageSwitcher() {
  const { t, locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("accountMenu.languageAriaLabel")}
        className="flex min-h-11 items-center gap-1.5 rounded-control px-3 text-sm font-medium text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 hover:text-ink"
      >
        <Globe className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        {locale.toUpperCase()}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("accountMenu.languageAriaLabel")}
          className="absolute left-0 top-full z-50 mt-2 w-40 origin-top-left animate-pop-in overflow-hidden rounded-card border border-border bg-surface shadow-card-hover"
        >
          <div className="py-1.5">
            {(["fr", "en"] as Locale[]).map((option) => (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={locale === option}
                onClick={() => {
                  setLocale(option);
                  setOpen(false);
                }}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <span>{t(option === "fr" ? "accountMenu.languageFrench" : "accountMenu.languageEnglish")}</span>
                {locale === option && <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Transparente en haut de page, devient une pilule blanche flottante et
// recentrée dès qu'on défile — jamais de fond opaque plein écran, qui
// pèserait visuellement sur le héros avant même d'avoir défilé.
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 transition-all duration-300 ease-magnetic">
      <nav
        className={`flex w-full items-center justify-between gap-4 rounded-control transition-all duration-300 ease-magnetic ${
          scrolled
            ? "max-w-3xl bg-surface px-4 py-2.5 shadow-card border border-border"
            : "max-w-shell bg-transparent px-2 py-2 border border-transparent"
        }`}
      >
        <Link href="/" className="inline-block shrink-0 transition-transform duration-200 ease-magnetic hover:scale-[1.03]">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-6 sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/connexion"
            className="hidden min-h-11 items-center rounded-control px-3.5 text-sm font-medium text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 hover:text-ink sm:inline-flex"
          >
            Se connecter
          </Link>
          <Link
            href="/creer"
            className="flex min-h-11 items-center rounded-control bg-brand px-4 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:brightness-90 active:scale-[0.98]"
          >
            Commencer
          </Link>
        </div>
      </nav>
    </div>
  );
}
