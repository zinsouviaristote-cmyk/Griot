import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId, email, firstName, lastName, phone, packId, notesAmount } = body;

    if (!productId || !userId || !email) {
      return NextResponse.json(
        { error: "Informations de paiement incomplètes" },
        { status: 400 }
      );
    }

    // 1. Nettoyage du numéro de téléphone (enlève les espaces et le +229 si présent)
    let rawPhone = phone ? String(phone).replace(/\s+/g, "") : "";
    if (rawPhone.startsWith("+229")) {
      rawPhone = rawPhone.replace("+229", "");
    } else if (rawPhone.startsWith("00229")) {
      rawPhone = rawPhone.replace("00229", "");
    }

    // Fallback par défaut si le téléphone n'est pas renseigné dans le formulaire
    const phoneNumber = rawPhone || "0190000000";

    // 2. Vérification et sécurisation de l'URL de redirection
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://votre-projet.vercel.app";
    const appUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

    // 3. Appel à l'API Checkout de Chariow
    const response = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHARIOW_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        email: email,
        first_name: firstName || "Client",
        last_name: lastName || "Griot",
        // Chariow exige l'objet phone complet en permanence
        phone: {
          country_code: "BJ",
          number: phoneNumber,
        },
        // Meta-données transmises au Webhook
        custom_metadata: {
          user_id: userId,
          pack_id: packId,
          notes_amount: String(notesAmount),
        },
        redirect_url: `${appUrl}/tableau-de-bord?status=success`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Chariow API:", data);
      return NextResponse.json(
        { error: data.message || "Impossible de créer la session de paiement" },
        { status: response.status }
      );
    }

    // Récupération de l'URL de paiement Chariow
    const checkoutUrl = data.data?.payment?.checkout_url || data.checkout_url || data.data?.url;

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Erreur création paiement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}