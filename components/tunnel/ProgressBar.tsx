// `scaleX` plutôt que `width` : une barre de progression qui anime sa largeur
// déclenche un recalcul de mise en page à chaque frame. `transform` reste sur
// le compositeur, jamais de repaint du reste de la page.
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-border"
    >
      <div
        className="h-full w-full origin-left rounded-full bg-brand transition-transform duration-300 ease-out"
        style={{ transform: `scaleX(${Math.max(0.03, progress)})` }}
      />
    </div>
  );
}
