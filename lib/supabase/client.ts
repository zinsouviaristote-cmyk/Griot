import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    console.warn(
      "ATTENTION: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY non définies ou invalides. " +
      "Vérifiez votre fichier .env.local (en local) ou les variables d'environnement sur Vercel Dashboard."
    );
  }

  return createBrowserClient<Database>(
    supabaseUrl || "https://cjssioxqjpubbqkifhko.supabase.co",
    supabaseAnonKey || "placeholder-anon-key"
  );
}
