"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { WeeklyListenPoint } from "@/lib/data/mock-stats";

// Coordonnées internes fixes, étirées à 100% de la largeur du conteneur via
// `preserveAspectRatio="none"` — jamais de recalcul selon le viewport, jamais
// de défilement horizontal possible : le SVG épouse toujours l'espace disponible.
const WIDTH = 320;
const HEIGHT = 96;
const PADDING_X = 4;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 6;

// Trait fin violet, sobre — une seule ligne de base en guise de grille, jamais
// de quadrillage : "sans grille lourde" (voir la demande).
export function WeeklyListensChart({ points }: { points: WeeklyListenPoint[] }) {
  const { t } = useLanguage();
  const max = Math.max(...points.map((p) => p.count), 1);
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const stepX = (WIDTH - PADDING_X * 2) / (points.length - 1);

  const coords = points.map((point, index) => ({
    x: PADDING_X + index * stepX,
    y: PADDING_TOP + plotHeight - (point.count / max) * plotHeight,
    point,
  }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="h-24 w-full" aria-hidden="true">
        <line
          x1={PADDING_X}
          y1={HEIGHT - 1}
          x2={WIDTH - PADDING_X}
          y2={HEIGHT - 1}
          strokeWidth="1"
          className="stroke-border"
        />
        <path d={path} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-brand" />
        {coords.map((c, index) => (
          <circle key={index} cx={c.x} cy={c.y} r="2.5" className="fill-brand" />
        ))}
      </svg>
      <div className="mt-1.5 flex text-[11px] text-ink-muted">
        {points.map((point, index) => (
          <span key={index} className="flex-1 text-center first:text-left last:text-right">
            {point.label}
          </span>
        ))}
      </div>
      <span className="sr-only">
        {t("stats.weeklyChart.srSummary", {
          summary: points.map((p) => t("stats.weeklyChart.srPoint", { label: p.label, count: p.count })).join(" ; "),
        })}
      </span>
    </div>
  );
}
