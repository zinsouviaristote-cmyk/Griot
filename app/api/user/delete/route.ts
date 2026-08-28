import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function DELETE() {
  try {
    // 1. Client Supabase côté serveur pour récupérer l'utilisateur authentifié
    //    (getUser() revalide le JWT auprès du serveur Auth, contrairement à
    //    getSession() qui se contente de lire le cookie local)
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Client Supabase Admin pour les privilèges de suppression
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 3. Suppression dans auth.users
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      throw deleteAuthError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le compte. Réessaie plus tard." },
      { status: 500 }
    );
  }
}