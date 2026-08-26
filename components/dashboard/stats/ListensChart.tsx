"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Ear } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useInView } from "@/lib/landing/useInView";
import { STATS_PERIODS, fetchListensSeries, formatListenDate, type StatsPeriod } from "@/lib/supabase/statsAdapters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ListenPoint } from "@/lib/types";

const VBOX_WIDTH = 640;
const VBOX_HEIGHT = 220;
const PADDING_LEFT = 34;
const PADDING_RIGHT = 8;
const PADDING_TOP = 14;
const PADDING_BOTTOM = 26;
const PLOT_WIDTH = VBOX_WIDTH - PADDING_LEFT - PADDING_RIGHT;
const PLOT_HEIGHT = VBOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const MAX_X_LABELS = 6;

// Plus petite valeur "ronde" au-dessus du maximum réel — c'est elle qui fixe
// les graduations de l'axe vertical, jamais le maximum brut (qui donnerait des
// nombres illisibles comme "furthermore 187").
function niceMax(value: number): number {
  if (value <= 0) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const residual = value / magnitude;
  const step = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return step * magnitude;
}

// Catmull-Rom → Bézier cubique : une courbe lissée qui passe exactement par
// chaque point, sans dépendance externe — jamais des segments droits entre
// les jours.
function smoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) return `M${coords[0].x},${coords[0].y}`;
  let d = `M${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

function ChartCanvas({ period, publishedSongIds }: { period: StatsPeriod; publishedSongIds: string[] }) {
  const { t, locale } = useLanguage();
  const gradientId = useId();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [mounted, setMounted] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<ListenPoint[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchListensSeries(publishedSongIds, period, locale)
      .then((series) => {
        if (!cancelled) setPoints(series);
      })
      .catch(() => {
        if (!cancelled) setPoints([]);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, locale, publishedSongIds.join(",")]);

  if (points.length === 0) return null;

  const max = niceMax(Math.max(...points.map((p) => p.count)));
  const yTicks = [0, max / 3, (max * 2) / 3, max];

  const coords = points.map((point, index) => ({
    x: PADDING_LEFT + (points.length === 1 ? 0 : (index / (points.length - 1)) * PLOT_WIDTH),
    y: PADDING_TOP + PLOT_HEIGHT - (point.count / max) * PLOT_HEIGHT,
    point,
  }));
  const linePath = smoothPath(coords);
  const baselineY = PADDING_TOP + PLOT_HEIGHT;
  const areaPath = `${linePath} L${coords[coords.length - 1].x},${baselineY} L${coords[0].x},${baselineY} Z`;

  const labelStep = Math.max(1, Math.ceil(points.length / MAX_X_LABELS));
  const xLabelIndexes = points
    .map((_, index) => index)
    .filter((index) => index % labelStep === 0 || index === points.length - 1);

  function updateHoverFromClientX(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const x = fraction * VBOX_WIDTH;
    const index = Math.round(((x - PADDING_LEFT) / PLOT_WIDTH) * (points.length - 1));
    setHoverIndex(Math.min(points.length - 1, Math.max(0, index)));
  }

  const hovered = hoverIndex !== null ? coords[hoverIndex] : null;

  return (
    <div ref={ref}>
      <div
        ref={wrapRef}
        className="relative w-full touch-none"
        style={{ aspectRatio: `${VBOX_WIDTH} / ${VBOX_HEIGHT}` }}
        onPointerDown={(event) => updateHoverFromClientX(event.clientX)}
        onPointerMove={(event) => updateHoverFromClientX(event.clientX)}
        onPointerUp={() => setHoverIndex(null)}
        onPointerCancel={() => setHoverIndex(null)}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <svg viewBox={`0 0 ${VBOX_WIDTH} ${VBOX_HEIGHT}`} className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#630ed4" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#630ed4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grille horizontale très pâle, jamais verticale — voir la demande. */}
          {yTicks.map((tick) => {
            const y = PADDING_TOP + PLOT_HEIGHT - (tick / max) * PLOT_HEIGHT;
            return (
              <line
                key={tick}
                x1={PADDING_LEFT}
                y1={y}
                x2={VBOX_WIDTH - PADDING_RIGHT}
                y2={y}
                strokeWidth="1"
                className="stroke-border/60"
              />
            );
          })}

          {yTicks.map((tick) => {
            const y = PADDING_TOP + PLOT_HEIGHT - (tick / max) * PLOT_HEIGHT;
            return (
              <text key={tick} x={PADDING_LEFT - 8} y={y + 3} textAnchor="end" className="fill-ink-muted text-[10px]">
                {Math.round(tick)}
              </text>
            );
          })}

          {xLabelIndexes.map((index) => (
            <text
              key={index}
              x={coords[index].x}
              y={VBOX_HEIGHT - 6}
              textAnchor="middle"
              className="fill-ink-muted text-[10px]"
            >
              {points[index].label}
            </text>
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} style={{ opacity: mounted && inView ? 1 : 0, transition: "opacity 0.6s ease-out 0.2s" }} />

          <path
            d={linePath}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-brand"
            pathLength={1}
            strokeDasharray={1}
            style={{
              strokeDashoffset: mounted && inView ? 0 : 1,
              transition: "stroke-dashoffset 1s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />

          {coords.map((c, index) => (
            <circle
              key={index}
              cx={c.x}
              cy={c.y}
              r={hoverIndex === index ? 5 : 2.5}
              className="fill-brand transition-[r] duration-150 ease-magnetic"
              style={{ opacity: mounted && inView ? 1 : 0, transition: "opacity 0.4s ease-out 0.9s, r 0.15s" }}
            />
          ))}

          {hovered && (
            <line
              x1={hovered.x}
              y1={PADDING_TOP}
              x2={hovered.x}
              y2={baselineY}
              strokeWidth="1"
              className="stroke-brand/25"
            />
          )}
        </svg>

        {hovered && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-control border border-border bg-surface px-2.5 py-1.5 text-center shadow-card-hover"
            style={{
              left: `${(hovered.x / VBOX_WIDTH) * 100}%`,
              top: `${(hovered.y / VBOX_HEIGHT) * 100}%`,
              marginTop: -8,
            }}
          >
            <p className="whitespace-nowrap text-[10px] font-medium text-ink-muted">
              {formatListenDate(hovered.point.date, locale)}
            </p>
            <p className="whitespace-nowrap font-mono text-xs font-semibold tabular-nums text-ink">
              {t("stats.listensChart.tooltipListens", { count: hovered.point.count })}
            </p>
          </div>
        )}
      </div>

      <span className="sr-only">
        {t("stats.listensChart.srSummary", {
          summary: points.map((p) => t("stats.listensChart.srPoint", { label: p.label, count: p.count })).join(" ; "),
        })}
      </span>
    </div>
  );
}

// Sélecteur de période en puces + graphique — remonter `period` ici plutôt
// que dans le parent : rien d'autre sur la page n'a besoin de le connaître.
// `key={period}` sur ChartCanvas force un remontage complet au changement, ce
// qui rejoue tout l'effet d'apparition (fondu + tracé) — la façon la plus
// simple d'obtenir une "transition animée" sans réanimation de tracé SVG.
export function ListensChart({ hasListens, publishedSongIds }: { hasListens: boolean; publishedSongIds: string[] }) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<StatsPeriod>(7);

  if (!hasListens) {
    return (
      <EmptyState
        icon={Ear}
        title={t("stats.listensChart.emptyTitle")}
        description={t("stats.listensChart.emptyDescription")}
        actionLabel={t("stats.listensChart.emptyAction")}
        actionHref="/historiques"
      />
    );
  }

  return (
    <div>
      <div role="tablist" aria-label={t("stats.listensChart.title")} className="inline-flex rounded-full border border-border bg-page p-1">
        {STATS_PERIODS.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={period === option}
            onClick={() => setPeriod(option)}
            className={`min-h-11 rounded-full px-3.5 text-xs font-medium transition-all duration-150 ease-magnetic ${
              period === option ? "bg-brand text-white shadow-card" : "text-ink-muted hover:text-ink"
            }`}
          >
            {t(`stats.listensChart.period${option}`)}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <ChartCanvas key={period} period={period} publishedSongIds={publishedSongIds} />
      </div>
    </div>
  );
}
