import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-brand-soft/40 px-4 py-8">
      <div className="mx-auto flex max-w-shell flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <Link href="/aide" className="transition-colors hover:text-ink">
            Confidentialité
          </Link>
          <Link href="/aide" className="transition-colors hover:text-ink">
            Conditions
          </Link>
          <a href="mailto:bonjour@griot.app" className="transition-colors hover:text-ink">
            bonjour@griot.app
          </a>
        </nav>

        <p className="text-sm text-ink-muted">Fait au Bénin, pour tout le monde.</p>
      </div>
    </footer>
  );
}
