"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { mockSendMagicLink } from "@/lib/tunnel/mockAdapters";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sans mot de passe : un lien à usage unique envoyé par e-mail, seule
// alternative à Google dans ce produit. /connexion/lien-envoye fait office de
// boîte mail tant que l'envoi réel n'est pas branché (Phase 2) — son bouton de
// test simule le clic sur le lien reçu, pour que ce chemin reste vérifiable
// de bout en bout dès maintenant.
export function MagicLinkForm({ returnTo }: { returnTo: string }) {
  const { t } = useLanguage();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const isValid = EMAIL_PATTERN.test(email.trim());

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid || sending) return;
    setSending(true);
    try {
      await mockSendMagicLink(email.trim());
      const params = new URLSearchParams({ email: email.trim(), returnTo });
      window.location.href = `/connexion/lien-envoye?${params.toString()}`;
    } catch {
      setSending(false);
      showToast(t("auth.linkSendFailed"), "danger");
    }
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
