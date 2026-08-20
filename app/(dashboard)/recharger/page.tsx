"use client";

import { useEffect, useState } from "react";
import { RechargerPageBody } from "@/components/recharge/RechargerPageBody";
import { fetchCreditTransactions } from "@/lib/supabase/dataAdapters";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";
import type { CreditTransaction } from "@/lib/types";

export default function RechargerPage() {
  const user = useDashboardUser();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  useEffect(() => {
    fetchCreditTransactions().then(setTransactions).catch(() => setTransactions([]));
  }, []);

  return <RechargerPageBody currentBalance={user.creditBalance} transactions={transactions} />;
}
