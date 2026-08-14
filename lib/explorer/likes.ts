// Suivi des likes anonymes — un par chanson et par appareil, sans compte.
// localStorage est le seul état possible ici : pas d'identité utilisateur à
// engager pour un simple cœur cliqué. À appeler uniquement côté client, après
// montage (voir le pattern SSR déjà utilisé par CountUp/Reveal) pour éviter
// tout décalage d'hydratation entre le rendu serveur et l'état réel du visiteur.

const STORAGE_KEY = "griot_liked_songs";

function readLikedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function hasLiked(publishedSongId: string): boolean {
  if (typeof window === "undefined") return false;
  return readLikedIds().includes(publishedSongId);
}

// Retourne false si déjà aimée (rien à faire côté appelant) ; true si le like
// vient d'être enregistré.
export function recordLike(publishedSongId: string): boolean {
  if (typeof window === "undefined") return false;
  const liked = readLikedIds();
  if (liked.includes(publishedSongId)) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...liked, publishedSongId]));
  } catch {
    return false;
  }
  return true;
}

// Symétrique de recordLike — un like doit pouvoir se reprendre. Retourne
// false si elle n'était pas aimée (rien à faire) ; true si le retrait vient
// d'avoir lieu.
export function removeLike(publishedSongId: string): boolean {
  if (typeof window === "undefined") return false;
  const liked = readLikedIds();
  if (!liked.includes(publishedSongId)) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(liked.filter((id) => id !== publishedSongId)));
  } catch {
    return false;
  }
  return true;
}
