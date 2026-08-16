"use client";

import { useState } from "react";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { signInWithGoogle } from "@/lib/auth/session";
import { useToast } from "@/components/ui/Toast";

export function GoogleButton({
  returnTo,
  label,
  className = "",
}: {
  returnTo: string;
  label?: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const showToast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleGoogleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle(returnTo);
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : t("auth.linkSendFailed");
      showToast(message, "danger");
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={loading}
      className={`flex min-h-11 w-full items-center justify-center gap-2.5 rounded-control border border-border bg-surface text-sm font-semibold text-ink transition-all duration-150 ease-magnetic hover:bg-page active:scale-[0.98] disabled:opacity-60 ${className}`}
    >
      <GoogleMark />
      {loading ? t("auth.sending") : (label ?? t("auth.continueWithGoogle"))}
    </button>
  );
}
