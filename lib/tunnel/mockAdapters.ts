import { buildLyricsForMode } from "@/lib/tunnel/lyricsEngine";
import type { StoryMode } from "@/lib/tunnel/types";
import type { Occasion } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";

// MOCK_AUDIO_SRC : seul reste factice ici — un aperçu générique par style
// musical (StyleVoiceStep), jamais la chanson réelle de qui que ce soit. La
// génération de la chanson elle-même passe désormais par le vrai pipeline
// (voir lib/supabase/generationAdapters.ts et supabase/functions/generate-song,
// qui a son propre adaptateur factice MUSIC_PROVIDER=fake côté serveur).

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
