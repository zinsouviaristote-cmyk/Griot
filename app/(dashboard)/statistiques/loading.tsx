import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  ActivityListSkeleton,
  ReferralCardSkeleton,
  SongListItemSkeleton,
  StatCardSkeleton,
  WeeklyChartCardSkeleton,
} from "@/components/ui/Skeleton";

export default function StatistiquesLoading() {
  return (
    <div>
      <SectionTitle as="h1" size="lg">
        Statistiques
      </SectionTitle>
      <p className="mt-2 max-w-xl text-body-md text-ink-muted">
        Comment vos chansons publiées voyagent, au-delà de vous.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="mt-8">
        <WeeklyChartCardSkeleton />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <SongListItemSkeleton key={index} />
        ))}
      </div>

      <div className="mt-8">
        <ActivityListSkeleton />
      </div>

      <div className="mt-8">
        <ReferralCardSkeleton />
      </div>
    </div>
  );
}
