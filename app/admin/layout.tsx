import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardUserProvider } from "@/lib/auth/DashboardUserContext";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await fetchServerUserProfile();
  if (!user) redirect("/connexion");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) redirect("/tableau-de-bord");

  return <DashboardUserProvider user={user}>{children}</DashboardUserProvider>;
}
