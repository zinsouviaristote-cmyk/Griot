"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, Music2, CircleDot, DollarSign, Users, Disc, ShieldCheck, PlusCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { fetchAdminStats, fetchAdminRecentSongs, fetchAdminOverview, checkIsAdmin, type AdminOverview, type AdminStats } from "@/lib/supabase/adminAdapters";
import { fetchUserProfile } from "@/lib/supabase/dataAdapters";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SongsTable } from "@/components/dashboard/SongsTable";
import type { DashboardUser, Song } from "@/lib/types";

export function AdminDashboardView() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [songsError, setSongsError] = useState<string | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
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
        const [statsResult, songsResult, overviewResult] = await Promise.allSettled([
          fetchAdminStats(),
          fetchAdminRecentSongs(),
          fetchAdminOverview(),
        ]);
        if (statsResult.status === "fulfilled") {
          setStats(statsResult.value);
        } else {
          setStatsError(statsResult.reason instanceof Error ? statsResult.reason.message : "Les statistiques sont indisponibles.");
        }
        if (songsResult.status === "fulfilled") {
          setRecentSongs(songsResult.value.slice(0, 3));
        } else {
          setSongsError(songsResult.reason instanceof Error ? songsResult.reason.message : "Les chansons récentes sont indisponibles.");
        }
        if (overviewResult.status === "fulfilled") {
          setOverview(overviewResult.value);
        } else {
          setOverviewError(overviewResult.reason instanceof Error ? overviewResult.reason.message : "Les données détaillées sont indisponibles.");
        }
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
      <div className="relative isolate space-y-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <span className="admin-orbit admin-orbit-one" />
          <span className="admin-orbit admin-orbit-two" />
          <Music2 className="admin-mark admin-mark-one" strokeWidth={1.2} />
          <CircleDot className="admin-mark admin-mark-two" strokeWidth={1.2} />
          <Music className="admin-mark admin-mark-three" strokeWidth={1.2} />
        </div>
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
              Chargement des données d&apos;administration...
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
            {statsError && (
              <div className="rounded-feature border border-danger/20 bg-danger/5 p-4 text-sm text-danger shadow-card">
                {statsError}
                <p className="mt-1 text-xs text-ink-muted">
                  Vérifiez que la fonction SQL <code>get_admin_stats</code> a bien été exécutée dans Supabase.
                </p>
              </div>
            )}

            {/* Grid des indicateurs clés */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Revenus Totaux */}
              <div className="rounded-feature border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-brand/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Chiffre d&apos;Affaires</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-display-sm font-bold text-ink">
                  {stats ? `${stats.totalRevenueFcfa.toLocaleString("fr-FR")} FCFA` : "—"}
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
                  {stats?.totalSongs ?? "—"}
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
                  {stats ? `${stats.totalNotesSold} Notes` : "—"}
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
                  {stats?.totalUsers ?? "—"}
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
                  {stats?.totalListens ?? "—"}
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
                  {stats?.totalPublications ?? "—"}
                </p>
                <p className="mt-2 text-xs text-ink-muted">Chansons publiées dans la communauté</p>
              </div>
            </div>

            {overviewError && (
              <p className="rounded-card border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{overviewError}</p>
            )}

            <section id="songs">
              <h2 className="mb-3 font-display text-title-lg font-semibold text-ink">Les 3 dernières chansons</h2>
              {songsError ? (
                <p className="rounded-card border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{songsError}</p>
              ) : (
                <SongsTable
                  songs={recentSongs}
                  emptyTitle="Aucune chanson créée"
                  emptyDescription="Les chansons créées par les utilisateurs apparaîtront ici."
                />
              )}
            </section>

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
                    <p className="text-xs text-ink-muted mt-0.5">Comme n&apos;importe quel utilisateur</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-brand" />
                </Link>

                <Link
                  href="/historiques"
                  className="flex items-center justify-between rounded-control border border-border bg-page p-4 transition-all hover:border-brand/40"
                >
                  <div>
                    <p className="font-semibold text-ink text-sm">Historique</p>
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
