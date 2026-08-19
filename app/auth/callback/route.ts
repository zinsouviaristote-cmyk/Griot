import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tableau-de-bord";

  // Reconstitution dynamique de l'hôte réel (Vercel ou Localhost)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const isLocalEnv = process.env.NODE_ENV === "development";

  const baseUrl = isLocalEnv
    ? new URL(request.url).origin
    : forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : "https://griot-six.vercel.app";

  if (code) {
    // 1. Await sur la création du client serveur
    const supabase = await createClient();

    // 2. Échange du code contre la session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 3. Création de la réponse de redirection
      const response = NextResponse.redirect(`${baseUrl}${next}`);

      // 4. Synchronisation du cookie de session
      response.cookies.set("griot_session", "1", {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
        secure: !isLocalEnv,
      });

      return response;
    }
  }

  // En cas d'échec ou d'absence de code
  return NextResponse.redirect(`${baseUrl}/connexion?error=AuthCallbackError`);
}