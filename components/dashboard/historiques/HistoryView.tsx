"use client";

import { useMemo, useState } from "react";
import { Music4, Search, X } from "lucide-react";
import { SongListItem } from "@/components/dashboard/historiques/SongListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { songsToQueue } from "@/lib/player/songToTrack";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PublishedSong, Song, SongStatus } from "@/lib/types";
import { HistoryFiltersPanel } from "./HistoryFiltersPanel";

type Shortcut = "toutes" | "publiees" | "telechargees";
type SortMode = "recentes" | "anciennes" | "ecoutees";

const SHORTCUTS: { key: Shortcut; labelKey: string }[] = [
  { key: "toutes", labelKey: "history.shortcuts.all" },
  { key: "publiees", labelKey: "history.shortcuts.published" },
  { key: "telechargees", labelKey: "history.shortcuts.downloaded" },
];

const SORT_LABEL_KEYS: Record<SortMode, string> = {
  recentes: "history.sort.recent",
  anciennes: "history.sort.oldest",
  ecoutees: "history.sort.mostListened",
};

export function HistoryView({
  songs,
  publishedSongs,
  onPublishedSongsChange,
  onSongDeleted,
  initialSearch = "",
}: {
  songs: Song[];
  publishedSongs: PublishedSong[];
  onPublishedSongsChange: (next: PublishedSong[]) => void;
  onSongDeleted: (songId: string) => void;
  initialSearch?: string;
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState(initialSearch);
  const [shortcut, setShortcut] = useState<Shortcut>("toutes");
  const [statusFilters, setStatusFilters] = useState<Set<SongStatus>>(new Set());
  const [sort, setSort] = useState<SortMode>("recentes");

  const isPublished = (songId: string) => publishedSongs.some((entry) => entry.sourceSongId === songId);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = songs.filter((song) => {
      const matchesSearch = !query || song.recipientFirstName.toLowerCase().includes(query);
      const matchesStatus = statusFilters.size === 0 || statusFilters.has(song.status);
      const matchesShortcut =
        shortcut === "toutes" ||
        (shortcut === "publiees" && isPublished(song.id)) ||
        (shortcut === "telechargees" &&
          (song.status === "preview_ready" ||
            song.status === "awaiting_payment" ||
            song.status === "paid" ||
            song.status === "delivered"));
      return matchesSearch && matchesStatus && matchesShortcut;
    });
    return [...result].sort((a, b) => {
      if (sort === "ecoutees") return b.listens - a.listens;
      const delta = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "anciennes" ? -delta : delta;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, search, statusFilters, shortcut, sort, publishedSongs]);

  const hasAnySongs = songs.length > 0;
  const hasResults = filtered.length > 0;
  const isFiltering = statusFilters.size > 0 || shortcut !== "toutes" || search.trim() !== "";
  const queue = useMemo(() => songsToQueue(filtered, t, publishedSongs), [filtered, t, publishedSongs]);

  function handlePublishedChange(song: Song, entry: PublishedSong | null) {
    const withoutThisSong = publishedSongs.filter((item) => item.sourceSongId !== song.id);
    onPublishedSongsChange(entry ? [...withoutThisSong, entry] : withoutThisSong);
  }

  if (!hasAnySongs) {
    return (
      <EmptyState
        icon={Music4}
        title={t("history.emptyHistory.title")}
        description={t("history.emptyHistory.description")}
        actionLabel={t("dashboard.primaryAction.createFirstSong")}
        actionHref="/creer"
      />
    );
  }

  return (
    <div>
      <label className="group relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-muted transition-colors duration-200 group-focus-within:text-brand"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("history.searchPlaceholder")}
          aria-label={t("history.searchAriaLabel")}
          className="min-h-11 w-full rounded-control border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 focus:border-brand focus:outline-none focus:shadow-ring-focus"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <HistoryFiltersPanel active={statusFilters} onChange={setStatusFilters} />

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          aria-label={t("history.sortAriaLabel")}
          className="min-h-11 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:shadow-ring-focus"
        >
          {(Object.keys(SORT_LABEL_KEYS) as SortMode[]).map((key) => (
            <option key={key} value={key}>
              {t(SORT_LABEL_KEYS[key])}
            </option>
          ))}
        </select>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        {SHORTCUTS.map(({ key, labelKey }) => (
          <button
            key={key}
            type="button"
            onClick={() => setShortcut(key)}
            aria-pressed={shortcut === key}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
              shortcut === key
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {hasResults ? (
        <div className="mt-5 flex flex-col gap-3">
          {filtered.map((song, index) => (
            <SongListItem
              key={song.id}
              song={song}
              publishedEntry={publishedSongs.find((entry) => entry.sourceSongId === song.id) ?? null}
              index={index}
              queue={queue}
              onPublishedChange={(entry) => handlePublishedChange(song, entry)}
              onDeleted={onSongDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-ink-muted">{t("history.noResults.message")}</p>
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setStatusFilters(new Set());
                setShortcut("toutes");
                setSearch("");
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {t("history.noResults.resetFilters")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
