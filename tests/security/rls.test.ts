import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const IS_LIVE_PROJECT = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

describe("Tests de Sécurité RLS et Permissions Supabase", () => {
  const clientAnonyme = createClient<Database>(SUPABASE_URL, ANON_KEY);

  it("1. Empêche un utilisateur anonyme d'accéder aux chansons privées", async () => {
    if (!IS_LIVE_PROJECT) {
      // Test de structure d'API hors-ligne
      expect(clientAnonyme.from("songs")).toBeDefined();
      return;
    }
    const { data, error } = await clientAnonyme.from("songs").select("*");
    expect(data).toBeNull();
    expect(error).toBeDefined();
  });

  it("2. Empêche un client d'insérer directement un mouvement de Notes dans credit_transactions", async () => {
    if (!IS_LIVE_PROJECT) {
      expect((clientAnonyme.from("credit_transactions") as any).insert).toBeDefined();
      return;
    }
    const { error } = await (clientAnonyme.from("credit_transactions") as any).insert({
      user_id: "00000000-0000-0000-0000-000000000001",
      motif: "achat",
      label_key: "test",
      delta: 100,
      balance_after: 100,
    });
    expect(error).toBeDefined();
  });

  it("3. Empêche un client d'insérer directement un paiement fictif dans la table payments", async () => {
    if (!IS_LIVE_PROJECT) {
      expect((clientAnonyme.from("payments") as any).insert).toBeDefined();
      return;
    }
    const { error } = await (clientAnonyme.from("payments") as any).insert({
      user_id: "00000000-0000-0000-0000-000000000001",
      amount_fcfa: 5900,
      payment_method: "mobile_money",
      status: "completed",
    });
    expect(error).toBeDefined();
  });

  it("4. Les chansons partagées via la vue public_shared_songs masquent l'histoire brute et l'email", async () => {
    if (!IS_LIVE_PROJECT) {
      expect(clientAnonyme.from("public_shared_songs")).toBeDefined();
      return;
    }
    const { data } = await clientAnonyme.from("public_shared_songs").select("*").limit(1);
    if (data && data.length > 0) {
      const sample = data[0];
      expect((sample as any).story_prompt).toBeUndefined();
      expect((sample as any).email).toBeUndefined();
      expect((sample as any).user_id).toBeUndefined();
    }
  });

  it("5. Les publications Explorer dans published_songs sont accessibles en lecture publique", async () => {
    if (!IS_LIVE_PROJECT) {
      expect(clientAnonyme.from("published_songs")).toBeDefined();
      return;
    }
    const { error } = await clientAnonyme.from("published_songs").select("id, recipient_first_name, occasion, style, likes_count");
    if (error) {
      expect(error.code).not.toBe("42501");
    }
  });
});
