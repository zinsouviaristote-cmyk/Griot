"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
};

export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  size = "sm",
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  size?: keyof typeof SIZE_CLASSES;
}) {
  // Le portail ne peut cibler document.body qu'une fois monté côté client —
  // sans ce garde-fou, le rendu serveur (SSR) plante en cherchant `document`.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // createPortal : le Modal quitte physiquement l'arbre du dashboard (sidebar,
  // topbar, ExplorerPage...) pour se rendre juste avant </body>. Il n'hérite
  // plus jamais du contexte d'empilement d'un parent — le z-index redevient
  // enfin comparable globalement, ce que z-[100] seul ne garantissait pas.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative max-h-[85vh] w-full overflow-y-auto animate-pop-in rounded-feature border border-border bg-surface p-6 shadow-card-hover ${SIZE_CLASSES[size]}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}