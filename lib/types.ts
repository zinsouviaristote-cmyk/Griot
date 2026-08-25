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

// Vocabulaire du lien avec le destinataire, utilisé par le tunnel (écran
// destinataire) — un seul endroit pour cette liste fermée, jamais une chaîne
// libre dupliquée.
export const RELATIONSHIP_OPTIONS = [
  "ma mère",
  "mon père",
  "ma femme",
  "mon mari",
  "mon frère",
  "ma sœur",
  "mon ami·e",
  "mon enfant",
  "ma grand-mère",
  "mon grand-père",
  "autre",
] as const;

export type Relationship = (typeof RELATIONSHIP_OPTIONS)[number];

export type MusicStyle =
  | "afrobeat"
  | "coupe_decale"
  | "gospel"
  | "ballade_acoustique"
  | "zouk";

export interface Song {
  id: string;
  recipientFirstName: string;
  relationship: string;
  occasion: Occasion;
  style: MusicStyle;
  status: SongStatus;
  createdAt: string;
  durationSeconds: number | null;

  // Non nul dès l'extrait généré (preview_ready et au-delà) ;
  // les paroles ne le sont qu'après paiement (paid/delivered).
  audioUrl: string | null;
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
  relationship: Relationship;

  // "YYYY-MM-DD" — seuls le mois et le jour comptent dans tous les calculs.
  birthday: string;

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
  firstName: string;
  initials: string;

  // Adresse du compte Google lié.
  email: string;

  creditBalance: number;

  // Facultatif : sert uniquement aux rappels et à la livraison WhatsApp.
  phone: string | null;

  // Photo de profil.
  photoUrl: string | null;
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