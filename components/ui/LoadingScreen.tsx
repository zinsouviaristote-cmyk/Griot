"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Logo } from "./Logo";

export function LoadingScreen() {
  const { t } = useLanguage();

  return (
    <div
      role="status"
      aria-label={t("common.loadingAriaLabel")}
      className="fixed inset-0 z-50 flex animate-reveal-up items-center justify-center bg-page"
    >
      <Logo
        withWordmark={true}
        animated={true}
        className="scale-[1.8]"
      />
    </div>
  );
}