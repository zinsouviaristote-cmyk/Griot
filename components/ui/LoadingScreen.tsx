"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

// Écran de chargement à la marque — remplace toute roue générique sur les
// transitions qui prennent plus d'une demi-seconde (premier chargement,
// ouverture du tunnel, changement de page lourde). Fond `page`, rien d'autre,
// aucun texte : seul le trait ondulé du logo se dessine en boucle lente.
// Rendu via les fichiers `loading.tsx` de Next (Suspense de segment) — il
// s'efface donc de lui-même dès que le contenu réel est prêt à être peint.
export function LoadingScreen() {
  const { t } = useLanguage();
  return (
    <div
      role="status"
      aria-label={t("common.loadingAriaLabel")}
      className="fixed inset-0 z-50 flex animate-reveal-up items-center justify-center bg-page"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-brand"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="42.7 10.7"
        />
        <path
          d="M5.5 12.5c1.8-2.6 3.5-2.6 5.3 0s3.5 2.6 5.3 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          className="animate-draw-wave"
        />
      </svg>
    </div>
  );
}
