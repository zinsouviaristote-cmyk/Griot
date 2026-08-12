"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { useToast } from "@/components/ui/Toast";
import { PublishModal } from "@/components/publish/PublishModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function DeliveryStep() {
  const { t } = useLanguage();
  const { data } = useTunnel();
  const showToast = useToast();
  const [copied, setCopied] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [published, setPublished] = useState(false);

  async function handleCopyLyrics() {
    if (!data.lyrics) return;
    try {
      await navigator.clipboard.writeText(data.lyrics);
      setCopied(true);
      showToast(t("tunnel.delivery.lyricsCopied"), "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(t("tunnel.delivery.copyFailed"), "danger");
    }
  }

  return (
    <div>
      {/* Seule apparition non liée au défilement de tout le tunnel (voir Reveal,
          conçu pour du contenu sous la ligne de flottaison) : la chanson terminée
          est le troisième et dernier moment de récompense du produit, toujours
          au-dessus de la ligne de flottaison à l'arrivée sur cet écran — animée
          directement au montage, en cascade douce plutôt qu'au défilement. */}
      <div className="flex animate-reveal-up flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-headline-md text-ink">{t("tunnel.delivery.ready")}</p>
        <p className="mt-1 text-body-md text-ink-muted">
          {t("tunnel.delivery.readyFor", {
            name: data.recipientFirstName || t("tunnel.delivery.readyForFallback"),
          })}
        </p>
      </div>

      <a
        href={data.audioUrl ?? "#"}
        download={`griot-${data.recipientFirstName || "chanson"}.wav`}
        style={{ animationDelay: "90ms" }}
        className="mt-8 flex min-h-11 w-full animate-reveal-up items-center justify-center gap-2 rounded-control bg-brand px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:brightness-90 active:scale-[0.98]"
      >
        <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        {t("tunnel.delivery.downloadMp3")}
      </a>

      <div
        style={{ animationDelay: "180ms" }}
        className="mt-6 animate-reveal-up rounded-card border border-border bg-surface p-5 shadow-card"
      >
        <div className="flex items-center justify-between">
          <p className="text-label-md uppercase tracking-wide text-ink-muted">{t("tunnel.delivery.lyricsTitle")}</p>
          <button
            type="button"
            onClick={handleCopyLyrics}
            className="-my-3.5 flex min-h-11 items-center gap-1.5 text-label-sm font-medium text-brand hover:underline"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            )}
            {copied ? t("tunnel.delivery.copied") : t("tunnel.delivery.copy")}
          </button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{data.lyrics}</pre>
      </div>

      {/* Point d'entrée pour la publication dans Explorer — jamais activée par
          défaut. Pour un hommage, l'action reste possible mais n'est pas mise en
          avant (lien discret plutôt que cette carte). */}
      {data.occasion && data.style && !published && data.occasion !== "hommage" && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-card border border-dashed border-border bg-page p-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Share2 className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              {t("tunnel.delivery.publishToExplore")}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">{t("tunnel.delivery.publishHint")}</p>
          </div>
          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            className="shrink-0 rounded-control border border-brand/40 px-3.5 py-2 text-xs font-semibold text-brand transition-all duration-150 ease-magnetic hover:bg-brand-soft active:scale-95"
          >
            {t("tunnel.delivery.publish")}
          </button>
        </div>
      )}
      {data.occasion && data.style && !published && data.occasion === "hommage" && (
        <button
          type="button"
          onClick={() => setPublishOpen(true)}
          className="mt-6 text-sm font-medium text-ink-muted hover:text-brand hover:underline"
        >
          {t("tunnel.delivery.publishTribute")}
        </button>
      )}
      {published && (
        <p className="mt-6 flex items-center gap-1.5 text-sm font-medium text-success">
          <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t("tunnel.delivery.published")}
        </p>
      )}

      {data.occasion && data.style && (
        <PublishModal
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          recipientFirstName={data.recipientFirstName || t("tunnel.delivery.readyForFallback")}
          occasion={data.occasion}
          style={data.style}
          onPublish={() => {
            setPublishOpen(false);
            setPublished(true);
            showToast(t("tunnel.delivery.publishedToast"), "success");
          }}
        />
      )}

      <Link href="/tableau-de-bord" className="mt-8 block text-center text-sm font-medium text-brand hover:underline">
        {t("tunnel.delivery.backToDashboard")}
      </Link>
    </div>
  );
}
