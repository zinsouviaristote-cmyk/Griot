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

// Temps d'écoute cumulé (Statistiques) : un total en secondes se lit mal tel
// quel — "20 h 5 min" plutôt que "72330". Sous la minute, "min" seul suffit
// (jamais de secondes ici, trop précis pour un cumul de plusieurs chansons).
export function formatListeningDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 60) return "< 1 min";
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}
