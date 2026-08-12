"use client";

import type { FormEvent } from "react";
import { Cake, UsersRound } from "lucide-react";
import { useTunnel } from "@/lib/tunnel/TunnelContext";
import { RELATIONSHIP_OPTIONS } from "@/lib/tunnel/types";
import { Button } from "@/components/ui/Button";
import { mockContacts } from "@/lib/data/mock-contacts";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { relationshipLabel } from "@/lib/i18n/catalog";
import type { Contact } from "@/lib/types";

// Le prénom est l'élément le plus important de l'écran — c'est le mot que la
// chanson va chanter — d'où un traitement typographique proche d'un titre,
// pas un simple champ de formulaire parmi d'autres.
export function RecipientStep() {
  const { t } = useLanguage();
  const { data, update, goNext } = useTunnel();
  const canContinue = data.recipientFirstName.trim().length > 0 && data.relationship !== null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;
    goNext();
  }

  function pickContact(contact: Contact) {
    update({
      recipientFirstName: contact.firstName,
      relationship: contact.relationship,
      contactId: contact.id,
      recipientBirthday: contact.birthday,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {mockContacts.length > 0 && (
        <div className="mb-6">
          <p className="flex items-center gap-1.5 text-label-md uppercase tracking-wide text-ink-muted">
            <UsersRound className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            {t("tunnel.recipient.pickFromContacts")}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {mockContacts.map((contact) => {
              const isSelected = data.contactId === contact.id;
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => pickContact(contact)}
                  aria-pressed={isSelected}
                  className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-ink-muted hover:border-brand/40 hover:text-ink"
                  }`}
                >
                  {contact.firstName}
                </button>
              );
            })}
          </div>
        </div>
      )}

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

      <p className="mt-10 text-label-md uppercase tracking-wide text-ink-muted">
        {t("tunnel.recipient.relationshipLabelWith", {
          name: data.recipientFirstName.trim() || t("tunnel.recipient.relationshipDefaultName"),
        })}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {RELATIONSHIP_OPTIONS.map((relationship) => {
          const isSelected = data.relationship === relationship;
          return (
            <button
              key={relationship}
              type="button"
              onClick={() => update({ relationship })}
              aria-pressed={isSelected}
              className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium capitalize transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
                isSelected
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border text-ink-muted hover:border-brand/40 hover:text-ink"
              }`}
            >
              {relationshipLabel(t, relationship)}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-5">
        <div className="max-w-[180px]">
          <label htmlFor="recipient-age" className="text-label-md uppercase tracking-wide text-ink-muted">
            {t("tunnel.recipient.ageLabel")}
          </label>
          <input
            id="recipient-age"
            type="number"
            min={0}
            max={120}
            inputMode="numeric"
            value={data.recipientAge}
            onChange={(event) => update({ recipientAge: event.target.value })}
            placeholder={t("tunnel.recipient.agePlaceholder")}
            className="mt-2 min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus"
          />
        </div>

        <div className="max-w-[220px]">
          <label htmlFor="recipient-birthday" className="text-label-md uppercase tracking-wide text-ink-muted">
            {t("tunnel.recipient.birthdayLabel")}
          </label>
          <input
            id="recipient-birthday"
            type="date"
            value={data.recipientBirthday}
            onChange={(event) => update({ recipientBirthday: event.target.value })}
            className="mt-2 min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus"
          />
          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
            <Cake className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {t("tunnel.recipient.birthdayHint")}
          </p>
        </div>
      </div>

      <Button type="submit" disabled={!canContinue} className="mt-10 w-full sm:w-auto">
        {t("tunnel.recipient.continue")}
      </Button>
    </form>
  );
}
