import type { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Administration : Griot",
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
