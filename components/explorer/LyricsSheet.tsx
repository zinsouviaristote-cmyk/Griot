"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { styleLabel } from "@/lib/i18n/catalog";
import type { PublishedSong } from "@/lib/types";

const PEEK_RATIO = 0.55;
const FULL_RATIO = 0.92;
const DRAG_THRESHOLD = 60;

// Panneau glissant, entièrement piloté par transform (jamais par height —
// seule propriété perf-compatible pour une animation qui doit rester fluide
// au doigt, voir le budget performance du produit). Toujours rendu à sa
// hauteur maximale dans le DOM ; c'est sa POSITION qui varie entre replié
// ("peek", quelques lignes visibles) et déplié ("full", défilement complet).
// La poignée est la seule zone qui déclenche le glissement — le contenu, lui,
// ne fait QUE défiler nativement : jamais les deux gestes en concurrence sur
// la même zone tactile.
export function LyricsSheet({
  entry,
  displayName,
  onClose,
}: {
  entry: PublishedSong;
  displayName: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [viewportHeight, setViewportHeight] = useState(0);
  const [snap, setSnap] = useState<"peek" | "full">("peek");
  const [mounted, setMounted] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const draggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  useEffect(() => {
    function measure() {
      setViewportHeight(window.innerHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const fullHeight = Math.round(viewportHeight * FULL_RATIO);
  const peekHeight = Math.round(viewportHeight * PEEK_RATIO);
  const closedOffset = fullHeight;
  const peekOffset = fullHeight - peekHeight;
  const baseOffset = !mounted ? closedOffset : snap === "full" ? 0 : peekOffset;
  const liveOffset = Math.max(-40, Math.min(closedOffset + 40, baseOffset + dragDelta));

  function handlePointerDown(event: React.PointerEvent) {
    draggingRef.current = true;
    dragStartYRef.current = event.clientY;
    (event.target as Element).setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!draggingRef.current) return;
    setDragDelta(event.clientY - dragStartYRef.current);
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const delta = dragDelta;
    setDragDelta(0);
    if (delta < -DRAG_THRESHOLD) {
      setSnap("full");
    } else if (delta > DRAG_THRESHOLD) {
      if (snap === "full") setSnap("peek");
      else onClose();
    }
  }

  return (
    <>
      {/* Fond assombri, mobile seulement : sur desktop le panneau pousse le
          contenu plutôt que de le couvrir, rien à obscurcir derrière lui.
          `bg-black`, jamais `bg-ink` : ce voile doit rester sombre dans les
          deux thèmes, alors que `ink` s'inverse en clair en mode sombre. */}
      <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={`lyrics-${entry.id}`}
        style={{
          height: fullHeight || "92vh",
          transform: `translateY(${liveOffset}px)`,
          transition: draggingRef.current ? "none" : "transform 320ms cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden rounded-t-feature border-t border-border bg-surface shadow-card-hover lg:static lg:inset-auto lg:z-auto lg:!h-full lg:w-[360px] lg:shrink-0 lg:animate-panel-in lg:!transform-none lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none"
      >
        {/* Poignée + en-tête : seule zone de glissement — touch-none empêche le
            navigateur de tenter son propre geste (scroll/refresh) par-dessus. */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="shrink-0 touch-none px-6 pt-3 lg:cursor-default lg:touch-auto lg:px-7 lg:pt-16"
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-border lg:hidden" aria-hidden="true" />
          <div className="mt-3 flex items-center justify-between lg:mt-0">
            <p
              id={`lyrics-${entry.id}`}
              className="flex items-center gap-2 font-display text-lg font-semibold text-ink"
            >
              <FileText className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
              {t("explorer.lyrics")}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("explorer.closeLyrics")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-page hover:text-ink active:scale-90"
            >
              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 pb-3 text-xs text-ink-muted">
            {displayName} · {styleLabel(t, entry.style)}
          </p>
        </div>

        {/* Contenu — défilement natif uniquement, jamais mêlé au geste de la
            poignée : overscroll-contain empêche un défilement en bout de liste
            de "fuiter" vers le carrousel d'Explorer derrière. */}
        <div className="min-h-0 flex-1 overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:px-7 lg:pb-10">
          <div className="space-y-4 pt-2">
            {entry.lyrics.map((line, lineIndex) => (
              <p
                key={lineIndex}
                style={{ animationDelay: `${lineIndex * 90}ms` }}
                className="animate-reveal-up text-base leading-relaxed text-ink"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
