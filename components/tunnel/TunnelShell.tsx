"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { ProgressBar } from "@/components/tunnel/ProgressBar";
import { Logo } from "@/components/ui/Logo";
import { OccasionStep } from "@/components/tunnel/steps/OccasionStep";
import { RecipientStep } from "@/components/tunnel/steps/RecipientStep";
import { StoryStep } from "@/components/tunnel/steps/StoryStep";
import { StyleVoiceStep } from "@/components/tunnel/steps/StyleVoiceStep";
import { LyricsStep } from "@/components/tunnel/steps/LyricsStep";
import { GenerationStep } from "@/components/tunnel/steps/GenerationStep";
import { ChoiceStep } from "@/components/tunnel/steps/ChoiceStep";
import { DeliveryStep } from "@/components/tunnel/steps/DeliveryStep";
import { PlayerContentSpacer } from "@/components/player/PlayerContentSpacer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Chrome minimal, volontairement en dehors de DashboardShell (pas de sidebar,
// pas de barre de recherche) : le tunnel est un parcours à part entière, pas un
// onglet de plus dans le tableau de bord — "le cœur du produit" mérite tout
// l'écran, sans rien qui détourne l'attention de la question posée.
export function TunnelShell() {
  const { t } = useLanguage();
  const { step, canGoBack, goBack, progress } = useTunnel();

  // Nettoie l'URL une fois `auth`/`email`/`provider`/`name` consommés par
  // TunnelProvider (voir sa restauration `resumeAuth`) — recharger la page
  // plus tard ne doit ni rejouer le toast d'échec, ni relire un e-mail obsolète.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("auth")) return;
    for (const key of ["auth", "email", "provider", "name"]) url.searchParams.delete(key);
    window.history.replaceState(null, "", url.toString());
  }, []);

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-20 border-b border-border bg-page/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label={t("tunnel.shell.previousStep")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>

          <div className="flex-1">
            <ProgressBar progress={progress} />
          </div>

          <Link
            href="/"
            aria-label={t("tunnel.shell.closeToDashboard")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 hover:text-ink active:scale-90"
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 hidden sm:block">
          <Logo />
        </div>
        <div key={step} className="animate-step-slide">
          {step === "occasion" && <OccasionStep />}
          {step === "recipient" && <RecipientStep />}
          {step === "story" && <StoryStep />}
          {step === "style" && <StyleVoiceStep />}
          {step === "lyrics" && <LyricsStep />}
          {step === "generation" && <GenerationStep />}
          {step === "choice" && <ChoiceStep />}
          {step === "delivery" && <DeliveryStep />}
        </div>
        {/* Réserve, en fin d'écran, l'espace que le lecteur persistant occupe une
            fois affiché — sans quoi son survol fixe finirait par couvrir un bouton
            de validation qui n'est pas lui-même sticky (voir OccasionStep,
            RecipientStep, StyleVoiceStep…). Les écrans à barre sticky (Story,
            Lyrics) se décalent déjà eux-mêmes au-dessus (voir
            useMobilePlayerBarVisible) ; ce spacer couvre tous les autres. */}
        <PlayerContentSpacer />
      </main>
    </div>
  );
}
