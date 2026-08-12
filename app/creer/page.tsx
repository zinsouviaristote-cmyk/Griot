import type { Metadata } from "next";
import { TunnelProvider, type AuthResumeResult } from "@/lib/tunnel/TunnelContext";
import { TunnelShell } from "@/components/tunnel/TunnelShell";
import { occasionCatalog, mockUser } from "@/lib/data/mock-dashboard";
import { RELATIONSHIP_OPTIONS, type TunnelStep } from "@/lib/tunnel/types";
import type { Occasion } from "@/lib/types";

export const metadata: Metadata = {
  title: "Créer une chanson — Griot",
};

// Arrivée depuis le bloc de création du tableau de bord : prénom + occasion
// déjà saisis démarrent directement à l'histoire (écran 3), modifiables via le
// retour arrière. Occasion seule (carte d'occasion cliquée directement) saute
// l'écran 1. Rien de saisi : on repart du tout début.
// Arrivée depuis "Refaire une chanson" / "Réessayer" sur la fiche d'une chanson
// existante : ?lien= pré-remplit le lien avec le destinataire — sans occasion,
// on repart de l'écran 1 (peut-être une occasion différente cette fois) ; avec
// occasion connue (cas "Réessayer"), on saute directement à l'histoire.
// ?credits=0 force un solde de Notes à zéro pour prévisualiser l'écran de
// recharge sur "Écoutez et choisissez" — même convention que ?vide=1 sur le
// tableau de bord.
export default function CreerPage({
  searchParams,
}: {
  searchParams: {
    prenom?: string;
    occasion?: string;
    lien?: string;
    credits?: string;
    auth?: string;
    email?: string;
    provider?: string;
    name?: string;
  };
}) {
  const prenom = searchParams.prenom?.trim() ?? "";
  const occasionParam = searchParams.occasion;
  const validOccasion = occasionCatalog.some((o) => o.id === occasionParam) ? (occasionParam as Occasion) : null;
  const lienParam = searchParams.lien;
  const validRelationship = RELATIONSHIP_OPTIONS.includes(lienParam as (typeof RELATIONSHIP_OPTIONS)[number])
    ? (lienParam as (typeof RELATIONSHIP_OPTIONS)[number])
    : null;

  // L'occasion arrive avant le destinataire dans le tunnel (écran 1 puis 2) :
  // connaître le contact (prénom + lien) ne permet donc jamais de sauter l'écran
  // 1 tant que l'occasion elle-même reste à choisir — seul `validOccasion` le
  // permet. Le contact ne fait que pré-remplir l'écran 2, atteint normalement.
  let initialStep: TunnelStep = "occasion";
  if (prenom && validOccasion) {
    initialStep = "story";
  } else if (validOccasion) {
    initialStep = "recipient";
  }

  const creditBalance =
    searchParams.credits !== undefined ? Number(searchParams.credits) || 0 : mockUser.creditBalance;

  // Posé par /connexion/google ou /connexion/lien-envoye au moment de la
  // redirection retour (voir withParams) — sa seule présence dit à
  // TunnelProvider de reprendre l'étape stockée plutôt que celle calculée
  // ci-dessus depuis prenom/occasion (voir son prop `resumeAuth`).
  const authParam = searchParams.auth;
  const resumeAuth: AuthResumeResult | null =
    authParam === "success" || authParam === "denied" || authParam === "error"
      ? {
          result: authParam,
          email: searchParams.email,
          provider: searchParams.provider === "email" ? "email" : "google",
        }
      : null;

  return (
    <TunnelProvider
      initialStep={initialStep}
      initialData={{
        recipientFirstName: prenom,
        occasion: validOccasion,
        relationship: validRelationship,
      }}
      creditBalance={creditBalance}
      resumeAuth={resumeAuth}
    >
      <TunnelShell />
    </TunnelProvider>
  );
}
