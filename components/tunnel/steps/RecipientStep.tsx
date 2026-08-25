"use client";

import type { FormEvent } from "react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Le prénom est l'élément le plus important de l'écran — c'est le mot que la
// chanson va chanter — d'où un traitement typographique proche d'un titre,
// pas un simple champ de formulaire parmi d'autres.
export function RecipientStep() {
  const { t } = useLanguage();
  const { data, update, goNext } = useTunnel();
  const canContinue = data.recipientFirstName.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;
    goNext();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="recipient-name" className="text-label-md uppercase tracking-wide text-ink-muted">
        {t("tunnel.recipient.firstNameLabel")}
      </label>
      <input
        id="recipient-name"
        autoFocus
        value={data.recipientFirstName}
        onChange={(event) => update({ recipientFirstName: event.target.value, contactId: null })}
        placeholder={t("tunnel.recipient.firstNamePlaceholder")}
        className="mt-3 w-full border-b-2 border-border bg-transparent pb-2 font-display text-4xl font-bold text-ink placeholder:text-ink-muted/30 focus:border-brand focus:outline-none sm:text-5xl"
      />
      <Button type="submit" disabled={!canContinue} className="mt-10 w-full sm:w-auto">
        {t("tunnel.recipient.continue")}
      </Button>
    </form>
  );
}
