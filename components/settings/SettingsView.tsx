"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Trash2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "@/components/ui/Logo";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { ProfilePhotoField } from "@/components/settings/ProfilePhotoField";
import { signOutUser } from "@/lib/auth/session";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { DashboardUser } from "@/lib/types";

interface NotificationRow {
  key: "birthday" | "ready" | "payment";
  labelKey: string;
  descriptionKey: string;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  { key: "payment", labelKey: "settings.notificationRows.payment.label", descriptionKey: "settings.notificationRows.payment.description" },
];

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof UserIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-feature border border-border bg-surface p-6 shadow-card">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-label-md uppercase tracking-wide text-ink-muted">{title}</p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Réduite au strict nécessaire : trois blocs, une colonne, pas d'onglets — tout
// ce qui n'a pas d'effet visible immédiat (sécurité/appareils, export de
// données) a été retiré. Tient en deux écrans sur mobile.
export function SettingsView({
  user,
  songCount,
  publishedCount,
}: {
  user: DashboardUser;
  songCount: number;
  publishedCount: number;
}) {
  const { t, tn } = useLanguage();
  const showToast = useToast();

  const [firstName, setFirstName] = useState(user.firstName);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState(user.phone ?? "");

  const [notifications, setNotifications] = useState<Record<NotificationRow["key"], boolean>>({
    birthday: true,
    ready: true,
    payment: true,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleted, setDeleted] = useState(false);

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    showToast(t("settings.profileUpdated"), "success");
  }

  function handleSaveNotifications(event: React.FormEvent) {
    event.preventDefault();
    showToast(t("settings.preferencesSaved"), "success");
  }

  async function handleDeleteAccount() {
    try {
      await signOutUser();
      showToast(t("settings.accountDeletedToast"), "success");
      setDeleted(true);
      setDeleteOpen(false);
    } catch {
      showToast(t("settings.accountDeleteFailed"), "danger");
    }
  }

  if (deleted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <Logo withWordmark={false} />
        <p className="mt-6 font-display text-headline-md text-ink">{t("settings.accountDeletedTitle")}</p>
        <p className="mt-2 text-body-md text-ink-muted">{t("settings.accountDeletedBody")}</p>
        <Link href="/" className="mt-8 text-sm font-medium text-brand hover:underline">
          {t("settings.backToHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard icon={UserIcon} title={t("settings.myProfile")}>
        <ProfilePhotoField initials={user.initials} photoUrl={photoUrl} onChange={setPhotoUrl} />

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">{t("settings.firstName")}</span>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-page px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:shadow-ring-focus"
            />
          </label>
          <div>
            <span className="text-sm font-medium text-ink">{t("settings.emailAddress")}</span>
            <p className="mt-1.5 flex min-h-11 items-center gap-1.5 rounded-control border border-border bg-page px-3.5 text-sm text-ink-muted">
              <GoogleMark className="h-3.5 w-3.5 shrink-0" />
              {user.email}
            </p>
            <p className="mt-1.5 text-xs text-ink-muted">{t("settings.googleAccountLinked")}</p>
          </div>
          <Button type="submit" variant="primary">
            {t("settings.save")}
          </Button>
        </form>
      </SectionCard>

      <SectionCard icon={Bell} title={t("settings.notifications")}>
        <form onSubmit={handleSaveNotifications}>
          <div className="divide-y divide-border">
            {NOTIFICATION_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-2 first:pt-0">
                <div>
                  <p className="text-sm font-medium text-ink">{t(row.labelKey)}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{t(row.descriptionKey)}</p>
                </div>
                <Toggle
                  checked={notifications[row.key]}
                  onChange={() =>
                    setNotifications((current) => ({ ...current, [row.key]: !current[row.key] }))
                  }
                  label={t(row.labelKey)}
                />
              </div>
            ))}
          </div>

          <label className="mt-3 block border-t border-border pt-4">
            <span className="text-sm font-medium text-ink">{t("settings.phoneNumber")}</span>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07 00 00 00 00"
              className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-page px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:shadow-ring-focus"
            />
            <p className="mt-1.5 text-xs text-ink-muted">{t("settings.phoneHint")}</p>
          </label>

          <Button type="submit" variant="primary" className="mt-4">
            {t("settings.save")}
          </Button>
        </form>
      </SectionCard>

      <SectionCard icon={UserIcon} title={t("settings.account")}>
        <Button type="button" variant="secondary" className="w-full" onClick={() => setLogoutOpen(true)}>
          <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t("settings.logout")}
        </Button>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs font-medium text-ink-muted">{t("settings.deleteAccountLabel")}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{t("settings.deleteAccountHint")}</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-control px-3 text-xs font-medium text-ink-muted transition-colors hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            {t("settings.delete")}
          </button>
        </div>
      </SectionCard>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} labelledBy="delete-account-title">
        <p id="delete-account-title" className="font-display text-lg font-semibold text-ink">
          {t("settings.deleteModalTitle")}
        </p>
        <p className="mt-2 text-sm text-ink-muted">{t("settings.deleteModalIntro")}</p>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          <li>• {tn("settings.deleteModalSongs", songCount)}</li>
          <li>• {tn("settings.deleteModalNotes", user.creditBalance)}</li>
          <li>• {tn("settings.deleteModalPublications", publishedCount)}</li>
          <li>• {t("settings.deleteModalAccountInfo")}</li>
        </ul>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">
            {t("settings.deleteModalConfirmPromptBefore")}
            <span className="font-mono font-semibold">{t("settings.deleteModalConfirmWord")}</span>
            {t("settings.deleteModalConfirmPromptAfter")}
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-page px-3.5 text-sm text-ink focus:border-danger focus:outline-none"
          />
        </label>
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="flex-1">
            {t("settings.cancel")}
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={confirmText !== t("settings.deleteModalConfirmWord")}
            className="flex-1 !bg-danger hover:!brightness-90"
          >
            {t("settings.deletePermanently")}
          </Button>
        </div>
      </Modal>
      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}
