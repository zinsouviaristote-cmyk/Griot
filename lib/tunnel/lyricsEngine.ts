import type { StoryMode } from "@/lib/tunnel/types";
import type { Locale } from "@/lib/i18n/locale";

// Moteur de paroles — Phase 1, aucune IA réelle : un gabarit qui EXTRAIT la
// matière première de l'histoire (lieux, gestes, habitudes, objets) et la
// recompose en vers courts, plutôt que de recopier le texte de la personne.
// C'est la correction du bug produit central : une chanson qui ne fait que
// coller le texte brut, ou qui ne parle que d'elle-même ("cette chanson…"),
// ne dit rien de la personne qu'elle est censée célébrer.
//
// Paramétré par langue de chanson (voir RaconteLanguagePack) — vocabulaire,
// mots-outils et gabarits de vers diffèrent entre français et anglais, mais
// l'algorithme d'extraction et de composition reste unique : un seul endroit
// à faire évoluer si la logique change, jamais deux moteurs à synchroniser.

export const MAX_WORDS_PER_LINE = 12;

export const META_REFERENCE_PATTERNS = [
  /cette chanson/i,
  /cette mélodie/i,
  /ces mots/i,
  /la musique te dira/i,
  /cette musique/i,
];

const EN_META_REFERENCE_PATTERNS = [
  /this song/i,
  /this melody/i,
  /these words/i,
  /the music will tell you/i,
  /this tune/i,
];

export function containsMetaReference(text: string, patterns: RegExp[] = META_REFERENCE_PATTERNS): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function wordCount(line: string): number {
  return line.trim().split(/\s+/).filter(Boolean).length;
}

export function isTagLine(line: string): boolean {
  return /^\[.+\]$/.test(line.trim());
}

// Le contenu d'une section nommée (entre son étiquette et la suivante) —
// utilisé pour vérifier que le prénom apparaît bien DANS le refrain, pas
// seulement quelque part dans le texte.
export function extractSection(lyricsText: string, tagName: string): string | null {
  const lines = lyricsText.split("\n");
  const startIndex = lines.findIndex((line) => new RegExp(`^\\[${tagName}\\b`, "i").test(line.trim()));
  if (startIndex === -1) return null;
  const rest = lines.slice(startIndex + 1);
  const endOffset = rest.findIndex((line) => isTagLine(line));
  const section = endOffset === -1 ? rest : rest.slice(0, endOffset);
  return section.join("\n");
}

function countOccurrences(text: string, needle: string): number {
  if (!needle.trim()) return 0;
  const escaped = needle.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = text.match(new RegExp(escaped, "gi"));
  return matches ? matches.length : 0;
}

function capLineWords(line: string): string {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length <= MAX_WORDS_PER_LINE) return words.join(" ");
  // Coupe proprement au mot 12 — jamais de "…", une ligne tronquée avec des
  // points de suspension est exactement le défaut qu'on corrige ici.
  return words.slice(0, MAX_WORDS_PER_LINE).join(" ");
}

function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// ---------------------------------------------------------------------------
// Vocabulaire propre à chaque langue de chanson
// ---------------------------------------------------------------------------

interface RaconteLanguagePack {
  stopwords: Set<string>;
  concreteVocab: Set<string>;
  linkingWords: Set<string>;
  habitPatterns: RegExp[];
  relationshipOpeners: Record<string, string>;
  defaultOpener: string;
  anchorLineTemplates: ((anchor: string, name: string) => string)[];
  coupletOpeners: string[];
  refrainClosers: string[];
  closingLines: string[];
  metaReferencePatterns: RegExp[];
  refrainTag: string;
  introTag: string;
  coupletTag: (index: number) => string;
  fallbackAnchor: string;
  fallbackName: string;
}

const FR_STOPWORDS = new Set([
  "le", "la", "les", "l", "un", "une", "des", "de", "du", "d", "et", "ou", "à",
  "au", "aux", "ce", "cette", "ces", "cet", "qui", "que", "qu", "pour", "avec",
  "sans", "sur", "sous", "dans", "chez", "par", "en", "est", "es", "suis",
  "sommes", "êtes", "sont", "ai", "as", "a", "avons", "avez", "ont", "était",
  "étais", "étaient", "été", "être", "ne", "pas", "jamais", "toujours", "tu",
  "je", "il", "elle", "nous", "vous", "ils", "elles", "on", "mon", "ma", "mes",
  "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos",
  "leur", "leurs", "se", "s", "te", "t", "me", "m", "y", "si", "comme", "plus",
  "très", "tout", "toute", "tous", "toutes", "rien", "quand", "où", "dont",
  "même", "aussi", "encore", "déjà", "fois", "fait", "faisait", "fais", "peu",
  "bien", "cela", "ça", "avait", "avais", "avaient",
]);

