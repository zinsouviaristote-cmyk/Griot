import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Rediriger vers /tableau-de-bord par défaut au lieu de /dashboard
  const next = searchParams.get("next") ?? "/tableau-de-bord";

  if (code) {
    // Ajouter await si createClient est une promesse
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      let redirectUrl = `${origin}${next}`;
      
      // En production sur Vercel, utiliser le host transmis pour éviter les problèmes de domaine
      if (!isLocalEnv && forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      }

      const response = NextResponse.redirect(redirectUrl);
      
      // Définit également le cookie session pour la landing
      response.cookies.set("griot_session", "1", {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
      });

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=AuthCallbackError`);
}