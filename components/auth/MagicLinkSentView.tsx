"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { withParams } from "@/lib/auth/returnUrl";
import { markMockSessionActive } from "@/lib/auth/session";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Tient lieu de boîte mail tant que l'envoi réel n'est pas branché (Phase 2) —
// le bouton de test simule le clic sur le lien reçu, pour que ce chemin de
// connexion reste vérifiable de bout en bout dès maintenant, avec le même
// aller-retour réel (navigation complète) qu'un vrai lien cliqué depuis un
// client mail l'aurait produit.
export function MagicLinkSentView({ email, returnTo }: { email: string; returnTo: string }) {
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);

  function handleTestClick() {
    setSending(true);
    window.setTimeout(() => {
      markMockSessionActive();
      window.location.href = withParams(returnTo, { auth: "success", provider: "email", email });
    }, 500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-feature border border-border bg-surface p-6 shadow-card sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
            <MailCheck className="h-6 w-6 text-brand" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-headline-md text-ink">{t("auth.checkYourInbox")}</p>
          <p className="mt-2 text-sm text-ink-muted">
            {t("auth.linkSentToBefore")}
            <span className="font-medium text-ink">{email}</span>
            {t("auth.linkSentToAfter")}
          </p>

          <div className="mt-6 border-t border-dashed border-border pt-5">
            <p className="text-xs text-ink-muted">{t("auth.demoNoticeTitle")}</p>
            <button
              type="button"
              onClick={handleTestClick}
              disabled={sending}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-control border border-brand/40 px-4 text-sm font-semibold text-brand transition-all duration-150 ease-magnetic hover:bg-brand-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? t("auth.openingLink") : t("auth.iClickedTheLink")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
