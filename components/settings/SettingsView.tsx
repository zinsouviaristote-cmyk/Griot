"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Download,
  LogOut,
  Megaphone,
  MonitorSmartphone,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/ui/Logo";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { useToast } from "@/components/ui/Toast";
import { formatDateFr } from "@/lib/format/date";
import type { ConnectedDevice, DashboardUser } from "@/lib/types";

interface NotificationRow {
  key: "birthday" | "ready" | "payment";
  label: string;
  description: string;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  {
    key: "birthday",
    label: "Rappels d'anniversaire",
    description: "Un rappel quelques jours avant l'anniversaire d'un proche enregistré.",
  },
  {
    key: "ready",
    label: "Chanson prête",
    description: "Un message dès que l'extrait de votre chanson est disponible à l'écoute.",
  },
  {
    key: "payment",
    label: "Confirmation de paiement",
    description: "Un reçu à chaque recharge ou déblocage de chanson.",
  },
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

export function SettingsView({
  user,
  songCount,
  publishedCount,
  devices,
}: {
  user: DashboardUser;
  songCount: number;
  publishedCount: number;
  devices: ConnectedDevice[];
}) {
  const showToast = useToast();

  const [firstName, setFirstName] = useState(user.firstName);
  const [phone, setPhone] = useState(user.phone ?? "");

  const [notifications, setNotifications] = useState<Record<NotificationRow["key"], boolean>>({
    birthday: true,
    ready: true,
    payment: true,
  });

  const [connectedDevices, setConnectedDevices] = useState(devices);
  const [remainingPublished, setRemainingPublished] = useState(publishedCount);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleted, setDeleted] = useState(false);

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    showToast("Profil mis à jour.", "success");
  }

  function handleSaveNotifications(event: React.FormEvent) {
    event.preventDefault();
    showToast("Préférences enregistrées.", "success");
  }

  function handleRevokeDevice(deviceId: string) {
    setConnectedDevices((current) => current.filter((device) => device.id !== deviceId));
    showToast("Appareil déconnecté.", "default");
  }

  function handleUnpublishAll() {
    setRemainingPublished(0);
    showToast("Toutes vos chansons ont été retirées d'Explorer.", "default");
  }

  function handleDownloadData() {
    const payload = {
      profil: { prenom: user.firstName, email: user.email },
      solde: { notes: user.creditBalance },
      chansons: songCount,
      publications: publishedCount,
      exporteLe: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "griot-mes-donnees.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Téléchargement lancé.", "success");
  }

  function handleDeleteAccount() {
    setDeleted(true);
    setDeleteOpen(false);
  }

  if (deleted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <Logo withWordmark={false} />
        <p className="mt-6 font-display text-headline-md text-ink">Votre compte a été supprimé</p>
        <p className="mt-2 text-body-md text-ink-muted">
          Toutes vos données ont été effacées. Merci d&apos;avoir raconté vos histoires avec Griot.
        </p>
        <Link href="/" className="mt-8 text-sm font-medium text-brand hover:underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard icon={UserIcon} title="Mon profil">
        <div className="flex items-center gap-3">
          <Avatar initials={user.initials} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.firstName}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <GoogleMark className="h-3.5 w-3.5" />
              Compte Google lié — {user.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">Prénom</span>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-page px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:shadow-ring-focus"
            />
          </label>
          <div>
            <span className="text-sm font-medium text-ink">Adresse e-mail</span>
            <p className="mt-1.5 flex min-h-11 items-center rounded-control border border-border bg-page px-3.5 text-sm text-ink-muted">
              {user.email}
            </p>
            <p className="mt-1.5 text-xs text-ink-muted">
              Gérée par votre compte Google — modifiable uniquement depuis Google.
            </p>
          </div>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </form>
      </SectionCard>

      <SectionCard icon={ShieldCheck} title="Sécurité">
        <p className="text-sm text-ink-muted">Appareils actuellement connectés à votre compte.</p>
        <div className="mt-3 divide-y divide-border">
          {connectedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    {device.label}
                    {device.current && (
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-label-sm font-medium text-success">
                        Cet appareil
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {device.location} · dernière activité {formatDateFr(device.lastActiveAt)}
                  </p>
                </div>
              </div>
              {!device.current && (
                <button
                  type="button"
                  onClick={() => handleRevokeDevice(device.id)}
                  className="shrink-0 rounded-control border border-border px-3.5 py-2 text-xs font-semibold text-ink-muted transition-all duration-150 ease-magnetic hover:border-danger/40 hover:text-danger active:scale-95"
                >
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications">
        <form onSubmit={handleSaveNotifications}>
          <div className="divide-y divide-border">
            {NOTIFICATION_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                <div>
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{row.description}</p>
                </div>
                <Toggle
                  checked={notifications[row.key]}
                  onChange={() =>
                    setNotifications((current) => ({ ...current, [row.key]: !current[row.key] }))
                  }
                  label={row.label}
                />
              </div>
            ))}
          </div>

          <label className="mt-4 block border-t border-border pt-4">
            <span className="text-sm font-medium text-ink">Numéro de téléphone (facultatif)</span>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07 00 00 00 00"
              className="mt-1.5 w-full min-h-11 rounded-control border border-border bg-page px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:shadow-ring-focus"
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              Sert uniquement aux rappels et à la livraison de votre chanson par WhatsApp — jamais pour vous
              connecter.
            </p>
          </label>

          <Button type="submit" variant="primary" className="mt-4">
            Enregistrer
          </Button>
        </form>
      </SectionCard>

      <SectionCard icon={ShieldCheck} title="Confidentialité">
        <div className="divide-y divide-border">
          <Link href="/publications" className="group flex items-center justify-between gap-4 py-3.5 first:pt-0">
            <div className="flex items-center gap-3">
              <Megaphone className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-sm font-medium text-ink">Mes publications</span>
            </div>
            <ChevronRight
              className="h-4 w-4 text-ink-muted transition-transform duration-150 ease-magnetic group-hover:translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-ink">Retirer toutes mes chansons d&apos;Explorer</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {remainingPublished > 0
                  ? `${remainingPublished} chanson${remainingPublished > 1 ? "s" : ""} actuellement publiée${remainingPublished > 1 ? "s" : ""}.`
                  : "Aucune chanson publiée."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUnpublishAll}
              disabled={remainingPublished === 0}
              className="shrink-0 rounded-control border border-border px-3.5 py-2 text-xs font-semibold text-ink-muted transition-all duration-150 ease-magnetic hover:border-danger/40 hover:text-danger active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tout retirer
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5 last:pb-0">
            <div>
              <p className="text-sm font-medium text-ink">Télécharger mes données</p>
              <p className="mt-0.5 text-xs text-ink-muted">Profil, solde de Notes et historique, au format JSON.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadData}
              className="flex shrink-0 items-center gap-1.5 rounded-control border border-border px-3.5 py-2 text-xs font-semibold text-ink transition-all duration-150 ease-magnetic hover:border-brand/40 hover:text-brand active:scale-95"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              Télécharger
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={UserIcon} title="Compte">
        <div className="flex items-center justify-between gap-4 pb-3.5">
          <div>
            <p className="text-sm font-medium text-ink">Se déconnecter</p>
            <p className="mt-0.5 text-xs text-ink-muted">Vous devrez vous reconnecter avec Google pour revenir.</p>
          </div>
          <Link
            href="/connexion"
            className="flex shrink-0 items-center gap-1.5 rounded-control border border-border px-3.5 py-2 text-xs font-semibold text-ink transition-all duration-150 ease-magnetic hover:border-danger/40 hover:text-danger active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            Déconnexion
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-3.5">
          <div>
            <p className="text-sm font-medium text-danger">Supprimer mon compte</p>
            <p className="mt-0.5 text-xs text-ink-muted">Efface définitivement vos données et votre historique.</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-control border border-danger/30 px-3.5 py-2 text-xs font-semibold text-danger transition-all duration-150 ease-magnetic hover:bg-danger/10 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            Supprimer
          </button>
        </div>
      </SectionCard>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} labelledBy="delete-account-title">
        <p id="delete-account-title" className="font-display text-lg font-semibold text-ink">
          Supprimer votre compte ?
        </p>
        <p className="mt-2 text-sm text-ink-muted">Cette action est définitive. Vous perdrez :</p>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          <li>
            • {songCount} chanson{songCount > 1 ? "s" : ""} créée{songCount > 1 ? "s" : ""}
          </li>
          <li>
            • {user.creditBalance} Note{user.creditBalance > 1 ? "s" : ""} restante{user.creditBalance > 1 ? "s" : ""}
          </li>
          <li>
            • {publishedCount} publication{publishedCount > 1 ? "s" : ""} sur Explorer
          </li>
          <li>• Vos informations de compte</li>
        </ul>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">
            Tapez <span className="font-mono font-semibold">SUPPRIMER</span> pour confirmer
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
            Annuler
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={confirmText !== "SUPPRIMER"}
            className="flex-1 !bg-danger hover:!brightness-90"
          >
            Supprimer définitivement
          </Button>
        </div>
      </Modal>
    </div>
  );
}
