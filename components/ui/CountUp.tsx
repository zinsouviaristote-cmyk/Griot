"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatFcfa } from "@/lib/format/currency";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// `variant` (une chaîne sérialisable) plutôt qu'une fonction de formatage :
// ce composant est rendu depuis un Server Component, qui ne peut pas lui passer
// de closure en prop à travers la frontière serveur/client.
const FORMATTERS: Record<"number" | "fcfa", (value: number) => string> = {
  number: (n) => String(n),
  fcfa: formatFcfa,
};

type Phase = "static" | "pending" | "animating";

export function CountUp({
  target,
  durationMs = 1200,
  variant = "number",
}: {
  target: number;
  durationMs?: number;
  variant?: "number" | "fcfa";
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      setPhase("animating");
      return;
    }

    let frame: number;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setPhase("animating");
        const start = performance.now();
        const tick = (now: number) => {
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
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [phase, target, durationMs]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {format(display)}
    </span>
  );
}
