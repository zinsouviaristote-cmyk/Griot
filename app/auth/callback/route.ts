import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tableau-de-bord";

  if (code) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    const baseUrl =
      !isLocalEnv && forwardedHost
        ? `https://${forwardedHost}`
        : origin;

    // Crée la réponse de redirection en amont
    const response = NextResponse.redirect(`${baseUrl}${next}`);

    // Initialiser le client serveur
    const supabase = await createClient();

    // Échanger le code contre la session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Synchronise le cookie custom 'griot_session'
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