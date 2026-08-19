import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  const supabaseUrl = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ejssioxqjpubbqkifhko.supabase.co";
  
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // <-- Collez la même clé eyJ... ici

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}