import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { mockUser } from "@/lib/data/mock-dashboard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell creditBalance={mockUser.creditBalance} userInitials={mockUser.initials}>
      {children}
    </DashboardShell>
  );
}
