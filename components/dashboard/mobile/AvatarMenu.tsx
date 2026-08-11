"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleHelp, LogOut, Megaphone, Music, Settings, UsersRound, Wallet } from "lucide-react";
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
        className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 ease-magnetic hover:scale-105 active:scale-95"
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
          <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-pop-in overflow-hidden rounded-card border border-border bg-surface shadow-card-hover">
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="truncate text-xs text-ink-muted">{email}</p>
            </div>
            <nav className="py-1.5">
              <Link
                href="/parametres"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <Settings className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Paramètres
              </Link>
              <Link
                href="/bibliotheque"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <Music className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Mes chansons
              </Link>
              <Link
                href="/proches"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <UsersRound className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Mes proches
              </Link>
              <Link
                href="/publications"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <Megaphone className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Mes publications
              </Link>
              <Link
                href="/credits"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <Wallet className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Mes Notes
              </Link>
              <Link
                href="/aide"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm text-ink transition-colors hover:bg-brand-soft"
              >
                <CircleHelp className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Aide
              </Link>
            </nav>
            <div className="border-t border-border py-1.5">
              <Link
                href="/connexion"
                onClick={() => setIsOpen(false)}
                className="group flex min-h-[44px] items-center gap-3 px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
              >
                <LogOut className="h-4 w-4 transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                Déconnexion
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
