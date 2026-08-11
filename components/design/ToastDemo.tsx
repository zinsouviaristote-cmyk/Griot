"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function ToastDemo() {
  const showToast = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => showToast("Lien copié dans le presse-papiers.")}>
        Toast neutre
      </Button>
      <Button
        variant="secondary"
        onClick={() => showToast("Rechargement effectué avec succès.", "success")}
      >
        Toast succès
      </Button>
      <Button variant="secondary" onClick={() => showToast("Le paiement a échoué. Réessayez.", "danger")}>
        Toast erreur
      </Button>
    </div>
  );
}
