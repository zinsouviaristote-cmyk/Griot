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
  // Photo de profil : source UNIQUE, jamais reçue en prop — c'est exactement
  // ce qui manquait avant (chaque page devait penser à la transmettre, et
  // aucune ne se mettait à jour après un changement dans Paramètres).
  const { profile } = useUserProfile();
  const userPhotoUrl = profile?.photoUrl ?? null;

  // Solde de Notes en direct : un seul abonnement Realtime pour tout le
  // tableau de bord (voir useCreditsBalance), qui alimente à la fois la
  // pastille du haut et la carte de la sidebar — jamais deux valeurs qui
  // pourraient diverger le temps d'un rechargement.
  const { id: userId } = useDashboardUser();
  const liveCreditBalance = useCreditsBalance(userId, creditBalance);

  return (
    <div className="relative min-h-screen overflow-hidden">
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