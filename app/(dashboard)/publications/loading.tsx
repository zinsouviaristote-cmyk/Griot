import { SectionTitle } from "@/components/ui/SectionTitle";
import { LikesFeatureCardSkeleton, SongListItemSkeleton } from "@/components/ui/Skeleton";

export default function PublicationsLoading() {
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Mes publications
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Les chansons que vous avez choisi de partager dans Explorer.
      </p>

      <div className="mt-6">
        <LikesFeatureCardSkeleton />
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SongListItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
