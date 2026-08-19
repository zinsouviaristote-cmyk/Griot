import type { Metadata } from "next";
import { RechargerPageBody } from "@/components/recharge/RechargerPageBody";
import { getCreditTransactionsSortedDesc } from "@/lib/data/mock-credits";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";

export const metadata: Metadata = {
  title: "Recharger : Griot",
};

export default async function RechargerPage() {
  const user = await fetchServerUserProfile();
  return <RechargerPageBody currentBalance={user.creditBalance} transactions={getCreditTransactionsSortedDesc()} />;
}
