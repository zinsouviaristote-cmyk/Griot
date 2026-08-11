"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

type ToastTone = "default" | "success" | "danger";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const TONE_ICON = {
  default: Info,
  success: CheckCircle2,
  danger: TriangleAlert,
} as const;

const TONE_ICON_CLASSES: Record<ToastTone, string> = {
  default: "text-ink-muted",
  success: "text-success",
  danger: "text-danger",
};

type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast | null>(null);

// Glissement depuis le haut, discret (16px, pas un plein écran) — la carte gère
// sa propre sortie (`leaving`) pour ne retirer le toast du DOM qu'une fois
// l'animation terminée, jamais en coupant l'apparition en cours de route.
function ToastCard({ toast, onDone }: { toast: ToastItem; onDone: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false);
  const Icon = TONE_ICON[toast.tone];

  useEffect(() => {
    const timer = window.setTimeout(() => setLeaving(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      onAnimationEnd={() => {
        if (leaving) onDone(toast.id);
      }}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-border bg-surface p-4 shadow-card-hover ${
        leaving ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${TONE_ICON_CLASSES[toast.tone]}`} strokeWidth={1.5} aria-hidden="true" />
      <p className="flex-1 pt-0.5 text-sm text-ink">{toast.message}</p>
      <button
        type="button"
        onClick={() => setLeaving(true)}
        aria-label="Fermer"
        className="shrink-0 rounded-full p-1 text-ink-muted transition-colors duration-150 hover:bg-page hover:text-ink active:scale-90"
      >
        <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback<ShowToast>((message, tone = "default") => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, tone }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:top-6"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast doit être appelé sous ToastProvider");
  return show;
}
