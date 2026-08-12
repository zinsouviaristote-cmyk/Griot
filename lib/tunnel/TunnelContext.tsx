"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EMPTY_TUNNEL_DATA, TUNNEL_STEPS, LAST_EDITABLE_STEP_INDEX, type TunnelData, type TunnelStep } from "@/lib/tunnel/types";
import { useToast } from "@/components/ui/Toast";
import { getStoredOrDetectedLocale } from "@/lib/i18n/locale";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const STORAGE_KEY = "griot:tunnel";

// Ce que la page /creer transmet après un aller-retour de connexion (Google ou
// lien magique) — jamais construit ailleurs : c'est app/creer/page.tsx qui lit
// les paramètres `auth`/`email`/`provider` posés par la redirection de retour,
// et les passe ici pour reprendre le tunnel exactement où il en était.
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
  // Solde de Notes — mutable ici (contrairement au solde du tableau de bord) :
  // chaque reprise en dépense une, en direct, sans quoi le bouton "Réessayer"
  // ne pourrait jamais refléter "il vous en restera X" avant confirmation.
  notesBalance: number;
  spendNote: () => void;
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
  // Présent uniquement quand cette page vient d'être atteinte par la
  // redirection de retour d'une connexion — voir app/creer/page.tsx. Sa seule
  // présence (peu importe le résultat) déclenche la restauration de l'étape
  // depuis le stockage local ; en dehors de ce cas, arriver sur /creer démarre
  // toujours à l'étape calculée depuis l'URL, jamais une reprise surprise
  // d'une session laissée en plan il y a plusieurs jours.
  resumeAuth?: AuthResumeResult | null;
}) {
  const [step, setStep] = useState<TunnelStep>(initialStep);
  // La langue de chanson par défaut suit celle de l'interface au moment où le
  // tunnel démarre (voir lib/i18n/locale.ts) — une détection synchrone plutôt
  // qu'un effet, pour éviter toute course avec le montage de LanguageProvider
  // (ses propres effets, plus haut dans l'arbre, se déclenchent après ceux
  // d'ici). `initialData` reste prioritaire si un appelant fournit déjà une
  // langue de chanson explicite.
  const [data, setData] = useState<TunnelData>(() => ({
    ...EMPTY_TUNNEL_DATA,
    songLanguage: getStoredOrDetectedLocale(),
    ...initialData,
  }));
  const [notesBalance, setNotesBalance] = useState(creditBalance);
  const hydrated = useRef(false);
  const showToast = useToast();
  const { t } = useLanguage();

  // Restauration après montage seulement (jamais pendant le rendu serveur) :
  // même philosophie que Reveal/CountUp ailleurs dans l'app — le premier rendu
  // doit être identique côté serveur et client, l'ajustement vient après coup.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = readStoredTunnel();

    if (resumeAuth && stored.step && stored.data) {
      // Retour d'une redirection de connexion : reprise COMPLÈTE et exacte de
      // l'état sauvegardé, jamais la fusion champ-par-champ ci-dessous — c'est
      // très précisément l'état qu'on vient de quitter, pas un vieux brouillon
      // à compléter. La fusion "ne récupère que ce qui manque" laisserait les
      // essais déjà générés (un tableau, jamais "vide" au sens de ce test)
      // bloqués à zéro sur l'écran de choix.
      setStep(stored.step);
      setData((current) => {
        const restored: TunnelData = { ...current, ...stored.data };
        if (resumeAuth.result === "success" && resumeAuth.email) {
          restored.authEmail = resumeAuth.email;
          restored.authProvider = resumeAuth.provider ?? "google";
        }
        return restored;
      });
    } else {
      // Arrivée normale (pas de redirection) : les réponses transmises par
      // l'accueil (prénom, occasion) priment toujours sur une session laissée
      // en plan — on ne récupère que ce qui manque, jamais ce qui est déjà rempli.
      setData((current) => {
        const merged = { ...current };
        let changed = false;
        for (const key of Object.keys(stored.data ?? {}) as (keyof TunnelData)[]) {
          const currentValue = current[key];
          const isEmpty = currentValue === "" || currentValue === null;
          const storedValue = stored.data![key];
          if (isEmpty && storedValue !== undefined && storedValue !== "" && storedValue !== null) {
            (merged as Record<string, unknown>)[key] = storedValue;
            changed = true;
          }
        }
        return changed ? merged : current;
      });
    }

    if (resumeAuth?.result === "denied") {
      showToast(t("tunnel.shell.googleCancelled"), "default");
    } else if (resumeAuth?.result === "error") {
      showToast(t("tunnel.shell.authFailed"), "danger");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload: StoredTunnel = { step, data };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Stockage indisponible (navigation privée, quota) — la session continue
      // simplement sans persistance, ce n'est jamais bloquant pour le tunnel.
    }
  }, [step, data]);

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
    };
  }, [step, data, notesBalance]);

  return <TunnelContext.Provider value={value}>{children}</TunnelContext.Provider>;
}

export function useTunnel(): TunnelContextValue {
  const ctx = useContext(TunnelContext);
  if (!ctx) throw new Error("useTunnel doit être appelé sous TunnelProvider");
  return ctx;
}
