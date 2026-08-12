"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw, Sparkles, TriangleAlert } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { mockGenerateLyrics } from "@/lib/tunnel/mockAdapters";
import { isTagLine } from "@/lib/tunnel/lyricsEngine";
import { REFORMULATE_COUNTER_THRESHOLD, REFORMULATE_LIMIT } from "@/lib/tunnel/types";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useMobilePlayerBarVisible } from "@/lib/player/useMobilePlayerBarVisible";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Locale } from "@/lib/i18n/locale";

function linesFromDraft(draft: string): string[] {
  return draft.split("\n");
}

// Le prénom est ce que la chanson va réellement chanter — le surligner
// partout où il apparaît est ce qui rend une faute d'orthographe visible
// avant l'essai audio, pas après.
function renderHighlighted(line: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) return line;
  const escaped = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = line.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === trimmedName.toLowerCase() ? (
      <mark key={index} className="rounded bg-brand-soft px-0.5 text-brand">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function LyricsStep() {
  const { t } = useLanguage();
  const { data, update, goNext } = useTunnel();
  const playerBarVisible = useMobilePlayerBarVisible();
  const [lines, setLines] = useState<string[]>(() => (data.lyricsDraft ? linesFromDraft(data.lyricsDraft) : []));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(data.lyricsDraft === null);
  const [reformulating, setReformulating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const seedRef = useRef(0);

  const lyricsInput = {
    storyMode: data.storyMode,
    story: data.story,
    recipientFirstName: data.recipientFirstName,
    relationship: data.relationship,
    occasion: data.occasion ?? "anniversaire",
  };

  useEffect(() => {
    if (data.lyricsDraft !== null) return;
    let cancelled = false;
    mockGenerateLyrics(lyricsInput, seedRef.current, data.songLanguage).then((text) => {
      if (cancelled) return;
      update({ lyricsDraft: text });
      setLines(linesFromDraft(text));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Changer la langue de la chanson régénère les paroles : le vocabulaire du
  // moteur (voir lyricsEngine.ts) est propre à chaque langue, un simple
  // changement d'étiquette ne suffirait pas en mode "raconte". Désactivé
  // pendant un chargement ou une reformulation déjà en cours, pour ne jamais
  // empiler deux générations concurrentes.
  async function handleSongLanguageChange(nextLanguage: Locale) {
    if (nextLanguage === data.songLanguage || loading || reformulating) return;
    update({ songLanguage: nextLanguage });
    setReformulating(true);
    const text = await mockGenerateLyrics(lyricsInput, seedRef.current, nextLanguage);
    update({ lyricsDraft: text });
    setLines(linesFromDraft(text));
    setReformulating(false);
  }

  // Fait remonter la ligne éditée au-dessus du clavier virtuel — sur un
  // écran de 360px, un champ en bas de liste se retrouve sinon masqué dès
  // que le clavier s'ouvre. Un second écouteur est nécessaire : le clavier
  // peut apparaître (`visualViewport` se redimensionne) *après* que le champ
  // a déjà le focus — un simple effet sur `editingIndex` ne se redéclenche
  // pas dans ce cas, puisque l'index de la ligne éditée n'a pas changé.
  useEffect(() => {
    if (editingIndex === null) return;
    // Le passage bouton → input change l'élément monté : sans focus() explicite,
    // rien ne reçoit jamais le focus clavier, et le clavier virtuel du mobile
    // ne s'ouvre tout simplement pas.
    inputRef.current?.focus();
    const scrollIntoView = () => inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    scrollIntoView();
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", scrollIntoView);
    return () => viewport?.removeEventListener("resize", scrollIntoView);
  }, [editingIndex]);

  function updateLine(index: number, value: string) {
    setLines((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  function handleBlurLine(nextLines: string[]) {
    setEditingIndex(null);
    update({ lyricsDraft: nextLines.join("\n") });
  }

  async function handleReformulate() {
    if (reformulateDisabled) return;
    setReformulating(true);
    seedRef.current += 1;
    const text = await mockGenerateLyrics(lyricsInput, seedRef.current, data.songLanguage);
    const nextCount = data.reformulateCount + 1;
    update({ lyricsDraft: text, reformulateCount: nextCount });
    setLines(linesFromDraft(text));
    setReformulating(false);
  }

  function handleContinue() {
    update({ lyricsDraft: lines.join("\n") });
    goNext();
  }

  const isStructured = data.storyMode === "paroles_structurees";
  const reformulateDisabled =
    isStructured || data.reformulateCount >= REFORMULATE_LIMIT || reformulating || loading;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
          <Sparkles className="h-6 w-6 animate-breathe text-brand" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">{t("tunnel.lyrics.loading")}</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SectionTitle as="h1" size="lg">
            {t("tunnel.lyrics.title")}
          </SectionTitle>
          <p className="mt-2 text-body-md text-ink-muted">{t("tunnel.lyrics.subtitle")}</p>
        </div>

        {/* Langue de la chanson, distincte de la langue de l'interface — voir
            handleSongLanguageChange, qui régénère les paroles avec le
            vocabulaire de la langue choisie. */}
        <div
          role="tablist"
          aria-label={t("tunnel.lyrics.songLanguageLabel")}
          className="inline-flex shrink-0 rounded-full border border-border bg-page p-1"
        >
          {(["fr", "en"] as Locale[]).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={data.songLanguage === option}
              onClick={() => handleSongLanguageChange(option)}
              disabled={loading || reformulating}
              className={`min-h-9 rounded-full px-3 text-xs font-medium transition-all duration-150 ease-magnetic disabled:cursor-not-allowed disabled:opacity-60 ${
                data.songLanguage === option ? "bg-brand text-white shadow-card" : "text-ink-muted hover:text-ink"
              }`}
            >
              {t(option === "fr" ? "tunnel.lyrics.songLanguageFrench" : "tunnel.lyrics.songLanguageEnglish")}
            </button>
          ))}
        </div>
      </div>

      {data.recipientFirstName.trim() && (
        <p className="mt-4 flex items-start gap-2 rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-ink">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
          <span>
            {t("tunnel.lyrics.spellingWarningBefore")}
            <mark className="rounded bg-brand-soft px-0.5 text-brand">{data.recipientFirstName}</mark>
            {t("tunnel.lyrics.spellingWarningAfter")}
          </span>
        </p>
      )}

      <div className="mt-4 rounded-feature border border-border bg-surface p-5 shadow-card">
        {lines.map((line, index) => {
          if (isTagLine(line)) {
            return (
              <div key={index} className="mt-7 border-t border-border pt-5 first:mt-0 first:border-t-0 first:pt-0">
                <span className="inline-block rounded-full bg-brand-soft px-2.5 py-1 text-label-sm font-semibold uppercase tracking-wide text-brand">
                  {line.replace(/[[\]]/g, "")}
                </span>
              </div>
            );
          }
          if (!line.trim()) return <div key={index} className="h-3" aria-hidden="true" />;
          const isEditing = editingIndex === index;
          return isEditing ? (
            <input
              key={index}
              ref={inputRef}
              value={line}
              onChange={(event) => updateLine(index, event.target.value)}
              onBlur={(event) => handleBlurLine(lines.map((l, i) => (i === index ? event.target.value : l)))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  (event.target as HTMLInputElement).blur();
                }
              }}
              className="mt-2.5 block min-h-12 w-full rounded-control border border-brand bg-page px-3 text-base text-ink leading-relaxed focus:outline-none focus:shadow-ring-focus"
            />
          ) : (
            <button
              key={index}
              type="button"
              onClick={() => setEditingIndex(index)}
              className="mt-2.5 block min-h-12 w-full rounded-control px-3 py-2.5 text-left text-base leading-relaxed text-ink transition-colors hover:bg-page"
            >
              {renderHighlighted(line, data.recipientFirstName)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleReformulate}
          disabled={reformulateDisabled}
          className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand transition-opacity hover:underline disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline disabled:opacity-60"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${reformulating ? "animate-spin" : ""}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {isStructured ? t("tunnel.lyrics.reformulateDisabled") : t("tunnel.lyrics.reformulate")}
        </button>
        {!isStructured && data.reformulateCount >= REFORMULATE_COUNTER_THRESHOLD && (
          <span className="font-mono text-xs tabular-nums text-ink-muted">
            {data.reformulateCount}/{REFORMULATE_LIMIT}
          </span>
        )}
      </div>

      {/* Sticky plutôt que dans le flux : sur 360px avec le clavier ouvert,
          le bouton de validation doit rester atteignable sans redescendre.
          Décalée au-dessus de la barre compacte du lecteur quand elle est
          affichée — jamais superposées (voir useMobilePlayerBarVisible). */}
      <div
        className={`sticky z-10 -mx-4 mt-6 border-t border-border bg-page/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:mt-8 sm:rounded-feature sm:border sm:bg-surface sm:px-5 sm:py-4 sm:pb-4 sm:shadow-card ${
          playerBarVisible ? "bottom-16" : "bottom-0"
        }`}
      >
        <p className="text-xs text-ink-muted">{t("tunnel.lyrics.freeAttempt")}</p>
        <Button onClick={handleContinue} className="mt-2 w-full sm:w-auto">
          {t("tunnel.lyrics.generatePreview")}
        </Button>
      </div>
    </div>
  );
}
