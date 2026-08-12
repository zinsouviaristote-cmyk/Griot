"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CREDIT_PACKS, packNotes } from "@/lib/tunnel/types";
import { formatFcfa } from "@/lib/format/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AidePageBody() {
  const { t } = useLanguage();

  const packsList = CREDIT_PACKS.map((pack) =>
    t("help.faq.q2.packItem", { price: formatFcfa(pack.priceFcfa), notes: packNotes(pack) }),
  ).join(", ");

  const faq = [
    { question: t("help.faq.q1.question"), answer: t("help.faq.q1.answer") },
    {
      question: t("help.faq.q2.question"),
      answer: `${t("help.faq.q2.pricingPrefix")} ${packsList}. ${t("help.faq.q2.pricingSuffix")}`,
    },
    { question: t("help.faq.q3.question"), answer: t("help.faq.q3.answer") },
    { question: t("help.faq.q4.question"), answer: t("help.faq.q4.answer") },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        {t("help.pageTitle")}
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">{t("help.pageSubtitle")}</p>

      <div className="mt-6 flex flex-col gap-3">
        {faq.map((item, index) => (
          <Reveal key={item.question} delayMs={index * 80}>
            <div className="rounded-card border border-border bg-surface p-5 shadow-card">
              <p className="font-display text-base font-semibold text-ink">{item.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
