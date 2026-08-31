import type { LucideIcon } from "lucide-react";

// Types partagés — dérivés de l'énumération songs.status du modèle de données (Phase 2 du plan).
// Un composant qui affiche un statut importe toujours depuis ici, jamais une chaîne libre.

export type SongStatus =
  | "draft"
  | "generating"
  | "preview_ready"
  | "awaiting_payment"
  | "paid"
  | "delivered"
  | "failed";

// Occasions disponibles pour la création d'une chanson.
// Cette liste est volontairement courte afin de garder l'interface simple.
export type Occasion =
  | "anniversaire"
  | "amour"
  | "mariage"
  | "reussite"
  | "celebration"
  | "hommage"
  | "autre";

export type MusicStyle =
  | "afrobeat"
  | "coupe_decale"
  | "gospel"
  | "zouk"
  | "rnb"
  | "afropop"
  | "amapiano"
  | "reggae"
  | "pop"
  | "piano_voix"
  | "jazz"
  | "rap_hiphop"
  | "afro_soul";

export interface Song {
  id: string;
  recipientFirstName: string;
  occasion: Occasion;
  style: MusicStyle;
  status: SongStatus;
  createdAt: string;
  durationSeconds: number | null;

  // Non nul dès l'extrait généré (preview_ready et au-delà) ;
  // les paroles ne le sont qu'après paiement (paid/delivered).
  audioUrl: string | null;

  // Chemin brut (pas une URL) du fichier maître complet dans le bucket privé
  // song-masters — jamais utilisable tel quel, seulement pour générer une URL
  // signée (voir resolveSongMasterUrl). Réservé à l'admin pour l'instant :
  // aucune politique storage.objects ne permet encore à un client payant d'y
  // accéder (livraison post-paiement non implémentée).
  audioMasterPath: string | null;
  lyrics: string | null;

  // Lien vers Mes proches quand la chanson a été créée pour un contact enregistré.
  contactId: string | null;

  // Nombre de lectures de l'extrait ou de la chanson complète.
  listens: number;

  // Pochette téléversée par l'utilisateur.
  imageUrl: string | null;
}

export interface Contact {
  id: string;
  firstName: string;

  phone: string | null;
  note: string | null;
}

// Contrairement à `Song`/`Contact`, cette interface ne porte plus `label`
// ni `tagline` : les deux sont désormais des traductions
// (voir lib/i18n/catalog.ts).
export interface OccasionMeta {
  id: Occasion;
  icon: LucideIcon;
}

export interface DashboardUser {
  id: string;

  firstName: string;
  initials: string;

  // Adresse du compte Google lié.
  email: string;

  creditBalance: number;

  // Facultatif : sert uniquement aux rappels et à la livraison WhatsApp.
  phone: string | null;

  // Photo de profil.
  photoUrl: string | null;

  // Génère gratuitement (voir request_song_generation) et écoute la version
  // complète de ses chansons sans payer (voir la fiche chanson) — jamais
  // affiché ni exploité ailleurs que dans ces deux parcours.
  isAdmin: boolean;
}

// Une chanson publiée dans Explorer.
export interface PublishedSong {
  id: string;
  sourceSongId: string | null;
  mine: boolean;
  recipientFirstName: string;
  hideFirstName: boolean;
  publicTitle: string | null;
  occasion: Occasion;
  style: MusicStyle;
  audioUrl: string;
  likes: number;
  listens: number;

  // Téléchargements du MP3 depuis cette publication précisément.
  downloads: number;

  publishedAt: string;

  // Pseudonyme public de l'auteur.
  authorName: string;

  // Photo de profil de l'auteur⋅ice au moment de la publication — nulle si
  // iel n'en avait pas, l'avatar retombe alors sur ses initiales.
  authorPhotoUrl: string | null;

  // Pochette résolue et figée au moment de la publication.
  imageUrl: string | null;

  // Courtes lignes de paroles pour l'aperçu.
  lyrics: string[];
}

// Un mouvement du solde de Notes.
export type CreditMotif = "achat" | "essai" | "remboursement";

export interface CreditTransaction {
  id: string;
  date: string;
  motif: CreditMotif;

  // Clé de traduction.
  labelKey: string;
  labelParams?: Record<string, string | number>;

  delta: number;
  balanceAfter: number;
}

// Totaux agrégés des publications Explorer de l'utilisateur courant — voir
// lib/supabase/statsAdapters.ts.
export interface MyStatsTotals {
  listens: number;
  likes: number;
  downloads: number;
  listeningSeconds: number;
  publishedCount: number;
}

export interface ListenPoint {
  date: string;
  label: string;
  count: number;
}

export interface ActivityEntry {
  id: string;
  type: "like" | "listen";
  displayName: string;
  minutesAgo: number;
}

// Aucune infrastructure de suivi de parrainage n'existe encore (pas de table
// dédiée) : ces deux nombres restent à 0 tant qu'elle n'est pas construite —
// jamais une valeur inventée pour remplir la carte.
export interface ReferralStats {
  pageOpens: number;
  songsCreated: number;
}