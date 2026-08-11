import { Music4 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

// Sans ce fichier, `notFound()` retombe sur la page 404 générique de Next (texte
// anglais, statut HTTP pas toujours correctement propagé) — un segment dynamique
// a besoin de sa propre limite "introuvable" pour les deux à la fois.
export default function SongNotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <EmptyState
        icon={Music4}
        title="Cette chanson n'existe pas ou plus"
        description="Elle a peut-être été supprimée, ou le lien est incorrect."
        actionLabel="Retour à ma bibliothèque"
        actionHref="/bibliotheque"
      />
    </div>
  );
}
