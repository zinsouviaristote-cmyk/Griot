"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DashboardUser } from "@/lib/types";

const DashboardUserContext = createContext<DashboardUser | null>(null);

export function DashboardUserProvider({ user, children }: { user: DashboardUser; children: ReactNode }) {
  return <DashboardUserContext.Provider value={user}>{children}</DashboardUserContext.Provider>;
}

export function useDashboardUser(): DashboardUser {
  const user = useContext(DashboardUserContext);
  if (!user) throw new Error("useDashboardUser doit être appelé sous DashboardUserProvider");
  return user;
}