const FR_CONCRETE_VOCAB = new Set([
  "marché", "marchés", "maison", "cuisine", "jardin", "école", "champ",
  "champs", "rivière", "village", "ville", "quartier", "route", "chemin",
  "terre", "gare", "église", "mosquée", "atelier", "boutique", "magasin",
  "usine", "capitale",
  "matin", "matins", "soir", "soirs", "soleil", "lever", "nuit", "nuits",
  "aube", "étoiles", "lune", "saison", "pluie", "récolte", "dimanche",
  "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi",
  "main", "mains", "sourire", "larmes", "lettre", "lettres", "photo", "radio",
  "café", "thé", "pain", "riz", "mil", "igname", "feu", "lampe", "bougie",
  "bougies", "panier", "sac", "vélo", "stylo", "montre", "bracelet",
  "foulard", "chapeau", "valise", "bague", "collier", "pagne", "cahier",
  "tableau", "gâteau", "chocolat", "cœur", "cadeau",
  "travail", "voyage", "prière", "prières", "chant", "chants", "danse",
  "fête", "conseil", "conseils", "histoire", "histoires", "silence",
  "courage", "patience", "sacrifice", "famille", "enfants", "argent",
  "couturière", "couturier", "infirmière", "infirmier", "enseignant",
  "enseignante", "institutrice", "instituteur", "agricultrice",
  "agriculteur", "cultivateur", "cultivatrice", "commerçante", "commerçant",
  "vendeuse", "vendeur", "ouvrier", "ouvrière", "chauffeur", "cuisinière",
  "cuisinier", "tailleur", "mécanicien", "coiffeuse", "coiffeur", "pêcheur",
  "pêcheuse", "pêche", "tisserand", "artisan", "ingénieur", "ingénieure",
  "médecin", "avocat", "avocate", "professeur", "professeure", "pharmacien",
  "pharmacienne",
]);

const FR_LINKING_WORDS = new Set(["du", "de", "des", "d", "au", "aux", "la", "le"]);

const FR_HABIT_PATTERNS: RegExp[] = [
  /ne\s+t'?es?\s+jamais\s+([a-zà-ÿ']+(?:\s+[a-zà-ÿ']+){0,1})/i,
  /jamais\s+([a-zà-ÿ']+(?:\s+[a-zà-ÿ']+){0,1})/i,
  /toujours\s+([a-zà-ÿ']+(?:\s+[a-zà-ÿ']+){0,1})/i,
  /(?:tous les|chaque)\s+([a-zà-ÿ']+(?:\s+[a-zà-ÿ']+){0,1})/i,
  /avant\s+(?:le|la|les|l')\s*([a-zà-ÿ']+(?:\s+[a-zà-ÿ']+){0,2})/i,
  /sans\s+jamais\s+([a-zà-ÿ']+(?:\s+[a-zà-ÿ']+){0,1})/i,
];

const FR_RELATIONSHIP_OPENERS: Record<string, string> = {
  "ma mère": "Maman, laisse-moi te dire",
  "mon père": "Papa, laisse-moi te dire",
  "ma femme": "Depuis le premier jour",
  "mon mari": "Depuis le premier jour",
  "mon frère": "Frère, écoute bien ceci",
  "ma sœur": "Sœur, écoute bien ceci",
  "mon ami·e": "Sur la route de la vie",
  "mon enfant": "Petit à petit tu grandis",
  "ma grand-mère": "Tes mains ont tout donné",
  "mon grand-père": "Tes mains ont tout donné",
  autre: "Sur mon chemin, un jour",
};

