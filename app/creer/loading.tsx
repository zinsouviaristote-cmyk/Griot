import { LoadingScreen } from "@/components/ui/LoadingScreen";

// Ouverture du tunnel — parcours à part entière (voir TunnelShell), mérite
// l'écran de chargement à la marque plutôt qu'un squelette de contenu qui n'a
// pas de forme stable ici (l'écran de départ change selon les paramètres d'entrée).
export default function CreerLoading() {
  return <LoadingScreen />;
}
