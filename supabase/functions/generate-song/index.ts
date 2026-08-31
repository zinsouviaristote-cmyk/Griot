// Edge Function `generate-song` -- point d'entree unique du pipeline de
// generation musicale. Valide la demande, verifie les droits, repond
// IMMEDIATEMENT au client, puis poursuit le travail reel (appel fournisseur,
// stockage, decoupe d'extrait, finalisation) via EdgeRuntime.waitUntil().
//
// Le client ne doit jamais attendre cette requete HTTP pour savoir si la
// generation a reussi : il suit l'avancement par abonnement Realtime sur les
// lignes `songs` / `generation_attempts`.
//
// Filet de securite : un ecouteur `beforeunload` marque au mieux l'essai en
// echec si le worker est tue avant la fin (best effort, non garanti) ; le
// vrai filet est le job pg_cron `reconcile-stuck-generation-attempts`
// (voir la migration `elevenlabs_music_integration`), qui repasse en echec
// et journalise tout essai reste bloque en `processing` au-dela du delai
// raisonnable.

import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { createMusicProvider } from "./providers/index.ts";
import type { MusicGenerationRequest, MusicGenerationResult, MusicProvider } from "./providers/types.ts";
import { GenerationError, toGenerationError } from "./errors.ts";
import { analyzeMp3, clipMp3ToDuration } from "./mp3Clip.ts";

// Cette fonction n'est jamais appelee que depuis l'app Griot (avec un JWT
// utilisateur) : pas de raison qu'un autre site puisse la requeter depuis un
// navigateur. ALLOWED_ORIGINS liste les origines de l'app (prod + previews +
// dev local) ; tout le reste n'obtient pas d'en-tete CORS et le navigateur
// bloque la reponse.
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

const PREVIEW_CLIP_MS = Number(Deno.env.get("PREVIEW_CLIP_MS") ?? 25_000);
const MIN_REQUESTED_DURATION_MS = 30_000;
const MAX_REQUESTED_DURATION_MS = 120_000;
const MS_PER_LYRICS_LINE = 3_500;

