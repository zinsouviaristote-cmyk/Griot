import { FeedScreenSkeleton } from "@/components/ui/Skeleton";
import { ExplorerHeading } from "@/components/explorer/ExplorerHeading";

// Même positionnement `fixed` que ExplorerPage (voir son commentaire) : calé
// entre les barres du shell, jamais par-dessus — sans quoi ce squelette
// couvrirait la barre basse mobile ou la sidebar le temps du chargement.
export default function ExplorerLoading() {
  return (
    <>
      <ExplorerHeading />
      <div className="fixed left-0 right-0 top-[65px] bottom-[65px] lg:bottom-0 lg:left-[280px] lg:right-0 lg:top-[77px]">
        <FeedScreenSkeleton />
      </div>
    </>
  );
}
