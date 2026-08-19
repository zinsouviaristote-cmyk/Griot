import type { Metadata } from "next";
import { ConnexionView } from "@/components/auth/ConnexionView";
import { DEFAULT_RETURN_TO } from "@/lib/auth/returnUrl";

export const metadata: Metadata = {
  title: "Connexion : Griot",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  // 💡 Résolution asynchrone des searchParams obligatoire sur Next.js 15+
  const resolvedParams = await searchParams;
  
  const returnTo = resolvedParams.returnTo?.startsWith("/")
    ? resolvedParams.returnTo
    : DEFAULT_RETURN_TO;

  return <ConnexionView returnTo={returnTo} />;
}