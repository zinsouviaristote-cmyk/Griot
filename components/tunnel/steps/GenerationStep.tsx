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

const SAFETY_POLL_INTERVAL_MS = 10000;

type RunResult = { status: "ok"; attempt: SongAttempt; newSongId: string | null } | { status: "error"; message: string };

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
      fetchGenerationAttemptStatus(attemptId).then(settle).catch(() => {});
    }, SAFETY_POLL_INTERVAL_MS);

    function cleanup() {
      unsubscribe();
      window.clearInterval(safetyTimer);
    }
  });
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  if (typeof err === "string" && err) return err;
  return "";
}

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
        durationSeconds: data.duration ?? 120,
      });
      songId = draft.id;
      onSongIdKnown(songId);
    }

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
  }, [statusMessages.length]);

  useEffect(() => {
    if (!data.authEmail) return;
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
  }, [data, retryToken, goNext, setNotesBalance, t, update]);
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