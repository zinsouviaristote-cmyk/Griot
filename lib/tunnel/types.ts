import type { Occasion, MusicStyle } from "@/lib/types";

import type { Locale } from "@/lib/i18n/locale";

// Ordre des écrans du tunnel — l'index dans ce tableau pilote à la fois la barre
// de progression et les boutons précédent/suivant. Un seul endroit à modifier
// pour réordonner ou insérer un écran.
export const TUNNEL_STEPS = [
  "occasion",
  "recipient",
  "story",
  "style",
  "lyrics",
  "generation",
  "choice",
  "delivery",
] as const;

export type TunnelStep = (typeof TUNNEL_STEPS)[number];

// Les quatre premiers écrans sont un vrai formulaire (retour arrière possible,
// réponses modifiables) ; les quatre suivants sont une séquence de résultats
// (génération → écoute → paiement → livraison) qu'on ne "corrige" pas en
// revenant en arrière — revenir en arrière n'y a pas de sens produit.
export const LAST_EDITABLE_STEP_INDEX =
  TUNNEL_STEPS.indexOf("style");

export type VoiceType = "homme" | "femme";

// "raconte" : l'utilisateur écrit librement, le site compose les paroles.
// "paroles_libres" : l'utilisateur écrit ses propres paroles en brut, le site
// les structure (intro/couplets/refrain) sans changer un mot.
// "paroles_structurees" : le texte porte déjà ses balises [Couplet]/[Refrain] —
// transmis à la lettre, c'est la promesse fondamentale du produit.
export type StoryMode =
  | "raconte"
  | "paroles_libres"
  | "paroles_structurees";

// Un essai = une génération audio à partir des mêmes paroles validées. Chaque
// essai reste écoutable indépendamment — un essai décevant ne doit jamais
// faire perdre un essai précédent qu'on préférait.
export interface SongAttempt {
  id: string;
  index: number;
  audioUrl: string;
  lyrics: string;
  free: boolean;
}

// Minimum volontairement bas — c'est un garde-fou contre "rien écrit du tout",
// pas un test de littérature. Le message d'aide reste bienveillant en dessous.
export const STORY_MIN_LENGTH = 40;

export const STORY_MAX_LENGTH = 800;

// Plafond propre au mode Avancé : des paroles déjà écrites, collées telles
// quelles, dépassent largement le format d'un récit libre — un texte tronqué
// à 800 caractères trahirait la promesse "sans en changer un mot".
export const LYRICS_MAX_LENGTH = 4000;

export interface StyleMeta {
  id: MusicStyle;
  label: string;
  tagline: string;
  festive: boolean;
}

// Taglines propres au tunnel.
export const styleCatalog: StyleMeta[] = [
  {
    id: "afrobeat",
    label: "Afrobeat",
    tagline: "Rythme entraînant, groove chaloupé.",
    festive: true,
  },
  {
    id: "coupe_decale",
    label: "Coupé-décalé",
    tagline: "Énergie de fête, pour danser.",
    festive: true,
  },
  {
    id: "gospel",
    label: "Gospel",
    tagline: "Voix chorale, chaleur et recueillement.",
    festive: false,
  },
  {
    id: "zouk",
    label: "Zouk",
    tagline: "Slow langoureux, à deux.",
    festive: true,
  },
  {
    id: "rnb",
    label: "R&B",
    tagline: "Sensuel, moderne et émotionnel.",
    festive: false,
  },
  {
    id: "afropop",
    label: "Afropop",
    tagline: "Mélodique, moderne et chaleureux.",
    festive: false,
  },
  {
    id: "amapiano",
    label: "Amapiano",
    tagline: "Groove doux, basses profondes et ambiance dansante.",
    festive: true,
  },
  {
    id: "reggae",
    label: "Reggae",
    tagline: "Détendu, chaleureux et positif.",
    festive: false,
  },
  {
    id: "pop",
    label: "Pop",
    tagline: "Mélodie accrocheuse, moderne et accessible.",
    festive: false,
  },
  {
    id: "piano_voix",
    label: "Piano-voix",
    tagline: "Intime, minimaliste et très émotionnel.",
    festive: false,
  },
  {
    id: "jazz",
    label: "Jazz",
    tagline: "Élégant, doux et sophistiqué.",
    festive: false,
  },
  {
    id: "rap_hiphop",
    label: "Rap / Hip-hop",
    tagline: "Moderne, personnel et rythmé.",
    festive: true,
  },
  {
    id: "afro_soul",
    label: "Afro-soul",
    tagline: "Mélange d'Afrobeat et de soul, parfait pour les déclarations.",
    festive: false,
  },
];

