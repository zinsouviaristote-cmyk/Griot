"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const LINKS = [
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#questions", label: "Questions" },
];

// Transparente en haut de page, devient une pilule blanche flottante et
// recentrée dès qu'on défile — jamais de fond opaque plein écran, qui
// pèserait visuellement sur le héros avant même d'avoir défilé.
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 transition-all duration-300 ease-magnetic">
      <nav
        className={`flex w-full items-center justify-between gap-4 rounded-control transition-all duration-300 ease-magnetic ${
          scrolled
            ? "max-w-3xl bg-surface px-4 py-2.5 shadow-card border border-border"
            : "max-w-shell bg-transparent px-2 py-2 border border-transparent"
        }`}
      >
        <Link href="/" className="inline-block shrink-0 transition-transform duration-200 ease-magnetic hover:scale-[1.03]">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-6 sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/connexion"
            className="hidden min-h-11 items-center rounded-control px-3.5 text-sm font-medium text-ink-muted transition-all duration-150 ease-magnetic hover:bg-brand-soft/60 hover:text-ink sm:inline-flex"
          >
            Se connecter
          </Link>
          <Link
            href="/creer"
            className="flex min-h-11 items-center rounded-control bg-brand px-4 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:scale-[1.02] hover:brightness-90 active:scale-[0.98]"
          >
            Commencer
          </Link>
        </div>
      </nav>
    </div>
  );
}
