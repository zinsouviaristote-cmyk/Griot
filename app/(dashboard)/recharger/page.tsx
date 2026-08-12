import type { Metadata } from "next";
import { RechargerPageBody } from "@/components/recharge/RechargerPageBody";
import { mockUser } from "@/lib/data/mock-dashboard";
import { getCreditTransactionsSortedDesc } from "@/lib/data/mock-credits";

export const metadata: Metadata = {
  title: "Recharger : Griot",
};

export default function RechargerPage() {
  return (
    <RechargerPageBody currentBalance={mockUser.creditBalance} transactions={getCreditTransactionsSortedDesc()} />
  );
}
