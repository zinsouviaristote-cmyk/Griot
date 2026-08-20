// Le lecteur persistant vit désormais dans app/layout.tsx (racine) pour
// survivre à toute navigation — y compris vers des écrans hors du tableau de
// bord (tunnel, connexion) qui n'ont ni sidebar ni barre basse. Il a donc
// besoin de savoir, depuis le seul chemin courant, si ce décor existe pour
// décaler correctement sa barre desktop (à droite de la sidebar) et sa barre
// mobile (au-dessus de BottomNav). Liste positive plutôt que négative : un
// chemin non reconnu (404 compris) est traité par défaut comme "sans décor",
// jamais l'inverse, pour ne jamais réserver un espace de sidebar qui n'existe pas.
const SHELL_PATH_PATTERNS = [
  /^\/tableau-de-bord$/,
  /^\/explorer$/,
  /^\/historiques(\/.*)?$/,
  /^\/publications$/,
  /^\/statistiques$/,
  /^\/parametres$/,
  /^\/profil$/,
  /^\/recharger$/,
];

export function isDashboardShellRoute(pathname: string): boolean {
  return SHELL_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}
