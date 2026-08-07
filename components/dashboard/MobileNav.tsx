"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SidebarContent } from "@/components/dashboard/SidebarContent";

export function MobileNav({
  isOpen,
  onClose,
  creditBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  creditBalance: number;
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-line-800 bg-ink-900 shadow-2xl transition-transform duration-300 ease-magnetic ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-paper-400 transition-colors hover:bg-ink-800 hover:text-paper-100"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <SidebarContent creditBalance={creditBalance} onNavigate={onClose} />
      </div>
    </div>
  );
}