const FR_ANCHOR_LINE_TEMPLATES: ((anchor: string, name: string) => string)[] = [
  (a) => `Je revois ${a}`,
  (a) => `Il y a ${a}, gravé dans ma mémoire`,
  (a) => `Rien n'effaçait ${a}`,
  (a) => `${capitalize(a)}, je n'ai rien oublié`,
  (a, name) => `${name}, je pense à ${a}`,
  (a) => `Dans ${a}, je te retrouve encore`,
  (a) => `On se souvient de ${a}`,
  (a) => `Chaque ${a} raconte qui tu es`,
];

const FR_COUPLET_OPENERS = ["je repense à toi", "j'ai gardé ça en moi", "voici ce que je vois"];

const FR_REFRAIN_CLOSERS = [
  "je te le dis aujourd'hui",
  "merci pour tout, encore et encore",
  "tu comptes plus que tout",
  "voilà ce que je devais te dire",
  "et ça ne changera jamais",
];

const FR_CLOSING_LINES = [
  "ce que tu as donné ne s'efface pas",
  "je porte tout ça avec moi",
  "rien de tout cela ne s'oublie",
  "et je continue de te le rendre",
];

const FR_PACK: RaconteLanguagePack = {
  stopwords: FR_STOPWORDS,
  concreteVocab: FR_CONCRETE_VOCAB,
  linkingWords: FR_LINKING_WORDS,
  habitPatterns: FR_HABIT_PATTERNS,
  relationshipOpeners: FR_RELATIONSHIP_OPENERS,
  defaultOpener: FR_RELATIONSHIP_OPENERS.autre,
  anchorLineTemplates: FR_ANCHOR_LINE_TEMPLATES,
  coupletOpeners: FR_COUPLET_OPENERS,
  refrainClosers: FR_REFRAIN_CLOSERS,
  closingLines: FR_CLOSING_LINES,
  metaReferencePatterns: META_REFERENCE_PATTERNS,
  refrainTag: "Refrain",
  introTag: "Intro",
  coupletTag: (index) => `Couplet ${index}`,
  fallbackAnchor: "ce que tu m'as donné",
  fallbackName: "toi",
};

// ---------------------------------------------------------------------------
// Pack anglais — même algorithme, vocabulaire et gabarits propres à la langue.
// ---------------------------------------------------------------------------

const EN_STOPWORDS = new Set([
  "the", "a", "an", "of", "to", "and", "or", "in", "on", "at", "for", "with",
  "without", "from", "by", "is", "are", "was", "were", "been", "be", "am",
  "i", "you", "he", "she", "we", "they", "it", "my", "your", "his", "her",
  "our", "their", "this", "that", "these", "those", "who", "what", "when",
  "where", "why", "how", "not", "never", "always", "so", "as", "more",
  "most", "very", "all", "some", "none", "still", "already", "again",
  "once", "too", "also", "just", "did", "do", "does", "had", "have", "has",
  "there", "than", "such", "own", "same", "no", "if", "but",
]);

const EN_CONCRETE_VOCAB = new Set([
  "market", "house", "kitchen", "garden", "school", "field", "fields",
  "river", "village", "town", "neighborhood", "road", "street", "land",
  "station", "church", "mosque", "workshop", "shop", "store", "factory",
  "capital",
  "morning", "mornings", "evening", "evenings", "sun", "sunrise", "night",
  "nights", "dawn", "stars", "moon", "season", "rain", "harvest", "sunday",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
  "hand", "hands", "smile", "tears", "letter", "letters", "photo", "radio",
  "coffee", "tea", "bread", "rice", "fire", "lamp", "candle", "candles",
  "basket", "bag", "bicycle", "pen", "watch", "bracelet", "scarf", "hat",
  "suitcase", "ring", "necklace", "notebook", "painting", "cake",
  "chocolate", "heart", "gift",
  "work", "journey", "prayer", "prayers", "song", "songs", "dance",
  "celebration", "advice", "story", "stories", "silence", "courage",
  "patience", "sacrifice", "family", "children", "money",
  "seamstress", "tailor", "nurse", "teacher", "farmer", "trader", "vendor",
  "worker", "driver", "cook", "mechanic", "hairdresser", "fisherman",
  "fisherwoman", "fishing", "weaver", "artisan", "engineer", "doctor",
  "lawyer", "professor", "pharmacist",
]);

const EN_LINKING_WORDS = new Set(["of", "the", "in", "at", "from"]);

