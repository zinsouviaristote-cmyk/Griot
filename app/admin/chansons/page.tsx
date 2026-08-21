import type { Metadata } from "next";
import { AdminDataPage } from "@/components/admin/AdminDataPage";

export const metadata: Metadata = { title: "Chansons : Administration" };

export default function AdminSongsPage() {
  return <AdminDataPage section="songs" />;
}