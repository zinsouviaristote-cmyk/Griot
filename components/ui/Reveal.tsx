"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fait apparaître son contenu en fondu montant au défilement — mais reste visible
 * par défaut au rendu serveur et tant que le JS n'a pas encore tourné. Sur une 3G
 * qui coupe en plein chargement, du contenu qui dépend du JS pour redevenir visible
 * ne doit jamais être le comportement par défaut : ça le rendrait invisible pour de bon.
 * Seul le montage client (useLayoutEffect, avant la peinture) décide de masquer ce qui
 * est réellement hors écran, pour ensuite le révéler au défilement.
 */
export function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "revealing">("visible");

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyInView) setState("hidden");
  }, []);

  useEffect(() => {
    if (state !== "hidden") return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("revealing");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [state]);

  const stateClass = state === "hidden" ? "opacity-0" : state === "revealing" ? "animate-reveal-up" : "";

  return (
    <div
      ref={ref}
      className={`${stateClass} ${className}`}
      style={state === "revealing" ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
