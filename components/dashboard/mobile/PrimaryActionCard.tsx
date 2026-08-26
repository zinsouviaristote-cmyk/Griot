"use client";

import Link from "next/link";
import { ChevronRight, Wand2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { styleLabel } from "@/lib/i18n/catalog";
import type { MusicStyle } from "@/lib/types";

const SAMPLE_STYLE_IDS: MusicStyle[] = ["afrobeat", "coupe_decale", "gospel"];

/**
 * La carte la plus visible de l'écran mobile — toute la surface est cliquable.
 * Bordure `brand` à 2px (plutôt que le `border-border` 1px des autres cartes) :
 * c'est le seul endroit de l'app qui se permet cette emphase.
 */
export function PrimaryActionCard({ hasSongs }: { hasSongs: boolean }) {
  const { t } = useLanguage();
  const styleSample = `${SAMPLE_STYLE_IDS.map((id) => styleLabel(t, id)).join(", ")} ${t("dashboard.primaryAction.styleSampleSuffix")}`;

  return (
    <Link
      href="/creer"
      // `bg-surface`, jamais `bg-brand-soft` : ce jeton reste un violet pâle
      // fixe en mode sombre, alors que `text-ink` ci-dessous s'inverse en
      // clair — illisible sur cette carte précisément. La bordure épaisse
      // reste la seule emphase, comme voulu (voir commentaire ci-dessus).
      className="group flex items-center gap-4 rounded-card border-2 border-brand bg-surface p-4 shadow-card transition-all duration-200 ease-magnetic hover:shadow-card-hover active:scale-[0.98]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-card bg-brand text-white transition-transform duration-300 ease-magnetic group-hover:scale-105 group-hover:-rotate-3 group-active:scale-95">
        <Wand2 className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold text-ink">
          {hasSongs ? t("dashboard.primaryAction.createSong") : t("dashboard.primaryAction.createFirstSong")}
        </p>
        <p className="mt-0.5 truncate text-sm text-ink-muted">{styleSample}</p>
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-brand transition-transform duration-200 ease-magnetic group-hover:translate-x-1"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}
