import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tableau-de-bord";

  // Reconstitution exacte de l'hôte public sur Vercel (HTTPS)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : "https://griot-six.vercel.app";

  const response = NextResponse.redirect(`${baseUrl}${next}`);

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set({ name, value, ...options });
              response.cookies.set({ name, value, ...options });
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      response.cookies.set("griot_session", "1", {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
        secure: !isLocalEnv,
      });

      return response;
    }
  }

  return NextResponse.redirect(`${baseUrl}/connexion?error=AuthCallbackError`);
}