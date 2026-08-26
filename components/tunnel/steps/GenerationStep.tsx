"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mail, RotateCcw, Sparkles } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { createSongDraft, fetchUserProfile } from "@/lib/supabase/dataAdapters";
import {
  fetchGenerationAttemptStatus,
  requestSongGeneration,
  resolvePreviewAudioUrl,
  subscribeToGenerationAttempt,
  updateSongLyrics,
  type GenerationAttemptStatus,
} from "@/lib/supabase/generationAdapters";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TunnelData, SongAttempt } from "@/lib/tunnel/types";

// Filet de sécurité uniquement : le suivi principal se fait par Realtime
// (voir subscribeToGenerationAttempt), déjà résynchronisé à la reconnexion —
// cet intervalle ne rattrape que le cas résiduel d'un événement Postgres
// manqué sans que le canal ne signale d'erreur.
const SAFETY_POLL_INTERVAL_MS = 10000;

type RunResult = { status: "ok"; attempt: SongAttempt; newSongId: string | null } | { status: "error"; message: string };

// Attend la résolution (terminée ou échouée) d'un essai déjà créé en base,
// par abonnement Realtime sur sa ligne — avec sondage de secours en complément
// pour ne jamais rester bloqué si un événement était manqué. Se nettoie
// entièrement (canal + intervalle) dès que le résultat final arrive.
function waitForGenerationResult(attemptId: string): Promise<GenerationAttemptStatus> {
  return new Promise((resolve) => {
    let settled = false;

    function settle(status: GenerationAttemptStatus) {
      if (settled) return;
      if (status.status !== "completed" && status.status !== "failed") return;
      settled = true;
      cleanup();
      resolve(status);
    }

    const unsubscribe = subscribeToGenerationAttempt(attemptId, settle);

    const safetyTimer = window.setInterval(() => {
      fetchGenerationAttemptStatus(attemptId).then(settle).catch(() => {
        // Coupure réseau : le canal Realtime se resynchronisera de son côté.
      });
    }, SAFETY_POLL_INTERVAL_MS);

    function cleanup() {
      unsubscribe();
      window.clearInterval(safetyTimer);
    }
  });
}

// Toute erreur possible ici ne descend pas forcément d'`Error` (une erreur
// Postgrest/Functions peut arriver comme simple objet `{ message }`) — sans
// cette extraction tolérante, un message réel et utile se retrouvait
// silencieusement remplacé par le texte générique de secours.
function getErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  if (typeof err === "string" && err) return err;
  return "";
}

// Effectue tout le travail réel (brouillon, paroles, génération, sondage du
// résultat) exactement une fois par `runId`, quel que soit le nombre
// d'invocations de l'effet qui le déclenchent — le mode strict de React
// exécute chaque effet deux fois en développement (montage → nettoyage →
// remontage) ; sans ce partage, la première invocation crée le brouillon puis
// s'interrompt au nettoyage, et la seconde ne redémarre jamais rien.
async function performGeneration(
  data: TunnelData,
  onSongIdKnown: (id: string) => void,
  onAttemptKnown: (attemptId: string | null, isFree: boolean) => void,
): Promise<RunResult> {
  try {
    let songId = data.songId;
    if (!songId) {
      const draft = await createSongDraft({
        recipientFirstName: data.recipientFirstName,
        occasion: data.occasion ?? "anniversaire",
        style: data.style ?? "afrobeat",
        contactId: data.contactId,
        storyPrompt: data.story,
      });
      songId = draft.id;
      onSongIdKnown(songId);
    }

    // Reprise : un essai était déjà en cours côté serveur avant que ce
    // composant ne (re)monte (retour d'onglet, reconnexion) — on ne relance
    // jamais une seconde génération, on se rebranche simplement dessus.
    let attemptId = data.pendingAttemptId;
    let isFree = data.pendingAttemptIsFree;
    if (!attemptId) {
      await updateSongLyrics(songId, data.lyricsDraft ?? "");
      const result = await requestSongGeneration(songId, data.voiceType);
      attemptId = result.attemptId;
      isFree = result.isFree;
      onAttemptKnown(attemptId, isFree);
    }

    const attemptStatus = await waitForGenerationResult(attemptId);

    if (attemptStatus.status === "completed" && attemptStatus.previewAudioPath) {
      const audioUrl = resolvePreviewAudioUrl(attemptStatus.previewAudioPath);
      const attempt: SongAttempt = {
        id: attemptId,
        index: data.attempts.length + 1,
        audioUrl,
        lyrics: data.lyricsDraft ?? "",
        free: isFree,
      };
      onAttemptKnown(null, false);
      return { status: "ok", attempt, newSongId: songId };
    }

    onAttemptKnown(null, false);
    return { status: "error", message: attemptStatus.errorMessage || "" };
  } catch (err) {
    return { status: "error", message: getErrorMessage(err) };
  }
}

