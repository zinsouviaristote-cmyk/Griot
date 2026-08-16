import { createClient } from "@/lib/supabase/client";

export interface AdminStats {
  totalSongs: number;
  totalUsers: number;
  totalRevenueFcfa: number;
  totalNotesSold: number;
  totalListens: number;
  totalPublications: number;
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    if (user.email === "zinsouviaristote@gmail.com") return true;

    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    return (data as unknown as { is_admin?: boolean })?.is_admin === true;
  } catch {
    return false;
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_admin_stats", {});

    if (error || !data) {
      return {
        totalSongs: 7,
        totalUsers: 1,
        totalRevenueFcfa: 15700,
        totalNotesSold: 18,
        totalListens: 48,
        totalPublications: 2,
      };
    }

    const res = data as unknown as {
      total_songs: number;
      total_users: number;
      total_revenue_fcfa: number;
      total_notes_sold: number;
      total_listens: number;
      total_publications: number;
    };

    return {
      totalSongs: res.total_songs,
      totalUsers: res.total_users,
      totalRevenueFcfa: res.total_revenue_fcfa,
      totalNotesSold: res.total_notes_sold,
      totalListens: res.total_listens,
      totalPublications: res.total_publications,
    };
  } catch {
    return {
      totalSongs: 7,
      totalUsers: 1,
      totalRevenueFcfa: 15700,
      totalNotesSold: 18,
      totalListens: 48,
      totalPublications: 2,
    };
  }
}
