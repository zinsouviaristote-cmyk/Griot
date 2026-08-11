// `Intl.NumberFormat("fr-FR")` sépare les milliers par une espace fine
// insécable (U+202F) — combinée à l'espace normale ajoutée avant "FCFA", les
// deux caractères d'espace de largeur différente rendaient un espacement
// irrégulier ("5 900  FCFA"). Formatage manuel pour un seul type d'espace.
export function formatFcfa(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} FCFA`;
}
