"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { signOutUser } from "@/lib/auth/session";

export function LogoutConfirmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const showToast = useToast();
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    if (pending) return;
    setPending(true);
    try {
      await signOutUser();
      window.location.assign("/connexion?toast=logout");
    } catch {
      setPending(false);
      showToast(t("auth.logoutFailed"), "danger");
    }
  }

  return (
    <Modal open={open} onClose={pending ? () => undefined : onClose} labelledBy="logout-confirm-title">
      <p id="logout-confirm-title" className="font-display text-lg font-semibold text-ink">
        {t("auth.logoutConfirmTitle")}
      </p>
      <p className="mt-2 text-sm text-ink-muted">{t("auth.logoutConfirmBody")}</p>
      <div className="mt-5 flex gap-3">
        <Button variant="ghost" onClick={onClose} disabled={pending} className="flex-1">
          {t("common.cancel")}
        </Button>
        <Button onClick={handleConfirm} disabled={pending} className="flex-1 !bg-danger hover:!brightness-90">
          {t("auth.logoutConfirmAction")}
        </Button>
      </div>
    </Modal>
  );
}