import type { MusicProvider } from "./types.ts";
import { FakeMusicProvider } from "./fake.ts";
import { ElevenLabsMusicProvider } from "./elevenlabs.ts";
import { GenerationError } from "../errors.ts";

// Selectionnable sans redeploiement de code applicatif : seule la variable
// d'environnement MUSIC_PROVIDER change. "fake" reste toujours disponible
// pour developper sans consommer de credits payants.
export function createMusicProvider(): MusicProvider {
  const providerName = Deno.env.get("MUSIC_PROVIDER") ?? "fake";

  if (providerName === "fake") {
    return new FakeMusicProvider();
  }

  if (providerName === "elevenlabs") {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      throw new GenerationError(
        "internal_error",
        "ELEVENLABS_API_KEY manquant alors que MUSIC_PROVIDER=elevenlabs.",
      );
    }
    return new ElevenLabsMusicProvider({
      apiKey,
      modelId: Deno.env.get("ELEVENLABS_MODEL_ID") ?? undefined,
      strategy: Deno.env.get("ELEVENLABS_LYRICS_STRATEGY") ?? undefined,
      timeoutMs: Deno.env.get("ELEVENLABS_TIMEOUT_MS")
        ? Number(Deno.env.get("ELEVENLABS_TIMEOUT_MS"))
        : undefined,
    });
  }

  throw new GenerationError("internal_error", `MUSIC_PROVIDER inconnu : "${providerName}".`);
}
