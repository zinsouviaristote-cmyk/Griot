// "0:00" tant que la durée n'est pas encore connue (avant loadedmetadata) —
// jamais "NaN:NaN", qui apparaîtrait le temps d'un frame à chaque changement
// de piste.
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}
