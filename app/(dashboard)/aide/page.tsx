import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Aide — Griot",
};

const FAQ = [
  {
    question: "Comment ça marche ?",
    answer:
      "Vous racontez une histoire — ou écrivez vos propres paroles —, vous vérifiez et corrigez le texte, puis vous choisissez une occasion et un style. Le premier essai est gratuit : vous l'écoutez avant de dépenser quoi que ce soit.",
  },
  {
    question: "Combien ça coûte ?",
    answer:
      "Une Note = un essai de génération. Le premier essai de chaque chanson est offert ; au-delà, chaque nouvel essai consomme une Note. Les packs : 1 900 FCFA pour 2 Notes, 3 900 FCFA pour 6 Notes, 5 900 FCFA pour 10 Notes — le prix baisse à mesure que le pack grandit. Vos Notes n'expirent jamais.",
  },
  {
    question: "Que se passe-t-il si la chanson ne me plaît pas ?",
    answer:
      "Vous pouvez réessayer autant de fois que votre solde de Notes le permet, et tous vos essais restent écoutables — vous gardez celui que vous préférez, même si ce n'est pas le dernier. Si une génération échoue, la Note vous est remboursée.",
  },
  {
    question: "Comment payer en Mobile Money ?",
    answer:
      "Choisissez Mobile Money au moment de recharger, confirmez la transaction directement depuis votre téléphone, et vos Notes sont ajoutées dès la confirmation reçue.",
  },
];

export default function AidePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        Aide
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">Les questions les plus fréquentes.</p>

      <div className="mt-6 flex flex-col gap-3">
        {FAQ.map((item, index) => (
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
