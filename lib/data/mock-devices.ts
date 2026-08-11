import type { ConnectedDevice } from "@/lib/types";

// Sessions actives fictives pour Paramètres > Sécurité — l'appareil courant
// (Chrome Android, ici) n'a pas de bouton "Déconnecter" : on ne coupe jamais
// sa propre session depuis cette liste, seulement les autres.
export const mockConnectedDevices: ConnectedDevice[] = [
  {
    id: "device_1",
    label: "Chrome sur Android",
    location: "Abidjan, Côte d'Ivoire",
    lastActiveAt: "2026-08-11",
    current: true,
  },
  {
    id: "device_2",
    label: "Safari sur iPhone",
    location: "Abidjan, Côte d'Ivoire",
    lastActiveAt: "2026-08-08",
    current: false,
  },
  {
    id: "device_3",
    label: "Chrome sur Windows",
    location: "Dakar, Sénégal",
    lastActiveAt: "2026-07-22",
    current: false,
  },
];
