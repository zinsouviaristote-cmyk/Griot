import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { MarqueeBanner } from "@/components/landing/MarqueeBanner";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrialSection } from "@/components/landing/TrialSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

// Page publique — jamais dans DashboardShell. Une personne déjà entrée (voir
// lib/auth/session : cookie posé par le callback OAuth/lien magique réel)
// n'a aucune raison de revoir cet écran : elle repart directement vers son
// tableau de bord, "/" ne lui appartient plus une fois connectée.
export default function LandingPage() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (session === "1") redirect("/tableau-de-bord");

  return (
    <div className="relative overflow-x-hidden bg-page">
      <LandingNav />
      <Hero />
      <MarqueeBanner />
      <HowItWorks />
      <TrialSection />
      <FaqSection />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}
