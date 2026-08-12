import type { Metadata } from "next";
import { GoogleConsentView } from "@/components/auth/GoogleConsentView";
import { DEFAULT_RETURN_TO } from "@/lib/auth/returnUrl";

export const metadata: Metadata = {
  title: "Connexion Google : Griot",
};

export default function GoogleConsentPage({
  searchParams,
}: {
  searchParams: { returnTo?: string };
}) {
  const returnTo = searchParams.returnTo?.startsWith("/") ? searchParams.returnTo : DEFAULT_RETURN_TO;
  return <GoogleConsentView returnTo={returnTo} />;
}
