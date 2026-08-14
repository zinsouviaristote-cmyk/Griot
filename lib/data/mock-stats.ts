import { getSongById } from "@/lib/data/mock-dashboard";
import { getMyPublishedSongs, getPublicDisplayName } from "@/lib/data/mock-explorer";
import type { Locale } from "@/lib/i18n/locale";
import type { Song } from "@/lib/types";

// Repli quand la chanson source n'est plus retrouvable (ne devrait pas arriver
// pour les publications "mine", gardé pour la robustesse du calcul).
const AVERAGE_SONG_SECONDS = 150;

export interface MyStatsTotals {
  listens: number;
  likes: number;
  downloads: number;
  listeningSeconds: number;
  publishedCount: number;
}

// Le temps d'écoute cumulé est une estimation (durée de la chanson × ses
// écoutes) — Griot ne mesure jamais combien de temps un lecteur a réellement
// gardé le doigt sur play, seulement combien de fois la piste a démarré.
export function getMyStatsTotals(): MyStatsTotals {
  const published = getMyPublishedSongs();
  return published.reduce<MyStatsTotals>(
    (totals, entry) => {
      const durationSeconds =
        (entry.sourceSongId && getSongById(entry.sourceSongId)?.durationSeconds) || AVERAGE_SONG_SECONDS;
      return {
        listens: totals.listens + entry.listens,
        likes: totals.likes + entry.likes,
        downloads: totals.downloads + entry.downloads,
        listeningSeconds: totals.listeningSeconds + durationSeconds * entry.listens,
        publishedCount: totals.publishedCount + 1,
      };
    },
    { listens: 0, likes: 0, downloads: 0, listeningSeconds: 0, publishedCount: 0 },
  );
}

// Les lignes réutilisées de la bibliothèque (voir SongListItem) affichent
// `song.listens`, le compteur privé — jamais celui, public, de la publication
// (déjà le cas dans Mes publications). Trier sur ce même nombre garde l'ordre
// visible cohérent avec ce que chaque ligne affiche réellement.
export function getMyPopularSongs(): Song[] {
  const songs = getMyPublishedSongs()
    .map((entry) => (entry.sourceSongId ? getSongById(entry.sourceSongId) : undefined))
    .filter((song): song is Song => song !== undefined);
  return [...songs].sort((a, b) => b.listens - a.listens);
}

export interface ListenPoint {
  // "YYYY-MM-DD" — utilisé par l'infobulle du graphique, jamais recalculé
  // depuis `label` (qui, lui, est déjà abrégé et perd l'année).
  date: string;
  label: string;
  count: number;
}

export const STATS_PERIODS = [7, 30, 90] as const;
export type StatsPeriod = (typeof STATS_PERIODS)[number];

const WEEKDAY_FORMATTERS: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }),
  en: new Intl.DateTimeFormat("en-US", { weekday: "short" }),
};
const DAY_MONTH_FORMATTERS: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }),
  en: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }),
};
const FULL_DATE_FORMATTERS: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }),
  en: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long" }),
};

// Part de la période dans le cumul total — plus la période est longue, plus
// elle en couvre une large fraction (90 jours capture presque tout l'historique
// d'une chanson récente, 7 jours n'en capture qu'un éclat).
const PERIOD_SHARE_OF_LIFETIME: Record<StatsPeriod, number> = { 7: 0.12, 30: 0.4, 90: 0.75 };

// Forme déterministe (jamais Math.random) mais jamais plate non plus : une
// oscillation douce + un pic net vers les deux tiers de la période + un creux
// net vers le premier tiers — le plancher garantit qu'aucun jour ne tombe à
// zéro, seule promesse qui compte ici ("jamais une ligne droite ni des
// valeurs à zéro").
function shareForDay(dayIndex: number, totalDays: number): number {
  const wave = 0.55 + 0.35 * Math.sin((dayIndex / totalDays) * Math.PI * 2.3 + 0.6);
  const peakBoost = Math.exp(-(((dayIndex - totalDays * 0.68) / (totalDays * 0.06)) ** 2)) * 0.9;
  const dip = Math.exp(-(((dayIndex - totalDays * 0.32) / (totalDays * 0.05)) ** 2)) * 0.45;
  return Math.max(0.12, wave + peakBoost - dip);
}

export function getListensSeries(period: StatsPeriod, locale: Locale = "fr"): ListenPoint[] {
  const { listens } = getMyStatsTotals();
  const pool = Math.round(listens * PERIOD_SHARE_OF_LIFETIME[period]);
  const shares = Array.from({ length: period }, (_, index) => shareForDay(index, period));
  const shareSum = shares.reduce((sum, share) => sum + share, 0);
  const today = new Date(2026, 7, 9); // 2026-08-09, la date de référence du produit
  const labelFormatter = period === 7 ? WEEKDAY_FORMATTERS[locale] : DAY_MONTH_FORMATTERS[locale];

  return shares.map((share, index) => {
    const daysAgo = period - 1 - index;
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return {
      date: date.toISOString().slice(0, 10),
      label: labelFormatter.format(date),
      count: pool > 0 ? Math.max(1, Math.round((share / shareSum) * pool)) : 0,
    };
  });
}

export function formatListenDate(isoDate: string, locale: Locale = "fr"): string {
  return FULL_DATE_FORMATTERS[locale].format(new Date(`${isoDate}T00:00:00`));
}

export interface ActivityEntry {
  id: string;
  type: "like" | "listen";
  displayName: string;
  minutesAgo: number;
}

// Gabarit déterministe d'événements espacés dans le temps, appliqué en boucle
// aux publications réelles — Griot ne retient jamais l'identité de qui a aimé
// ou écouté (voir LikeButton), seulement des compteurs agrégés : ces lignes
// racontent "quoi et quand", jamais "qui".
const ACTIVITY_PATTERN: { type: "like" | "listen"; minutesAgo: number }[] = [
  { type: "like", minutesAgo: 12 },
  { type: "listen", minutesAgo: 47 },
  { type: "listen", minutesAgo: 95 },
  { type: "like", minutesAgo: 260 },
  { type: "listen", minutesAgo: 430 },
  { type: "like", minutesAgo: 1_140 },
  { type: "listen", minutesAgo: 1_850 },
  { type: "like", minutesAgo: 4_200 },
];

export function getRecentActivity(t: (key: string) => string): ActivityEntry[] {
  const published = getMyPublishedSongs();
  if (published.length === 0) return [];
  return ACTIVITY_PATTERN.map((event, index) => ({
    id: `activity_${index}`,
    type: event.type,
    displayName: getPublicDisplayName(published[index % published.length], t),
    minutesAgo: event.minutesAgo,
  }));
}

export interface ReferralStats {
  pageOpens: number;
  songsCreated: number;
}

// Le seul indicateur qui parle de bouche-à-oreille plutôt que d'audience :
// combien de personnes ont ouvert une chanson partagée, et combien en ont créé
// une à leur tour. Aucune chanson publiée : aucun lien à ouvrir, aucune donnée
// à montrer.
export function getReferralStats(): ReferralStats {
  const { publishedCount } = getMyStatsTotals();
  if (publishedCount === 0) return { pageOpens: 0, songsCreated: 0 };
  return { pageOpens: 286, songsCreated: 9 };
}
