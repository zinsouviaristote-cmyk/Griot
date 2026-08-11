"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Sparkles } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { mockGenerateAudio } from "@/lib/tunnel/mockAdapters";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { GoogleMark } from "@/components/auth/GoogleMark";
import type { SongAttempt } from "@/lib/tunnel/types";

const STATUS_MESSAGES = [
  "On lit votre histoire…",
  "On compose la mélodie…",
  "On enregistre la voix…",
  "On peaufine le mix…",
];

// La génération elle-même ne dépend jamais de la redirection ci-dessous : ce
// tunnel entier revit à l'identique au retour (voir TunnelContext), donc même
// si la personne part se connecter à Google en cours de route, la génération
// reprend son cours sans double déclenchement — voir la garde `cancelled` plus
// bas, qui protège seulement contre le Strict Mode, pas contre la navigation.
//
// Un essai = un passage ici. Les paroles sont déjà figées (verrouillées à
// l'écran précédent) : seule la prise audio change d'un essai à l'autre —
// "Réessayer" ne repasse jamais par l'écriture.
export function GenerationStep() {
  const { data, update, goNext } = useTunnel();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Pas de garde "déjà démarré" par ref : en Strict Mode (dev), React monte
    // l'effet, le nettoie, puis le remonte — un tel garde laisserait la seule
    // requête réellement lancée (la première) déjà annulée par ce nettoyage,
    // et la seconde invocation ne repartirait jamais. `cancelled`, propre à
    // chaque invocation, suffit : seule la dernière (la "vraie") aboutit.
    let cancelled = false;
    mockGenerateAudio().then((audioUrl) => {
      if (cancelled) return;
      const attempt: SongAttempt = {
        id: `attempt-${data.attempts.length + 1}`,
        index: data.attempts.length + 1,
        audioUrl,
        lyrics: data.lyricsDraft ?? "",
        free: data.attempts.length === 0,
      };
      update({ attempts: [...data.attempts, attempt] });
      goNext();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
        <Sparkles className="h-7 w-7 animate-breathe text-brand" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="mt-6 font-display text-headline-md text-ink">On prépare votre chanson</p>
      <p key={messageIndex} aria-live="polite" className="mt-2 min-h-[24px] animate-field-in text-body-md text-ink-muted">
        {STATUS_MESSAGES[messageIndex]}
      </p>

      {/* La friction arrive avant la récompense, jamais après : proposée
          pendant l'attente, jamais requise pour continuer — l'essai gratuit
          reste consultable sans se connecter. */}
      <div className="mt-10 w-full max-w-sm rounded-card border border-border bg-surface p-5 text-left shadow-card">
        {data.authEmail ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={1.5} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm text-ink">Connecté avec {data.authEmail}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                {data.authProvider === "google" ? (
                  <GoogleMark className="h-3 w-3" />
                ) : (
                  <Mail className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                )}
                Vous retrouverez cette chanson dans votre bibliothèque.
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-ink">Connectez-vous pour la retrouver facilement</p>
            <p className="mt-1 text-xs text-ink-muted">
              Facultatif — votre extrait gratuit reste disponible même sans compte.
            </p>

            <div className="mt-3">
              <GoogleButton returnTo="/creer" />
            </div>

            <div className="mt-4 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-ink-muted">ou</span>
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
