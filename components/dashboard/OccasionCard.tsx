"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowRight, X } from "lucide-react";
import { OCCASION_TONES } from "@/lib/occasionTones";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { OccasionMeta } from "@/lib/types";

type TranslatedOccasion = OccasionMeta & {
  label: string;
  tagline: string;
};

export function OccasionCard({
  occasion,
}: {
  occasion: TranslatedOccasion;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customOccasion, setCustomOccasion] = useState("");
  const [touched, setTouched] = useState(false);

  const isOther = occasion.id === "autre";

  const tone = OCCASION_TONES[occasion.id] || {
    accentBorder: "border-brand",
    chip: "bg-brand/10 text-brand",
    hoverArrow: "bg-brand/10 text-brand",
  };

  const canContinue = customOccasion.trim().length > 0;

  function handleCardClick() {
    if (isOther) {
      setIsModalOpen(true);
    } else {
      router.push(`/creer?occasion=${occasion.id}`);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = customOccasion.trim();
    if (!trimmed) {
      setTouched(true);
      return;
    }

    setIsModalOpen(false);
    router.push(
      `/creer?occasion=autre&customOccasion=${encodeURIComponent(trimmed)}`
    );
  }

  return (
    <>
      {/* BOUTON CARTE DANS LE CARROUSEL */}
      <button
        type="button"
        onClick={handleCardClick}
        className={`group flex h-40 w-[210px] shrink-0 snap-start flex-col justify-between rounded-card border-x border-b border-t-[3px] border-x-border border-b-border bg-surface p-4 text-left shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:scale-[0.98] active:shadow-card ${tone.accentBorder}`}
      >
        <div className="flex items-start justify-between">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ease-magnetic group-hover:scale-110 ${tone.chip}`}
          >
            <occasion.icon
              className="h-4 w-4"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>

          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-all duration-200 ease-magnetic group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${tone.hoverArrow}`}
          >
            <ArrowUpRight
              className="h-4 w-4"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        </div>

        <div>
          <p className="font-display text-lg font-semibold text-ink">
            {occasion.label}
          </p>
          <p className="mt-1 text-xs leading-snug text-ink-muted">
            {occasion.tagline}
          </p>
        </div>
      </button>

      {/* MODAL / OVERLAY POUR AUTRE OCCASION */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${tone.chip}`}
                >
                  <occasion.icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {t("tunnel.occasion.customModalTitle")}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setCustomOccasion("");
                  setTouched(false);
                }}
                aria-label={t("common.close")}
                className="rounded-full p-1 text-ink-muted hover:bg-page hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                {t("tunnel.occasion.customLabel")}
              </label>
              <div
                className={`flex items-center rounded-control border bg-page p-1 ${
                  touched && !canContinue
                    ? "border-danger"
                    : "border-border focus-within:border-brand"
                }`}
              >
                <input
                  autoFocus
                  type="text"
                  value={customOccasion}
                  onChange={(e) => {
                    setCustomOccasion(e.target.value);
                    if (e.target.value.trim() !== "") setTouched(false);
                  }}
                  placeholder={t("tunnel.occasion.customPlaceholder")}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!canContinue}
                  className={`flex h-9 w-9 items-center justify-center rounded-control transition-all ${
                    canContinue
                      ? "bg-brand text-white hover:scale-105 active:scale-95"
                      : "cursor-not-allowed bg-brand-soft text-brand"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {touched && !canContinue && (
                <p className="mt-1.5 text-xs text-danger">
                  {t("tunnel.occasion.customError")}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}