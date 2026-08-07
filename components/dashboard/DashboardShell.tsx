import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileTopBar } from "@/components/dashboard/mobile/MobileTopBar";
import { BottomNav } from "@/components/dashboard/mobile/BottomNav";
import { BackgroundMotifs } from "@/components/decor/BackgroundMotifs";

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
    // Pas de `bg-page` ici : `body` le porte déjà globalement (globals.css). Un
    // second fond opaque à ce niveau empilerait au même rang que BackgroundMotifs
    // (`position:fixed`, qui ignore un simple `relative` ambiant — seuls un
    // `transform`/`filter` le contiendraient) et le couvrirait entièrement, y
    // compris dans les zones vides. Sans ce second fond, le décor se pose
    // naturellement entre le fond de `body` et les cartes.
    <div className="min-h-screen">
      <BackgroundMotifs />
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