function jsonResponse(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

// -----------------------------------------------------------------------
// Filet de securite "best effort" : suivi des essais en cours dans cet
// isolate pour le cas ou le worker serait tue en cours de route.
// -----------------------------------------------------------------------
const inFlightAttempts = new Set<string>();
let fallbackAdminClient: SupabaseClient | null = null;

function getFallbackAdminClient(): SupabaseClient {
  if (!fallbackAdminClient) {
    fallbackAdminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return fallbackAdminClient;
}

addEventListener("beforeunload", (ev) => {
  // deno-lint-ignore no-explicit-any
  const reason = (ev as any)?.detail?.reason ?? "unknown";
  if (inFlightAttempts.size === 0) return;

  console.log(`beforeunload (${reason}) : ${inFlightAttempts.size} essai(s) en cours, marquage best-effort.`);
  const client = getFallbackAdminClient();
  for (const attemptId of inFlightAttempts) {
    client
      .rpc("fail_song_generation", {
        p_attempt_id: attemptId,
        p_error_code: "worker_killed",
        p_error_message: `Le worker a ete arrete avant la fin de la generation (raison: ${reason}).`,
      })
      .then(() => {})
      .catch(() => {});
  }
});

// -----------------------------------------------------------------------
// RPC errors -> reponses HTTP propres, jamais de code technique cote client.
// -----------------------------------------------------------------------
function mapRequestRpcError(message: string): { status: number; code: string; userMessage: string } {
  if (message.includes("NON_AUTHENTIFIE")) {
    return { status: 401, code: "not_authenticated", userMessage: "Connecte-toi pour generer une chanson." };
  }
  if (message.includes("CHANSON_INTROUVABLE")) {
    return { status: 404, code: "song_not_found", userMessage: "Cette chanson est introuvable." };
  }
  if (message.includes("SOLDE_NOTES_INSUFFISANT")) {
    return {
      status: 402,
      code: "insufficient_credits",
      userMessage: "Il ne te reste plus de Notes. Recharge pour continuer.",
    };
  }
  return { status: 500, code: "internal_error", userMessage: "Une erreur inattendue est survenue." };
}

async function failAttempt(
  adminClient: SupabaseClient,
  attemptId: string,
  code: string,
  message: string,
  providerName?: string,
) {
  const { error } = await adminClient.rpc("fail_song_generation", {
    p_attempt_id: attemptId,
    p_error_code: code,
    p_error_message: message,
    p_provider: providerName ?? null,
    p_model_id: null,
  });
  if (error) console.error("fail_song_generation a echoue", error);
}

// Reessaie une seule fois, uniquement sur les erreurs classees reessayables
// (reseau, timeout, erreur serveur fournisseur) -- jamais sur cle invalide,
// quota depasse ou contenu refuse.
async function generateWithRetry(
  provider: MusicProvider,
  req: MusicGenerationRequest,
): Promise<MusicGenerationResult> {
  try {
    return await provider.generate(req);
  } catch (err) {
    const genErr = toGenerationError(err);
    if (!genErr.retryable) throw genErr;

    console.warn(`Erreur reessayable (${genErr.code}), un seul reessai.`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      return await provider.generate(req);
    } catch (err2) {
      throw toGenerationError(err2);
    }
  }
}

interface GenerationContext {
  songId: string;
  attemptId: string;
  voiceType: "homme" | "femme" | null;
}

async function processGeneration(adminClient: SupabaseClient, ctx: GenerationContext): Promise<void> {
  let provider: MusicProvider;
  try {
    provider = createMusicProvider();
  } catch (err) {
    const genErr = err instanceof GenerationError ? err : toGenerationError(err);
    await failAttempt(adminClient, ctx.attemptId, genErr.code, genErr.userMessage);
    return;
  }

  // 1. Selection incluant duration_seconds
  const { data: song, error: songError } = await adminClient
    .from("songs")
    .select("id, user_id, style, lyrics, story_prompt, duration_seconds")
    .eq("id", ctx.songId)
    .single();

  if (songError || !song) {
    await failAttempt(adminClient, ctx.attemptId, "internal_error", "Chanson introuvable au moment de la generation.");
    return;
  }

  const lyricsSource = (song.lyrics ?? song.story_prompt ?? "").trim();
  if (!lyricsSource) {
    await failAttempt(adminClient, ctx.attemptId, "content_rejected", "Aucune parole disponible pour cette chanson.");
    return;
  }

  const { data: styleConfig } = await adminClient
    .from("music_style_prompts")
    .select("positive_styles, negative_styles")
    .eq("style", song.style)
    .maybeSingle();

  const positiveStyles = styleConfig?.positive_styles ?? [song.style];
  const negativeStyles = styleConfig?.negative_styles ?? [];

  // 2. Calcul de la duree demandee :
  // Priorite a song.duration_seconds si disponible et valide, sinon calcul par nombre de lignes.
  let requestedDurationMs: number;

  if (typeof song.duration_seconds === "number" && song.duration_seconds > 0) {
    requestedDurationMs = Math.min(
      MAX_REQUESTED_DURATION_MS,
      Math.max(MIN_REQUESTED_DURATION_MS, song.duration_seconds * 1000),
    );
  } else {
    const lineCount = lyricsSource.split(/\r?\n/).filter((l: string) => l.trim().length > 0).length;
    requestedDurationMs = Math.min(
      MAX_REQUESTED_DURATION_MS,
      Math.max(MIN_REQUESTED_DURATION_MS, lineCount * MS_PER_LYRICS_LINE),
    );
  }

  let result: MusicGenerationResult;
  try {
    result = await generateWithRetry(provider, {
      lyrics: lyricsSource,
      style: song.style,
      voiceType: ctx.voiceType,
      positiveStyles,
      negativeStyles,
      requestedDurationMs,
    });
  } catch (err) {
    const genErr = err instanceof GenerationError ? err : toGenerationError(err);
    console.error(`generation fournisseur echouee (${genErr.code})`, genErr.message);
    await failAttempt(adminClient, ctx.attemptId, genErr.code, genErr.userMessage, provider.name);
    return;
  }

  const analysis = analyzeMp3(result.audioBytes);
  const durationSeconds = Math.round(analysis.totalDurationMs / 1000);
  const previewBytes = clipMp3ToDuration(result.audioBytes, PREVIEW_CLIP_MS);

  const masterPath = `${song.user_id}/${song.id}/${ctx.attemptId}.mp3`;
  const previewPath = `${song.id}/${ctx.attemptId}-preview.mp3`;

  const masterUpload = await adminClient.storage.from("song-masters").upload(masterPath, result.audioBytes, {
    contentType: result.contentType || "audio/mpeg",
    upsert: true,
  });
  if (masterUpload.error) {
    console.error("depot du fichier maitre echoue", masterUpload.error);
    await failAttempt(adminClient, ctx.attemptId, "internal_error", "Echec du depot du fichier audio.", provider.name);
    return;
  }

  const previewUpload = await adminClient.storage.from("song-previews").upload(previewPath, previewBytes, {
    contentType: "audio/mpeg",
    upsert: true,
  });
  if (previewUpload.error) {
    // Le fichier maitre est deja stocke correctement : on finalise quand
    // meme plutot que de perdre tout le travail pour un extrait manquant.
    console.error("depot de l'extrait echoue", previewUpload.error);
  }

  const { error: finalizeError } = await adminClient.rpc("finalize_song_generation", {
    p_attempt_id: ctx.attemptId,
    p_audio_path: masterPath,
    p_preview_audio_path: previewUpload.error ? null : previewPath,
    p_duration_seconds: durationSeconds,
    p_processing_ms: result.processingMs,
    p_elevenlabs_song_id: result.providerSongId,
    p_provider: provider.name,
    p_model_id: result.modelId,
    p_style: song.style,
    p_voice_type: ctx.voiceType,
    p_text_length: lyricsSource.length,
    p_requested_duration_ms: requestedDurationMs,
  });

  if (finalizeError) {
    console.error("finalize_song_generation a echoue", finalizeError);
    await failAttempt(
      adminClient,
      ctx.attemptId,
      "internal_error",
      "Impossible d'enregistrer la chanson generee.",
      provider.name,
    );
  }
}

Deno.serve(async (req: Request) => {
  const cors = corsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" }, cors);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse(401, { error: "missing_authorization" }, cors);
  }

  let payload: { songId?: unknown; voiceType?: unknown };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" }, cors);
  }

  const songId = payload.songId;
  if (typeof songId !== "string" || songId.length === 0) {
    return jsonResponse(400, { error: "missing_song_id" }, cors);
  }
  const voiceType = payload.voiceType === "homme" || payload.voiceType === "femme" ? payload.voiceType : null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: rpcData, error: rpcError } = await userClient.rpc("request_song_generation", {
    p_song_id: songId,
    p_prompt: null,
  });

  if (rpcError) {
    const mapped = mapRequestRpcError(rpcError.message);
    return jsonResponse(mapped.status, { error: mapped.code, message: mapped.userMessage }, cors);
  }

  const attemptId = rpcData.attempt_id as string;
  const isFree = rpcData.is_free as boolean;

  const response = jsonResponse(202, { attemptId, status: "generating", isFree }, cors);

  inFlightAttempts.add(attemptId);
  EdgeRuntime.waitUntil(
    processGeneration(adminClient, { songId, attemptId, voiceType })
      .catch((err) => console.error("processGeneration a echoue de facon inattendue", err))
      .finally(() => inFlightAttempts.delete(attemptId)),
  );

  return response;
});