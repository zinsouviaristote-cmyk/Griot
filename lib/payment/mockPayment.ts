// Adaptateur factice pour la recharge — Phase 1, aucun appel réseau réel.
// À remplacer en Phase 2 par les intégrations Mobile Money et carte derrière
// exactement ces mêmes signatures (voir lib/tunnel/mockAdapters.ts, même esprit).

export type PaymentMethod = "mobile_money" | "carte";

export type PaymentStatus = "pending" | "confirmed";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initie la transaction — pour Mobile Money, c'est ce qui déclenche l'invite de
// confirmation sur le téléphone du client dans une vraie intégration.
export async function mockInitiatePayment(method: PaymentMethod, packId: string): Promise<void> {
  await wait(900);
  void method;
  void packId;
}

// Interrogée en boucle par l'écran d'attente jusqu'à confirmation — ne renvoie
// jamais d'échec : la seule issue est "pending" (on réessaie) ou "confirmed".
// Un vrai fournisseur peut mettre du temps à répondre (réseau, confirmation
// manuelle côté client) ; déclarer un échec avant d'être sûr reviendrait à
// annuler une recharge qui allait pourtant aboutir.
export async function mockCheckPaymentStatus(attempt: number): Promise<PaymentStatus> {
  await wait(1500);
  return attempt >= 2 ? "confirmed" : "pending";
}
