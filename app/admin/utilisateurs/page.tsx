import type { Metadata } from "next";
import { AdminDataPage } from "@/components/admin/AdminDataPage";

export const metadata: Metadata = { title: "Utilisateurs : Administration" };

export default function AdminUsersPage() {
  return <AdminDataPage section="users" />;
}