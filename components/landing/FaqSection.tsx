"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FAQ_ITEM_KEYS = [
  { questionKey: "landing.faq.question1", answerKey: "landing.faq.answer1" },
  { questionKey: "landing.faq.question2", answerKey: "landing.faq.answer2" },
  { questionKey: "landing.faq.question3", answerKey: "landing.faq.answer3" },
  { questionKey: "landing.faq.question4", answerKey: "landing.faq.answer4" },
  { questionKey: "landing.faq.question5", answerKey: "landing.faq.answer5" },
  { questionKey: "landing.faq.question6", answerKey: "landing.faq.answer6" },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-feature border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <span className="font-display text-base font-bold text-ink sm:text-lg">{question}</span>
        <Plus
          className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ease-magnetic ${
            open ? "rotate-45" : "rotate-0"
          }`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
      {/* Hauteur animée sans mesurer le DOM : une grille dont la ligne passe de
          0fr à 1fr s'anime en douceur jusqu'à la hauteur réelle du contenu,
          quelle qu'elle soit — pas de saut, pas de calcul JS. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-magnetic"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm leading-relaxed text-ink-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const { t } = useLanguage();
  // Tout fermé au chargement — à l'utilisateur de choisir ce qu'il veut lire.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="questions"
      className="scroll-mt-[var(--nav-clearance)] px-4 pb-8 pt-12 sm:pb-10 sm:pt-16"
    >
      <div className="mx-auto max-w-2xl">
        <SectionTitle as="h2" size="lg" align="center" animated>
          {t("landing.faq.title")} <span className="text-brand">{t("landing.faq.titleHighlight")}</span>
        </SectionTitle>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ_ITEM_KEYS.map((item, index) => (
            <Reveal key={item.questionKey} delayMs={index * 60}>
              <FaqItem
                question={t(item.questionKey)}
                answer={t(item.answerKey)}
                open={openIndex === index}
                onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
