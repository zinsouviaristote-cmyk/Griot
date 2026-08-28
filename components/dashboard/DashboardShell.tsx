"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileTopBar } from "@/components/dashboard/mobile/MobileTopBar";
import { BottomNav } from "@/components/dashboard/mobile/BottomNav";
import { PlayerContentSpacer } from "@/components/player/PlayerContentSpacer";
import { DashboardMusicBackdrop } from "@/components/dashboard/DashboardMusicBackdrop";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useCreditsBalance } from "@/lib/hooks/useCreditsBalance";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";

export function DashboardShell({
  creditBalance,
  userInitials,
  userName,
  userEmail,
  children,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  children: ReactNode;
}) {
  const { profile } = useUserProfile();
  const userPhotoUrl = profile?.photoUrl ?? null;

  const { id: userId } = useDashboardUser();
  const liveCreditBalance = useCreditsBalance(userId, creditBalance);

  return (
    /* 🛠️ CORRECTION : Remplacement de overflow-hidden par min-h-screen relative */
    <div className="relative min-h-screen">
      <DashboardMusicBackdrop />
      <Sidebar
        creditBalance={liveCreditBalance}
        userInitials={userInitials}
        userName={userName}
        userEmail={userEmail}
        userPhotoUrl={userPhotoUrl}
      />
      <MobileTopBar
        creditBalance={liveCreditBalance}
        userInitials={userInitials}
        userName={userName}
        userEmail={userEmail}
        userPhotoUrl={userPhotoUrl}
      />

      <div className="relative z-10 lg:pl-[280px]">
        <TopBar
          creditBalance={liveCreditBalance}
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
          userPhotoUrl={userPhotoUrl}
        />
        <main className="mx-auto max-w-shell px-4 pb-28 pt-20 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
          <PlayerContentSpacer />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}