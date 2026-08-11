"use client";

import { useState, type FocusEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, TriangleAlert, Wand2 } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { occasionCatalog } from "@/lib/data/mock-dashboard";
import type { Occasion } from "@/lib/types";

export function CreateSongHero() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [touched, setTouched] = useState(false);
  const canSubmit = firstName.trim().length > 0;
  // Le bouton désactivé bloque déjà toute soumission vide — l'erreur se déclenche
  // donc au blur (l'utilisateur a visité le champ et l'a laissé vide), le seul
  // moment où un champ vide devient une vraie erreur plutôt qu'un état initial normal.
  const showError = touched && !canSubmit;

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (event.target.value.trim() === "") setTouched(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = firstName.trim();
    if (!trimmed) {
      setTouched(true);
      return;
    }
    const params = new URLSearchParams({ prenom: trimmed });
    if (occasion) params.set("occasion", occasion);
    router.push(`/creer?${params.toString()}`);
  }

  return (
    <section className="rounded-feature border border-border bg-surface px-5 py-6 shadow-card sm:px-8 sm:py-8">
      <div className="max-w-2xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white sm:h-14 sm:w-14">
          <Wand2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>

        <div className="mt-4">
          <SectionTitle as="h1" size="lg" align="left">
            Créer une nouvelle chanson
          </SectionTitle>
        </div>
        <p className="mt-2 max-w-md text-body-md leading-relaxed text-ink-muted">
          Racontez votre histoire, on lui compose une chanson. Vous écoutez
          l&apos;extrait gratuitement avant de payer quoi que ce soit.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div
            className={`flex flex-col gap-2.5 rounded-card border bg-page p-2 transition-colors duration-200 sm:flex-row sm:items-center ${
              showError ? "border-danger/60" : "border-border focus-within:border-brand/50"
            }`}
          >
            <input
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                if (event.target.value.trim() !== "") setTouched(false);
              }}
              onBlur={handleBlur}
              type="text"
              placeholder="Prénom du destinataire — ex. Fatou"
              aria-label="Prénom du destinataire"
              aria-invalid={showError}
              aria-describedby={showError ? "prenom-error" : undefined}
              className="w-full flex-1 rounded-control bg-transparent px-3.5 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none sm:text-base"
            />
            {/* Le bouton reste toujours lisible : un état désactivé estompé en opacité
                lui ferait perdre le point d'entrée de l'écran. Sa teinte change plutôt
                que sa netteté (bg-brand-soft/text-brand, même contraste qu'actif). */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`group inline-flex shrink-0 items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-semibold transition-all duration-200 ease-magnetic ${
                canSubmit
                  ? "bg-brand text-white hover:scale-[1.02] hover:brightness-90 active:scale-[0.98]"
                  : "cursor-not-allowed bg-brand-soft text-brand"
              }`}
            >
              Créer sa chanson
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-magnetic group-hover:translate-x-1"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>

          {showError && (
            <p
              id="prenom-error"
              role="alert"
              className="flex animate-field-in items-center gap-1.5 text-label-sm text-danger"
            >
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              Indiquez un prénom pour continuer.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {occasionCatalog.map((item) => {
              const isSelected = occasion === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccasion(isSelected ? null : item.id)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-3.5 py-1.5 text-label-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-ink-muted hover:border-brand/40 hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </form>
      </div>
    </section>
  );
}
