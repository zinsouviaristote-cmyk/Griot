import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-chariow-signature");
    const deliveryId = req.headers.get("x-pulse-delivery-id");

    // 1. Vérification des en-têtes obligatoires
    if (!signature || !deliveryId) {
      return new NextResponse("En-têtes manquants", { status: 401 });
    }

    // 2. Vérification de la signature HMAC-SHA256 (Sécurité)
    const secret = process.env.CHARIOW_PULSE_SECRET;
    if (secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      const receivedSignature = signature.replace("sha256=", "");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(receivedSignature)
      );

      if (!isValid) {
        return new NextResponse("Signature invalide", { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // 3. On ne traite que les ventes réussies
    if (payload.event === "successful.sale" || payload.event === "sale.completed") {
      const metadata = payload.data?.custom_metadata || payload.custom_metadata || {};
      const userId: string | undefined = metadata.user_id;
      const songId: string | undefined = metadata.song_id || undefined;
      // Les packs de Notes sont identifiés côté produit par pack1/pack3/pack5
      // (voir lib/tunnel/types.ts, CREDIT_PACKS) mais la RPC process_payment_webhook
      // attend l'énumération pack_2/pack_6/pack_10 (le nombre de Notes qu'elle
      // crédite) — cette table de correspondance est le seul endroit qui les relie.
      const PACK_ID_TO_RPC: Record<string, string> = { pack1: "pack_2", pack3: "pack_6", pack5: "pack_10" };
      const rpcPackId = metadata.pack_id ? PACK_ID_TO_RPC[metadata.pack_id] ?? null : null;
      const providerTxId: string =
        payload.data?.id?.toString() || payload.data?.reference || payload.id?.toString() || deliveryId;
      const amountFcfa = Number(payload.data?.amount ?? payload.amount ?? 0);

      if (!userId) {
        console.error("[CHARIOW WEBHOOK] user_id absent des custom_metadata, paiement ignoré.", { deliveryId });
      } else {
        const adminSupabase = createAdminClient();
        const { data, error } = await adminSupabase.rpc("process_payment_webhook", {
          p_provider_tx_id: providerTxId,
          p_user_id: userId,
          p_amount: amountFcfa > 0 ? amountFcfa : 1,
          p_pack_id: rpcPackId ?? undefined,
          p_song_id: songId,
          p_payment_method: "chariow",
        });

        if (error) {
          console.error("[CHARIOW WEBHOOK] Échec de la RPC process_payment_webhook", error);
          return NextResponse.json({ error: "Erreur de traitement du paiement" }, { status: 500 });
        }

        console.log(`[CHARIOW WEBHOOK] Paiement traité pour ${userId} (Delivery ID: ${deliveryId})`, data);
      }
    }

    // Répondre 200 à Chariow pour confirmer la bonne réception
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur Webhook Chariow:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}