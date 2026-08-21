import type { Metadata } from "next";
import { AdminDataPage } from "@/components/admin/AdminDataPage";

export const metadata: Metadata = { title: "Paiements : Administration" };

export default function AdminPaymentsPage() {
  return <AdminDataPage section="payments" />;
}