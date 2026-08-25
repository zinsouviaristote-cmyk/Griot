"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { styleCatalog } from "@/lib/tunnel/types";
import { MOCK_AUDIO_SRC } from "@/lib/tunnel/mockAdapters";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { styleLabel, styleTagline } from "@/lib/i18n/catalog";
import type { MusicStyle } from "@/lib/types";

const PREVIEW_DURATION_MS = 8000;
 
export function StyleVoiceStep() {
  const { t } = useLanguage();
  const { data, update, goNext } = useTunnel();
  const [playingId, setPlayingId] = useState<MusicStyle | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutRef = useRef<number>();

  // L'hommage écarte les styles festifs — si l'utilisateur revient en arrière
  // et change d'occasion après avoir choisi un style qui n'est plus proposé,
  // on ne laisse pas une sélection invalide et invisible traîner en mémoire.
  const availableStyles = styleCatalog;
  
  useEffect(() => {
    if (data.style && !availableStyles.some((s) => s.id === data.style)) {
      update({ style: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.occasion]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function stopPreview() {
    audioRef.current?.pause();
    setPlayingId(null);
    window.clearTimeout(timeoutRef.current);
  }

  function togglePreview(id: MusicStyle) {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId === id) {
      stopPreview();
      return;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setPlayingId(id);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(stopPreview, PREVIEW_DURATION_MS);
  }

  const canContinue = data.style !== null && data.voiceType !== null;

  return (
    <div>
      <SectionTitle as="h1" size="lg">
        {t("tunnel.style.title")}
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">{t("tunnel.style.subtitle")}</p>

      <audio ref={audioRef} src={MOCK_AUDIO_SRC} preload="none" onEnded={stopPreview} className="hidden" />

      <div className="mt-6 space-y-2.5">
        {availableStyles.map((s) => {
          const isSelected = data.style === s.id;
          const isPlaying = playingId === s.id;
          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 rounded-card border p-3 transition-colors duration-150 ${
                isSelected ? "border-brand bg-brand-soft" : "border-border bg-surface"
              }`}
            >
              <button
                type="button"
                onClick={() => togglePreview(s.id)}
                aria-label={
                  isPlaying
                    ? t("tunnel.style.stopPreview", { style: styleLabel(t, s.id) })
                    : t("tunnel.style.playPreview", { style: styleLabel(t, s.id) })
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform duration-150 ease-magnetic active:scale-90"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4 translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => update({ style: s.id })}
                aria-pressed={isSelected}
                className="min-h-11 flex-1 text-left"
              >
                <p className="font-display text-base font-semibold text-ink">{styleLabel(t, s.id)}</p>
                <p className="text-xs text-ink-muted">{styleTagline(t, s.id)}</p>
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-label-md uppercase tracking-wide text-ink-muted">{t("tunnel.style.voiceLabel")}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {(["femme", "homme"] as const).map((voice) => {
          const isSelected = data.voiceType === voice;
          return (
            <button
              key={voice}
              type="button"
              onClick={() => update({ voiceType: voice })}
              aria-pressed={isSelected}
              className={`min-h-11 rounded-control border px-4 py-3 text-sm font-semibold transition-all duration-150 ease-magnetic active:scale-95 ${
                isSelected
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border text-ink-muted hover:border-brand/40 hover:text-ink"
              }`}
            >
              {voice === "homme" ? t("tunnel.style.voiceMale") : t("tunnel.style.voiceFemale")}
            </button>
          );
        })}
      </div>

      <Button onClick={goNext} disabled={!canContinue} className="mt-8 w-full sm:w-auto">
        {t("tunnel.style.continue")}
      </Button>
    </div>
  );
}
