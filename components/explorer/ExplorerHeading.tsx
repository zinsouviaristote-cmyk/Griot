"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

// Titre visuellement masqué mais annoncé aux lecteurs d'écran — Explorer n'a
// pas de <h1> visible (plein écran immersif, voir ExplorerPage), mais la page
// en a besoin d'un pour rester navigable au clavier/lecteur d'écran.
export function ExplorerHeading() {
  const { t } = useLanguage();
  return <h1 className="sr-only">{t("explorer.title")}</h1>;
}
