"use client";

import { useState } from "react";
import { TriangleAlert, UserRoundPlus } from "lucide-react";
import { ContactCard } from "@/components/proches/ContactCard";
import { ContactFormModal, type ContactFormOutput } from "@/components/proches/ContactFormModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { getNextOccurrence } from "@/lib/format/date";
import { mockSongs } from "@/lib/data/mock-dashboard";
import type { Contact } from "@/lib/types";

let localIdCounter = 0;

// État local, non persisté au rechargement — même philosophie que le reste du
// produit en phase 1 (mock, aucun appel réel). Ajouter/modifier/supprimer se
// ressent immédiatement dans la session, sans prétendre survivre à un F5.
export function ProchesView({ contacts: initialContacts }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const sorted = [...contacts].sort(
    (a, b) => getNextOccurrence(a.birthday).getTime() - getNextOccurrence(b.birthday).getTime(),
  );

  function songCountFor(contactId: string): number {
    return mockSongs.filter((song) => song.contactId === contactId).length;
  }

  function openAddModal() {
    setEditingContact(null);
    setFormOpen(true);
  }

  function handleSave(values: ContactFormOutput) {
    if (editingContact) {
      const editedId = editingContact.id;
      setContacts((current) => current.map((c) => (c.id === editedId ? { ...c, ...values } : c)));
    } else {
      const newContact: Contact = { id: `contact_local_${(localIdCounter += 1)}`, ...values };
      setContacts((current) => [...current, newContact]);
    }
    setFormOpen(false);
    setEditingContact(null);
  }

  function handleConfirmDelete() {
    if (!deletingContact) return;
    const deletedId = deletingContact.id;
    setContacts((current) => current.filter((c) => c.id !== deletedId));
    setDeletingContact(null);
  }

  if (contacts.length === 0) {
    return (
      <>
        <EmptyState
          icon={UserRoundPlus}
          title="Ajoutez ceux qui comptent"
          description="On vous préviendra avant leur anniversaire — vous ne raterez plus une occasion d'offrir une chanson."
          actionLabel="Ajouter un proche"
          onAction={openAddModal}
        />
        <ContactFormModal
          key={`${editingContact?.id ?? "new"}:${formOpen}`}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          contact={editingContact}
        />
      </>
    );
  }

  const deletingSongCount = deletingContact ? songCountFor(deletingContact.id) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {contacts.length} proche{contacts.length > 1 ? "s" : ""}
        </p>
        <Button onClick={openAddModal}>Ajouter un proche</Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((contact, index) => (
          <Reveal key={contact.id} delayMs={index * 80}>
            <ContactCard
              contact={contact}
              songCount={songCountFor(contact.id)}
              onEdit={() => {
                setEditingContact(contact);
                setFormOpen(true);
              }}
              onDelete={() => setDeletingContact(contact)}
            />
          </Reveal>
        ))}
      </div>

      {/* `key` force un vrai remontage à chaque ouverture : ProchesView rend ce
          composant en continu (Modal ne masque que ses enfants côté affichage),
          donc son `useState` interne ne relirait `contact` qu'une fois, jamais
          au proche suivant, sans cette clé qui change à chaque ouverture. */}
      <ContactFormModal
        key={`${editingContact?.id ?? "new"}:${formOpen}`}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        contact={editingContact}
      />

      <Modal
        open={deletingContact !== null}
        onClose={() => setDeletingContact(null)}
        labelledBy="delete-contact-title"
      >
        {deletingContact && (
          <>
            <p id="delete-contact-title" className="font-display text-lg font-semibold text-ink">
              Supprimer {deletingContact.firstName} de vos proches ?
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Sa fiche — lien, anniversaire, note — sera définitivement supprimée.
            </p>
            {deletingSongCount > 0 && (
              <div className="mt-3 flex items-start gap-2.5 rounded-card border border-warning/30 bg-warning/10 p-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm text-ink">
                  {deletingSongCount} chanson{deletingSongCount > 1 ? "s" : ""} déjà créée
                  {deletingSongCount > 1 ? "s" : ""} pour {deletingContact.firstName} — elle
                  {deletingSongCount > 1 ? "s restent" : " reste"} dans votre bibliothèque, seule cette fiche
                  contact disparaît.
                </p>
              </div>
            )}
            <div className="mt-5 flex gap-3">
              <Button variant="ghost" onClick={() => setDeletingContact(null)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleConfirmDelete} className="flex-1 !bg-danger hover:!brightness-90">
                Supprimer
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
