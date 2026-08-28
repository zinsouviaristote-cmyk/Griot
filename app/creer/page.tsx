import type { Metadata } from "next";
import {
  TunnelProvider,
  type AuthResumeResult,
} from "@/lib/tunnel/TunnelContext";
import { TunnelShell } from "@/components/tunnel/TunnelShell";
import { StudioCompactForm } from "@/components/studio/StudioCompactForm";
import { occasionCatalog } from "@/lib/songCatalog";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";
import { type TunnelStep } from "@/lib/tunnel/types";
import type { Occasion } from "@/lib/types";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardUserProvider } from "@/lib/auth/DashboardUserContext";

export const metadata: Metadata = {
  title: "Créer une chanson : Griot",
};

export default async function CreerPage({
  searchParams,
}: {
  searchParams: Promise<{
    prenom?: string;
    occasion?: string;
    customOccasion?: string;
    lien?: string;
    credits?: string;
    auth?: string;
    email?: string;
    provider?: string;
    name?: string;
  }>;
}) {
  const params = await searchParams;

  const prenom = params.prenom?.trim() ?? "";
  const occasionParam = params.occasion;

  const validOccasion = occasionCatalog.some((o) => o.id === occasionParam)
    ? (occasionParam as Occasion)
    : null;

  const customOccasion =
    validOccasion === "autre" ? params.customOccasion?.trim() ?? "" : "";

  let initialStep: TunnelStep = "occasion";

  const isOtherWithoutCustomText =
    validOccasion === "autre" && !customOccasion;

  if (prenom && validOccasion && !isOtherWithoutCustomText) {
    initialStep = "story";
  } else if (validOccasion && !isOtherWithoutCustomText) {
    initialStep = "recipient";
  }

  const userProfile = params.credits === undefined ? await fetchServerUserProfile() : null;
  const creditBalance =
    params.credits !== undefined ? Number(params.credits) || 0 : (userProfile?.creditBalance ?? 0);

  const authParam = params.auth;

  const resumeAuth: AuthResumeResult | null =
    authParam === "success" ||
    authParam === "denied" ||
    authParam === "error"
      ? {
          result: authParam,
          email: params.email,
          provider: params.provider === "email" ? "email" : "google",
        }
      : null;

  // 🟢 SI L'UTILISATEUR EST CONNECTÉ -> MODE STUDIO COMPACT
  if (userProfile) {
    const initials = userProfile.initials ?? "UT";
    const name = userProfile.firstName ?? "Utilisateur";
    const email = userProfile.email ?? "utilisateur@email.com";

    const dashboardUser = {
      id: userProfile.id,
      firstName: name,
      email: email,
      initials: initials,
      creditBalance: creditBalance,
      phone: userProfile.phone ?? null,
      photoUrl: userProfile.photoUrl ?? null,
    };

    return (
      <DashboardUserProvider user={dashboardUser}>
        <DashboardShell
          creditBalance={creditBalance}
          userInitials={initials}
          userName={name}
          userEmail={email}
        >
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-headline-md font-bold text-ink">
                Créer une chanson
              </h1>
              <p className="mt-1 text-sm text-ink-muted">
                Décrivez votre chanson, choisissez un style et générez-la en quelques instants.
              </p>
            </div>
            <StudioCompactForm creditBalance={creditBalance} />
          </div>
        </DashboardShell>
      </DashboardUserProvider>
    );
  }

  // 🔴 SI L'UTILISATEUR N'EST PAS CONNECTÉ -> TUNNEL PAS-À-PAS
  return (
    <TunnelProvider
      initialStep={initialStep}
      initialData={{
        recipientFirstName: prenom,
        occasion: validOccasion,
        customOccasion,
      }}
      creditBalance={creditBalance}
      resumeAuth={resumeAuth}
    >
      <TunnelShell />
    </TunnelProvider>
  );
}