import type { Metadata } from "next";
import { ProfilPageBody } from "@/components/dashboard/mobile/ProfilPageBody";

export const metadata: Metadata = {
  title: "Profil : Griot",
};

// "Profil" est le seul chemin, sur mobile, vers Paramètres, Statistiques, Mes
// publications et Aide — sans sidebar, ces pages n'existaient sinon que dans le
// menu de l'avatar, que personne ne pense à ouvrir. Le contenu du compte
// (prénom, téléphone…) reste dans Paramètres, jamais dupliqué ici.
export default function ProfilPage() {
  return <ProfilPageBody />;
}