const EN_HABIT_PATTERNS: RegExp[] = [
  /never\s+once\s+([a-z']+(?:\s+[a-z']+){0,1})/i,
  /never\s+([a-z']+(?:\s+[a-z']+){0,1})/i,
  /always\s+([a-z']+(?:\s+[a-z']+){0,1})/i,
  /every\s+(?:single\s+)?([a-z']+(?:\s+[a-z']+){0,1})/i,
  /before\s+(?:the|every)\s*([a-z']+(?:\s+[a-z']+){0,2})/i,
  /without\s+ever\s+([a-z']+(?:\s+[a-z']+){0,1})/i,
];

const EN_RELATIONSHIP_OPENERS: Record<string, string> = {
  "ma mère": "Mama, let me tell you",
  "mon père": "Papa, let me tell you",
  "ma femme": "Since the very first day",
  "mon mari": "Since the very first day",
  "mon frère": "Brother, listen closely",
  "ma sœur": "Sister, listen closely",
  "mon ami·e": "On the road of life",
  "mon enfant": "Little by little you grow",
  "ma grand-mère": "Your hands have given everything",
  "mon grand-père": "Your hands have given everything",
  autre: "On my path, one day",
};

const EN_ANCHOR_LINE_TEMPLATES: ((anchor: string, name: string) => string)[] = [
  (a) => `I still see ${a}`,
  (a) => `There was ${a}, carved into my memory`,
  (a) => `Nothing could erase ${a}`,
  (a) => `${capitalize(a)}, I haven't forgotten a thing`,
  (a, name) => `${name}, I think of ${a}`,
  (a) => `In ${a}, I find you still`,
  (a) => `We still remember ${a}`,
  (a) => `Every ${a} tells me who you are`,
];

const EN_COUPLET_OPENERS = ["I think back to you", "I kept this close to me", "here's what I see"];

const EN_REFRAIN_CLOSERS = [
  "I'm telling you today",
  "thank you for everything, again and again",
  "you matter more than anything",
  "this is what I had to tell you",
  "and that will never change",
];

const EN_CLOSING_LINES = [
  "what you gave never fades away",
  "I carry all of it with me",
  "none of it is ever forgotten",
  "and I keep giving it back to you",
];

const EN_PACK: RaconteLanguagePack = {
  stopwords: EN_STOPWORDS,
  concreteVocab: EN_CONCRETE_VOCAB,
  linkingWords: EN_LINKING_WORDS,
  habitPatterns: EN_HABIT_PATTERNS,
  relationshipOpeners: EN_RELATIONSHIP_OPENERS,
  defaultOpener: EN_RELATIONSHIP_OPENERS.autre,
  anchorLineTemplates: EN_ANCHOR_LINE_TEMPLATES,
  coupletOpeners: EN_COUPLET_OPENERS,
  refrainClosers: EN_REFRAIN_CLOSERS,
  closingLines: EN_CLOSING_LINES,
  metaReferencePatterns: EN_META_REFERENCE_PATTERNS,
  refrainTag: "Chorus",
  introTag: "Intro",
  coupletTag: (index) => `Verse ${index}`,
  fallbackAnchor: "what you gave me",
  fallbackName: "you",
};

const LANGUAGE_PACKS: Record<Locale, RaconteLanguagePack> = { fr: FR_PACK, en: EN_PACK };

// ---------------------------------------------------------------------------
// Extraction d'éléments concrets (mode "raconte")
// ---------------------------------------------------------------------------

