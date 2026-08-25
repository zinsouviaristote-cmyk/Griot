"use client";

import { Reveal } from "@/components/ui/Reveal";
import { PrenomForm } from "@/components/landing/PrenomForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Fond teinté qui se prolonge dans le pied de page (voir LandingFooter, même
// couleur) : plus de carte blanche isolée qui flotte sur la page — les deux
// forment une seule bande continue, le bloc d'appel se lit comme rattaché.
export function FinalCta() {
  const { t } = useLanguage();
  return (
    <section className="scroll-mt-[var(--nav-clearance)] bg-brand-soft/40 px-4 pb-10 pt-12 sm:pb-14 sm:pt-16">
      <Reveal>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t("landing.finalCta.title")}
          </p>
          <div className="mt-6 flex w-full justify-center">
            <PrenomForm size="lg" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
