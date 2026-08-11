import { formatIsoDate, getNextOccurrence } from "@/lib/format/date";
import type { Contact, NextOccasion } from "@/lib/types";

// Un contact par destinataire déjà présent dans mockSongs (voir mock-dashboard.ts,
// qui référence ces id via Song.contactId), plus Fatoumata — nom déjà utilisé par
// la carte "Prochaine occasion" du tableau de bord avant que celle-ci ne soit
// calculée dynamiquement : elle doit continuer à s'y retrouver, le 18 août.
export const mockContacts: Contact[] = [
  {
    id: "contact_1",
    firstName: "Fatou",
    relationship: "ma mère",
    birthday: "1968-09-12",
    phone: "07 01 02 03 04",
    note: null,
  },
  {
    id: "contact_2",
    firstName: "Moussa",
    relationship: "mon ami·e",
    birthday: "1991-10-03",
    phone: null,
    note: "Adore le coupé-décalé.",
  },
  {
    id: "contact_3",
    firstName: "Awa",
    relationship: "ma femme",
    birthday: "1993-08-25",
    phone: "07 05 06 07 08",
    note: null,
  },
  {
    id: "contact_4",
    firstName: "Ibrahim",
    relationship: "mon père",
    birthday: "1962-02-14",
    phone: null,
    note: null,
  },
  {
    id: "contact_5",
    firstName: "Aminata",
    relationship: "ma sœur",
    birthday: "1996-08-30",
    phone: "07 09 10 11 12",
    note: null,
  },
  {
    id: "contact_6",
    firstName: "Kader",
    relationship: "autre",
    birthday: "1994-01-05",
    phone: null,
    note: "Collègue de bureau.",
  },
  {
    id: "contact_7",
    firstName: "Yacouba",
    relationship: "mon grand-père",
    birthday: "1948-08-20",
    phone: null,
    note: "N'entend plus très bien au téléphone.",
  },
  {
    id: "contact_8",
    firstName: "Fatoumata",
    relationship: "autre",
    birthday: "1994-08-18",
    phone: null,
    note: null,
  },
];

export function getContactById(id: string): Contact | undefined {
  return mockContacts.find((contact) => contact.id === id);
}

// Alimente la carte "Prochaine occasion" du tableau de bord — un anniversaire de
// proche est toujours l'occasion "anniversaire", jamais une autre.
export function getNextOccasionFromContacts(
  contacts: Contact[],
  from: Date = new Date(),
): NextOccasion | null {
  let closest: { contact: Contact; nextDate: Date } | null = null;
  for (const contact of contacts) {
    const nextDate = getNextOccurrence(contact.birthday, from);
    if (!closest || nextDate < closest.nextDate) {
      closest = { contact, nextDate };
    }
  }
  if (!closest) return null;
  return {
    recipientFirstName: closest.contact.firstName,
    occasion: "anniversaire",
    date: formatIsoDate(closest.nextDate),
  };
}