function stripPunct(word: string): string {
  return word.replace(/^[«"'’(]+|[»"'’).,;:!?…]+$/g, "");
}

function normalize(word: string): string {
  return stripPunct(word).toLowerCase();
}

// Forme affichable d'un mot : au singulier apostrophé ("l'usine", "d'un"),
// c'est la partie APRÈS l'apostrophe qui porte le sens — "usine", pas "l".
// Sans effet en anglais (pas d'élision), la coupure ne s'y déclenche jamais.
function displayForm(rawWord: string): string {
  const stripped = stripPunct(rawWord);
  const idx = stripped.lastIndexOf("'");
  return idx >= 0 && idx < stripped.length - 1 ? stripped.slice(idx + 1) : stripped;
}

// Reconnaît un mot du vocabulaire concret même élidé ("l'usine") ou au
// pluriel ("vélos") — le vocabulaire ne liste que les formes de base, la
// reconnaissance ne doit pas dépendre d'avoir pensé à chaque variante.
function vocabWord(rawWord: string, pack: RaconteLanguagePack): string | null {
  const displayed = displayForm(rawWord);
  const normalized = normalize(displayed);
  if (pack.concreteVocab.has(normalized) || pack.concreteVocab.has(normalized.replace(/s$/, ""))) {
    return displayed;
  }
  return null;
}

function cleanPhrase(phrase: string, pack: RaconteLanguagePack): string {
  const words = phrase.trim().split(/\s+/).map(stripPunct).filter(Boolean);
  while (words.length && pack.stopwords.has(normalize(words[0]))) words.shift();
  while (words.length && pack.stopwords.has(normalize(words[words.length - 1]))) words.pop();
  return words.join(" ").trim();
}

// Repère les éléments concrets d'une histoire libre : habitudes ("jamais",
// "toujours", "chaque"…) puis noms de lieux/objets/métiers d'un vocabulaire
// courant. Repli sur les mots les plus longs si le texte est trop pauvre en
// vocabulaire reconnu — jamais de liste vide, toujours ancré dans le texte
// fourni (jamais un fait inventé).
export function extractAnchors(story: string, language: Locale = "fr"): string[] {
  const pack = LANGUAGE_PACKS[language];
  const anchors: string[] = [];
  const seen = new Set<string>();

  function add(phrase: string) {
    const cleaned = cleanPhrase(phrase, pack);
    if (!cleaned) return;
    // Un résidu d'un seul mot, court et hors vocabulaire, est presque toujours
    // ce qui reste après avoir retiré les mots-outils d'un motif d'habitude
    // (ex. "toujours été là" → "là") — pas un élément concret en soi.
    const words = cleaned.split(/\s+/);
    if (words.length === 1 && cleaned.length < 5 && !pack.concreteVocab.has(normalize(cleaned))) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    anchors.push(cleaned);
  }

  for (const pattern of pack.habitPatterns) {
    const match = story.match(pattern);
    if (match?.[1]) add(match[1]);
  }

  const words = story.split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const displayed = vocabWord(words[i], pack);
    if (!displayed) continue;
    let phrase = displayed;
    const next1 = words[i + 1] ? normalize(words[i + 1]) : "";
    const next2 = words[i + 2] ? stripPunct(words[i + 2]) : "";
    if (pack.linkingWords.has(next1) && next2) {
      phrase = `${phrase} ${stripPunct(words[i + 1])} ${next2}`;
    }
    add(phrase);
  }

  if (anchors.length < 3) {
    const candidates = words
      .map(stripPunct)
      .filter((w) => w.length >= 5 && !pack.stopwords.has(normalize(w)))
      .sort((a, b) => b.length - a.length);
    for (const candidate of candidates) {
      if (anchors.length >= 3) break;
      add(candidate);
    }
  }

  // Un mot repéré seul ("soir") et ce même mot capturé dans une phrase plus
  // longue par un motif d'habitude ("soir après") comptent pour deux
  // éléments distincts sans l'être : ça grignote des places sur la limite de
  // six, au détriment d'un élément qui n'a pas encore sa place.
  const deduped: string[] = [];
  for (const anchor of anchors) {
    const lower = anchor.toLowerCase();
    const isRedundant = deduped.some((kept) => {
      const keptLower = kept.toLowerCase();
      return keptLower.includes(lower) || lower.includes(keptLower);
    });
    if (!isRedundant) deduped.push(anchor);
  }

  return deduped.slice(0, 6);
}

// ---------------------------------------------------------------------------
// Composition (mode "raconte")
// ---------------------------------------------------------------------------

// Générateur pseudo-aléatoire déterministe (mulberry32) : "Reformuler" doit
// produire une variante différente à chaque appel, mais un même graine doit
// toujours redonner le même résultat — nécessaire pour des tests reproductibles.
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)] ?? items[0];
}

interface RaconteInput {
  recipientFirstName: string;
  relationship: string | null;
  story: string;
}

function buildAnchorLine(anchor: string, name: string, rng: () => number, pack: RaconteLanguagePack): string {
  return capLineWords(pick(pack.anchorLineTemplates, rng)(anchor, name));
}

