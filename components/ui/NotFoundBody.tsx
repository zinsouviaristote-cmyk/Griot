"use client";

import { SearchX } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function NotFoundBody() {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <Logo />
      <span className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
        <SearchX className="h-7 w-7 text-brand" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="mt-6">
        <SectionTitle as="h1" size="lg" align="center">
          {t("notFoundPage.title")}
        </SectionTitle>
      </div>
      <p className="mt-3 max-w-sm text-body-md text-ink-muted">{t("notFoundPage.body")}</p>
      <ButtonLink href="/" variant="primary" className="mt-8">
        {t("notFoundPage.backHome")}
      </ButtonLink>
    </div>
  );
}
