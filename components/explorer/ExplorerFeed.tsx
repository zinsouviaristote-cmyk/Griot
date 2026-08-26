"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FeedScreen } from "@/components/explorer/FeedScreen";
import { FeedFiltersPanel } from "@/components/explorer/FeedFiltersPanel";
import { usePlayer, type PlayerTrack } from "@/lib/player/PlayerContext";
import { getPublicDisplayName } from "@/lib/explorer/displayName";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { occasionLabel, styleLabel } from "@/lib/i18n/catalog";
import type { MusicStyle, Occasion, PublishedSong } from "@/lib/types";

// Défilement vertical, un morceau plein écran à la fois — le geste des
// applications de vidéo courte, jamais une grille passive. Le scroll-snap CSS
// gère le glissement au doigt et la molette nativement ; les flèches du
// clavier appellent la même navigation programmatique que les boutons
// précédent/suivant, pour rester en phase avec la lecture (voir goTo ci-dessous).
export function ExplorerFeed({ entries, likedIds }: { entries: PublishedSong[]; likedIds: Set<string> }) {
  const { t } = useLanguage();
  const player = usePlayer();
  const [occasionFilter, setOccasionFilter] = useState<Occasion | "toutes">("toutes");
  const [styleFilter, setStyleFilter] = useState<MusicStyle | "tous">("tous");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const result = entries.filter((entry) => {
      const matchesOccasion = occasionFilter === "toutes" || entry.occasion === occasionFilter;
      const matchesStyle = styleFilter === "tous" || entry.style === styleFilter;
      return matchesOccasion && matchesStyle;
    });
    return [...result].sort((a, b) => b.likes - a.likes);
  }, [entries, occasionFilter, styleFilter]);

  const queue: PlayerTrack[] = useMemo(
    () =>
      filtered.map((entry) => ({
        id: entry.id,
        title: getPublicDisplayName(entry, t),
        subtitle: `${occasionLabel(t, entry.occasion)} · ${styleLabel(t, entry.style)}`,
        occasion: entry.occasion,
        audioUrl: entry.audioUrl,
        publishedId: entry.id,
        likes: entry.likes,
        likedByMe: likedIds.has(entry.id),
        imageUrl: entry.imageUrl,
        origin: "explorer" as const,
      })),
    [filtered, t, likedIds],
  );

  const clampedIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

  const goTo = useCallback((nextIndex: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = Math.max(0, Math.min(nextIndex, container.children.length - 1));
    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    setActiveIndex(target);
    container.scrollTo({ top: target * container.clientHeight, behavior: "smooth" });
  }, []);

  // Remet la file à zéro dès qu'un filtre change — précédent/suivant ne
  // parcourent jamais que la sélection actuellement affichée.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: 0 });
    setActiveIndex(0);
  }, [occasionFilter, styleFilter]);

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;
    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    // Attend que le défilement se stabilise avant de considérer l'écran comme
    // "affiché" — sinon un geste rapide déclencherait la lecture de chaque
    // écran traversé en chemin, jamais seulement celui où le doigt s'arrête.
    scrollTimeoutRef.current = window.setTimeout(() => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      setActiveIndex(Math.max(0, Math.min(index, filtered.length - 1)));
    }, 130);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goTo(clampedIndex + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goTo(clampedIndex - 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo, clampedIndex]);

  // La lecture démarre sur le morceau affiché et s'arrête dès qu'on en change :
  // un seul effet, déclenché uniquement par un changement d'écran actif —
  // jamais par une simple pause manuelle sur l'écran déjà affiché.
  useEffect(() => {
    const entry = filtered[clampedIndex];
    if (!entry) return;
    if (player.current?.id === entry.id) return;
    const track = queue[clampedIndex];
    if (track) player.play(track, queue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedIndex, filtered]);

  // Suit le lecteur global quand IL change de piste sans passer par goTo — le
  // seul cas où ça arrive ici est la fin naturelle d'une piste, qui avance
  // d'elle-même à la suivante de la file (voir onEnded dans PlayerContext).
  // Sans ce filet, l'écran affiché resterait figé sur la chanson terminée
  // pendant qu'une autre joue déjà, plein écran étant censé montrer une seule
  // vérité à la fois.
  useEffect(() => {
    const currentId = player.current?.id;
    if (!currentId) return;
    const index = filtered.findIndex((entry) => entry.id === currentId);
    if (index !== -1 && index !== clampedIndex) goTo(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.current?.id]);

  const remaining = Math.max(0, filtered.length - clampedIndex - 1);

  return (
    <div className="relative h-full w-full">
      {filtered.length > 0 ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          tabIndex={-1}
          className="h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth"
        >
          {filtered.map((entry, index) => (
            <FeedScreen
              key={entry.id}
              entry={entry}
              index={index}
              isFirst={index === 0}
              isLast={index === filtered.length - 1}
              isActive={index === clampedIndex}
              queue={queue}
              likedByMe={likedIds.has(entry.id)}
              onGoPrev={() => goTo(clampedIndex - 1)}
              onGoNext={() => goTo(clampedIndex + 1)}
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        // Aucune chanson publiée nulle part, distinct d'un filtre trop
        // restrictif ci-dessous — jamais le même message pour ces deux
        // situations, qui n'appellent pas la même action de l'utilisateur.
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm font-medium text-ink">{t("explorer.emptyFeed.title")}</p>
          <p className="text-sm text-ink-muted">{t("explorer.emptyFeed.description")}</p>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-ink-muted">{t("explorer.noResults")}</p>
          <button
            type="button"
            onClick={() => {
              setOccasionFilter("toutes");
              setStyleFilter("tous");
            }}
            className="text-sm font-medium text-brand hover:underline"
          >
            {t("explorer.resetFilters")}
          </button>
        </div>
      )}

      {/* Indicateur de position, discret, bord droit — jamais numéroté en gros :
          juste de quoi sentir sa place et ce qu'il reste à découvrir. */}
      {filtered.length > 1 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 lg:right-4"
        >
          {Array.from({ length: Math.min(filtered.length, 5) }).map((_, dot) => {
            const isCurrentDot =
              filtered.length <= 5 ? dot === clampedIndex : dot === Math.min(clampedIndex, 4);
            return (
              <span
                key={dot}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                  isCurrentDot ? "animate-breathe bg-brand" : "bg-ink-muted/25"
                }`}
              />
            );
          })}
          {remaining > 0 && <span className="mt-0.5 text-[10px] font-medium text-ink-muted">+{remaining}</span>}
        </div>
      )}

      {/* Seul point de création sur Explorer désormais : le "+" de la barre de
          navigation basse (voir BottomNav) — plus de bouton dupliqué ici, qui
          mangeait l'espace de la pochette pour une action déjà accessible
          partout ailleurs dans l'app. */}
      <div className="pointer-events-none absolute left-4 top-3 z-10 flex items-center gap-2 lg:top-5">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-label={t("explorer.filterAriaLabel")}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-ink-muted shadow-card transition-transform duration-150 ease-magnetic hover:scale-105 hover:text-ink active:scale-95"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <FeedFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        occasionFilter={occasionFilter}
        onOccasionChange={setOccasionFilter}
        styleFilter={styleFilter}
        onStyleChange={setStyleFilter}
        resultCount={filtered.length}
      />
    </div>
  );
}
