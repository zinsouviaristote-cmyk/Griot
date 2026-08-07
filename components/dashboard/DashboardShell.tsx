"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { TopBar } from "@/components/dashboard/TopBar";

export function DashboardShell({
  creditBalance,
  userInitials,
  children,
}: {
  creditBalance: number;
  userInitials: string;
  children: ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar creditBalance={creditBalance} />
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        creditBalance={creditBalance}
      />

      <div className="lg:pl-[272px]">
        <TopBar
          creditBalance={creditBalance}
          userInitials={userInitials}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main className="mx-auto max-w-shell px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
