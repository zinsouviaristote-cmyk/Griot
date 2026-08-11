export function formatDateFr(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

// `new Date("YYYY-MM-DD")` parse en UTC minuit : dans un fuseau à décalage négatif,
// le jour affiché glisse d'une unité. Construction en heure locale à partir des
// composantes pour que la date affichée corresponde toujours au jour saisi.
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DAY_MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });

export function formatDayMonthFr(date: Date): string {
  return DAY_MONTH_FORMATTER.format(date);
}

// Seuls le mois et le jour d'un anniversaire comptent — l'année stockée ne sert
// qu'à remplir un <input type="date">. Renvoie la prochaine occurrence à partir
// d'aujourd'hui (cette année si elle n'est pas encore passée, sinon l'an prochain).
export function getNextOccurrence(birthdayIso: string, from: Date = new Date()): Date {
  const [, month, day] = birthdayIso.split("-").map(Number);
  const todayMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let next = new Date(from.getFullYear(), month - 1, day);
  if (next < todayMidnight) {
    next = new Date(from.getFullYear() + 1, month - 1, day);
  }
  return next;
}

export function getDaysUntil(date: Date, from: Date = new Date()): number {
  const todayMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((date.getTime() - todayMidnight.getTime()) / 86_400_000);
}
