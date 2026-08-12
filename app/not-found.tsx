import type { Metadata } from "next";
import { NotFoundBody } from "@/components/ui/NotFoundBody";

export const metadata: Metadata = {
  title: "Page introuvable : Griot",
};

// Racine de l'app (pas de segment dynamique) : Next.js sert cette page pour
// toute route qui ne correspond à rien — jamais la 404 générique anglaise.
// Chrome autonome, sans Sidebar ni TopBar : ce fichier vit hors du groupe
// (dashboard), rien ne l'enveloppe à part app/layout.tsx.
export default function NotFound() {
  return <NotFoundBody />;
}
