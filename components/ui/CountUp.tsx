"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatFcfa } from "@/lib/format/currency";
import { formatListeningDuration } from "@/lib/format/duration";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// `variant` (une chaîne sérialisable) plutôt qu'une fonction de formatage :
// ce composant est rendu depuis un Server Component, qui ne peut pas lui passer
// de closure en prop à travers la frontière serveur/client.
const FORMATTERS: Record<"number" | "fcfa" | "duration", (value: number) => string> = {
  number: (n) => String(n),
  fcfa: formatFcfa,
  // Secondes cumulées → "20 h 5 min" (Statistiques, "Temps d'écoute") — anime la
  // valeur brute en secondes, seul le formatage change à chaque image.
  duration: formatListeningDuration,
};

type Phase = "static" | "pending" | "animating";

export function CountUp({
  target,
  durationMs = 1200,
  variant = "number",
  className = "font-mono tabular-nums",
}: {
  target: number;
  durationMs?: number;
  variant?: "number" | "fcfa" | "duration";
  // Les gros chiffres autonomes (StatCard) veulent le mono ; un compteur glissé dans
  // une phrase (MobileGreeting) veut juste la largeur stable de tabular-nums.
  className?: string;
}) {
  const format = FORMATTERS[variant];
  // "static" affiche toujours la vraie valeur : si le JS n'arrive jamais (coupure 3G
  // en plein chargement), l'utilisateur voit son vrai solde, jamais un 0 qui ne
  // remonte que si l'animation a pu se lancer.
  const [phase, setPhase] = useState<Phase>("static");
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) return;
    setPhase("pending");
    setDisplay(0);
  }, []);

  useEffect(() => {
    if (phase !== "pending") return;
    const node = ref.current;
    if (!node) return;

    // Le Strict Mode de React double-invoque cet effet en dev (mount → cleanup →
    // remount) ; sans ce garde, le callback asynchrone de l'observateur "fantôme"
    // peut encore arriver après son propre cleanup et relancer une seconde boucle
    // d'animation concurrente — le compteur reste alors bloqué à 0.
    let cancelled = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      setPhase("animating");
      return;
    }

    let frame: number;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (cancelled || !entry.isIntersecting) return;
        observer.disconnect();
        setPhase("animating");
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelled) return;
          const progress = Math.min((now - start) / durationMs, 1);
          setDisplay(Math.round(target * easeOutCubic(progress)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [phase, target, durationMs]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
