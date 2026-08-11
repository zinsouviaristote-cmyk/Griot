import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MagicLinkSentView } from "@/components/auth/MagicLinkSentView";
import { DEFAULT_RETURN_TO } from "@/lib/auth/returnUrl";

export const metadata: Metadata = {
  title: "Lien envoyé — Griot",
};

export default function MagicLinkSentPage({
  searchParams,
}: {
  searchParams: { email?: string; returnTo?: string };
}) {
  if (!searchParams.email) redirect("/connexion");
  const returnTo = searchParams.returnTo?.startsWith("/") ? searchParams.returnTo : DEFAULT_RETURN_TO;
  return <MagicLinkSentView email={searchParams.email} returnTo={returnTo} />;
}
