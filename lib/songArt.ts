// Ordre de priorité unique pour la pochette d'une chanson, appliqué partout
// (bibliothèque, Explorer, fiche détail, page publique, aperçu WhatsApp) :
// l'image propre à la chanson d'abord, sinon la photo de profil de son
// auteur, sinon rien — TrackArt se charge alors du dégradé d'occasion.
// Jamais de rectangle gris : ce résolveur ne renvoie que "une vraie image" ou
// `null`, jamais une valeur qui inviterait à en afficher une cassée.
export function resolveSongArt(songImageUrl: string | null, authorPhotoUrl: string | null): string | null {
  return songImageUrl ?? authorPhotoUrl ?? null;
}
