import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page introuvable — Griot",
};

// Racine de l'app (pas de segment dynamique) : Next.js sert cette page pour
// toute route qui ne correspond à rien — jamais la 404 générique anglaise.
// Chrome autonome, sans Sidebar ni TopBar : ce fichier vit hors du groupe
// (dashboard), rien ne l'enveloppe à part app/layout.tsx.
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <Logo />
      <span className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
        <SearchX className="h-7 w-7 text-brand" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="mt-6">
        <SectionTitle as="h1" size="lg" align="center">
          Cette page n&apos;existe pas
        </SectionTitle>
      </div>
      <p className="mt-3 max-w-sm text-body-md text-ink-muted">
        Le lien que vous avez suivi est peut-être incorrect, ou la page a été déplacée.
      </p>
      <ButtonLink href="/" variant="primary" className="mt-8">
        Retour à l&apos;accueil
      </ButtonLink>
    </div>
  );
}