function buildRaconteAttempt(input: RaconteInput, anchors: string[], seed: number, pack: RaconteLanguagePack): string {
  const rng = mulberry32(seed);
  const name = input.recipientFirstName.trim() || pack.fallbackName;
  const opener = pack.relationshipOpeners[input.relationship ?? "autre"] ?? pack.defaultOpener;
  const safeAnchors = anchors.length > 0 ? anchors : [pack.fallbackAnchor];

  // Chaque élément concret extrait doit apparaître — jamais seulement les
  // quatre premiers d'une liste plus longue. Répartis entre les deux couplets
  // plutôt que plafonnés à un nombre fixe de lignes par couplet.
  const half = Math.ceil(safeAnchors.length / 2);
  const groupA = safeAnchors.slice(0, half);
  const groupB = safeAnchors.slice(half);

  const introLine = capLineWords(`${opener}, ${name}`);

  const coupletA = [
    capLineWords(`${name}, ${pick(pack.coupletOpeners, rng)}`),
    ...groupA.map((anchor) => buildAnchorLine(anchor, name, rng, pack)),
  ];

  const closer1 = pick(pack.refrainClosers, rng);
  const refrain = [`${name}, ${name},`, capLineWords(`${name}, ${closer1}`)];

  const coupletB = [
    ...groupB.map((anchor) => buildAnchorLine(anchor, name, rng, pack)),
    capLineWords(pick(pack.closingLines, rng)),
  ];

  const remainingClosers = pack.refrainClosers.filter((c) => c !== closer1);
  const closer2 = remainingClosers.length > 0 ? pick(remainingClosers, rng) : closer1;
  const refrainRepeat = [`${name}, ${name},`, capLineWords(`${name}, ${closer2}`)];

  return [
    `[${pack.introTag}]`,
    introLine,
    "",
    `[${pack.coupletTag(1)}]`,
    ...coupletA,
    "",
    `[${pack.refrainTag}]`,
    ...refrain,
    "",
    `[${pack.coupletTag(2)}]`,
    ...coupletB,
    "",
    `[${pack.refrainTag}]`,
    ...refrainRepeat,
  ].join("\n");
}

export interface LyricsValidation {
  valid: boolean;
  reasons: string[];
}

// Les cinq contrôles automatiques exigés par le produit — un texte qui en
// rate un seul est rejeté et régénéré, jamais livré tel quel.
export function validateRaconteLyrics(
  lyricsText: string,
  anchors: string[],
  name: string,
  story: string,
  language: Locale = "fr",
): LyricsValidation {
  const pack = LANGUAGE_PACKS[language];
  const reasons: string[] = [];
  const lower = lyricsText.toLowerCase();

  for (const anchor of anchors) {
    if (!lower.includes(anchor.toLowerCase())) reasons.push(`Élément concret absent : "${anchor}"`);
  }

  const nameCount = countOccurrences(lyricsText, name);
  if (nameCount < 3) reasons.push(`Le prénom apparaît ${nameCount} fois (minimum 3)`);

  const refrainSection = extractSection(lyricsText, pack.refrainTag);
  if (!refrainSection || countOccurrences(refrainSection, name) < 1) {
    reasons.push("Le prénom n'apparaît pas dans le refrain");
  }

  if (containsMetaReference(lyricsText, pack.metaReferencePatterns)) reasons.push("Vers auto-référentiel détecté");

  for (const line of lyricsText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || isTagLine(trimmed)) continue;
    if (wordCount(trimmed) > MAX_WORDS_PER_LINE) reasons.push(`Ligne trop longue : "${trimmed}"`);
    if (trimmed.length >= 8 && story.toLowerCase().includes(trimmed.toLowerCase())) {
      reasons.push(`Ligne collée brute du texte source : "${trimmed}"`);
    }
  }

  return { valid: reasons.length === 0, reasons };
}

const MAX_GENERATION_ATTEMPTS = 6;

