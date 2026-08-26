"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Remplace l'ancienne barre pleine largeur : la bibliothèque a déjà sa propre
// recherche, celle-ci ne sert qu'à retrouver une chanson depuis n'importe quel
// écran, sans lui réserver toute la largeur du haut sur chaque page.
export function HeaderSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  function submitSearch() {
    const value = query.trim();
    if (!value) return;
    const target = pathname.startsWith("/admin") ? "/admin/chansons" : "/historiques";
    router.push(`${target}?recherche=${encodeURIComponent(value)}`);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      {open ? (
        <label className="flex animate-field-in items-center gap-2 rounded-control border border-brand/50 bg-surface py-2 pl-3.5 pr-2 shadow-ring-focus">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder={t("dashboard.search.placeholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitSearch();
            }}
            className="w-52 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("dashboard.search.close")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-page hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </label>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("dashboard.search.open")}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-all duration-150 ease-magnetic hover:bg-page active:scale-90"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
