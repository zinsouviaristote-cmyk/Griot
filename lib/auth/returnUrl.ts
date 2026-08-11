// Ajoute (ou remplace) des paramètres sur une URL de retour relative, sans
// perdre ceux déjà présents (ex. ?prenom=&occasion= sur /creer) — utilisé pour
// poser le résultat d'une connexion (auth, email, provider) sur l'URL de
// destination avant la redirection retour.
export function withParams(returnTo: string, params: Record<string, string>): string {
  const [path, existingQuery] = returnTo.split("?");
  const search = new URLSearchParams(existingQuery ?? "");
  for (const [key, value] of Object.entries(params)) search.set(key, value);
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

// Détermine le point de retour par défaut d'une page /connexion visitée
// directement (hors tunnel) — le tableau de bord, jamais /creer, qui n'a de
// sens qu'accompagné de l'état d'un tunnel en cours.
export const DEFAULT_RETURN_TO = "/";
