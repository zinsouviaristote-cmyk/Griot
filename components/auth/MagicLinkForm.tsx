"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { sendMagicLink } from "@/lib/auth/session";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MagicLinkForm({ returnTo }: { returnTo: string }) {
  const { t } = useLanguage();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isValid = EMAIL_PATTERN.test(email.trim());

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid || sending) return;
    setSending(true);
    try {
      await sendMagicLink(email.trim(), returnTo);
      setSent(true);
      showToast(t("auth.linkSentToast"), "success");
    } catch (err: unknown) {
      setSending(false);
      const message = err instanceof Error ? err.message : t("auth.linkSendFailed");
      showToast(message, "danger");
    }
  }

  if (sent) {
    return (
      <div className="rounded-control border border-brand/20 bg-brand/5 p-4 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-brand" />
        <p className="mt-2 text-sm font-semibold text-ink">
          {t("auth.linkSentToast")}
        </p>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          {t("auth.linkSentToBefore")}
          <strong>{email}</strong>
          {t("auth.linkSentToAfter")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="block text-left">
        <span className="sr-only">{t("auth.emailLabel")}</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("auth.emailPlaceholder")}
          className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus"
        />
      </label>
      <button
        type="submit"
        disabled={!isValid || sending}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-brand px-5 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:brightness-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        {sending ? t("auth.sending") : t("auth.receiveLink")}
      </button>
    </form>
  );
}