export interface CreditPack {
  id: "pack1" | "pack3" | "pack5";
  songs: number;
  priceFcfa: number;
  featured?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack1",
    songs: 1,
    priceFcfa: 1900,
  },
  {
    id: "pack3",
    songs: 3,
    priceFcfa: 3900,
    featured: true,
  },
  {
    id: "pack5",
    songs: 5,
    priceFcfa: 5900,
  },
  
];

// Une Note = un essai.
export function packNotes(pack: CreditPack): number {
  return pack.songs * 2;
}

type PluralTranslate = (
  key: string,
  count: number,
  vars?: Record<string, string | number>
) => string;

export function formatPackEquivalence(
  pack: CreditPack,
  tn: PluralTranslate
): string {
  const notes = packNotes(pack);

  return `${tn(
    "credits.attemptsCount",
    notes
  )}, ${tn("credits.enoughForSongs", pack.songs)}`;
}

// Forme volontairement plate et sérialisable : c'est exactement le corps qu'un
// futur PATCH /api/tunnel/:id enverrait pour persister la progression côté
// serveur, sans que les écrans aient à changer.
export interface TunnelData {
  occasion: Occasion | null;

  // Rempli uniquement lorsque l'utilisateur choisit "Autre occasion".
  // Pour les occasions prédéfinies, cette valeur reste vide.
  customOccasion: string;

  recipientFirstName: string;

  relationship: string | null;

  // Renseigné quand le destinataire est choisi parmi les chips de contacts
  // connus à l'écran 2 — nul dès que le prénom est retapé à la main, pour ne
  // jamais lier une chanson au mauvais contact.
  contactId: string | null;


  story: string;

  // Choisi par la personne (détecté automatiquement à la saisie, modifiable
  // ensuite) — pilote entièrement ce que l'écran "lyrics" fait du texte.
  storyMode: StoryMode;

  style: MusicStyle | null;

  voiceType: VoiceType | null;

  // Langue dans laquelle la chanson est chantée — distincte de la langue de
  // l'interface.
  songLanguage: Locale;

  // Renseignés une fois la connexion Google (ou le lien magique) aboutie.
  authEmail: string | null;

  authProvider: "google" | "email" | null;

  // Paroles structurées, éditées à l'écran "lyrics".
  lyricsDraft: string | null;

  reformulateCount: number;

  attempts: SongAttempt[];

  selectedAttemptId: string | null;

  // L'essai retenu, une fois choisi.
  audioUrl: string | null;

  lyrics: string | null;

  // Pochette téléversée à l'écran de livraison.
  imageUrl: string | null;

  selectedPack: CreditPack["id"];
}

export const EMPTY_TUNNEL_DATA: TunnelData = {
  occasion: null,

  // Aucun texte personnalisé par défaut.
  customOccasion: "",

  recipientFirstName: "",
  relationship: null,
  contactId: null,
  story: "",
  storyMode: "raconte",
  style: null,
  voiceType: null,
  songLanguage: "fr",
  authEmail: null,
  authProvider: null,
  lyricsDraft: null,
  reformulateCount: 0,
  attempts: [],
  selectedAttemptId: null,
  audioUrl: null,
  lyrics: null,
  imageUrl: null,
  selectedPack: "pack3",
};

// Plafond du bouton "Reformuler".
export const REFORMULATE_LIMIT = 10;

// À partir de cet essai, un compteur discret ("7/10"…) apparaît près du bouton.
export const REFORMULATE_COUNTER_THRESHOLD = 7;

// Détecte le mode "déjà structurées" à la saisie.
const STRUCTURED_TAG_PATTERN =
  /\[(intro|couplet|refrain|pont)\b[^\]]*\]/i;

export function detectStoryMode(text: string): StoryMode {
  return STRUCTURED_TAG_PATTERN.test(text)
    ? "paroles_structurees"
    : "raconte";
}