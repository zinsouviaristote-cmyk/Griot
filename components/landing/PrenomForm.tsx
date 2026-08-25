"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Champ d'appel à l'action du héros et du bloc final — un seul geste, sans
// détour par une page de formulaire : le prénom saisi ici part directement en
// paramètre d'URL vers le tunnel (voir app/creer/page.tsx, qui le lit via
// searchParams.prenom et saute directement à l'écran "destinataire").
//
// Le bouton reste toujours plein et actif : sur une landing page, un CTA grisé
// est invisible, donc contre-productif. Un champ vide au clic ne bloque rien,
// il attire simplement l'attention dessus (focus + secousse discrète).
//
// `size="lg"` réservé au héros : c'est l'élément le plus important de la page
// après le titre, il doit se voir avant tout le reste. Le bloc final garde la
// taille par défaut, plus discrète en fin de parcours.
export function PrenomForm({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [attention, setAttention] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = prenom.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      setAttention(true);
      return;
    }
    router.push(`/creer?prenom=${encodeURIComponent(trimmed)}`);
  }

  const isLg = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2.5 sm:flex-row sm:gap-3 ${isLg ? "max-w-lg" : "max-w-md"} ${className}`}
    >
      <label className="block flex-1 text-left">
        <span className="sr-only">{t("landing.prenomForm.srLabel")}</span>
        <input
          ref={inputRef}
          type="text"
          value={prenom}
          onChange={(event) => {
            setPrenom(event.target.value);
            if (attention) setAttention(false);
          }}
          onAnimationEnd={() => setAttention(false)}
          placeholder={t("landing.prenomForm.placeholder")}
          className={`w-full rounded-control border border-border bg-surface text-ink placeholder:text-ink-muted transition-colors focus:border-brand focus:outline-none focus:shadow-ring-focus ${
            isLg ? "min-h-14 px-5 text-base" : "min-h-11 px-4 text-sm"
          } ${attention ? "animate-attn-shake border-brand" : ""}`}
        />
      </label>
      <button
        type="submit"
        className={`flex shrink-0 items-center justify-center gap-2 rounded-control bg-brand font-semibold text-white transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:brightness-90 hover:shadow-card active:scale-[0.98] ${
          isLg ? "min-h-14 px-7 text-base" : "min-h-11 px-5 text-sm"
        }`}
      >
        {t("landing.prenomForm.cta")}
        <ArrowRight className={isLg ? "h-5 w-5" : "h-4 w-4"} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </form>
  );
}
