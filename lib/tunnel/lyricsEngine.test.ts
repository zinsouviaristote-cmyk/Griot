import { describe, expect, it } from "vitest";
import {
  MAX_TOTAL_LINES,
  MAX_WORDS_PER_LINE,
  MIN_TOTAL_LINES,
  containsFestiveWord,
  containsMetaReference,
  extractAllSections,
  extractSection,
  generateRaconteLyrics,
  hasEnoughStoryMaterial,
  isTagLine,
  passThroughStructuredLyrics,
  structureUserLyrics,
  wordCount,
} from "@/lib/tunnel/lyricsEngine";
import type { Occasion } from "@/lib/types";

// Cinq histoires, une par occasion — chacune avec ses éléments concrets
// choisis à la main (lieux, objets, métiers, habitudes réellement présents
// dans le texte), indépendamment de ce que l'extracteur du moteur choisit
// d'y voir. Vérifier contre une liste indépendante, pas contre la sortie de
// la fonction elle-même, est ce qui rend ce test capable d'échouer pour de
// vraies raisons.
const STORIES: {
  label: string;
  occasion: Occasion;
  recipientFirstName: string;
  relationship: string;
  story: string;
  concreteKeywords: string[];
}[] = [
  {
    label: "anniversaire — mère, marché avant le jour",
    occasion: "anniversaire",
    recipientFirstName: "Fatou",
    relationship: "ma mère",
    story:
      "Maman a toujours été là. Je me souviens des matins où elle partait au marché avant le lever du soleil. Elle ne s'est jamais plainte.",
    concreteKeywords: ["marché", "matin", "soleil", "plainte"],
  },
  {
    label: "amour — femme, stylo à la gare",
    occasion: "amour",
    recipientFirstName: "Awa",
    relationship: "ma femme",
    story:
      "Tu m'as offert un stylo le jour de notre rencontre, à la gare, sous la pluie. Depuis, chaque lettre que tu m'écris commence par mon prénom mal orthographié, et ça me fait rire à chaque fois.",
    concreteKeywords: ["stylo", "gare", "pluie", "lettre"],
  },
  {
    label: "mariage — sœur, le marché du quartier",
    occasion: "mariage",
    recipientFirstName: "Chantal",
    relationship: "ma sœur",
    story:
      "Le jour où tu as rencontré Paul au marché du quartier, tu es rentrée à la maison en dansant. Depuis, chaque dimanche, vous préparez le riz ensemble en riant.",
    concreteKeywords: ["marché", "quartier", "maison", "dimanche", "riz"],
  },
  {
    label: "réussite — frère, usine et bougie",
    occasion: "reussite",
    recipientFirstName: "Moussa",
    relationship: "mon frère",
    story:
      "Mon frère, tu as quitté le village très jeune pour travailler dans l'usine de la capitale. Chaque soir après ton service, tu étudiais à la lumière d'une bougie. Aujourd'hui tu es ingénieur.",
    concreteKeywords: ["village", "usine", "bougie", "ingénieur"],
  },
  {
    label: "hommage — père, vélos et pêche",
    occasion: "hommage",
    recipientFirstName: "Ibrahim",
    relationship: "mon père",
    story:
      "Papa, tu réparais les vélos du quartier sans jamais rien demander en retour. Le dimanche, tu emmenais tout le monde à la pêche sur la rivière. Ta radio grésillante jouait toujours la même chanson africaine.",
    concreteKeywords: ["vélo", "quartier", "pêche", "rivière", "radio"],
  },
];

