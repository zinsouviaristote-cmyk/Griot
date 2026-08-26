"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createResilientChannel } from "@/lib/supabase/realtimeChannel";

// Magasin partagé, en dehors de React (même schéma que useUserProfile) : la
// pastille du haut, la carte de la sidebar et l'écran de paiement lisent tous
// le MÊME solde, mis à jour par un unique abonnement Realtime sur la ligne
// `profiles` de l'utilisateur — jamais trois copies qui pourraient diverger.
type Listener = () => void;

let cachedBalance: number | null = null;
let subscribedUserId: string | null = null;
let unsubscribeChannel: (() => void) | null = null;
const listeners = new Set<Listener>();

function notifyAll() {
  listeners.forEach((listener) => listener());
}

interface DBProfileBalanceRow {
  id: string;
  credit_balance: number;
}

function ensureSubscription(userId: string) {
  if (subscribedUserId === userId && unsubscribeChannel) return;
  unsubscribeChannel?.();
  subscribedUserId = userId;
  unsubscribeChannel = createResilientChannel<DBProfileBalanceRow>({
    channelName: `profile-credits-${userId}`,
    table: "profiles",
    event: "UPDATE",
    filter: `id=eq.${userId}`,
    onChange: (row) => {
      if (typeof row.credit_balance !== "number") return;
      cachedBalance = row.credit_balance;
      notifyAll();
    },
    onResync: () => {
      const supabase = createClient();
      supabase
        .from("profiles")
        .select("credit_balance")
        .eq("id", userId)
        .maybeSingle()
        .then(({ data }) => {
          const row = data as { credit_balance: number } | null;
          if (row && typeof row.credit_balance === "number") {
            cachedBalance = row.credit_balance;
            notifyAll();
          }
        });
    },
  });
}

function releaseSubscriptionIfUnused(userId: string) {
  // Différé d'un tick : évite de fermer puis rouvrir le canal quand React
  // (mode strict, navigation interne au tableau de bord) démonte et remonte
  // le même composant sans qu'aucun autre lecteur n'ait jamais cessé d'exister.
  window.setTimeout(() => {
    if (listeners.size > 0) return;
    if (subscribedUserId !== userId) return;
    unsubscribeChannel?.();
    unsubscribeChannel = null;
    subscribedUserId = null;
  }, 0);
}

// Solde de Notes synchronisé en direct — `initialBalance` (rendu serveur) ne
// sert qu'à afficher immédiatement quelque chose avant la première
// confirmation Realtime, jamais rappelé ensuite : une fois le canal ouvert,
// seule la base fait foi.
export function useCreditsBalance(userId: string, initialBalance: number): number {
  const [balance, setBalance] = useState(() => cachedBalance ?? initialBalance);

  useEffect(() => {
    if (cachedBalance === null) cachedBalance = initialBalance;
    ensureSubscription(userId);

    function handleChange() {
      setBalance(cachedBalance ?? initialBalance);
    }
    listeners.add(handleChange);
    handleChange();

    return () => {
      listeners.delete(handleChange);
      releaseSubscriptionIfUnused(userId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return balance;
}
