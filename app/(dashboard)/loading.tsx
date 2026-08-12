import {
  CreateSongHeroSkeleton,
  MobileGreetingSkeleton,
  OccasionCardSkeleton,
  PrimaryActionCardSkeleton,
  SongCardMobileSkeleton,
  SongRowSkeleton,
} from "@/components/ui/Skeleton";

// Rendu automatiquement par Next.js pendant que ce segment de route charge —
// même structure que app/(dashboard)/page.tsx (mobile empilé / desktop en
// grille), pour que rien ne saute de forme quand le vrai contenu la remplace.
export default function DashboardLoading() {
  return (
    <>
      <div className="space-y-6 lg:hidden">
        <MobileGreetingSkeleton />
        <PrimaryActionCardSkeleton />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SongCardMobileSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <CreateSongHeroSkeleton />

        <div className="mt-8 flex gap-3.5 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <OccasionCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-card border border-border bg-surface shadow-card">
          <table className="w-full border-collapse">
            <tbody>
              {Array.from({ length: 6 }, (_, index) => (
                <SongRowSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
