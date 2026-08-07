import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-signature text-ink-950 shadow-glow-brand hover:shadow-[0_14px_34px_-10px_rgba(232,68,122,0.65)] hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "border border-line-700 bg-ink-800/60 text-paper-100 hover:border-line-600 hover:bg-ink-700 hover:scale-[1.01] active:scale-[0.98]",
  ghost: "text-paper-400 hover:text-paper-100 hover:bg-ink-800",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-magnetic disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:shadow-ring-focus";

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
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </Link>
  );
}
