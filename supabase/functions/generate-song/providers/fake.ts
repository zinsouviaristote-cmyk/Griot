// Adaptateur factice -- aucun appel reseau, aucun cout. Selectionnable via la
// variable d'environnement MUSIC_PROVIDER=fake pour developper et tester tout
// le pipeline (Storage, decoupe d'extrait, RPC de finalisation, Realtime)
// sans consommer de credits ElevenLabs.
//
// Produit un MP3 syntaxiquement valide (en-tetes de trame MPEG1 Layer III
// corrects, 44100Hz/128kbps) rempli de donnees de trame nulles. Ce n'est pas
// de la musique -- seule la structure des trames est correcte, ce qui suffit
// a exercer fidelement le parseur de decoupe (mp3Clip.ts) et le calcul de
// duree en aval.

import type { MusicGenerationRequest, MusicGenerationResult, MusicProvider } from "./types.ts";

const SAMPLE_RATE = 44100;
const BITRATE_KBPS = 128;
const SAMPLES_PER_FRAME = 1152;
const MS_PER_FRAME = (SAMPLES_PER_FRAME / SAMPLE_RATE) * 1000;

function buildFakeMp3(durationMs: number): Uint8Array {
  const frameCount = Math.ceil(durationMs / MS_PER_FRAME);
  const baseFrameLength = Math.floor((SAMPLES_PER_FRAME / 8) * (BITRATE_KBPS * 1000) / SAMPLE_RATE);
  const exactFrameLength = (SAMPLES_PER_FRAME / 8) * (BITRATE_KBPS * 1000) / SAMPLE_RATE;

  const frames: Uint8Array[] = [];
  let paddingRemainder = 0;

  for (let i = 0; i < frameCount; i++) {
    paddingRemainder += exactFrameLength - baseFrameLength;
    const padding = paddingRemainder >= 1 ? 1 : 0;
    if (padding) paddingRemainder -= 1;

    const frameLength = baseFrameLength + padding;
    const frame = new Uint8Array(frameLength);
    // FF FB : sync (11 bits) + MPEG1 + Layer III + pas de CRC.
    frame[0] = 0xff;
    frame[1] = 0xfb;
    // bitrate index 1001 (128kbps) + samplerate 00 (44100) + padding + prive(0).
    frame[2] = 0b10010000 | (padding << 1);
    // mono + pas d'extension + pas de copyright + pas d'original + pas d'emphase.
    frame[3] = 0b11000000;
    // Reste de la trame (side info + main data) laisse a zero.
    frames.push(frame);
  }

  const total = new Uint8Array(frames.reduce((sum, f) => sum + f.length, 0));
  let offset = 0;
  for (const frame of frames) {
    total.set(frame, offset);
    offset += frame.length;
  }
  return total;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class FakeMusicProvider implements MusicProvider {
  readonly name = "fake";

  async generate(req: MusicGenerationRequest): Promise<MusicGenerationResult> {
    const start = Date.now();
    // Delai court pour rester representatif d'un appel reseau dans les logs,
    // sans ralentir les tests de bout en bout.
    await wait(1500);

    const audioBytes = buildFakeMp3(req.requestedDurationMs);

    return {
      audioBytes,
      contentType: "audio/mpeg",
      providerSongId: `fake-${crypto.randomUUID()}`,
      modelId: "fake-v0",
      processingMs: Date.now() - start,
    };
  }
}
