import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// Violet plein, jamais en dégradé : le survol assombrit `brand` via un filtre
// (brightness), pas une seconde teinte ni un halo lumineux.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:brightness-90 hover:scale-[1.02] hover:shadow-card active:scale-[0.98]",
  secondary:
    "border border-border bg-surface text-brand hover:border-brand/40 hover:bg-brand-soft active:scale-[0.98]",
  ghost: "text-ink-muted hover:text-ink hover:bg-brand-soft active:scale-[0.98]",
};

// min-h-11 (44px) : zone tactile minimale, même quand py-3 + text-sm ne suffit pas à l'atteindre.
// rounded-control (8px) : les boutons et champs partagent ce rayon, distinct des cartes (16/24px).
const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-semibold transition-all duration-200 ease-magnetic disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:shadow-ring-focus";

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  onClick,
}: CommonProps & { href: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </Link>
  );
}
