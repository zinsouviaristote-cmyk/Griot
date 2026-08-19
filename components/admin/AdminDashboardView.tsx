"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, DollarSign, Users, Disc, ShieldCheck, PlusCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { fetchAdminStats, checkIsAdmin, type AdminStats } from "@/lib/supabase/adminAdapters";
import { fetchUserProfile } from "@/lib/supabase/dataAdapters";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { DashboardUser } from "@/lib/types";

export function AdminDashboardView() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userProfile, setUserProfile] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [adminFlag, uProfile] = await Promise.all([
        checkIsAdmin(),
        fetchUserProfile(),
      ]);
      setIsAdmin(adminFlag);
      setUserProfile(uProfile);
      if (adminFlag) {
        const s = await fetchAdminStats();
        setStats(s);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const balance = userProfile?.creditBalance ?? 6;
  const initials = userProfile?.initials ?? "AK";
  const name = userProfile?.firstName ?? "Aïcha";
  const email = userProfile?.email ?? "aicha.k@example.com";

  return (
    <DashboardShell
      creditBalance={balance}
      userInitials={initials}
      userName={name}
      userEmail={email}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-brand" />
              <h1 className="font-display text-headline-md font-bold text-ink">
                Espace Admin
              </h1>
            </div>
            <div className="mt-1.5 h-1 w-20 rounded-full bg-brand" />
            <p className="mt-2 text-sm text-ink-muted">
              Vue globale de l&apos;activité du site, les revenus générés et des statistiques de création musicale.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/creer"
              className="flex items-center gap-2 rounded-control bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-200 ease-magnetic hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              Créer une chanson
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-feature border border-border bg-surface shadow-card">
            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Chargement des données d'administration...
            </div>
          </div>
        ) : !isAdmin ? (
          <div className="rounded-feature border border-danger/20 bg-danger/5 p-6 text-center shadow-card">
            <h2 className="font-display text-title-md font-semibold text-danger">Accès Réservé</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Cet espace est réservé à l&apos;administrateur principal de Griot (zinsouviaristote@gmail.com). Vous pouvez créer vos chansons depuis le tableau de bord standard.
            </p>
            <Link
              href="/tableau-de-bord"
              className="mt-4 inline-flex items-center gap-2 rounded-control bg-surface border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-page"
            >
              Retour au tableau de bord
            </Link>
          </div>
        ) : (
          <>
            {/* Grid des indicateurs clés */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Revenus Totaux */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Chiffre d&apos;Affaires</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {(stats?.totalRevenueFcfa || 0).toLocaleString("fr-FR")} FCFA
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Paiements FCFA sécurisés</span>
                </div>
              </div>

              {/* Chansons Créées */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Total Chansons Créées</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Music className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {stats?.totalSongs || 0}
                </p>
                <p className="mt-2 text-xs text-ink-muted">Chansons enregistrées en base</p>
              </div>

              {/* Notes Vendues */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Notes Vendues</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Disc className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {stats?.totalNotesSold || 0} Notes
                </p>
                <p className="mt-2 text-xs text-ink-muted">Packs de 2, 6 et 10 Notes</p>
              </div>

              {/* Utilisateurs Inscrits */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Comptes Utilisateurs</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {stats?.totalUsers || 0}
                </p>
                <p className="mt-2 text-xs text-ink-muted">Inscriptions Google & E-mail</p>
              </div>

              {/* Écoutes Cumulées */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Écoutes Cumulées</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {stats?.totalListens || 0}
                </p>
                <p className="mt-2 text-xs text-ink-muted">Lectures audio uniques et publiques</p>
              </div>

              {/* Publications Explorer */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Publications Explorer</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Disc className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {stats?.totalPublications || 0}
                </p>
                <p className="mt-2 text-xs text-ink-muted">Chansons publiées dans la communauté</p>
              </div>
            </div>

            {/* Raccourcis de Gestion */}
            <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
              <h2 className="font-display text-title-lg font-semibold text-ink">
                Actions & Gestion de la Plateforme
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Link
                  href="/creer"
                  className="flex items-center justify-between rounded-control border border-border bg-page p-4 transition-all hover:border-brand/40"
                >
                  <div>
                    <p className="font-semibold text-ink text-sm">Créer une musique</p>
                    <p className="text-xs text-ink-muted mt-0.5">Comme n'importe quel utilisateur</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-brand" />
                </Link>

                <Link
                  href="/bibliotheque"
                  className="flex items-center justify-between rounded-control border border-border bg-page p-4 transition-all hover:border-brand/40"
                >
                  <div>
                    <p className="font-semibold text-ink text-sm">Ma Bibliothèque</p>
                    <p className="text-xs text-ink-muted mt-0.5">Vos chansons personnelles</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-brand" />
                </Link>

                <Link
                  href="/recharger"
                  className="flex items-center justify-between rounded-control border border-border bg-page p-4 transition-all hover:border-brand/40"
                >
                  <div>
                    <p className="font-semibold text-ink text-sm">Tarifs & Packs</p>
                    <p className="text-xs text-ink-muted mt-0.5">Simuler un achat de Notes</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-brand" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
