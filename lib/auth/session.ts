import { createClient } from "@/lib/supabase/client";

export const SESSION_COOKIE_NAME = "griot_session";

// Helper pour calculer une URL de callback propre et valide
function getCallbackUrl(redirectTo?: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const target = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/tableau-de-bord";
  return `${origin}/auth/callback?next=${encodeURIComponent(target)}`;
}

// Connexion via Google OAuth (sans mot de passe)
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();
  const callbackUrl = getCallbackUrl(redirectTo);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error) {
    throw error;
  }
}

// Connexion via Lien Magique Email (sans mot de passe)
export async function sendMagicLink(email: string, redirectTo?: string) {
  const supabase = createClient();
  const callbackUrl = getCallbackUrl(redirectTo);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    throw error;
  }
}

// Déconnexion
export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
  if (typeof document !== "undefined") {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

// Fonctions de compatibilité de session locale pour le préchargement SSR
export function markMockSessionActive(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearMockSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}