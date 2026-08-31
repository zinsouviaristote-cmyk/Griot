// Adaptateur ElevenLabs Music (POST /v1/music). La reponse est SYNCHRONE et
// contient directement le fichier audio -- pas d'identifiant de tache, pas de
// webhook, pas d'endpoint de statut a interroger.
//
// STRATEGIE DES PAROLES -- NON VERIFIEE EMPIRIQUEMENT (voir README de la
// fonction). Par defaut on utilise `composition_plan` (une section par bloc
// [Couplet]/[Refrain]/[Pont] des paroles), qui est ce que la documentation et
// le skill officiels d'ElevenLabs recommandent pour la fidelite exacte du
// texte chante -- au prix de sections limitees a 200 caracteres/ligne et 30
// lignes/section. Le test comparatif reel (prompt vs composition_plan, sur un
// texte francais) n'a pas pu etre execute : le compte ElevenLabs n'a pas
// encore de plan payant actif (erreur 402 paid_plan_required). Des que le
// paiement a l'usage est actif, relancer le test et ajuster ELEVENLABS_LYRICS_STRATEGY
// si le verdict differe.

import type { MusicGenerationRequest, MusicGenerationResult, MusicProvider } from "./types.ts";
import { GenerationError, classifyHttpStatus, toGenerationError } from "../errors.ts";

const API_URL = "https://api.elevenlabs.io/v1/music";
const PROMPT_MAX_CHARS = 4100;
const SECTION_LINE_MAX_CHARS = 200;
const SECTION_MAX_LINES = 30;
const SECTION_MIN_MS = 3000;
const SECTION_MAX_MS = 120000;

// Doit rester en phase avec les hypotheses de mp3Clip.ts (44100Hz, Layer III
// MPEG1) : c'est ce format qui rend la decoupe par frontiere de trame fiable.
export const OUTPUT_FORMAT = "mp3_44100_128";

const STRUCTURED_TAG = /^\[(intro|couplet|refrain|pont)\b[^\]]*\]$/i;

interface LyricsSection {
  name: string;
  lines: string[];
}

function parseLyricsSections(lyrics: string): LyricsSection[] {
  const rawLines = lyrics
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const sections: LyricsSection[] = [];
  let current: LyricsSection | null = null;

  for (const line of rawLines) {
    const tagMatch = line.match(STRUCTURED_TAG);
    if (tagMatch) {
      current = { name: line.replace(/[[\]]/g, ""), lines: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { name: "Couplet", lines: [] };
      sections.push(current);
    }
    current.lines.push(line);
  }

  // Une section trop longue est repartie en plusieurs sections pour respecter
  // la limite de 30 lignes/section imposee par l'API.
  const bounded: LyricsSection[] = [];
  for (const section of sections) {
    if (section.lines.length <= SECTION_MAX_LINES) {
      bounded.push(section);
      continue;
    }
    for (let i = 0; i < section.lines.length; i += SECTION_MAX_LINES) {
      bounded.push({
        name: section.name,
        lines: section.lines.slice(i, i + SECTION_MAX_LINES),
      });
    }
  }

  return bounded.filter((s) => s.lines.length > 0);
}

function voiceStyleTag(voiceType: MusicGenerationRequest["voiceType"]): string | null {
  if (voiceType === "homme") return "voix masculine";
  if (voiceType === "femme") return "voix feminine";
  return null;
}

function buildCompositionPlan(req: MusicGenerationRequest) {
  const sections = parseLyricsSections(req.lyrics);

  for (const section of sections) {
    for (const line of section.lines) {
      if (line.length > SECTION_LINE_MAX_CHARS) {
        throw new GenerationError(
          "text_too_long",
          `Ligne de ${line.length} caracteres > ${SECTION_LINE_MAX_CHARS} (limite ElevenLabs par ligne de section).`,
        );
      }
    }
  }

  if (sections.length === 0) {
    throw new GenerationError("content_rejected", "Aucune ligne de paroles exploitable apres parsing.");
  }

  const totalLines = sections.reduce((sum, s) => sum + s.lines.length, 0);
  const voiceTag = voiceStyleTag(req.voiceType);
  const positiveGlobalStyles = voiceTag ? [...req.positiveStyles, voiceTag] : req.positiveStyles;

  const planSections = sections.map((section) => {
    const share = section.lines.length / totalLines;
    const durationMs = Math.min(
      SECTION_MAX_MS,
      Math.max(SECTION_MIN_MS, Math.round(req.requestedDurationMs * share)),
    );
    return {
      section_name: section.name.slice(0, 100),
      positive_local_styles: [],
      negative_local_styles: [],
      duration_ms: durationMs,
      lines: section.lines,
    };
  });

  return {
    positive_global_styles: positiveGlobalStyles,
    negative_global_styles: req.negativeStyles,
    sections: planSections,
  };
}

function buildPrompt(req: MusicGenerationRequest): string {
  const voiceTag = voiceStyleTag(req.voiceType);
  const styleSentence = [...req.positiveStyles, voiceTag].filter(Boolean).join(", ");
  return (
    `${styleSentence}.\n\n` +
    `Chante exactement les paroles suivantes, mot pour mot, sans en changer le texte :\n\n` +
    req.lyrics
  );
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 500);
  } catch {
    return res.statusText;
  }
}

