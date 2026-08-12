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

export type Occasion = "anniversaire" | "amour" | "mariage" | "reussite" | "hommage";

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
  // Non nul dès l'extrait généré (preview_ready et au-delà) ; les paroles ne le
  // sont qu'après paiement (paid/delivered) — le paiement débloque du contenu
  // réel, pas seulement une étiquette d'état.
  audioUrl: string | null;
  lyrics: string | null;
  // Lien vers Mes proches quand la chanson a été créée pour un contact enregistré
  // (via le tunnel ou "Créer une chanson pour X"). Nul pour les chansons plus
  // anciennes ou dont le contact a depuis été supprimé — la chanson reste
  // affichable, seule cette référence croisée disparaît.
  contactId: string | null;
  // Nombre de lectures de l'extrait ou de la chanson complète, tous appareils
  // confondus — 0 tant qu'aucun audio n'existe (draft, generating, failed).
  listens: number;
}

export interface Contact {
  id: string;
  firstName: string;
  relationship: Relationship;
  // "YYYY-MM-DD" — seuls le mois et le jour comptent dans tous les calculs
  // (prochaine occurrence, rappel), l'année de naissance n'est jamais affichée.
  birthday: string;
  phone: string | null;
  note: string | null;
}

// Contrairement à `Song`/`Contact`, cette interface ne porte plus `label`
// ni `tagline` : les deux sont désormais des traductions (voir
// lib/i18n/catalog.ts, occasionLabel/occasionTagline), jamais un texte figé
// dans les données — seule l'icône reste propre à l'occasion elle-même.
export interface OccasionMeta {
  id: Occasion;
  icon: LucideIcon;
}

export interface DashboardUser {
  firstName: string;
  initials: string;
  // Adresse du compte Google lié — seule identité du produit depuis le retrait
  // du mot de passe, non modifiable directement (voir Paramètres > Mon profil).
  email: string;
  creditBalance: number;
  // Facultatif : sert uniquement aux rappels et à la livraison WhatsApp (voir
  // Paramètres > Notifications), plus jamais un identifiant de connexion.
  phone: string | null;
}

// Une chanson publiée dans Explorer — entité distincte de Song : la publication
// est un choix explicite et réversible, jamais un attribut permanent de la
// chanson d'origine. `sourceSongId` relie une publication à une chanson réelle
// de la bibliothèque de son auteur quand elle existe (nul pour les publications
// fictives d'autres utilisateurs dans les données de démonstration).
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
  // Téléchargements du MP3 depuis cette publication précisément (Statistiques) —
  // distinct des téléchargements possibles depuis la bibliothèque privée, jamais
  // comptés ici : cette page ne parle que de ce que le public a fait.
  downloads: number;
  publishedAt: string;
  // Le pseudonyme public de l'auteur (celui qui a offert la chanson, pas le
  // destinataire) — affiché avec un avatar d'initiales dans Explorer, jamais
  // une photo (voir occasionTones.ts pour la même règle sur les pochettes).
  authorName: string;
  // Courtes lignes de paroles, pour l'aperçu (première ligne) et la
  // surimpression "Paroles" du lecteur immersif d'Explorer.
  lyrics: string[];
}

// Un mouvement du solde de Notes — achat (Mobile Money/carte), essai (une
// génération audio ; 0 pour le premier essai gratuit d'une chanson) ou
// remboursement (échec de génération). `balanceAfter` est stocké plutôt que
// recalculé : l'historique reste lisible ligne par ligne, sans dépendre de
// l'ordre d'affichage pour rester cohérent.
export type CreditMotif = "achat" | "essai" | "remboursement";

export interface CreditTransaction {
  id: string;
  date: string;
  motif: CreditMotif;
  // Clé de traduction (espace de noms recharge.history.transactions) plutôt
  // qu'un texte déjà composé — une ligne d'historique doit s'afficher dans la
  // langue d'interface courante, jamais figée dans celle où la donnée a été
  // écrite.
  labelKey: string;
  labelParams?: Record<string, string | number>;
  delta: number;
  balanceAfter: number;
}
