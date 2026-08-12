"use client";

import { useEffect, useRef, useState } from "react";

// Même logique d'observation que components/ui/Reveal.tsx, mais expose l'état
// visible/non-visible directement plutôt qu'une classe CSS toute faite — sert
// aux animations de la landing qui ont besoin de piloter autre chose qu'une
// simple apparition (tracé SVG d'un trait ou d'une coche, cascade d'étapes).
// Se déclenche une seule fois, jamais au retour hors champ.
export function useInView<T extends Element>(rootMargin = "0px 0px -60px 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
