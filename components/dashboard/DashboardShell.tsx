import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileTopBar } from "@/components/dashboard/mobile/MobileTopBar";
import { BottomNav } from "@/components/dashboard/mobile/BottomNav";
import { BackgroundStrings } from "@/components/decor/BackgroundStrings";

/**
 * Deux shells de navigation distincts, jamais un seul redimensionné :
 * sidebar + barre sticky sur desktop, barre haute + barre basse fixes sur mobile
 * (la sidebar ne s'y affiche pas du tout — voir Sidebar.tsx, `hidden lg:flex`).
 * Le choix se fait en CSS pur (`lg:` / `hidden`), jamais en JS, pour éviter tout
 * flash d'hydratation lié à la détection de la taille d'écran.
 */
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
  return (
    <div className="min-h-screen bg-page">
      <BackgroundStrings />
      <Sidebar creditBalance={creditBalance} />
      <MobileTopBar
        creditBalance={creditBalance}
        userInitials={userInitials}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="lg:pl-[280px]">
        <TopBar creditBalance={creditBalance} userInitials={userInitials} />
        <main className="mx-auto max-w-shell px-4 pb-28 pt-20 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
