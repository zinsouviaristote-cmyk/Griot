import { Reveal } from "@/components/ui/Reveal";
import { PrenomForm } from "@/components/landing/PrenomForm";

export function FinalCta() {
  return (
    <section className="px-4 py-16 sm:py-20">
      <Reveal>
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-feature border border-border bg-surface px-6 py-12 text-center sm:px-12">
          <p className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Une histoire à raconter ? Elle mérite sa chanson.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <PrenomForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
