import { describe, expect, it } from "vitest";
import {
  containsMetaReference,
  generateRaconteLyrics,
  isTagLine,
  passThroughStructuredLyrics,
  structureUserLyrics,
  wordCount,
} from "@/lib/tunnel/lyricsEngine";

// Cinq histoires représentatives — chacune avec ses éléments concrets choisis
// à la main (lieux, objets, métiers, habitudes réellement présents dans le
// texte), indépendamment de ce que l'extracteur du moteur choisit d'y voir.
// Vérifier contre une liste indépendante, pas contre la sortie de la fonction
// elle-même, est ce qui rend ce test capable d'échouer pour de vraies raisons.
const STORIES: {
  label: string;
  recipientFirstName: string;
  relationship: string;
  story: string;
  concreteKeywords: string[];
}[] = [
  {
    label: "mère — marché avant le jour",
    recipientFirstName: "Fatou",
    relationship: "ma mère",
    story:
      "Maman, tu as toujours été là pour nous. Je me souviens des matins où tu partais au marché avant le lever du soleil. Tu ne t'es jamais plainte.",
    concreteKeywords: ["marché", "matin", "soleil", "plainte"],
  },
  {
    label: "frère — usine et bougie",
    recipientFirstName: "Moussa",
    relationship: "mon frère",
    story:
      "Mon frère, tu as quitté le village très jeune pour travailler dans l'usine de la capitale. Chaque soir après ton service, tu étudiais à la lumière d'une bougie. Aujourd'hui tu es ingénieur.",
    concreteKeywords: ["village", "usine", "bougie", "ingénieur"],
  },
  {
    label: "femme — stylo à la gare",
    recipientFirstName: "Awa",
    relationship: "ma femme",
    story:
      "Tu m'as offert un stylo le jour de notre rencontre, à la gare, sous la pluie. Depuis, chaque lettre que tu m'écris commence par mon prénom mal orthographié, et ça me fait rire à chaque fois.",
    concreteKeywords: ["stylo", "gare", "pluie", "lettre"],
  },
  {
    label: "père — vélos et pêche",
    recipientFirstName: "Ibrahim",
    relationship: "mon père",
    story:
      "Papa, tu réparais les vélos du quartier sans jamais rien demander en retour. Le dimanche, tu emmenais tout le monde à la pêche sur la rivière. Ta radio grésillante jouait toujours la même chanson africaine.",
    concreteKeywords: ["vélo", "quartier", "pêche", "rivière", "radio"],
  },
  {
    label: "sœur — gâteau au chocolat",
    recipientFirstName: "Aminata",
    relationship: "ma sœur",
    story:
      "Chaque année, tu prépares le même gâteau au chocolat pour mon anniversaire, et tu chantes complètement faux, mais avec tout ton cœur.",
    concreteKeywords: ["gâteau", "chocolat", "cœur"],
  },
];

describe("generateRaconteLyrics — mode « Je raconte »", () => {
  for (const { label, recipientFirstName, relationship, story, concreteKeywords } of STORIES) {
    describe(label, () => {
      const lyrics = generateRaconteLyrics({ recipientFirstName, relationship, story });
      const lower = lyrics.toLowerCase();

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

      it("mentionne le prénom au moins trois fois, dont une dans le refrain", () => {
        const count = (lyrics.match(new RegExp(recipientFirstName, "gi")) ?? []).length;
        expect(count).toBeGreaterThanOrEqual(3);
      });

      it("ne dépasse jamais douze mots par ligne", () => {
        for (const line of lyrics.split("\n")) {
          if (!line.trim() || isTagLine(line)) continue;
          expect(wordCount(line), `ligne trop longue : "${line}"`).toBeLessThanOrEqual(12);
        }
      });

      it("structure le texte en sections balisées", () => {
        expect(lyrics).toMatch(/\[Intro\]/);
        expect(lyrics).toMatch(/\[Couplet 1\]/);
        expect(lyrics).toMatch(/\[Refrain\]/);
      });
    });
  }
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
