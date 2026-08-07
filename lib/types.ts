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
}

export interface OccasionMeta {
  id: Occasion;
  label: string;
  tagline: string;
  icon: LucideIcon;
}

export interface DashboardUser {
  firstName: string;
  initials: string;
  creditBalance: number;
}
