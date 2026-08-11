import type { CreditTransaction } from "@/lib/types";

// Historique fictif, en Notes — chronologique, chaque `balanceAfter` cohérent
// avec le précédent, jusqu'au solde actuel de mockUser (6). Chaque essai
// figure comme un mouvement, même le premier de chaque chanson (gratuit,
// delta 0) : la transparence sur "combien ça a coûté" vaut aussi pour "ça n'a
// rien coûté". Kader illustre le seul remboursement : son second essai a
// échoué (voir mockSongs, status "failed").
export const mockCreditTransactions: CreditTransaction[] = [
  {
    id: "credit_1",
    date: "2026-07-05",
    motif: "achat",
    label: "Achat — pack de 5 chansons (10 Notes)",
    delta: 10,
    balanceAfter: 10,
  },
  {
    id: "credit_2",
    date: "2026-07-10",
    motif: "essai",
    label: "Essai 1 pour Kader (gratuit)",
    delta: 0,
    balanceAfter: 10,
  },
  {
    id: "credit_3",
    date: "2026-07-10",
    motif: "essai",
    label: "Essai 2 pour Kader",
    delta: -1,
    balanceAfter: 9,
  },
  {
    id: "credit_4",
    date: "2026-07-11",
    motif: "remboursement",
    label: "Remboursement — échec de génération (Kader, essai 2)",
    delta: 1,
    balanceAfter: 10,
  },
  {
    id: "credit_5",
    date: "2026-07-28",
    motif: "essai",
    label: "Essai 1 pour Moussa (gratuit)",
    delta: 0,
    balanceAfter: 10,
  },
  {
    id: "credit_6",
    date: "2026-07-28",
    motif: "essai",
    label: "Essai 2 pour Moussa",
    delta: -1,
    balanceAfter: 9,
  },
  {
    id: "credit_7",
    date: "2026-07-29",
    motif: "essai",
    label: "Essai 3 pour Moussa",
    delta: -1,
    balanceAfter: 8,
  },
  {
    id: "credit_8",
    date: "2026-08-02",
    motif: "essai",
    label: "Essai 1 pour Fatou (gratuit)",
    delta: 0,
    balanceAfter: 8,
  },
  {
    id: "credit_9",
    date: "2026-08-02",
    motif: "essai",
    label: "Essai 2 pour Fatou",
    delta: -1,
    balanceAfter: 7,
  },
  {
    id: "credit_10",
    date: "2026-08-03",
    motif: "essai",
    label: "Essai 3 pour Fatou",
    delta: -1,
    balanceAfter: 6,
  },
];

export function getCreditTransactionsSortedDesc(): CreditTransaction[] {
  return [...mockCreditTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
