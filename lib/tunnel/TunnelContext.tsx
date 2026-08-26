"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EMPTY_TUNNEL_DATA, TUNNEL_STEPS, LAST_EDITABLE_STEP_INDEX, type TunnelData, type TunnelStep } from "@/lib/tunnel/types";
import { useToast } from "@/components/ui/Toast";
import { getStoredOrDetectedLocale } from "@/lib/i18n/locale";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "griot:tunnel";

export interface AuthResumeResult {
  result: "success" | "denied" | "error";
  email?: string;
  provider?: "google" | "email";
}

interface StoredTunnel {
  step: TunnelStep;
  data: TunnelData;
}

interface TunnelContextValue {
  step: TunnelStep;
  stepIndex: number;
  progress: number;
  data: TunnelData;
  update: (patch: Partial<TunnelData>) => void;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: TunnelStep) => void;
  canGoBack: boolean;
  notesBalance: number;
  spendNote: () => void;
  setNotesBalance: (value: number) => void;
  reset: () => void;
}

const TunnelContext = createContext<TunnelContextValue | null>(null);

function readStoredTunnel(): Partial<StoredTunnel> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<StoredTunnel>) : {};
  } catch {
    return {};
  }
}

export function TunnelProvider({
  children,
  initialStep = "occasion",
  initialData,
  creditBalance,
  resumeAuth,
}: {
  children: ReactNode;
  initialStep?: TunnelStep;
  initialData?: Partial<TunnelData>;
  creditBalance: number;
  resumeAuth?: AuthResumeResult | null;
}) {
  const [step, setStep] = useState<TunnelStep>(initialStep);

  const [data, setData] = useState<TunnelData>(() => ({
    ...EMPTY_TUNNEL_DATA,
    songLanguage: getStoredOrDetectedLocale(),
    ...initialData,
  }));

  const [notesBalance, setNotesBalance] = useState(creditBalance);
  const hydrated = useRef(false);
  const showToast = useToast();
  const { t } = useLanguage();

  // 🟢 1. Synchronisation si initialStep ou initialData sont mis à jour via l'URL
  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setData((current) => ({
        ...current,
        ...initialData,
      }));
    }
  }, [initialData]);

  // 🟢 2. Restauration depuis le localStorage UNIQUEMENT lors du retour d'auth
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = readStoredTunnel();

    // Restaure le brouillon seulement si l'utilisateur revient d'une redirection OAuth
    if (resumeAuth && stored.step && stored.data) {
      setStep(stored.step);
      setData((current) => {
        const restored: TunnelData = { ...current, ...stored.data };
        if (resumeAuth.result === "success" && resumeAuth.email) {
          restored.authEmail = resumeAuth.email;
          restored.authProvider = resumeAuth.provider ?? "google";
        }
        return restored;
      });
    }

    if (resumeAuth?.result === "denied") {
      showToast(t("tunnel.shell.googleCancelled"), "default");
    } else if (resumeAuth?.result === "error") {
      showToast(t("tunnel.shell.authFailed"), "danger");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🟢 2bis. La personne peut arriver dans le tunnel déjà connectée (session
  // Supabase déjà active, hors de tout retour OAuth/lien magique depuis cet
  // écran) — sans cette vérification, GenerationStep ne le saurait jamais et
  // redemanderait toujours de se connecter, même à quelqu'un déjà en ligne.
  useEffect(() => {
    if (resumeAuth) return; // déjà traité ci-dessus dans ce cas précis
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled || !user?.email) return;
      setData((current) =>
        current.authEmail
          ? current
          : {
              ...current,
              authEmail: user.email ?? null,
              authProvider: user.app_metadata?.provider === "google" ? "google" : "email",
            },
      );
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🟢 3. Sauvegarde automatique de la session en cours dans le localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload: StoredTunnel = { step, data };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignorer si indisponible
    }
  }, [step, data]);

  // 🟢 4. Fonction permettant de réinitialiser complètement le formulaire
  const reset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setData({
      ...EMPTY_TUNNEL_DATA,
      songLanguage: getStoredOrDetectedLocale(),
    });
    setStep("occasion");
  };

  const value = useMemo<TunnelContextValue>(() => {
    const stepIndex = TUNNEL_STEPS.indexOf(step);
    return {
      step,
      stepIndex,
      progress: (stepIndex + 1) / TUNNEL_STEPS.length,
      data,
      update: (patch) => setData((current) => ({ ...current, ...patch })),
      goNext: () => setStep((current) => TUNNEL_STEPS[Math.min(TUNNEL_STEPS.indexOf(current) + 1, TUNNEL_STEPS.length - 1)]),
      goBack: () => setStep((current) => TUNNEL_STEPS[Math.max(TUNNEL_STEPS.indexOf(current) - 1, 0)]),
      goToStep: (target) => setStep(target),
      canGoBack: stepIndex > 0 && stepIndex <= LAST_EDITABLE_STEP_INDEX,
      notesBalance,
      spendNote: () => setNotesBalance((current) => Math.max(0, current - 1)),
      setNotesBalance,
      reset,
    };
  }, [step, data, notesBalance]);

  return <TunnelContext.Provider value={value}>{children}</TunnelContext.Provider>;
}

export function useTunnel(): TunnelContextValue {
  const ctx = useContext(TunnelContext);
  if (!ctx) throw new Error("useTunnel doit être appelé sous TunnelProvider");
  return ctx;
}