describe("generateRaconteLyrics — mode « Je raconte » (mode simple)", () => {
  for (const { label, occasion, recipientFirstName, relationship, story, concreteKeywords } of STORIES) {
    describe(label, () => {
      const lyrics = generateRaconteLyrics({ recipientFirstName, relationship, occasion, story });
      const lower = lyrics.toLowerCase();

      it("a assez de matière dans l'histoire pour générer (≥2 éléments concrets)", () => {
        expect(hasEnoughStoryMaterial(story)).toBe(true);
      });

      it("transforme chaque élément concret fourni dans les paroles", () => {
        for (const keyword of concreteKeywords) {
          expect(lower, `"${keyword}" est absent des paroles générées`).toContain(keyword.toLowerCase());
        }
      });

      it("ne colle aucune phrase brute du texte source", () => {
        const rawSentences = story
          .split(/[.!?]/)
          .map((s) => s.trim())
          .filter((s) => s.length >= 8);
        for (const sentence of rawSentences) {
          expect(lower, `la phrase source "${sentence}" apparaît telle quelle`).not.toContain(sentence.toLowerCase());
        }
      });

      it("ne contient aucun vers auto-référentiel (« cette chanson »…)", () => {
        expect(containsMetaReference(lyrics)).toBe(false);
      });

      it("mentionne le prénom au moins trois fois", () => {
        const count = (lyrics.match(new RegExp(recipientFirstName, "gi")) ?? []).length;
        expect(count).toBeGreaterThanOrEqual(3);
      });

      it("mentionne le prénom dans le refrain", () => {
        const refrain = extractSection(lyrics, occasion === "hommage" ? "Refrain" : "Refrain");
        expect(refrain, "aucune section [Refrain] trouvée").not.toBeNull();
        expect(refrain!.toLowerCase()).toContain(recipientFirstName.toLowerCase());
      });

      it("répète le refrain à l'identique, mot pour mot, à chaque occurrence", () => {
        const refrains = extractAllSections(lyrics, "Refrain");
        expect(refrains.length).toBeGreaterThanOrEqual(2);
        for (const section of refrains) expect(section).toBe(refrains[0]);
      });

      it("ne dépasse jamais dix mots par ligne", () => {
        for (const line of lyrics.split("\n")) {
          if (!line.trim() || isTagLine(line)) continue;
          expect(wordCount(line), `ligne trop longue : "${line}"`).toBeLessThanOrEqual(MAX_WORDS_PER_LINE);
        }
      });

      it("structure le texte en sections balisées, y compris le pont", () => {
        expect(lyrics).toMatch(/\[Intro\]/);
        expect(lyrics).toMatch(/\[Couplet 1\]/);
        expect(lyrics).toMatch(/\[Refrain\]/);
        expect(lyrics).toMatch(/\[Couplet 2\]/);
        expect(lyrics).toMatch(/\[Pont\]/);
      });

      it("compte entre seize et vingt-deux lignes hors balises", () => {
        const contentLines = lyrics.split("\n").filter((line) => line.trim() && !isTagLine(line));
        expect(contentLines.length).toBeGreaterThanOrEqual(MIN_TOTAL_LINES);
        expect(contentLines.length).toBeLessThanOrEqual(MAX_TOTAL_LINES);
      });

      it("suit le registre de l'occasion (aucun mot festif dans un hommage)", () => {
        if (occasion !== "hommage") return;
        const FESTIVE_FR = ["fête", "fêter", "célébrons", "célébrer", "dansons", "dansez", "applaudissons", "champagne"];
        expect(containsFestiveWord(lyrics, FESTIVE_FR)).toBe(false);
      });
    });
  }
});

describe("hasEnoughStoryMaterial — garde-fou contre une histoire trop pauvre", () => {
  it("refuse une histoire sans élément concret", () => {
    expect(hasEnoughStoryMaterial("Bonjour, elle est très gentille et je l'aime beaucoup.")).toBe(false);
  });

  it("refuse une histoire avec un seul élément concret", () => {
    expect(hasEnoughStoryMaterial("Elle travaillait tout le temps sans jamais se reposer vraiment.")).toBe(false);
  });

  it("accepte dès que deux éléments concrets sont présents", () => {
    expect(hasEnoughStoryMaterial("Elle partait au marché chaque matin avant le lever du soleil.")).toBe(true);
  });
});

describe("structureUserLyrics — mode « J'écris mes paroles »", () => {
  it("restitue tous les mots de la personne, dans l'ordre, sans en changer un seul", () => {
    const raw = `Tu es le vent qui pousse mes voiles quand je n'ai plus la force d'avancer moi-même et que tout semble s'effondrer autour de moi

Fatou, Fatou, reste avec moi
Fatou, Fatou, pour toujours et un jour

Je n'ai pas besoin d'autre richesse que ton sourire chaque matin`;

    const structured = structureUserLyrics(raw, "Fatou");

    // Doit être structuré (balises ajoutées), mais chaque mot d'origine, dans
    // l'ordre, doit s'y retrouver exactement — c'est la seule transformation
    // autorisée : mise en forme, jamais de réécriture.
    expect(structured).toMatch(/\[Refrain\]/);
    expect(structured).toMatch(/\[Couplet 1\]/);

    const originalWords = raw.split(/\s+/).filter(Boolean);
    const structuredWords = structured
      .split("\n")
      .filter((line) => !isTagLine(line))
      .join(" ")
      .split(/\s+/)
      .filter(Boolean);

    expect(structuredWords).toEqual(originalWords);
  });
});

describe("passThroughStructuredLyrics — mode « Mes paroles sont déjà structurées »", () => {
  it("transmet le texte à la lettre, sans aucune modification", () => {
    const raw = `[Couplet 1]
Une ligne avec   des espaces irréguliers
UNE AUTRE EN MAJUSCULES

[Refrain]
Fatou, Fatou

[Pont]
Dernière ligne, sans point final`;

    expect(passThroughStructuredLyrics(raw)).toBe(raw);
  });
});
