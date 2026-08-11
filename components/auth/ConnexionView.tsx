import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

// Écran de connexion autonome — atteint directement (lien partagé, favori) ou
// depuis l'écran de génération du tunnel, qui rend ce même contenu inline
// plutôt que d'y rediriger (voir GenerationStep). Habillage Griot uniquement :
// violet en aplat, fond de page, jamais les couleurs orange de la référence.
export function ConnexionView({ returnTo }: { returnTo: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-feature border border-border bg-surface p-6 text-center shadow-card sm:p-8">
          <p className="font-display text-headline-md text-ink">Bienvenue sur Griot</p>
          <p className="mt-1.5 text-sm text-ink-muted">
            Connectez-vous pour écouter vos extraits et retrouver vos chansons.
          </p>

          <div className="mt-6">
            <GoogleButton returnTo={returnTo} />
          </div>

          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-ink-muted">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-5">
            <MagicLinkForm returnTo={returnTo} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-muted">
          En continuant, vous acceptez les{" "}
          <Link href="/aide" className="font-medium text-brand hover:underline">
            conditions d&apos;utilisation
          </Link>{" "}
          et la{" "}
          <Link href="/aide" className="font-medium text-brand hover:underline">
            politique de confidentialité
          </Link>{" "}
          de Griot.
        </p>
      </div>
    </div>
  );
}
