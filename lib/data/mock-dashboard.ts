import { Cake, Feather, Gem, Heart, Trophy } from "lucide-react";
import type { DashboardUser, OccasionMeta, Song } from "@/lib/types";

// Module unique de données fictives pour le tableau de bord.
// Aucun appel réseau, aucune base : à remplacer par les requêtes Supabase en Phase 2
// sans changer la forme des données consommées par les composants.

// creditBalance est un solde de Notes (une Note = un essai de génération
// audio) — 6, cohérent avec l'historique de mock-credits.ts.
export const mockUser: DashboardUser = {
  firstName: "Aïcha",
  initials: "AK",
  email: "aicha.k@example.com",
  creditBalance: 6,
  phone: "07 00 00 00 00",
  language: "Français",
};

// Les occasions se distinguent par leur icône, leur texte, et une nuance propre —
// toujours dérivée du violet de marque (voir occasion.* dans tailwind.config.ts),
// jamais une couleur indépendante. Le mapping id → classes vit dans OccasionCard.tsx,
// au même endroit que les autres lookups de teinte du produit (TONE_CLASSES).
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

const FATOU_LYRICS = `Fatou, ma mère,
depuis toujours tu illumines mes jours.

[Couplet 1]
Je me souviens de tes mains qui berçaient,
de ta voix douce quand le soir tombait.
Aujourd'hui c'est à moi de te le dire,
merci maman, pour ce que tu as bâti.

[Refrain]
Fatou, Fatou,
cette chanson est pour toi,
Fatou, Fatou,
joyeux anniversaire, une fois pour toutes.

[Couplet 2]
Chaque année qui passe est un cadeau,
et toi tu en es le plus beau.
Que cette musique te le dise,
mieux que je ne saurais le faire moi-même.

[Refrain]
Fatou, Fatou,
cette chanson est pour toi,
Fatou, Fatou,
joyeux anniversaire, une fois pour toutes.`;

const MOUSSA_LYRICS = `Moussa, mon ami,
te voilà arrivé au sommet.

[Couplet 1]
On a traversé les mêmes galères,
tu n'as jamais baissé les bras, mon frère.
Cette réussite, tu la mérites,
elle porte le prix de tes nuits petites.

[Refrain]
Moussa, Moussa,
cette chanson est pour toi,
Moussa, Moussa,
bravo pour cette victoire, une fois pour toutes.

[Couplet 2]
Que la fête commence, que la musique joue,
pour celui qui n'a jamais dit "je ne peux pas".
Que cette chanson te le dise,
mieux que je ne saurais le faire moi-même.

[Refrain]
Moussa, Moussa,
cette chanson est pour toi,
Moussa, Moussa,
bravo pour cette victoire, une fois pour toutes.`;

// Couvre les sept statuts (y compris "draft", absent avant) : la bibliothèque et
// son détail doivent pouvoir se vérifier dans chaque état, pas seulement les cas
// heureux.
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
    audioUrl: "/mock-audio.wav",
    lyrics: FATOU_LYRICS,
    contactId: "contact_1",
    listens: 24,
  },
  {
    id: "song_2",
    recipientFirstName: "Moussa",
    relationship: "mon ami·e",
    occasion: "reussite",
    style: "coupe_decale",
    status: "paid",
    createdAt: "2026-07-28",
    durationSeconds: 121,
    audioUrl: "/mock-audio.wav",
    lyrics: MOUSSA_LYRICS,
    contactId: "contact_2",
    listens: 17,
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
    audioUrl: "/mock-audio.wav",
    lyrics: null,
    contactId: "contact_3",
    listens: 5,
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
    audioUrl: "/mock-audio.wav",
    lyrics: null,
    contactId: "contact_4",
    listens: 2,
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
    audioUrl: null,
    lyrics: null,
    contactId: "contact_5",
    listens: 0,
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
    audioUrl: null,
    lyrics: null,
    contactId: "contact_6",
    listens: 0,
  },
  {
    id: "song_7",
    recipientFirstName: "Yacouba",
    relationship: "mon grand-père",
    occasion: "anniversaire",
    style: "ballade_acoustique",
    status: "draft",
    createdAt: "2026-08-06",
    durationSeconds: null,
    audioUrl: null,
    lyrics: null,
    contactId: "contact_7",
    listens: 0,
  },
];

export function getOccasionLabel(occasion: Song["occasion"]): string {
  return occasionCatalog.find((item) => item.id === occasion)?.label ?? occasion;
}

export function getSongById(id: string): Song | undefined {
  return mockSongs.find((song) => song.id === id);
}

export const styleLabels: Record<Song["style"], string> = {
  afrobeat: "Afrobeat",
  coupe_decale: "Coupé-décalé",
  gospel: "Gospel",
  ballade_acoustique: "Ballade acoustique",
  zouk: "Zouk",
};

