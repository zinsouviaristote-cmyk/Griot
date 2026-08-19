import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tableau-de-bord";

  if (code) {
    // 1. Déterminer l'URL de base exacte
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    const baseUrl =
      !isLocalEnv && forwardedHost
        ? `https://${forwardedHost}`
        : origin;

    // 2. Préparer la réponse de redirection
    const response = NextResponse.redirect(`${baseUrl}${next}`);

    // 3. Initialiser le client Supabase serveur avec la gestion des cookies de la réponse
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Cookie personnalisé si nécessaire
      response.cookies.set("griot_session", "1", {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=AuthCallbackError`);
}