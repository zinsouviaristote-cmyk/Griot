import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-payment-signature");
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

    // Validation de la signature en production si le secret est configuré
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "SIGNATURE_INVALIDE" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { providerTransactionId, userId, amountFcfa, packId, songId, paymentMethod } = payload;

    if (!providerTransactionId || !userId || !amountFcfa) {
      return NextResponse.json({ error: "PAYLOAD_INVALIDE" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Appel de la RPC d'idempotence et d'attribution
    const { data, error } = await adminSupabase.rpc("process_payment_webhook", {
      p_provider_tx_id: providerTransactionId,
      p_user_id: userId,
      p_amount: amountFcfa,
      p_pack_id: packId || null,
      p_song_id: songId || null,
      p_payment_method: paymentMethod || "mobile_money",
    });

    if (error) {
      console.error("Erreur Webhook RPC Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "ok", result: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ERREUR_SERVEUR";
    console.error("Erreur serveur Webhook:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
