// Squelettes à la forme exacte du contenu attendu — jamais une roue générique.
// `.skeleton` (globals.css) porte déjà le fond + le reflet animé en balayage ;
// ces composants ne font que découper cette texture aux dimensions réelles de
// chaque carte, pour que l'écran ne saute pas quand le vrai contenu arrive.

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-8 w-12 rounded-control" />
    </div>
  );
}

export function OccasionCardSkeleton() {
  return (
    <div className="flex h-40 w-[210px] shrink-0 flex-col justify-between rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-5 w-24 rounded-control" />
        <Skeleton className="mt-2 h-3 w-full rounded-full" />
        <Skeleton className="mt-1.5 h-3 w-4/5 rounded-full" />
      </div>
    </div>
  );
}

export function SongRowSkeleton() {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3.5 pl-5 pr-3">
        <Skeleton className="h-4 w-24 rounded-control" />
        <Skeleton className="mt-1.5 h-3 w-16 rounded-full" />
      </td>
      <td className="px-3 py-3.5">
        <Skeleton className="h-3 w-20 rounded-full" />
      </td>
      <td className="px-3 py-3.5">
        <Skeleton className="h-3 w-24 rounded-full" />
      </td>
      <td className="px-3 py-3.5">
        <Skeleton className="h-3 w-16 rounded-full" />
      </td>
      <td className="px-3 py-3.5">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
      <td className="py-3.5 pl-3 pr-5 text-right">
        <Skeleton className="ml-auto h-6 w-20 rounded-control" />
      </td>
    </tr>
  );
}

export function SongCardMobileSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-28 rounded-control" />
          <Skeleton className="mt-1.5 h-3 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-36 rounded-full" />
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-control" />
      </div>
    </div>
  );
}

export function MobileGreetingSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 rounded-control" />
      <Skeleton className="mt-2 h-3.5 w-32 rounded-full" />
    </div>
  );
}

export function PrimaryActionCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-card border-2 border-border bg-surface p-4 shadow-card">
      <Skeleton className="h-14 w-14 shrink-0 rounded-card" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-40 rounded-control" />
        <Skeleton className="mt-1.5 h-3.5 w-48 rounded-full" />
      </div>
    </div>
  );
}

export function CreateSongHeroSkeleton() {
  return (
    <div className="rounded-feature border border-border bg-surface px-5 py-6 shadow-card sm:px-8 sm:py-8">
      <div className="max-w-2xl">
        <Skeleton className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
        <Skeleton className="mt-4 h-8 w-64 max-w-full rounded-control" />
        <Skeleton className="mt-3 h-4 w-full max-w-md rounded-full" />
        <Skeleton className="mt-1.5 h-4 w-3/4 max-w-sm rounded-full" />
        <Skeleton className="mt-5 h-14 w-full rounded-card" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
