import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // 💡 Ajout du `await` devant createClient()
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "NON_AUTHENTIFIE" }, { status: 401 });
    }

    const body = await request.json();
    const { songId, prompt } = body;

    if (!songId) {
      return NextResponse.json({ error: "PARAMETRES_MANQUANTS" }, { status: 400 });
    }

    // Exécution de la RPC d'autorité d'essai / déduction de Note
    const { data, error } = await supabase.rpc("request_song_generation", {
      p_song_id: songId,
      p_prompt: prompt || "",
    });

    if (error) {
      if (error.message.includes("SOLDE_NOTES_INSUFFISANT")) {
        return NextResponse.json({ error: "SOLDE_NOTES_INSUFFISANT" }, { status: 402 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ERREUR_SERVEUR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}