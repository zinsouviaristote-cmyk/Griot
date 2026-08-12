import type { Metadata } from "next";
import { ConnexionView } from "@/components/auth/ConnexionView";
import { DEFAULT_RETURN_TO } from "@/lib/auth/returnUrl";

export const metadata: Metadata = {
  title: "Connexion : Griot",
};

// Hors DashboardShell — comme /creer, cet écran mérite toute l'attention, sans
// sidebar ni barre de recherche pour la distraire. `returnTo` porte la page à
// rejoindre après connexion ; sans lui (arrivée directe), c'est le tableau de
// bord.
export default function ConnexionPage({
  searchParams,
}: {
  searchParams: { returnTo?: string };
}) {
  const returnTo = searchParams.returnTo?.startsWith("/") ? searchParams.returnTo : DEFAULT_RETURN_TO;
  return <ConnexionView returnTo={returnTo} />;
}
