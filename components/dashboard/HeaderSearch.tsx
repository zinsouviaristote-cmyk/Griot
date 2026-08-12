"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

// Remplace l'ancienne barre pleine largeur : la bibliothèque a déjà sa propre
// recherche, celle-ci ne sert qu'à retrouver une chanson depuis n'importe quel
// écran, sans lui réserver toute la largeur du haut sur chaque page.
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      {open ? (
        <label className="flex animate-field-in items-center gap-2 rounded-control border border-brand/50 bg-surface py-2 pl-3.5 pr-2 shadow-ring-focus">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Rechercher une chanson…"
            className="w-52 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer la recherche"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-soft/60 hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </label>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Rechercher une chanson"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 active:scale-90"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