// La génération elle-même ne dépend jamais de la redirection ci-dessous : ce
// tunnel entier revit à l'identique au retour (voir TunnelContext), donc même
// si la personne part se connecter à Google en cours de route, la génération
// reprend son cours sans double déclenchement.
//
// Un essai = un passage ici. Les paroles sont déjà figées (verrouillées à
// l'écran précédent) : seule la prise audio change d'un essai à l'autre —
// "Réessayer" ne repasse jamais par l'écriture.
//
// La génération réelle exige un compte (RLS Supabase : aucune ligne `songs`
// ne peut exister sans `auth.uid()`) — contrairement à l'ancienne maquette,
// la connexion n'est plus facultative ici, seulement retardée jusqu'à ce
// qu'elle ait lieu.
export function GenerationStep() {
  const { t } = useLanguage();
  const { data, update, goNext, setNotesBalance } = useTunnel();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const runRef = useRef<{ runId: string; promise: Promise<RunResult> } | null>(null);
  const statusMessages = [
    t("tunnel.generation.statusReading"),
    t("tunnel.generation.statusComposing"),
    t("tunnel.generation.statusRecording"),
    t("tunnel.generation.statusMixing"),
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % statusMessages.length);
    }, 2000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data.authEmail) return;
    // `retryToken` fait partie de la clé : un nouvel essai après échec doit
    // relancer exactement cette même séquence, sans attendre un remontage
    // complet du composant.
    const runId = `${data.authEmail}:${retryToken}`;
    if (!runRef.current || runRef.current.runId !== runId) {
      setError(null);
      runRef.current = {
        runId,
        promise: performGeneration(
          data,
          (songId) => update({ songId }),
          (pendingAttemptId, pendingAttemptIsFree) => update({ pendingAttemptId, pendingAttemptIsFree }),
        ),
      };
    }

    let cancelled = false;
    runRef.current.promise.then(async (result) => {
      if (cancelled) return;
      if (result.status === "ok") {
        const profile = await fetchUserProfile();
        if (cancelled) return;
        if (profile) setNotesBalance(profile.creditBalance);
        update({ attempts: [...data.attempts, result.attempt] });
        goNext();
      } else {
        setError(result.message || t("tunnel.generation.failedBody"));
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.authEmail, retryToken]);

  if (error) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <RotateCcw className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">{t("tunnel.generation.failedTitle")}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{error}</p>
        <Button onClick={() => setRetryToken((current) => current + 1)} variant="primary" className="mt-5">
          {t("tunnel.generation.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
        <Sparkles className="h-7 w-7 animate-breathe text-brand" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="mt-6 font-display text-headline-md text-ink">{t("tunnel.generation.preparing")}</p>
      <p key={messageIndex} aria-live="polite" className="mt-2 min-h-[24px] animate-field-in text-body-md text-ink-muted">
        {statusMessages[messageIndex]}
      </p>

      {/* La friction arrive avant la récompense, jamais après : la connexion
          est désormais nécessaire pour générer (voir RLS Supabase), donc
          affichée sans détour dès cet écran plutôt qu'en option tardive. */}
      <div className="mt-10 w-full max-w-sm rounded-card border border-border bg-surface p-5 text-left shadow-card">
        {data.authEmail ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={1.5} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm text-ink">{t("tunnel.generation.connectedAs", { email: data.authEmail ?? "" })}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                {data.authProvider === "google" ? (
                  <GoogleMark className="h-3 w-3" />
                ) : (
                  <Mail className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                )}
                {t("tunnel.generation.connectedHint")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-ink">{t("tunnel.generation.connectPrompt")}</p>
            <p className="mt-1 text-xs text-ink-muted">{t("tunnel.generation.connectOptional")}</p>

            <div className="mt-3">
              <GoogleButton returnTo="/creer" />
            </div>

            <div className="mt-4 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-ink-muted">{t("tunnel.generation.or")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-4">
              <MagicLinkForm returnTo="/creer" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
