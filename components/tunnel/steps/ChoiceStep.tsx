"use client";

import { Check, RotateCcw, Sparkles } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { CREDIT_PACKS, formatPackEquivalence, packNotes } from "@/lib/tunnel/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TrackHeroPlayer } from "@/components/player/TrackHeroPlayer";
import { formatFcfa } from "@/lib/format/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PlayerTrack } from "@/lib/player/PlayerContext";
import type { SongAttempt } from "@/lib/tunnel/types";

// Remplace à la fois l'ancien écran d'écoute et l'ancien paywall : il n'y a
// plus de paiement séparé, chaque essai EST déjà la transaction. Un essai
// moins bon que le précédent ne doit jamais faire perdre celui qu'on
// préférait — tous restent listés, tous restent écoutables.
export function ChoiceStep() {
  const { t, tn } = useLanguage();
  const { data, update, goNext, goToStep, notesBalance, spendNote } = useTunnel();

  function handleKeep(attempt: SongAttempt) {
    update({ selectedAttemptId: attempt.id, audioUrl: attempt.audioUrl, lyrics: attempt.lyrics });
    goNext();
  }

  function handleRetry() {
    if (notesBalance <= 0) return;
    spendNote();
    goToStep("generation");
  }

  const attempts = [...data.attempts].sort((a, b) => b.index - a.index);
  const occasion = data.occasion ?? "anniversaire";

  function trackFor(attempt: SongAttempt): PlayerTrack {
    return {
      id: attempt.id,
      title: data.recipientFirstName || t("tunnel.choice.defaultSongTitle"),
      subtitle: t("tunnel.choice.attemptLabel", { index: attempt.index }),
      occasion,
      audioUrl: attempt.audioUrl,
    };
  }

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("tunnel.choice.title")}
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">{t("tunnel.choice.subtitle")}</p>
      <p className="mt-1 text-label-sm font-medium text-brand">{t("tunnel.choice.firstFreeReminder")}</p>

      <div className="mt-6 flex flex-col gap-4">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="rounded-card border border-border bg-surface p-4 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                {t("tunnel.choice.attemptLabel", { index: attempt.index })}
                {attempt.free && (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-label-sm font-medium text-success">
                    {t("tunnel.choice.free")}
                  </span>
                )}
              </p>
              {data.selectedAttemptId === attempt.id && (
                <span className="flex items-center gap-1 text-label-sm font-medium text-brand">
                  <Check className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {t("tunnel.choice.kept")}
                </span>
              )}
            </div>
            <div className="mt-3">
              <TrackHeroPlayer track={trackFor(attempt)} durationSeconds={null} />
            </div>
            <Button onClick={() => handleKeep(attempt)} variant="secondary" className="mt-3 w-full">
              {t("tunnel.choice.keepThisOne")}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-card border border-dashed border-border bg-page p-4">
        {notesBalance > 0 ? (
          <>
            <p className="text-sm font-medium text-ink">{t("tunnel.choice.notConvinced")}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {t("tunnel.choice.retryCost", { count: notesBalance - 1 })}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-brand/40 px-4 text-sm font-semibold text-brand transition-all duration-150 ease-magnetic hover:bg-page active:scale-95"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {t("tunnel.choice.retry")}
            </button>
          </>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
              {t("tunnel.choice.balanceEmpty")}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">{t("tunnel.choice.balanceEmptyHint")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {CREDIT_PACKS.map((pack) => (
                <div key={pack.id} className="rounded-control border border-border bg-surface p-3 text-center">
                  <p className="font-display text-lg font-bold text-ink">
                    {packNotes(pack)} {tn("credits.unit", packNotes(pack))}
                  </p>
                  <p className="text-label-sm text-ink-muted">{formatPackEquivalence(pack, tn)}</p>
                  <p className="mt-1 text-xs font-medium text-ink">{formatFcfa(pack.priceFcfa)}</p>
                </div>
              ))}
            </div>
            <ButtonLink href="/recharger" variant="primary" className="mt-3 w-full">
              {t("tunnel.choice.recharge")}
            </ButtonLink>
          </>
        )}
      </div>
    </div>
  );
}
