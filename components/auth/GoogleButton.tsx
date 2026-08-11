"use client";

import { GoogleMark } from "@/components/auth/GoogleMark";

// Bouton volontairement neutre — ni le violet de marque, ni un dégradé : un
// bouton d'identité tierce se reconnaît par sa sobriété, pas par les couleurs
// de Griot. Navigue réellement (pas un simple appel async) vers l'écran de
// consentement simulé : c'est cet aller véritable qui rend testable la survie
// de l'état du tunnel à la redirection retour (voir /connexion/google).
export function GoogleButton({
  returnTo,
  label = "Continuer avec Google",
  className = "",
}: {
  returnTo: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={`/connexion/google?returnTo=${encodeURIComponent(returnTo)}`}
      className={`flex min-h-11 w-full items-center justify-center gap-2.5 rounded-control border border-border bg-surface text-sm font-semibold text-ink transition-all duration-150 ease-magnetic hover:bg-page active:scale-[0.98] ${className}`}
    >
      <GoogleMark />
      {label}
    </a>
  );
}
