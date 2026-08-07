"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { occasionCatalog } from "@/lib/data/mock-dashboard";
import type { Occasion } from "@/lib/types";

export function CreateSongHero() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [occasion, setOccasion] = useState<Occasion | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = firstName.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({ prenom: trimmed });
    if (occasion) params.set("occasion", occasion);
    router.push(`/creer?${params.toString()}`);
  }

  return (
    <section className="bg-grain relative overflow-hidden rounded-panel border border-line-800 bg-ink-900 bg-gradient-hero px-5 py-10 text-center sm:px-8 sm:py-14">
      <div className="relative z-[1] mx-auto max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line-700 bg-ink-800/70 px-3 py-1 text-xs font-medium text-paper-400">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-signature" aria-hidden="true" />
          Écoutez avant de payer
        </span>

        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-paper-100 sm:text-4xl">
          Créer une nouvelle chanson
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-paper-400 sm:text-base">
          Racontez votre histoire, on lui compose une chanson. Vous écoutez
          l&apos;extrait gratuitement avant de payer quoi que ce soit.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="flex flex-col gap-2.5 rounded-card border border-line-700 bg-ink-950/60 p-2 sm:flex-row sm:items-center">
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              type="text"
              placeholder="Prénom du destinataire — ex. Fatou"
              aria-label="Prénom du destinataire"
              className="w-full flex-1 rounded-control bg-transparent px-3.5 py-3 text-sm text-paper-100 placeholder:text-paper-600 focus:outline-none sm:text-base"
            />
            <button
              type="submit"
              disabled={!firstName.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-gradient-signature px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow-brand transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:shadow-[0_14px_34px_-10px_rgba(232,68,122,0.65)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Créer sa chanson
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {occasionCatalog.map((item) => {
              const isSelected = occasion === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccasion(isSelected ? null : item.id)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                    isSelected
                      ? "border-brand-500 bg-brand-500/15 text-brand-300"
                      : "border-line-700 text-paper-400 hover:border-line-600 hover:text-paper-100"
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
