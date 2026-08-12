import { LoadingScreen } from "@/components/ui/LoadingScreen";

// Filet de sécurité au niveau racine : couvre le premier chargement de
// l'application et toute route sans écran de chargement plus spécifique
// (connexion, design). Le tableau de bord et le tunnel ont chacun le leur,
// mieux adapté à leur contenu (squelette pour le premier, marque pour le second).
export default function RootLoading() {
  return <LoadingScreen />;
}
