import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/locale";
import type { ListenPoint } from "@/lib/types";

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

export function formatListenDate(isoDate: string, locale: Locale = "fr"): string {
  return FULL_DATE_FORMATTERS[locale].format(new Date(`${isoDate}T00:00:00`));
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Série réelle des écoutes des publications de l'utilisateur, groupées par
// jour sur la période demandée — jamais une courbe simulée : un jour sans
// écoute vaut 0, pas un plancher artificiel.
export async function fetchListensSeries(
  publishedSongIds: string[],
  period: StatsPeriod,
  locale: Locale = "fr",
): Promise<ListenPoint[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const labelFormatter = period === 7 ? WEEKDAY_FORMATTERS[locale] : DAY_MONTH_FORMATTERS[locale];

  const days: { date: Date; iso: string }[] = Array.from({ length: period }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (period - 1 - index));
    return { date, iso: isoDay(date) };
  });

  if (publishedSongIds.length === 0) {
    return days.map(({ date, iso }) => ({ date: iso, label: labelFormatter.format(date), count: 0 }));
  }

  const since = days[0].date;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("song_listens_log")
    .select("created_at")
    .in("published_song_id", publishedSongIds)
    .gte("created_at", since.toISOString());

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of (data as unknown as { created_at: string }[] | null) ?? []) {
    const day = row.created_at.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  return days.map(({ date, iso }) => ({ date: iso, label: labelFormatter.format(date), count: counts.get(iso) ?? 0 }));
}

export interface RawActivityEvent {
  id: string;
  type: "like" | "listen";
  publishedSongId: string;
  createdAt: string;
}

// Derniers événements (likes + écoutes) sur les publications de l'utilisateur —
// jamais l'identité de qui a aimé ou écouté, seulement quoi et quand (voir
// LikeButton : aucune trace d'identité n'est exposée côté client au-delà de
// "moi-même").
export async function fetchRecentActivityEvents(publishedSongIds: string[], limit = 10): Promise<RawActivityEvent[]> {
  if (publishedSongIds.length === 0) return [];
  const supabase = createClient();

  const [likesResult, listensResult] = await Promise.all([
    supabase
      .from("song_likes")
      .select("id, published_song_id, created_at")
      .in("published_song_id", publishedSongIds)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("song_listens_log")
      .select("id, published_song_id, created_at")
      .in("published_song_id", publishedSongIds)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (likesResult.error) throw likesResult.error;
  if (listensResult.error) throw listensResult.error;

  type Row = { id: string; published_song_id: string; created_at: string };
  const events: RawActivityEvent[] = [
    ...((likesResult.data as unknown as Row[] | null) ?? []).map((row) => ({
      id: row.id,
      type: "like" as const,
      publishedSongId: row.published_song_id,
      createdAt: row.created_at,
    })),
    ...((listensResult.data as unknown as Row[] | null) ?? []).map((row) => ({
      id: row.id,
      type: "listen" as const,
      publishedSongId: row.published_song_id,
      createdAt: row.created_at,
    })),
  ];

  events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return events.slice(0, limit);
}
