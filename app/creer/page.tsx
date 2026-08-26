import type { Metadata } from "next";
import {
  TunnelProvider,
  type AuthResumeResult,
} from "@/lib/tunnel/TunnelContext";
import { TunnelShell } from "@/components/tunnel/TunnelShell";
import { occasionCatalog } from "@/lib/songCatalog";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";
import {
  type TunnelStep,
} from "@/lib/tunnel/types";
import type { Occasion } from "@/lib/types";

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
  // 🟢 AJOUT OBLIGATOIRE DE AWAIT
  const params = await searchParams;

  const prenom = params.prenom?.trim() ?? "";
  const occasionParam = params.occasion;

  const validOccasion = occasionCatalog.some(
    (o) => o.id === occasionParam
  )
    ? (occasionParam as Occasion)
    : null;

  const customOccasion =
    validOccasion === "autre"
      ? params.customOccasion?.trim() ?? ""
      : "";

  let initialStep: TunnelStep = "occasion";

  const isOtherWithoutCustomText =
    validOccasion === "autre" && !customOccasion;

  if (prenom && validOccasion && !isOtherWithoutCustomText) {
    initialStep = "story";
  } else if (validOccasion && !isOtherWithoutCustomText) {
    initialStep = "recipient";
  }

  const user = params.credits === undefined ? await fetchServerUserProfile() : null;
  const creditBalance =
    params.credits !== undefined ? Number(params.credits) || 0 : (user?.creditBalance ?? 0);

  const authParam = params.auth;

  const resumeAuth: AuthResumeResult | null =
    authParam === "success" ||
    authParam === "denied" ||
    authParam === "error"
      ? {
          result: authParam,
          email: params.email,
          provider:
            params.provider === "email"
              ? "email"
              : "google",
        }
      : null;

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