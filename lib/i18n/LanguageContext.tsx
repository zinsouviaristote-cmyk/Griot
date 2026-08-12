"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, getStoredOrDetectedLocale, LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/locale";
import { fr } from "@/lib/i18n/dictionaries/fr";
import { en } from "@/lib/i18n/dictionaries/en";

const DICTIONARIES = { fr, en };

type PluralCategory = "one" | "other";

function getByPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

// Le français compte 0 comme singulier ("0 chanson") ; l'anglais le compte
// comme pluriel ("0 songs") — la seule différence entre les deux langues pour
// ce produit, qui n'a besoin que de deux catégories, jamais des règles
// complètes d'Intl.PluralRules.
function pluralCategory(locale: Locale, count: number): PluralCategory {
  if (locale === "fr") return Math.abs(count) <= 1 ? "one" : "other";
  return count === 1 ? "one" : "other";
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tn: (key: string, count: number, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Détection et persistance ne peuvent s'exécuter qu'après montage (ni
// localStorage ni navigator.language n'existent côté serveur) : le premier
// rendu est toujours en français, identique entre serveur et client, ajusté
// juste après — même principe que la restauration du tunnel (TunnelContext).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(getStoredOrDetectedLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Le choix reste actif pour la session en cours même si la persistance échoue.
    }
  }

  const value = useMemo<LanguageContextValue>(() => {
    const dict = DICTIONARIES[locale];
    function t(key: string, vars?: Record<string, string | number>): string {
      const found = getByPath(dict, key);
      if (typeof found !== "string") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] clé manquante : "${key}" (${locale})`);
        }
        return key;
      }
      return interpolate(found, vars);
    }
    function tn(key: string, count: number, vars?: Record<string, string | number>): string {
      const category = pluralCategory(locale, count);
      return t(`${key}.${category}`, { count, ...vars });
    }
    return { locale, setLocale, t, tn };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage doit être appelé sous LanguageProvider");
  return ctx;
}
