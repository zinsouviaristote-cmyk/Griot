"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

// Champ d'appel à l'action du héros et du bloc final — un seul geste, sans
// détour par une page de formulaire : le prénom saisi ici part directement en
// paramètre d'URL vers le tunnel (voir app/creer/page.tsx, qui le lit via
// searchParams.prenom et saute directement à l'écran "destinataire").
export function PrenomForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const isValid = prenom.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    router.push(`/creer?prenom=${encodeURIComponent(prenom.trim())}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:gap-3 ${className}`}
    >
      <label className="block flex-1 text-left">
        <span className="sr-only">Pour qui est cette chanson ?</span>
        <input
          type="text"
          value={prenom}
          onChange={(event) => setPrenom(event.target.value)}
          placeholder="Pour qui est cette chanson ?"
          className="min-h-11 w-full rounded-control border border-border bg-surface px-4 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-brand focus:outline-none focus:shadow-ring-focus"
        />
      </label>
      <button
        type="submit"
        disabled={!isValid}
        className={`flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control px-5 text-sm font-semibold transition-all duration-200 ease-magnetic active:scale-[0.98] ${
          isValid
            ? "bg-brand text-white hover:scale-[1.02] hover:brightness-90 hover:shadow-card"
            : "bg-brand/30 text-white/80 cursor-not-allowed"
        }`}
      >
        Créer ma chanson
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </form>
  );
}
