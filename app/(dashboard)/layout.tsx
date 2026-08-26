import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardUserProvider } from "@/lib/auth/DashboardUserContext";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await fetchServerUserProfile();
  if (!user) redirect("/connexion");

  return (
    <DashboardUserProvider user={user}>
      <DashboardShell
        creditBalance={user.creditBalance}
        userInitials={user.initials}
        userName={user.firstName}
        userEmail={user.email}
      >
        {children}
      </DashboardShell>
    </DashboardUserProvider>
  );
}
