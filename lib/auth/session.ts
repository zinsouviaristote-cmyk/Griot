// Phase 1 : aucune session serveur réelle — seulement un cookie posé au
// moment où le flux de connexion simulé (Google ou lien magique) aboutit.
// Il sert un seul but : permettre à "/" (la landing) de distinguer un
// premier visiteur d'une personne déjà entrée, pour la renvoyer directement
// vers son tableau de bord plutôt que de lui remontrer la page publique.
// Remplacé par un vrai cookie de session signé côté serveur en Phase 2.
export const SESSION_COOKIE_NAME = "griot_session";

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function markMockSessionActive(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

// Posé à côté de chaque lien « Se déconnecter » — sans ça, "/" continuerait à
// voir le cookie et renverrait aussitôt vers le tableau de bord, rendant la
// déconnexion (et le logo de /connexion vers la landing) sans effet visible.
export function clearMockSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
