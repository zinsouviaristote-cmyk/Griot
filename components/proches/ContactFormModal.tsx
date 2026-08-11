"use client";

import { useState, type FormEvent } from "react";
import { Cake, TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RELATIONSHIP_OPTIONS } from "@/lib/types";
import type { Contact, Relationship } from "@/lib/types";

export interface ContactFormOutput {
  firstName: string;
  relationship: Relationship;
  birthday: string;
  phone: string | null;
  note: string | null;
}

interface FormValues {
  firstName: string;
  relationship: Relationship | null;
  birthday: string;
  phone: string;
  note: string;
}

function toFormValues(contact: Contact | null): FormValues {
  if (!contact) return { firstName: "", relationship: null, birthday: "", phone: "", note: "" };
  return {
    firstName: contact.firstName,
    relationship: contact.relationship,
    birthday: contact.birthday,
    phone: contact.phone ?? "",
    note: contact.note ?? "",
  };
}

export function ContactFormModal({
  open,
  onClose,
  onSave,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (values: ContactFormOutput) => void;
  contact: Contact | null;
}) {
  // Remonte à chaque ouverture (Modal ne rend rien tant que fermé) : cet état
  // initial dépend simplement de `contact`, jamais besoin de le resynchroniser.
  const [values, setValues] = useState<FormValues>(() => toFormValues(contact));
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  const phoneDigits = values.phone.replace(/\D/g, "");
  const errors: Partial<Record<keyof FormValues, string>> = {
    firstName: values.firstName.trim() ? undefined : "Indiquez un prénom.",
    relationship: values.relationship ? undefined : "Choisissez un lien.",
    birthday: values.birthday ? undefined : "Choisissez une date d'anniversaire.",
    phone: values.phone.trim() && phoneDigits.length < 8 ? "Numéro incomplet." : undefined,
  };

  function markTouched(field: keyof FormValues) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ firstName: true, relationship: true, birthday: true, phone: true });
    if (errors.firstName || errors.relationship || errors.birthday || errors.phone) return;
    onSave({
      firstName: values.firstName.trim(),
      relationship: values.relationship as Relationship,
      birthday: values.birthday,
      phone: values.phone.trim() || null,
      note: values.note.trim() || null,
    });
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="contact-form-title" size="md">
      <form onSubmit={handleSubmit} noValidate>
        <p id="contact-form-title" className="font-display text-lg font-semibold text-ink">
          {contact ? `Modifier ${contact.firstName}` : "Ajouter un proche"}
        </p>

        <div className="mt-5">
          <label htmlFor="contact-firstname" className="text-label-md uppercase tracking-wide text-ink-muted">
            Prénom
          </label>
          <input
            id="contact-firstname"
            autoFocus
            value={values.firstName}
            onChange={(event) => setValues((v) => ({ ...v, firstName: event.target.value }))}
            onBlur={() => markTouched("firstName")}
            placeholder="Fatou"
            aria-invalid={touched.firstName && !!errors.firstName}
            className={`mt-2 min-h-11 w-full rounded-control border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none ${
              touched.firstName && errors.firstName
                ? "border-danger"
                : "border-border focus:border-brand focus:shadow-ring-focus"
            }`}
          />
          {touched.firstName && errors.firstName && (
            <p className="mt-1.5 flex animate-field-in items-center gap-1.5 text-label-sm text-danger">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-label-md uppercase tracking-wide text-ink-muted">Lien</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((relationship) => {
              const isSelected = values.relationship === relationship;
              return (
                <button
                  key={relationship}
                  type="button"
                  onClick={() => {
                    setValues((v) => ({ ...v, relationship }));
                    markTouched("relationship");
                  }}
                  aria-pressed={isSelected}
                  className={`min-h-11 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all duration-150 ease-magnetic hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-ink-muted hover:border-brand/40 hover:text-ink"
                  }`}
                >
                  {relationship}
                </button>
              );
            })}
          </div>
          {touched.relationship && errors.relationship && (
            <p className="mt-1.5 flex animate-field-in items-center gap-1.5 text-label-sm text-danger">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {errors.relationship}
            </p>
          )}
        </div>

        {/* Champ décisif : mis en avant par la position (après l'identité, avant le
            facultatif), le format (carte distincte) et une ligne qui dit pourquoi —
            jamais relégué en bas comme un champ parmi d'autres. */}
        <div
          className={`mt-5 rounded-card border p-4 ${
            touched.birthday && errors.birthday ? "border-danger" : "border-brand/30 bg-brand-soft"
          }`}
        >
          <label htmlFor="contact-birthday" className="flex items-center gap-1.5 text-sm font-semibold text-brand">
            <Cake className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Date d&apos;anniversaire
          </label>
          <p className="mt-1 text-xs text-ink-muted">
            Sert au rappel automatique et à la carte « Prochaine occasion » du tableau de bord.
          </p>
          <input
            id="contact-birthday"
            type="date"
            value={values.birthday}
            onChange={(event) => setValues((v) => ({ ...v, birthday: event.target.value }))}
            onBlur={() => markTouched("birthday")}
            aria-invalid={touched.birthday && !!errors.birthday}
            className="mt-3 min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:shadow-ring-focus"
          />
          {touched.birthday && errors.birthday && (
            <p className="mt-1.5 flex animate-field-in items-center gap-1.5 text-label-sm text-danger">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {errors.birthday}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="contact-phone" className="text-label-md uppercase tracking-wide text-ink-muted">
            Téléphone (facultatif)
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => setValues((v) => ({ ...v, phone: event.target.value }))}
            onBlur={() => markTouched("phone")}
            placeholder="07 00 00 00 00"
            aria-invalid={touched.phone && !!errors.phone}
            className={`mt-2 min-h-11 w-full rounded-control border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none ${
              touched.phone && errors.phone
                ? "border-danger"
                : "border-border focus:border-brand focus:shadow-ring-focus"
            }`}
          />
          {touched.phone && errors.phone && (
            <p className="mt-1.5 flex animate-field-in items-center gap-1.5 text-label-sm text-danger">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {errors.phone}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="contact-note" className="text-label-md uppercase tracking-wide text-ink-muted">
            Note (facultatif)
          </label>
          <textarea
            id="contact-note"
            rows={2}
            value={values.note}
            onChange={(event) => setValues((v) => ({ ...v, note: event.target.value }))}
            placeholder="Ex. adore le zouk, n'entend plus très bien au téléphone…"
            className="mt-2 w-full resize-none rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:shadow-ring-focus"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" className="flex-1">
            {contact ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
