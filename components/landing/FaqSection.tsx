"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

const FAQ_ITEMS = [
  {
    question: "Puis-je mettre un prénom dans la chanson ?",
    answer:
      "Oui — le prénom de la personne à qui la chanson est destinée, et le vôtre si vous le souhaitez, sont tissés directement dans les paroles.",
  },
  {
    question: "Pour quelles occasions puis-je créer une chanson ?",
    answer:
      "Anniversaire, mariage, déclaration d'amour, réussite, hommage, baptême, encouragement — et tout autre moment qui mérite d'être marqué.",
  },
  {
    question: "Est-ce que je choisis le style musical ?",
    answer: "Oui, vous choisissez l'ambiance qui correspond à la personne et au moment, avant que la chanson soit composée.",
  },
  {
    question: "Combien de temps ça prend ?",
    answer: "Quelques minutes pour raconter l'histoire, puis votre chanson est prête à écouter très rapidement.",
  },
  {
    question: "Comment je reçois ma chanson ?",
    answer: "Le fichier audio est à vous : téléchargeable et prêt à être envoyé où vous voulez, dès que vous la gardez.",
  },
  {
    question: "Et si le résultat ne me plaît pas ?",
    answer: "Vous ne payez que si vous voulez la garder — le premier essai ne coûte rien, sans engagement.",
  },
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
        className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-base font-semibold text-ink sm:text-lg">{question}</span>
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="questions" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <SectionTitle as="h2" size="lg" align="center" animated>
          Questions <span className="text-brand">fréquentes</span>
        </SectionTitle>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => (
            <Reveal key={item.question} delayMs={index * 60}>
              <FaqItem
                question={item.question}
                answer={item.answer}
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
