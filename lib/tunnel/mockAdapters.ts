import { buildLyricsForMode } from "@/lib/tunnel/lyricsEngine";
import type { StoryMode } from "@/lib/tunnel/types";
import type { Occasion } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";

// Adaptateurs factices — Phase 1. Aucun appel réseau réel : à remplacer par le
// moteur de génération et l'envoi d'e-mails en Phase 2, derrière exactement
// ces mêmes signatures.

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const MOCK_AUDIO_SRC = "/mock-audio.wav";

export interface LyricsInput {
  storyMode: StoryMode;
  story: string;
  recipientFirstName: string;
  relationship: string | null;
  occasion: Occasion;
}

// Génère (ou structure, ou transmet — selon le mode) les paroles. Gratuit et
// rapide : aucun essai audio n'est en jeu ici, seulement du texte — c'est ce
// qui rend "Reformuler" possible sans jamais consommer de Note. `language`
// pilote le vocabulaire du moteur (voir lyricsEngine.ts) — jamais les mots de
// la personne elle-même en mode paroles libres/structurées, seulement les
// étiquettes de section qu'on y ajoute.
export async function mockGenerateLyrics(input: LyricsInput, seed = 0, language: Locale = "fr"): Promise<string> {
  await wait(600);
  return buildLyricsForMode(input.storyMode, input, seed, language);
}

// Simule la synthèse audio à partir de paroles déjà validées — c'est
// spécifiquement CETTE étape, jamais l'écriture, qui correspond à "un essai"
// et à la Note qu'il consomme (au-delà du tout premier essai, gratuit).
// 8s — assez long pour laisser une vraie fenêtre au flux de connexion Google
// pendant l'attente, sans rendre chaque test du tunnel interminable.
export async function mockGenerateAudio(): Promise<string> {
  await wait(8000);
  return MOCK_AUDIO_SRC;
}

// Simule l'envoi du lien magique — jamais de mot de passe dans ce produit,
// jamais de code à usage unique par SMS : jusqu'à la vraie messagerie en
// Phase 2, /connexion/lien-envoye fait office de boîte mail (voir son bouton
// de test "J'ai cliqué le lien").
export async function mockSendMagicLink(email: string): Promise<void> {
  await wait(900);
  void email;
}
