import { NextResponse } from "next/server";
import crypto from "crypto";

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
      const userId = metadata.user_id;
      const notesAmount = parseInt(metadata.notes_amount || "0", 10);

      if (userId && notesAmount > 0) {
        // TODO: Insérer la logique de mise à jour dans votre base de données (Supabase / Prisma)
        // Exemple avec Supabase :
        // await supabase.rpc('add_user_credits', { user_id_param: userId, credits_to_add: notesAmount });
        
        console.log(`[CHARIOW WEBHOOK] Succès : +${notesAmount} notes créditées à l'utilisateur ${userId} (Delivery ID: ${deliveryId})`);
      }
    }

    // Répondre 200 à Chariow pour confirmer la bonne réception
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur Webhook Chariow:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}