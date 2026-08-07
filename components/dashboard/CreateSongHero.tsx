"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
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
    <section className="rounded-feature border border-border bg-surface px-5 py-10 text-center shadow-card sm:px-8 sm:py-14">
      <div className="mx-auto max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-label-sm font-medium text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          Écoutez avant de payer
        </span>

        <div className="mt-5">
          <SectionTitle as="h1" size="lg" align="center">
            Créer une nouvelle chanson
          </SectionTitle>
        </div>
        <p className="mx-auto mt-3 max-w-md text-body-md leading-relaxed text-ink-muted">
          Racontez votre histoire, on lui compose une chanson. Vous écoutez
          l&apos;extrait gratuitement avant de payer quoi que ce soit.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="flex flex-col gap-2.5 rounded-card border border-border bg-page p-2 sm:flex-row sm:items-center">
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              type="text"
              placeholder="Prénom du destinataire — ex. Fatou"
              aria-label="Prénom du destinataire"
              className="w-full flex-1 rounded-control bg-transparent px-3.5 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none sm:text-base"
            />
            <button
              type="submit"
              disabled={!firstName.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-brand px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:brightness-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Créer sa chanson
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
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
                  className={`rounded-full border px-3.5 py-1.5 text-label-sm font-medium transition-colors duration-150 ${
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
