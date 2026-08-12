"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Écran de connexion autonome — atteint directement (lien partagé, favori) ou
// depuis l'écran de génération du tunnel, qui rend ce même contenu inline
// plutôt que d'y rediriger (voir GenerationStep). Habillage Griot uniquement :
// violet en aplat, fond de page, jamais les couleurs orange de la référence.
export function ConnexionView({ returnTo }: { returnTo: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex justify-center transition-transform duration-200 ease-magnetic hover:scale-[1.03]"
        >
          <Logo />
        </Link>

        <div className="mt-8 rounded-feature border border-border bg-surface p-6 text-center shadow-card sm:p-8">
          <p className="font-display text-headline-md text-ink">{t("auth.welcome")}</p>
          <p className="mt-1.5 text-sm text-ink-muted">{t("auth.subtitle")}</p>

          <div className="mt-6">
            <GoogleButton returnTo={returnTo} />
          </div>

          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-ink-muted">{t("auth.or")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-5">
            <MagicLinkForm returnTo={returnTo} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-muted">
          {t("auth.termsPrefix")}{" "}
          <Link href="/aide" className="font-medium text-brand hover:underline">
            {t("auth.terms")}
          </Link>{" "}
          {t("auth.and")}{" "}
          <Link href="/aide" className="font-medium text-brand hover:underline">
            {t("auth.privacy")}
          </Link>{" "}
          {t("auth.ofGriot")}
        </p>
      </div>
    </div>
  );
}
