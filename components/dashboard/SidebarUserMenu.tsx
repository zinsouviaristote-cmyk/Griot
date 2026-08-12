"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Globe,
  LogOut,
  MoreHorizontal,
  SunMedium,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

type Panel = "root" | "langue" | "theme";

interface OptionRow {
  label: string;
  active: boolean;
  soon?: boolean;
}

const LANGUAGE_OPTIONS: OptionRow[] = [
  { label: "Français", active: true },
  { label: "Anglais", active: false, soon: true },
];

const THEME_OPTIONS: OptionRow[] = [
  { label: "Clair", active: true },
  { label: "Sombre", active: false, soon: true },
  { label: "Système", active: false, soon: true },
];

function OptionList({ options }: { options: OptionRow[] }) {
  return (
    <div className="py-1.5">
      {options.map((option) => (
        <div
          key={option.label}
          role="menuitemradio"
          aria-checked={option.active}
          className={`flex min-h-[44px] items-center justify-between gap-3 px-4 text-sm ${
            option.soon ? "text-ink-muted/50" : "text-ink"
          }`}
        >
          <span>{option.label}</span>
          {option.active && <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />}
          {option.soon && <span className="text-label-sm text-ink-muted/60">bientôt</span>}
        </div>
      ))}
    </div>
  );
}

// Menu utilisateur ancré en bas de la sidebar desktop — avatar, nom, bouton
// "…". Seul chemin vers Compte/Paramètres et Aide sur ce breakpoint : ils ne
// vivent nulle part ailleurs dans la sidebar (voir SidebarContent).
export function SidebarUserMenu({
  initials,
  name,
  email,
}: {
  initials: string;
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("root");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setPanel("root");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-full items-center gap-2.5 rounded-control px-2 py-2 text-left transition-colors duration-150 hover:bg-brand-soft/60"
      >
        <Avatar initials={initials} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">{name}</span>
          <span className="block truncate text-xs text-ink-muted">{email}</span>
        </span>
        <MoreHorizontal className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={panel === "root" ? "Menu du compte" : panel === "langue" ? "Langue" : "Thème"}
          className="absolute inset-x-0 bottom-full z-50 mb-2 animate-pop-in overflow-hidden rounded-card border border-border bg-surface shadow-card-hover"
        >
          {panel === "root" && (
            <div className="py-1.5">
              <Link
                href="/parametres"
                onClick={close}
                role="menuitem"
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <User className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                Compte
              </Link>
              <button
                type="button"
                onClick={() => setPanel("langue")}
                role="menuitem"
                className="flex w-full min-h-[44px] items-center justify-between gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <span className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                  Langue
                </span>
                <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPanel("theme")}
                role="menuitem"
                className="flex w-full min-h-[44px] items-center justify-between gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <span className="flex items-center gap-3">
                  <SunMedium className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                  Thème
                </span>
                <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <Link
                href="/aide"
                onClick={close}
                role="menuitem"
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <CircleHelp className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                Aide
              </Link>
              <div className="border-t border-border pt-1.5">
                <Link
                  href="/connexion"
                  onClick={close}
                  role="menuitem"
                  className="flex min-h-[44px] items-center gap-3 px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Se déconnecter
                </Link>
              </div>
            </div>
          )}

          {panel !== "root" && (
            <div>
              <button
                type="button"
                onClick={() => setPanel("root")}
                className="flex min-h-[44px] w-full items-center gap-2 border-b border-border px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {panel === "langue" ? "Langue" : "Thème"}
              </button>
              <OptionList options={panel === "langue" ? LANGUAGE_OPTIONS : THEME_OPTIONS} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
