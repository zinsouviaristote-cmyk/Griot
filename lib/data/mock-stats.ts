import { getSongById } from "@/lib/data/mock-dashboard";
import { getMyPublishedSongs, getPublicDisplayName } from "@/lib/data/mock-explorer";
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

export interface WeeklyListenPoint {
  label: string;
  count: number;
}

// Répartition déterministe sur sept jours (jamais Math.random, voir mock-explorer.ts) —
// une forme irrégulière plutôt qu'une ligne plate, sans dépendre d'un historique
// jour par jour qui n'existe pas encore côté données. Somme des parts = 1.
const WEEKDAY_SHARE = [0.1, 0.16, 0.08, 0.2, 0.13, 0.21, 0.12];
const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });

// Une semaine ne pèse qu'une fraction du cumul accumulé depuis la publication
// (parfois plusieurs semaines plus tôt) — jamais la totalité de `listens`.
const WEEKLY_SHARE_OF_LIFETIME = 0.12;

export function getWeeklyListens(): WeeklyListenPoint[] {
  const { listens } = getMyStatsTotals();
  const weeklyPool = Math.round(listens * WEEKLY_SHARE_OF_LIFETIME);
  const today = new Date();
  return WEEKDAY_SHARE.map((share, index) => {
    const daysAgo = 6 - index;
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return {
      label: WEEKDAY_FORMATTER.format(date),
      count: Math.round(weeklyPool * share),
    };
  });
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

export function getRecentActivity(): ActivityEntry[] {
  const published = getMyPublishedSongs();
  if (published.length === 0) return [];
  return ACTIVITY_PATTERN.map((event, index) => ({
    id: `activity_${index}`,
    type: event.type,
    displayName: getPublicDisplayName(published[index % published.length]),
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
