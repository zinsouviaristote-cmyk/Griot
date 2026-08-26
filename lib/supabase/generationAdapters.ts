import { createClient } from "@/lib/supabase/client";
import { createResilientChannel } from "@/lib/supabase/realtimeChannel";

export async function updateSongLyrics(songId: string, lyrics: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("songs").update({ lyrics }).eq("id", songId);
  if (error) throw error;
}

export interface GenerationRequestResult {
  attemptId: string;
  isFree: boolean;
}

// Déclenche la génération réelle — la fonction Edge `generate-song` répond
// immédiatement (202) une fois l'essai créé et les Notes déduites (RPC
// request_song_generation), puis termine le travail réel en arrière-plan
// (voir supabase/functions/generate-song). Le fournisseur (factice par
// défaut, ElevenLabs si configuré) est décidé côté serveur par la variable
// d'environnement MUSIC_PROVIDER, jamais ici.
export async function requestSongGeneration(songId: string, voiceType: "homme" | "femme" | null): Promise<GenerationRequestResult> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Connecte-toi pour générer ta chanson.");

  const { data, error } = await supabase.functions.invoke("generate-song", {
    body: { songId, voiceType },
  });

  if (error) {
    const message = (data as { message?: string } | null)?.message || error.message || "Impossible de lancer la génération.";
    throw new Error(message);
  }

  return { attemptId: (data as { attemptId: string }).attemptId, isFree: (data as { isFree: boolean }).isFree };
}

export interface GenerationAttemptStatus {
  status: "pending" | "processing" | "completed" | "failed";
  previewAudioPath: string | null;
  errorMessage: string | null;
}

export async function fetchGenerationAttemptStatus(attemptId: string): Promise<GenerationAttemptStatus> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("generation_attempts")
    .select("status, preview_audio_path, error_message")
    .eq("id", attemptId)
    .single();
  if (error) throw error;

  const row = data as unknown as { status: GenerationAttemptStatus["status"]; preview_audio_path: string | null; error_message: string | null };
  return { status: row.status, previewAudioPath: row.preview_audio_path, errorMessage: row.error_message };
}

interface DBGenerationAttemptRow {
  id: string;
  status: GenerationAttemptStatus["status"];
  preview_audio_path: string | null;
  error_message: string | null;
}

// Abonnement Realtime à un essai précis : c'est le chemin principal pour
// suivre l'avancement d'une génération (voir GenerationStep) — le sondage
// périodique n'est plus qu'un filet de sécurité en complément. `onResync` est
// rappelé par `createResilientChannel` dès la confirmation de l'abonnement et
// à chaque reconnexion, ce qui couvre à la fois la condition de course initiale
// (un changement survenu avant que l'abonnement soit actif) et une coupure
// réseau en cours de génération.
export function subscribeToGenerationAttempt(
  attemptId: string,
  onStatus: (status: GenerationAttemptStatus) => void,
): () => void {
  return createResilientChannel<DBGenerationAttemptRow>({
    channelName: `generation-attempt-${attemptId}`,
    table: "generation_attempts",
    event: "UPDATE",
    filter: `id=eq.${attemptId}`,
    onChange: (row) => {
      if (!row.status) return;
      onStatus({ status: row.status, previewAudioPath: row.preview_audio_path, errorMessage: row.error_message });
    },
    onResync: () => {
      fetchGenerationAttemptStatus(attemptId).then(onStatus).catch(() => {
        // Coupure réseau : `createResilientChannel` retentera à la reconnexion.
      });
    },
  });
}

export function resolvePreviewAudioUrl(path: string): string {
  const supabase = createClient();
  return supabase.storage.from("song-previews").getPublicUrl(path).data.publicUrl;
}
