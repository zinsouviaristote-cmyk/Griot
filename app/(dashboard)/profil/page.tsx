import type { Metadata } from "next";
import { ProfileMenu } from "@/components/dashboard/mobile/ProfileMenu";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { mockUser } from "@/lib/data/mock-dashboard";

export const metadata: Metadata = {
  title: "Profil — Griot",
};

// "Profil" est le seul chemin, sur mobile, vers Paramètres, Statistiques, Mes
// publications et Aide — sans sidebar, ces pages n'existaient sinon que dans le
// menu de l'avatar, que personne ne pense à ouvrir. Le contenu du compte
// (prénom, téléphone, langue…) reste dans Paramètres, jamais dupliqué ici.
export default function ProfilPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        Profil
      </SectionTitle>

      <div className="mt-6">
        <ProfileMenu
          initials={mockUser.initials}
          name={mockUser.firstName}
          email={mockUser.email}
          creditBalance={mockUser.creditBalance}
        />
      </div>
    </div>
  );
}
