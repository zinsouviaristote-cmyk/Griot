import type { DashboardUser } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

interface DBProfile {
  first_name: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  credit_balance: number | null;
}

function getInitials(name: string, email: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (initials || email.slice(0, 2)).toUpperCase();
}

// `null` = personne connectée : jamais de repli sur un utilisateur fictif,
// c'est à l'appelant (voir app/(dashboard)/layout.tsx) de renvoyer vers
// /connexion dans ce cas.
export async function fetchServerUserProfile(): Promise<DashboardUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    const profile = data as unknown as DBProfile | null;
    const email = user.email || profile?.email || "";
    const name = profile?.first_name || user.user_metadata?.full_name || email.split("@")[0] || "Utilisateur";

    return {
      id: user.id,
      firstName: name,
      initials: getInitials(name, email),
      email,
      creditBalance: profile?.credit_balance ?? 0,
      phone: profile?.phone ?? null,
      photoUrl: profile?.photo_url ?? user.user_metadata?.avatar_url ?? null,
    };
  } catch {
    return null;
  }
}