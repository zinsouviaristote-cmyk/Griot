"use client";

import { Music4 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Sans ce fichier, `notFound()` retombe sur la page 404 générique de Next (texte
// anglais, statut HTTP pas toujours correctement propagé) — un segment dynamique
// a besoin de sa propre limite "introuvable" pour les deux à la fois.
export default function SongNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl">
      <EmptyState
        icon={Music4}
        title={t("history.notFound.title")}
        description={t("history.notFound.description")}
        actionLabel={t("history.notFound.action")}
        actionHref="/bibliotheque"
      />
    </div>
  );
}
