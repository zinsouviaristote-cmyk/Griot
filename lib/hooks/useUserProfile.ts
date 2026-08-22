"use client";

import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/supabase/dataAdapters";
import type { DashboardUser } from "@/lib/types";

// Petit magasin partagé, en dehors de React : toutes les pages qui montent
// DashboardShell (ou appellent ce hook) lisent et écrivent le MÊME profil,
// jamais une copie locale à chaque page. Ça règle deux problèmes d'un coup :
// 1) plus de risque d'oublier de transmettre photoUrl quelque part —
//    DashboardShell le lit lui-même, sans passer par les props des pages ;
// 2) un refresh() après un changement de photo se propage instantanément
//    partout où le hook est utilisé, même sans recharger la page.
type Listener = () => void;

let cachedProfile: DashboardUser | null = null;
let hasFetchedOnce = false;
let inFlight: Promise<DashboardUser | null> | null = null;
const listeners = new Set<Listener>();

function notifyAll() {
  listeners.forEach((listener) => listener());
}

function loadProfile(): Promise<DashboardUser | null> {
  if (inFlight) return inFlight;
  inFlight = fetchUserProfile()
    .then((profile) => {
      cachedProfile = profile;
      hasFetchedOnce = true;
      return profile;
    })
    .finally(() => {
      inFlight = null;
      notifyAll();
    });
  return inFlight;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<DashboardUser | null>(cachedProfile);
  const [loading, setLoading] = useState(!hasFetchedOnce);

  useEffect(() => {
    function handleChange() {
      setProfile(cachedProfile);
      setLoading(false);
    }
    listeners.add(handleChange);

    if (!hasFetchedOnce) {
      loadProfile();
    } else {
      setProfile(cachedProfile);
      setLoading(false);
    }

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  // À appeler après updateUserProfile (nouvelle photo, nom, etc.) — force un
  // nouveau fetch et notifie tous les composants abonnés (toutes les
  // Sidebar/TopBar montées actuellement, sur toute page ouverte).
  async function refresh() {
    setLoading(true);
    await loadProfile();
  }

  return { profile, loading, refresh };
}