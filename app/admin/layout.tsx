import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardUserProvider } from "@/lib/auth/DashboardUserContext";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await fetchServerUserProfile();
  if (!user) redirect("/connexion");

  return <DashboardUserProvider user={user}>{children}</DashboardUserProvider>;
}
