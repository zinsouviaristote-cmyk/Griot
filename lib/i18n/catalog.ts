import type { Occasion, MusicStyle } from "@/lib/types";

// Traduction des catalogues partagés (occasions, styles, liens avec le
// destinataire) — `t` vient toujours de useLanguage(), jamais importé ici
// directement (ce module reste appelable depuis des fonctions pures comme
// depuis des composants). Un seul endroit par catalogue, pour que le tunnel,
// la bibliothèque, Explorer et la publication affichent toujours le même mot.

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function occasionLabel(t: Translate, id: Occasion): string {
  return t(`catalog.occasions.${id}.label`);
}

export function occasionTagline(t: Translate, id: Occasion): string {
  return t(`catalog.occasions.${id}.tagline`);
}

export function styleLabel(t: Translate, id: MusicStyle): string {
  return t(`catalog.styles.${id}.label`);
}

export function styleTagline(t: Translate, id: MusicStyle): string {
  return t(`catalog.styles.${id}.tagline`);
}

// Les chips de lien (RELATIONSHIP_OPTIONS) stockent la phrase française
// elle-même comme identifiant ("ma mère", "mon père"…) — un choix antérieur à
// ce module, jamais changé ici pour ne pas migrer les données existantes
// (chansons et contacts déjà enregistrés). Cette table fait le pont entre cet
// identifiant et la clé de traduction ; toute valeur hors de ce jeu fermé
// (saisie libre via "autre") est un texte écrit par la personne elle-même et
// n'est jamais traduite — elle est retournée telle quelle.
const RELATIONSHIP_KEY_BY_VALUE: Record<string, string> = {
  "ma mère": "mother",
  "mon père": "father",
  "ma femme": "wife",
  "mon mari": "husband",
  "mon frère": "brother",
  "ma sœur": "sister",
  "mon ami·e": "friend",
  "mon enfant": "child",
  "ma grand-mère": "grandmother",
  "mon grand-père": "grandfather",
  autre: "other",
};

export function relationshipLabel(t: Translate, value: string | null): string {
  if (!value) return "";
  const key = RELATIONSHIP_KEY_BY_VALUE[value];
  return key ? t(`catalog.relationships.${key}`) : value;
}