export class ElevenLabsMusicProvider implements MusicProvider {
  readonly name = "elevenlabs";

  private readonly apiKey: string;
  private readonly modelId: string;
  private readonly strategy: "prompt" | "composition_plan";
  private readonly timeoutMs: number;

  constructor(env: {
    apiKey: string;
    modelId?: string;
    strategy?: string;
    timeoutMs?: number;
  }) {
    this.apiKey = env.apiKey;
    // La forme `composition_plan` construite ici (sections/section_name/
    // positive_local_styles) correspond au schema MusicPrompt d'ElevenLabs,
    // reserve au modele music_v1 -- l'envoyer avec music_v2 (qui attend un
    // schema CompositionPlan a base de chunks) renvoie systematiquement une
    // 422 "Invalid type of composition_plan used for model music_v2".
    this.modelId = env.modelId ?? "music_v1";
    this.strategy = env.strategy === "prompt" ? "prompt" : "composition_plan";
    this.timeoutMs = env.timeoutMs ?? 120_000;
  }

  async generate(req: MusicGenerationRequest): Promise<MusicGenerationResult> {
    const start = Date.now();

    let body: Record<string, unknown>;

    if (this.strategy === "prompt") {
      const prompt = buildPrompt(req);
      if (prompt.length > PROMPT_MAX_CHARS) {
        // Bascule automatique vers le plan de composition plutot que de
        // tronquer silencieusement ou d'echouer : c'est exactement le
        // scenario "texte trop long pour le prompt" prevu au cahier des charges.
        body = {
          model_id: this.modelId,
          output_format: OUTPUT_FORMAT,
          composition_plan: buildCompositionPlan(req),
        };
      } else {
        body = {
          model_id: this.modelId,
          output_format: OUTPUT_FORMAT,
          music_length_ms: req.requestedDurationMs,
          prompt,
        };
      }
    } else {
      body = {
        model_id: this.modelId,
        output_format: OUTPUT_FORMAT,
        composition_plan: buildCompositionPlan(req),
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let res: Response;
    try {
      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      throw toGenerationError(err);
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const detail = await readErrorDetail(res);
      throw classifyHttpStatus(res.status, detail);
    }

    const audioBytes = new Uint8Array(await res.arrayBuffer());
    const providerSongId = res.headers.get("song-id");
    const contentType = res.headers.get("content-type") ?? "audio/mpeg";

    return {
      audioBytes,
      contentType,
      providerSongId,
      modelId: this.modelId,
      processingMs: Date.now() - start,
    };
  }
}
