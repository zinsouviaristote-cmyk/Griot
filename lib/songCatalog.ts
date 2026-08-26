import {
  Cake,
  Feather,
  Gem,
  Heart,
  Trophy,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import type { OccasionMeta, Song } from "@/lib/types";

// Les occasions se distinguent par leur icône et une nuance propre.
// Libellé et accroche ne sont pas stockés ici : voir lib/i18n/catalog.ts
// (occasionLabel, occasionTagline).
export const occasionCatalog: OccasionMeta[] = [
  { id: "anniversaire", icon: Cake },
  { id: "amour", icon: Heart },
  { id: "mariage", icon: Gem },
  { id: "reussite", icon: Trophy },
  { id: "celebration", icon: PartyPopper },
  { id: "hommage", icon: Feather },
  { id: "autre", icon: Sparkles },
];

// Identifiants de style, dans l'ordre d'affichage du produit.
export const MUSIC_STYLE_IDS: Song["style"][] = [
  "afrobeat",
  "coupe_decale",
  "gospel",
  "zouk",
  "rnb",
  "afropop",
  "amapiano",
  "reggae",
  "pop",
  "piano_voix",
  "jazz",
  "rap_hiphop",
  "afro_soul",
];
