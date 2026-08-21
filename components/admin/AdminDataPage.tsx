"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchUserProfile } from "@/lib/supabase/dataAdapters";
import { checkIsAdmin, fetchAdminOverview, type AdminOverview } from "@/lib/supabase/adminAdapters";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Section = "users" | "songs" | "payments" | "publications";

const TITLES: Record<Section, string> = {
  users: "Utilisateurs",
  songs: "Chansons",
  payments: "Paiements",
  publications: "Publications",
};

export function AdminDataPage({ section }: { section: Section }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({ firstName: "", initials: "", email: "", creditBalance: 0 });

  useEffect(() => {
    Promise.all([checkIsAdmin(), fetchUserProfile(), fetchAdminOverview()])
      .then(([isAdmin, user, data]) => {
        setAllowed(isAdmin);
        setProfile(user);
        if (isAdmin) setOverview(data);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Données indisponibles."));
  }, []);

  const query = searchParams.get("recherche")?.trim().toLowerCase() ?? "";
  const rows = (overview?.[section] ?? []).filter((row) =>
    !query || Object.values(row).some((value) => String(value).toLowerCase().includes(query)),
  );

  return (
    <DashboardShell
      creditBalance={profile.creditBalance}
      userInitials={profile.initials}
      userName={profile.firstName}
      userEmail={profile.email}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label-sm font-medium uppercase tracking-wide text-brand">{t("admin.nav.title")}</p>
            <h1 className="mt-1 font-display text-headline-md font-bold text-ink">{TITLES[section]}</h1>
          </div>
          {section === "songs" && (
            <Link
              href="/creer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Créer une chanson
            </Link>
          )}
        </div>

        {allowed === false ? (
          <p className="rounded-card border border-danger/20 bg-danger/5 p-4 text-sm text-danger">Accès réservé à l&apos;administrateur.</p>
        ) : error ? (
          <p className="rounded-card border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-border bg-surface shadow-card">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-border bg-page text-xs uppercase tracking-wide text-ink-muted">
                <tr>{Object.keys(rows[0] ?? { information: "" }).map((key) => <th key={key} className="px-4 py-3 font-medium">{key}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={String((row as { id?: string }).id ?? index)} className="border-b border-border last:border-0">
                    {Object.entries(row).map(([key, value]) => <td key={key} className="px-4 py-3 text-ink-muted">{key.toLowerCase().includes("date") ? String(value).slice(0, 10) : String(value)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {overview && rows.length === 0 && <p className="p-6 text-sm text-ink-muted">Aucune donnée disponible.</p>}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}