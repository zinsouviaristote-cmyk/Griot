export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "en";
}

export const LOCALE_STORAGE_KEY = "griot:locale";

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const lower = candidate.toLowerCase();
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("fr")) return "fr";
  }
  return DEFAULT_LOCALE;
}

// Lecture synchrone (stockage puis navigateur) utilisée à la fois par
// LanguageProvider (état de l'interface) et par TunnelProvider (langue de
// chanson par défaut) — un seul endroit pour cette logique, jamais deux
// implémentations qui pourraient diverger. `undefined` côté serveur (aucune
// des deux sources n'existe) : l'appelant retombe alors sur DEFAULT_LOCALE.
export function getStoredOrDetectedLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    // Stockage indisponible (navigation privée, quota) — on retombe sur la
    // détection du navigateur.
  }
  return isLocale(stored) ? stored : detectBrowserLocale();
}

// Un nœud de dictionnaire est soit une chaîne terminale, soit un espace de noms
// imbriqué — jamais un tableau ou une autre forme, pour que `getByPath` et le
// typage `DeepDictionary` restent simples.
export type DictionaryNode = string | { [key: string]: DictionaryNode };

// Force le dictionnaire anglais à porter exactement les mêmes clés que le
// français, à toute profondeur — une clé manquante ou en trop côté en.ts
// devient une erreur TypeScript à la compilation, jamais une chaîne qui
// s'affiche telle quelle en production.
export type DeepDictionary<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepDictionary<T[K]>;
};
