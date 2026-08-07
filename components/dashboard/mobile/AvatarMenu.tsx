"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleHelp, LogOut, Music, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export function AvatarMenu({
  initials,
  name,
  email,
}: {
  initials: string;
  name: string;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Ouvrir le menu du profil"
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded-full"
      >
        <Avatar initials={initials} size="sm" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-card border border-border bg-surface shadow-card-hover">
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="truncate text-xs text-ink-muted">{email}</p>
            </div>
            <nav className="py-1.5">
              <Link
                href="/profil"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <User className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                Profil
              </Link>
              <Link
                href="/bibliotheque"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <Music className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                Mes chansons
              </Link>
              <Link
                href="/aide"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <CircleHelp className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                Aide
              </Link>
            </nav>
            <div className="border-t border-border py-1.5">
              <Link
                href="/deconnexion"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center gap-3 px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Déconnexion
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
