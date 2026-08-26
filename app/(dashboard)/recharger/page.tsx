"use client";

import { useEffect, useState } from "react";
import { RechargerPageBody } from "@/components/recharge/RechargerPageBody";
import { fetchCreditTransactions } from "@/lib/supabase/dataAdapters";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";
import { useCreditsBalance } from "@/lib/hooks/useCreditsBalance";
import type { CreditTransaction } from "@/lib/types";

export default function RechargerPage() {
  const user = useDashboardUser();
  // Même solde en direct que la pastille du haut et la carte de la sidebar
  // (voir DashboardShell) — l'écran de paiement ne doit jamais en montrer un
  // différent, en particulier juste après une recharge confirmée.
  const liveCreditBalance = useCreditsBalance(user.id, user.creditBalance);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  useEffect(() => {
    fetchCreditTransactions().then(setTransactions).catch(() => setTransactions([]));
  }, []);

  return <RechargerPageBody currentBalance={liveCreditBalance} transactions={transactions} />;
}