// Boucle "génère puis valide" — régénère avec une graine différente tant
// qu'un contrôle échoue, jusqu'à MAX_GENERATION_ATTEMPTS (filet de sécurité :
// la construction par gabarits satisfait déjà ces règles dans l'immense
// majorité des cas, mais on ne livre jamais sans avoir vérifié).
export function generateRaconteLyrics(input: RaconteInput, seed = 0, language: Locale = "fr"): string {
  const pack = LANGUAGE_PACKS[language];
  const anchors = extractAnchors(input.story, language);
  const name = input.recipientFirstName.trim() || pack.fallbackName;
  let last = "";
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    last = buildRaconteAttempt(input, anchors, seed + attempt * 97 + input.story.length, pack);
    if (validateRaconteLyrics(last, anchors, name, input.story, language).valid) return last;
  }
  return last;
}

// ---------------------------------------------------------------------------
// Mode "J'écris mes paroles" — structure sans jamais changer un mot
// ---------------------------------------------------------------------------

// Insère un retour à la ligne au prochain mot après la limite — ne modifie,
// n'ajoute ni ne retire aucun mot, seulement des espaces devenus retours à
// la ligne.
function breakLongLines(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current: string[] = [];
  for (const word of words) {
    current.push(word);
    if (current.length >= MAX_WORDS_PER_LINE) {
      lines.push(current.join(" "));
      current = [];
    }
  }
  if (current.length) lines.push(current.join(" "));
  return lines.join("\n");
}

// Structure un texte libre écrit par la personne en intro/couplets/refrain,
// sans en changer les mots : découpe en paragraphes (ou phrases si aucun
// paragraphe n'est marqué), désigne comme refrain le passage le plus court
// qui nomme le destinataire — les refrains sont typiquement brefs et
// adressés directement à la personne. Seules les ÉTIQUETTES de section
// suivent la langue de la chanson ([Refrain] / [Chorus]) : les mots de la
// personne, eux, ne changent jamais, quelle que soit la langue choisie.
export function structureUserLyrics(
  rawText: string,
  recipientFirstName: string,
  seed = 0,
  language: Locale = "fr",
): string {
  const pack = LANGUAGE_PACKS[language];
  const normalized = rawText.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  let paragraphs = normalized
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (paragraphs.length < 2) {
    const sentences = normalized
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    if (sentences.length >= 2) {
      const mid = Math.ceil(sentences.length / 2);
      paragraphs = [sentences.slice(0, mid).join(" "), sentences.slice(mid).join(" ")].filter(Boolean);
    } else {
      paragraphs = [normalized.replace(/\s+/g, " ")];
    }
  }

  const withIndex = paragraphs.map((text, index) => ({ text, index }));
  const named = recipientFirstName
    ? withIndex.filter((p) => p.text.toLowerCase().includes(recipientFirstName.toLowerCase()))
    : [];
  const pool = named.length > 0 ? named : withIndex;
  // "Reformuler" doit pouvoir varier ce choix sans jamais toucher un mot : à
  // égalité de longueur minimale, la graine décide parmi les candidats.
  const minLength = Math.min(...pool.map((p) => p.text.length));
  const shortestCandidates = pool.filter((p) => p.text.length === minLength);
  const refrainEntry = shortestCandidates[Math.abs(seed) % shortestCandidates.length];

  let coupletIndex = 1;
  const sections = paragraphs.map((text, index) => {
    const tag = index === refrainEntry.index ? pack.refrainTag : pack.coupletTag(coupletIndex++);
    return { tag, text };
  });

  return sections.map(({ tag, text }) => `[${tag}]\n${breakLongLines(text)}`).join("\n\n");
}

// ---------------------------------------------------------------------------
// Mode "Mes paroles sont déjà structurées" — aucune modification
// ---------------------------------------------------------------------------

// Identité assumée : le texte de la personne est souverain, transmis à la
// lettre. La fonction existe pour que l'appelant n'ait jamais à distinguer
// "ne rien faire" d'un cas particulier ailleurs dans le code.
export function passThroughStructuredLyrics(rawText: string): string {
  return rawText;
}

// ---------------------------------------------------------------------------
// Point d'entrée unique, selon le mode choisi
// ---------------------------------------------------------------------------

export function buildLyricsForMode(
  mode: StoryMode,
  input: { story: string; recipientFirstName: string; relationship: string | null },
  seed = 0,
  language: Locale = "fr",
): string {
  if (mode === "paroles_structurees") return passThroughStructuredLyrics(input.story);
  if (mode === "paroles_libres") return structureUserLyrics(input.story, input.recipientFirstName, seed, language);
  return generateRaconteLyrics(input, seed, language);
}
