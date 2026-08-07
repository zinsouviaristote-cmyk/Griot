import { Cake, Feather, Gem, Heart, Trophy } from "lucide-react";
import type { DashboardUser, OccasionMeta, Song } from "@/lib/types";

// Module unique de données fictives pour le tableau de bord.
// Aucun appel réseau, aucune base : à remplacer par les requêtes Supabase en Phase 2
// sans changer la forme des données consommées par les composants.

export const mockUser: DashboardUser = {
  firstName: "Aïcha",
  initials: "AK",
  email: "aicha.k@example.com",
  creditBalance: 3,
};

// Une seule couleur de marque : les occasions se distinguent par leur icône et leur
// texte, jamais par une teinte différente — pas de dégradés arc-en-ciel par carte.
export const occasionCatalog: OccasionMeta[] = [
  {
    id: "anniversaire",
    label: "Anniversaire",
    tagline: "Surprenez avec une chanson rien que pour son grand jour.",
    icon: Cake,
  },
  {
    id: "amour",
    label: "Amour",
    tagline: "Dites-le en musique, une fois n'est pas coutume.",
    icon: Heart,
  },
  {
    id: "mariage",
    label: "Mariage",
    tagline: "Un cadeau qui reste, longtemps après la fête.",
    icon: Gem,
  },
  {
    id: "reussite",
    label: "Réussite",
    tagline: "Célébrez un diplôme, une promotion, une victoire.",
    icon: Trophy,
  },
  {
    id: "hommage",
    label: "Hommage",
    tagline: "Une mélodie pour honorer un être cher.",
    icon: Feather,
  },
];

export const mockSongs: Song[] = [
  {
    id: "song_1",
    recipientFirstName: "Fatou",
    relationship: "ma mère",
    occasion: "anniversaire",
    style: "afrobeat",
    status: "delivered",
    createdAt: "2026-08-02",
    durationSeconds: 138,
  },
  {
    id: "song_2",
    recipientFirstName: "Moussa",
    relationship: "mon ami",
    occasion: "reussite",
    style: "coupe_decale",
    status: "paid",
    createdAt: "2026-07-28",
    durationSeconds: 121,
  },
  {
    id: "song_3",
    recipientFirstName: "Awa",
    relationship: "ma femme",
    occasion: "amour",
    style: "zouk",
    status: "preview_ready",
    createdAt: "2026-07-24",
    durationSeconds: null,
  },
  {
    id: "song_4",
    recipientFirstName: "Ibrahim",
    relationship: "mon père",
    occasion: "hommage",
    style: "gospel",
    status: "awaiting_payment",
    createdAt: "2026-07-19",
    durationSeconds: null,
  },
  {
    id: "song_5",
    recipientFirstName: "Aminata",
    relationship: "ma sœur",
    occasion: "mariage",
    style: "ballade_acoustique",
    status: "generating",
    createdAt: "2026-07-15",
    durationSeconds: null,
  },
  {
    id: "song_6",
    recipientFirstName: "Kader",
    relationship: "mon collègue",
    occasion: "reussite",
    style: "afrobeat",
    status: "failed",
    createdAt: "2026-07-10",
    durationSeconds: null,
  },
];

export function getOccasionLabel(occasion: Song["occasion"]): string {
  return occasionCatalog.find((item) => item.id === occasion)?.label ?? occasion;
}

export const styleLabels: Record<Song["style"], string> = {
  afrobeat: "Afrobeat",
  coupe_decale: "Coupé-décalé",
  gospel: "Gospel",
  ballade_acoustique: "Ballade acoustique",
  zouk: "Zouk",
};

// Aïcha a acheté le pack de 5 chansons (5 900 FCFA) et en a déjà consommé deux
// (song_1 livrée, song_2 payée) — il lui en reste 3, cohérent avec mockUser.creditBalance.
export const dashboardStats = {
  creditsRestants: mockUser.creditBalance,
  chansonsCreees: mockSongs.length,
  chansonsOffertes: mockSongs.filter((s) => s.relationship !== "moi-même").length,
  totalDepenseFcfa: 5900,
};
