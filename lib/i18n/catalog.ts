import type { Occasion, MusicStyle } from "@/lib/types";

// Traduction des catalogues partagés (occasions, styles, liens avec le
// destinataire) — `t` vient toujours de useLanguage(), jamais importé ici
// directement. Un seul endroit par catalogue.

type Translate = (
  key: string,
  vars?: Record<string, string | number>
) => string;

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
// ce module, jamais changé ici pour ne pas migrer les données existantes.
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

export function relationshipLabel(
  t: Translate,
  value: string | null
): string {
  if (!value) return "";

  const key = RELATIONSHIP_KEY_BY_VALUE[value];

  return key
    ? t(`catalog.relationships.${key}`)
    : value;
}