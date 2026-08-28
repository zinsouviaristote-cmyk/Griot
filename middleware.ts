import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refus par défaut : toute route est protégée sauf celles listées ici. Une
// nouvelle route (page ou /api) créée sans y penser hérite donc de l'exigence
// d'authentification au lieu de rester ouverte par oubli.
const PUBLIC_PATHS = new Set(["/", "/connexion", "/design"]);

const PUBLIC_PREFIXES = [
  "/auth/", // callback OAuth/magic link : appelé avant qu'une session existe
  "/creer", // tunnel de création, utilisable sans compte jusqu'au paiement
  "/chanson/", // pages de chanson publiques partagées (lien WhatsApp/SMS)
  "/api/webhooks/", // appelées par des services externes (Chariow), vérifiées par signature HMAC, pas par session Supabase
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Variables manquantes : on ne bloque pas le boot de l'app pour ça,
    // mais aucune route protégée n'est réellement gardée dans ce cas.
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() revalide le JWT auprès du serveur Auth (contrairement à
  // getSession() qui se contente de lire le cookie local) — nécessaire ici
  // puisque c'est la porte d'entrée de toute route protégée.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublicPath(pathname) || user) {
    return response;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const redirectUrl = new URL("/connexion", request.url);
  redirectUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
