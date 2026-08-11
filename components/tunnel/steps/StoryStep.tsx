"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2, Redo2, Undo2 } from "lucide-react";
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

type UiMode = "simple" | "avance";

// "raconte" est le seul mode de l'onglet Simple ; les deux autres partagent
// l'onglet Avancé (voir setUiMode) — la bascule n'a donc que ces deux états,
// jamais trois, quel que soit le contenu déjà tapé.
function uiModeFor(storyMode: StoryMode): UiMode {
  return storyMode === "raconte" ? "simple" : "avance";
}

const SIMPLE_COPY = {
  title: "Racontez-la",
  subtitle: "Pas besoin d'être écrivain — quelques phrases suffisent, la mélodie fait le reste.",
  prompts: ["Un souvenir avec cette personne", "Une qualité qui la définit", "Ce que vous voudriez lui dire"],
  placeholder: "Racontez à votre façon…",
};

const ADVANCED_TITLE = "Écrivez vos paroles";

const ADVANCED_COPY: Record<"paroles_libres" | "paroles_structurees", { subtitle: string; prompts: string[] }> = {
  paroles_libres: {
    subtitle: "Vos mots, tels quels — on se contente de les mettre en forme (intro, couplets, refrain).",
    prompts: [
      "Écrivez comme vous voulez que ce soit chanté",
      "On choisit quel passage devient le refrain",
      "Pas un mot n'est changé, ni ajouté, ni retiré",
    ],
  },
  paroles_structurees: {
    subtitle: "Balises détectées — [Intro], [Couplet], [Refrain]… transmises à la lettre, sans modification.",
    prompts: ["Rien n'est modifié, pas même la ponctuation", "Le bouton Reformuler sera désactivé à l'écran suivant"],
  },
};

const ADVANCED_PLACEHOLDER =
  "Vos paroles, dans l'ordre où elles doivent être chantées…\n\nDéjà balisées avec [Couplet], [Refrain] ? On les respecte à la lettre. Sinon, on les met en forme sans en changer un mot.";

export function StoryStep() {
  const { data, update, goNext } = useTunnel();
  const uiMode = uiModeFor(data.storyMode);
  const advancedSubMode = data.storyMode === "paroles_structurees" ? "paroles_structurees" : "paroles_libres";
  const [fullscreen, setFullscreen] = useState(false);

  // Historique d'annulation propre au champ Avancé — jamais partagé avec
  // Simple, jamais persisté : un simple filet local pour "annuler / rétablir"
  // une frappe, pas une vraie gestion de versions.
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const lastEditRef = useRef(0);

  const maxLength = uiMode === "simple" ? STORY_MAX_LENGTH : LYRICS_MAX_LENGTH;
  const length = data.story.trim().length;
  const remaining = STORY_MIN_LENGTH - length;
  const canContinue = length >= STORY_MIN_LENGTH;

  function commitStory(nextValue: string) {
    const story = nextValue.slice(0, maxLength);
    if (uiMode === "simple") {
      update({ story, storyMode: "raconte" });
    } else {
      const detected = detectStoryMode(story);
      update({ story, storyMode: detected === "paroles_structurees" ? "paroles_structurees" : "paroles_libres" });
    }
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
    // Un nouveau point d'annulation seulement après une pause dans la frappe —
    // sinon chaque caractère deviendrait son propre cran d'"annuler", inutile
    // à quiconque. Décidé ICI, avant de toucher la ref : le correcteur de
    // `setPast` ne s'exécute qu'au rendu suivant, une fois `lastEditRef.current`
    // déjà réécrit plus bas — le lire depuis l'intérieur du correcteur aurait
    // toujours comparé `now` à lui-même.
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

  const title = uiMode === "simple" ? SIMPLE_COPY.title : ADVANCED_TITLE;
  const subtitle = uiMode === "simple" ? SIMPLE_COPY.subtitle : ADVANCED_COPY[advancedSubMode].subtitle;
  const prompts = uiMode === "simple" ? SIMPLE_COPY.prompts : ADVANCED_COPY[advancedSubMode].prompts;

  const counter = (
    <div className="mt-2 flex items-center justify-between text-label-sm">
      <span className={remaining > 0 ? "text-ink-muted" : "text-success"}>
        {remaining > 0
          ? `Encore ${remaining} caractère${remaining > 1 ? "s" : ""} — vous y êtes presque.`
          : "C'est largement suffisant."}
      </span>
      <span className="font-mono tabular-nums text-ink-muted">
        {length}/{maxLength}
      </span>
    </div>
  );

  const continueButton = (
    <Button onClick={goNext} disabled={!canContinue} className="w-full sm:w-auto">
      Continuer
    </Button>
  );

  // Barre d'outils propre au champ Avancé — annuler, rétablir, plein écran.
  // Jamais sur Simple : un récit court n'a pas besoin de cet appareillage.
  const toolbar = (
    <div className="flex items-center justify-between rounded-t-card border border-b-0 border-border bg-page px-2 py-1.5">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={past.length === 0}
          aria-label="Annuler"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-brand-soft/60 hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <Undo2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={future.length === 0}
          aria-label="Rétablir"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-brand-soft/60 hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <Redo2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setFullscreen((current) => !current)}
        aria-pressed={fullscreen}
        aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-brand-soft/60 hover:text-ink active:scale-90"
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
      placeholder={ADVANCED_PLACEHOLDER}
      aria-describedby="story-help"
      className={`w-full resize-none rounded-b-card border border-border bg-surface p-4 text-sm leading-relaxed text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus ${
        fullscreen ? "min-h-0 flex-1" : "min-h-[28vh] sm:min-h-[45vh]"
      }`}
    />
  );

  // Le plein écran est rendu via un portail, directement sous <body> : la
  // pile d'écrans du tunnel (TunnelShell) anime son conteneur avec un
  // `transform` (animate-reveal-up), et un ancêtre transformé redéfinit le
  // référentiel de tout `position: fixed` descendant — sans portail, ce
  // "plein écran" resterait coincé dans la boîte de cet ancêtre au lieu de
  // couvrir le vrai viewport.
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

      {/* Reprend le principe des onglets Simple / Avancé : un seul bouton
          discret sépare les deux, jamais une décision qui ferait perdre ce qui
          est déjà écrit (voir setUiMode — le texte survit à la bascule). */}
      <div
        role="tablist"
        aria-label="Mode de saisie des paroles"
        className="mt-5 inline-flex rounded-full border border-border bg-page p-1"
      >
        {(["simple", "avance"] as UiMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={uiMode === mode}
            onClick={() => setUiMode(mode)}
            className={`min-h-9 rounded-full px-4 text-sm font-medium transition-all duration-150 ease-magnetic ${
              uiMode === mode ? "bg-brand text-white shadow-card" : "text-ink-muted hover:text-ink"
            }`}
          >
            {mode === "simple" ? "Simple" : "Avancé"}
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
            placeholder={SIMPLE_COPY.placeholder}
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

      {/* Sticky plutôt que dans le flux : sur 360px avec le clavier virtuel
          ouvert (et un champ Avancé bien plus haut que l'ancien), le bouton de
          validation doit rester atteignable sans le faire disparaître derrière
          le clavier — même traitement que LyricsStep. */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-border bg-page/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pb-0">
        {continueButton}
      </div>
    </div>
  );
}
