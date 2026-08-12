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
    labelKey: "recharge.history.transactions.purchasePack",
    labelParams: { songs: 5, notes: 10 },
    delta: 10,
    balanceAfter: 10,
  },
  {
    id: "credit_2",
    date: "2026-07-10",
    motif: "essai",
    labelKey: "recharge.history.transactions.freeAttempt",
    labelParams: { index: 1, name: "Kader" },
    delta: 0,
    balanceAfter: 10,
  },
  {
    id: "credit_3",
    date: "2026-07-10",
    motif: "essai",
    labelKey: "recharge.history.transactions.attempt",
    labelParams: { index: 2, name: "Kader" },
    delta: -1,
    balanceAfter: 9,
  },
  {
    id: "credit_4",
    date: "2026-07-11",
    motif: "remboursement",
    labelKey: "recharge.history.transactions.refundFailed",
    labelParams: { name: "Kader", index: 2 },
    delta: 1,
    balanceAfter: 10,
  },
  {
    id: "credit_5",
    date: "2026-07-28",
    motif: "essai",
    labelKey: "recharge.history.transactions.freeAttempt",
    labelParams: { index: 1, name: "Moussa" },
    delta: 0,
    balanceAfter: 10,
  },
  {
    id: "credit_6",
    date: "2026-07-28",
    motif: "essai",
    labelKey: "recharge.history.transactions.attempt",
    labelParams: { index: 2, name: "Moussa" },
    delta: -1,
    balanceAfter: 9,
  },
  {
    id: "credit_7",
    date: "2026-07-29",
    motif: "essai",
    labelKey: "recharge.history.transactions.attempt",
    labelParams: { index: 3, name: "Moussa" },
    delta: -1,
    balanceAfter: 8,
  },
  {
    id: "credit_8",
    date: "2026-08-02",
    motif: "essai",
    labelKey: "recharge.history.transactions.freeAttempt",
    labelParams: { index: 1, name: "Fatou" },
    delta: 0,
    balanceAfter: 8,
  },
  {
    id: "credit_9",
    date: "2026-08-02",
    motif: "essai",
    labelKey: "recharge.history.transactions.attempt",
    labelParams: { index: 2, name: "Fatou" },
    delta: -1,
    balanceAfter: 7,
  },
  {
    id: "credit_10",
    date: "2026-08-03",
    motif: "essai",
    labelKey: "recharge.history.transactions.attempt",
    labelParams: { index: 3, name: "Fatou" },
    delta: -1,
    balanceAfter: 6,
  },
];

export function getCreditTransactionsSortedDesc(): CreditTransaction[] {
  return [...mockCreditTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
