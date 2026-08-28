"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, Maximize2, Minimize2, Redo2, Undo2 } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import {
  LYRICS_MAX_LENGTH,
  STORY_MAX_LENGTH,
  STORY_MIN_LENGTH,
  detectStoryMode,
  type StoryMode,
} from "@/lib/tunnel/types";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useMobilePlayerBarVisible } from "@/lib/player/useMobilePlayerBarVisible";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type UiMode = "simple" | "avance";

function uiModeFor(storyMode: StoryMode): UiMode {
  return storyMode === "raconte" ? "simple" : "avance";
}

// Helper pour formater les secondes en MM:SS (ex: 90s -> 1:30)
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function StoryStep() {
  const { t } = useLanguage();
  const { data, update, goNext } = useTunnel();
  const uiMode = uiModeFor(data.storyMode);
  const advancedSubMode = data.storyMode === "paroles_structurees" ? "paroles_structurees" : "paroles_libres";
  const [fullscreen, setFullscreen] = useState(false);
  const playerBarVisible = useMobilePlayerBarVisible();

  // Durée en secondes (30s min, 120s / 2min max). Valeur par défaut: 120s ou data.duration
  const duration = data.duration ?? 120;

  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const lastEditRef = useRef(0);

  const maxLength = uiMode === "simple" ? STORY_MAX_LENGTH : LYRICS_MAX_LENGTH;
  const length = data.story.trim().length;
  const remaining = STORY_MIN_LENGTH - length;
  const lengthOk = length >= STORY_MIN_LENGTH;
  const canContinue = lengthOk;

  function commitStory(nextValue: string) {
    const story = nextValue.slice(0, maxLength);
    if (uiMode === "simple") {
      update({ story, storyMode: "raconte" });
    } else {
      const detected = detectStoryMode(story);
      update({ story, storyMode: detected === "paroles_structurees" ? "paroles_structurees" : "paroles_libres" });
    }
  }

  function handleDurationChange(newDuration: number) {
    update({ duration: newDuration });
  }

  function setUiMode(next: UiMode) {
    if (next === uiMode) return;
    if (next === "simple") {
      update({ storyMode: "raconte" });
    } else {
      const detected = detectStoryMode(data.story);
      update({ storyMode: detected === "paroles_structurees" ? "paroles_structurees" : "paroles_libres" });
    }
  }

  function handleAdvancedChange(value: string) {
    const now = Date.now();
    const isNewCheckpoint = now - lastEditRef.current > 500;
    lastEditRef.current = now;
    if (isNewCheckpoint) {
      const before = data.story;
      setPast((current) => [...current, before]);
    }
    setFuture([]);
    commitStory(value);
  }

  function undo() {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [data.story, ...current]);
    commitStory(previous);
  }

  function redo() {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((current) => current.slice(1));
    setPast((current) => [...current, data.story]);
    commitStory(next);
  }

  const title = uiMode === "simple" ? t("tunnel.story.simpleTitle") : t("tunnel.story.advancedTitle");
  const subtitle =
    uiMode === "simple"
      ? t("tunnel.story.simpleSubtitle")
      : t(advancedSubMode === "paroles_libres" ? "tunnel.story.advancedFreeSubtitle" : "tunnel.story.advancedStructuredSubtitle");
  const prompts =
    uiMode === "simple"
      ? [t("tunnel.story.simplePrompt1"), t("tunnel.story.simplePrompt2"), t("tunnel.story.simplePrompt3")]
      : advancedSubMode === "paroles_libres"
        ? [t("tunnel.story.advancedFreePrompt1"), t("tunnel.story.advancedFreePrompt2"), t("tunnel.story.advancedFreePrompt3")]
        : [t("tunnel.story.advancedStructuredPrompt1"), t("tunnel.story.advancedStructuredPrompt2")];

  const counter = (
    <div className="mt-2 flex items-center justify-between text-label-sm">
      <span className={remaining > 0 ? "text-ink-muted" : "text-success"}>
        {remaining > 0
          ? t("tunnel.story.remaining", { count: remaining, plural: remaining > 1 ? "s" : "" })
          : t("tunnel.story.enough")}
      </span>
      <span className="font-mono tabular-nums text-ink-muted">
        {length}/{maxLength}
      </span>
    </div>
  );

  const durationSelector = (
    <div className="mt-6 rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-sm font-semibold text-ink">Durée de la chanson</span>
        </div>
        <span className="font-mono text-base font-bold text-brand">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Barre de défilement / Curseur */}
      <div className="mt-3">
        <input
          type="range"
          min={30}
          max={120}
          step={15}
          value={duration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-page accent-brand focus:outline-none"
        />
        <div className="mt-1.5 flex justify-between text-xs text-ink-muted">
          <span>0:30</span>
          <span>1:00</span>
          <span>1:30</span>
          <span>2:00</span>
        </div>
      </div>

      {/* Raccourcis rapides */}
      <div className="mt-3 flex gap-2">
        {[60, 90, 120].map((presetSec) => (
          <button
            key={presetSec}
            type="button"
            onClick={() => handleDurationChange(presetSec)}
            className={`flex-1 rounded-control border py-1 text-xs font-medium transition-colors ${
              duration === presetSec
                ? "border-brand bg-brand/10 text-brand"
                : "border-border bg-page text-ink-muted hover:text-ink"
            }`}
          >
            {formatDuration(presetSec)}
          </button>
        ))}
      </div>
    </div>
  );
  const continueButton = (
    <Button onClick={goNext} disabled={!canContinue} className="w-full sm:w-auto">
      {t("tunnel.story.continue")}
    </Button>
  );

  const toolbar = (
    <div className="flex items-center justify-between rounded-t-card border border-b-0 border-border bg-page px-2 py-1.5">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={past.length === 0}
          aria-label={t("tunnel.story.undo")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-page hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <Undo2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={future.length === 0}
          aria-label={t("tunnel.story.redo")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-page hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <Redo2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setFullscreen((current) => !current)}
        aria-pressed={fullscreen}
        aria-label={fullscreen ? t("tunnel.story.fullscreenExit") : t("tunnel.story.fullscreenEnter")}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-page hover:text-ink active:scale-90"
      >
        {fullscreen ? (
          <Minimize2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Maximize2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  );

  const textarea = (
    <textarea
      value={data.story}
      onChange={(event) => handleAdvancedChange(event.target.value)}
      rows={fullscreen ? undefined : 10}
      placeholder={t("tunnel.story.advancedPlaceholder")}
      aria-describedby="story-help"
      className={`w-full resize-none rounded-b-card border border-border bg-surface p-4 text-sm leading-relaxed text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus ${
        fullscreen ? "min-h-0 flex-1" : "min-h-[28vh] sm:min-h-[45vh]"
      }`}
    />
  );

  if (fullscreen && typeof document !== "undefined") {
    return createPortal(
      <div className="fixed inset-0 z-50 flex flex-col bg-page p-4 sm:p-6">
        <div className="mb-3 shrink-0">
          <p className="font-display text-lg font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          {toolbar}
          {textarea}
          <div id="story-help">{counter}</div>
        </div>
        <div className="mt-3 shrink-0 pb-[env(safe-area-inset-bottom)]">{continueButton}</div>
      </div>,
      document.body,
    );
  }

  return (
    <div className="pb-24">
      <SectionTitle as="h1" size="lg">
        {title}
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">{subtitle}</p>

      <div
        role="tablist"
        aria-label={t("tunnel.story.modeTabsLabel")}
        className="mt-5 inline-flex rounded-full border border-border bg-page p-1"
      >
        {(["simple", "avance"] as UiMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={uiMode === mode}
            onClick={() => setUiMode(mode)}
            className={`min-h-11 rounded-full px-4 text-sm font-medium transition-all duration-150 ease-magnetic ${
              uiMode === mode ? "bg-brand text-white shadow-card" : "text-ink-muted hover:text-ink"
            }`}
          >
            {mode === "simple" ? t("tunnel.story.modeSimple") : t("tunnel.story.modeAdvanced")}
          </button>
        ))}
      </div>

      {uiMode === "simple" ? (
        <>
          <ul className="mt-5 space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt} className="flex items-center gap-2.5 text-sm text-ink-muted">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                {prompt}
              </li>
            ))}
          </ul>

          <textarea
            value={data.story}
            onChange={(event) => commitStory(event.target.value)}
            rows={8}
            placeholder={t("tunnel.story.simplePlaceholder")}
            aria-describedby="story-help"
            className="mt-4 w-full resize-none rounded-card border border-border bg-surface p-4 text-sm leading-relaxed text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus"
          />
          <div id="story-help">{counter}</div>
        </>
      ) : (
        <div className="mt-4">
          {toolbar}
          {textarea}
          <div id="story-help">{counter}</div>

          <ul className="mt-3 space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt} className="flex items-center gap-2.5 text-sm text-ink-muted">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bloc d'ajustement de la durée de la chanson */}
      {durationSelector}

      <div
        className={`sticky z-10 -mx-4 mt-6 border-t border-border bg-page/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pb-0 ${
          playerBarVisible ? "bottom-16" : "bottom-0"
        }`}
      >
        {continueButton}
      </div>
    </div>
  );
}