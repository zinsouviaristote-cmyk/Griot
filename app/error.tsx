"use client";

import { useEffect } from "react";
import { Hanken_Grotesk, Manrope } from "next/font/google";
import { TriangleAlert } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button, ButtonLink } from "@/components/ui/Button";
import "./globals.css";

// Une limite d'erreur racine remplace tout app/layout.tsx, polices comprises —
// sans ce second chargement, ce seul écran retomberait sur les polices système.
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap", variable: "--font-display" });
const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-sans" });

// Convention Next.js : limite d'erreur au niveau racine, doit être un composant
// client et recevoir exactement ces deux props. Chrome autonome comme
// not-found.tsx — une erreur de rendu peut survenir avant que la Sidebar ou la
// TopBar n'aient eu la chance de s'afficher, donc ce fichier ne dépend d'aucune
// des deux. Ton chaleureux, jamais de message technique (pas de `error.message`
// affiché) : la personne qui voit cet écran n'a pas à comprendre la panne.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Un vrai suivi d'erreurs (Sentry ou équivalent) se brancherait ici en Phase 2.
  }, []);

  return (
    <html lang="fr" className={`${manrope.variable} ${hankenGrotesk.variable}`}>
      <body className="font-sans">
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
          <Logo />
          <span className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
            <TriangleAlert className="h-7 w-7 text-warning" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="mt-6">
            <SectionTitle as="h1" size="lg" align="center">
              Un problème est survenu
            </SectionTitle>
          </div>
          <p className="mt-3 max-w-sm text-body-md text-ink-muted">
            Ce n&apos;est pas vous, c&apos;est nous — réessayez dans un instant.
          </p>
          <div className="mt-8 flex gap-3">
            <Button variant="secondary" onClick={reset}>
              Réessayer
            </Button>
            <ButtonLink href="/" variant="primary">
              Retour à l&apos;accueil
            </ButtonLink>
          </div>
        </div>
      </body>
    </html>
  );
}
