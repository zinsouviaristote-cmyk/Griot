"use client";

import { useMemo, useState } from "react";
import { Music4, Search, X } from "lucide-react";
import { SongListItem } from "@/components/dashboard/library/SongListItem";
import { LibraryFiltersPanel } from "@/components/dashboard/library/LibraryFiltersPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedEntryForSong } from "@/lib/data/mock-explorer";
import { songsToQueue } from "@/lib/player/songToTrack";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Song, SongStatus } from "@/lib/types";

type Shortcut = "toutes" | "publiees" | "telechargees";
type SortMode = "recentes" | "anciennes" | "ecoutees";

const SHORTCUTS: { key: Shortcut; labelKey: string }[] = [
  { key: "toutes", labelKey: "library.shortcuts.all" },
  { key: "publiees", labelKey: "library.shortcuts.published" },
  { key: "telechargees", labelKey: "library.shortcuts.downloaded" },
];

const SORT_LABEL_KEYS: Record<SortMode, string> = {
  recentes: "library.sort.recent",
  anciennes: "library.sort.oldest",
  ecoutees: "library.sort.mostListened",
};

export function LibraryView({ songs }: { songs: Song[] }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [shortcut, setShortcut] = useState<Shortcut>("toutes");
  const [statusFilters, setStatusFilters] = useState<Set<SongStatus>>(new Set());
  const [sort, setSort] = useState<SortMode>("recentes");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = songs.filter((song) => {
      const matchesSearch = !query || song.recipientFirstName.toLowerCase().includes(query);
      const matchesStatus = statusFilters.size === 0 || statusFilters.has(song.status);
      const matchesShortcut =
        shortcut === "toutes" ||
        (shortcut === "publiees" && !!getPublishedEntryForSong(song.id)) ||
        (shortcut === "telechargees" && (song.status === "paid" || song.status === "delivered"));
      return matchesSearch && matchesStatus && matchesShortcut;
    });
    return [...result].sort((a, b) => {
      if (sort === "ecoutees") return b.listens - a.listens;
      const delta = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "anciennes" ? -delta : delta;
    });
  }, [songs, search, statusFilters, shortcut, sort]);

  const hasAnySongs = songs.length > 0;
  const hasResults = filtered.length > 0;
  const isFiltering = statusFilters.size > 0 || shortcut !== "toutes" || search.trim() !== "";
  const queue = useMemo(() => songsToQueue(filtered, t), [filtered, t]);

  if (!hasAnySongs) {
    return (
      <EmptyState
        icon={Music4}
        title={t("library.emptyLibrary.title")}
        description={t("library.emptyLibrary.description")}
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
          placeholder={t("library.searchPlaceholder")}
          aria-label={t("library.searchAriaLabel")}
          className="min-h-11 w-full rounded-control border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 focus:border-brand focus:outline-none focus:shadow-ring-focus"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LibraryFiltersPanel active={statusFilters} onChange={setStatusFilters} />

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          aria-label={t("library.sortAriaLabel")}
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
            <SongListItem key={song.id} song={song} index={index} queue={queue} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-ink-muted">{t("library.noResults.message")}</p>
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
              {t("library.noResults.resetFilters")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
