import { SectionTitle } from "@/components/ui/SectionTitle";
import { LibraryToolbarSkeleton, SongListItemSkeleton } from "@/components/ui/Skeleton";

// Sans ce fichier, `app/(dashboard)/loading.tsx` (forme du tableau de bord)
// servirait aussi de secours ici — la mauvaise forme le temps du chargement.
// Le titre et le sous-titre sont statiques (jamais dépendants des données) :
// on les affiche tels quels, seul le contenu réel est mis en squelette.
export default function BibliothequeLoading() {
  return (
    <div>
      <div>
        <SectionTitle as="h1" size="lg">
          Ma bibliothèque
        </SectionTitle>
        <p className="mt-2 max-w-xl text-body-md text-ink-muted">
          Toutes vos chansons, à un seul endroit — cherchez, filtrez, ouvrez.
        </p>
      </div>

      <div className="mt-6">
        <LibraryToolbarSkeleton />
        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, index) => (
            <SongListItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
