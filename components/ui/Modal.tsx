"use client";

import { useEffect, type ReactNode } from "react";

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative max-h-[85vh] w-full overflow-y-auto animate-pop-in rounded-feature border border-border bg-surface p-6 shadow-card-hover ${SIZE_CLASSES[size]}`}
      >
        {children}
      </div>
    </div>
  );
}
