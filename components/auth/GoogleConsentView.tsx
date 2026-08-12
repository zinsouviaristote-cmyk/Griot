"use client";

import { useState } from "react";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { Avatar } from "@/components/ui/Avatar";
import { withParams } from "@/lib/auth/returnUrl";
import { markMockSessionActive } from "@/lib/auth/session";
import { mockUser } from "@/lib/data/mock-dashboard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Outcome = "success" | "denied" | "error";

// Simule l'écran de consentement Google — hors identité Griot par choix : ce
// n'est pas notre page, elle doit se sentir tierce. Phase 1 sans fournisseur
// réel : les trois boutons couvrent les trois issues qu'un vrai retour OAuth
// peut produire (accepté, refusé, en échec), pour que chacune reste testable
// sans dépendre d'un compte Google réel.
export function GoogleConsentView({ returnTo }: { returnTo: string }) {
  const { t } = useLanguage();
  const [pending, setPending] = useState<Outcome | null>(null);

  function resolve(outcome: Outcome) {
    setPending(outcome);
    window.setTimeout(() => {
      const params: Record<string, string> =
        outcome === "success"
          ? { auth: "success", provider: "google", email: mockUser.email, name: mockUser.firstName }
          : { auth: outcome };
      if (outcome === "success") markMockSessionActive();
      window.location.href = withParams(returnTo, params);
    }, 700);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2f2f2] px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-[#dadce0] bg-white p-8 text-center shadow-sm">
        <GoogleMark className="mx-auto h-9 w-9" />
        <p className="mt-4 text-xl text-[#202124]">{t("auth.googleChooseAccount")}</p>
        <p className="mt-1 text-sm text-[#5f6368]">{t("auth.googleContinueTo")}</p>

        <button
          type="button"
          onClick={() => resolve("success")}
          disabled={pending !== null}
          className="mt-6 flex w-full items-center gap-3 rounded-md border border-[#dadce0] px-4 py-3 text-left transition-colors hover:bg-[#f8f9fa] disabled:opacity-60"
        >
          <Avatar initials={mockUser.initials} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm text-[#202124]">{mockUser.firstName}</span>
            <span className="block truncate text-xs text-[#5f6368]">{mockUser.email}</span>
          </span>
        </button>

        {pending && (
          <p className="mt-4 text-xs text-[#5f6368]" aria-live="polite">
            {pending === "success" && t("auth.googleConnecting")}
            {pending === "denied" && t("auth.googleReturning")}
            {pending === "error" && t("auth.googleFailed")}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => resolve("denied")}
            disabled={pending !== null}
            className="font-medium text-[#1a73e8] hover:underline disabled:opacity-60"
          >
            {t("auth.googleCancel")}
          </button>
          <button
            type="button"
            onClick={() => resolve("error")}
            disabled={pending !== null}
            className="text-[#5f6368] hover:underline disabled:opacity-60"
          >
            {t("auth.googleSimulateError")}
          </button>
        </div>
      </div>

      <p className="sr-only">{t("auth.googleSrDisclaimer")}</p>
    </div>
  );
}
