// Suivi des écoutes comptées — une par chanson et par session, déclenchée après
// cinq secondes de lecture effective. sessionStorage (pas localStorage comme
// pour les likes, voir explorer/likes.ts) : une écoute se recompte à la
// prochaine visite, un like jamais — ce sont deux durées de vie différentes.

const STORAGE_KEY = "griot_counted_listens";

function readCountedIds(): string[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function hasCountedListen(publishedSongId: string): boolean {
  if (typeof window === "undefined") return false;
  return readCountedIds().includes(publishedSongId);
}

// Retourne false si déjà comptée cette session (rien à faire côté appelant) ;
// true si l'écoute vient d'être enregistrée.
export function recordListen(publishedSongId: string): boolean {
  if (typeof window === "undefined") return false;
  const counted = readCountedIds();
  if (counted.includes(publishedSongId)) return false;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...counted, publishedSongId]));
  } catch {
    return false;
  }
  return true;
}
