import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cjssioxqjpubbqkifhko.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_c-3Vhx-6X2cE1LrskKyh4g_eBhFHQtQ";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
