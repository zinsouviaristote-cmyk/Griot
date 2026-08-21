import type { Metadata } from "next";
import { AdminDataPage } from "@/components/admin/AdminDataPage";

export const metadata: Metadata = { title: "Publications : Administration" };

export default function AdminPublicationsPage() {
  return <AdminDataPage section="publications" />;
}