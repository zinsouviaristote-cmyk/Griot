// Forme d'onde décorative — pas une vraie analyse du signal (coûteux, inutile
// pour ce produit) : des barres à hauteur fixe qui oscillent en cascade quand
// la lecture est active, immobiles sinon. `animation-play-state` (pas un
// montage/démontage) pour repartir en phase à chaque pause/reprise.
const BAR_HEIGHTS = [40, 70, 100, 60, 85, 45, 75, 55];

export function Waveform({
  active,
  className = "",
  barClassName = "bg-white",
}: {
  active: boolean;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={`w-[3px] shrink-0 rounded-full ${barClassName} animate-wave-bar`}
          style={{
            height: `${height}%`,
            animationDelay: `${index * 0.09}s`,
            animationPlayState: active ? "running" : "paused",
            transform: active ? undefined : "scaleY(0.35)",
          }}
        />
      ))}
    </div>
  );
}
