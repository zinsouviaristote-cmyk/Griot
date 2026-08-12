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

// Forme exacte de SongListItem (bibliothèque, publications) — vignette 64px,
// ligne de titre + badge, deux lignes de méta, rangée d'icônes d'action.
export function SongListItemSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-3 shadow-card">
      <div className="flex gap-3">
        <Skeleton className="h-16 w-16 shrink-0 rounded-control" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded-control" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-1.5 h-3 w-16 rounded-full" />
          <Skeleton className="mt-1 h-3 w-40 rounded-full" />
          <div className="mt-2.5 flex items-center gap-3">
            <Skeleton className="h-3 w-8 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Barre de recherche + rangée de filtres, en tête de la bibliothèque.
export function LibraryToolbarSkeleton() {
  return (
    <div>
      <Skeleton className="h-11 w-full rounded-control" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-16 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Carte "Likes reçus" en tête de Mes publications.
export function LikesFeatureCardSkeleton() {
  return (
    <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-10 w-16 rounded-control" />
      <Skeleton className="mt-2 h-3 w-32 rounded-full" />
    </div>
  );
}

// Carte "Écoutes des 7 derniers jours" des statistiques : un titre puis la
// zone du graphique (le trait lui-même n'a pas de forme à esquisser).
export function WeeklyChartCardSkeleton() {
  return (
    <div className="rounded-feature border border-border bg-surface p-6 shadow-card">
      <Skeleton className="h-3 w-40 rounded-full" />
      <Skeleton className="mt-5 h-24 w-full rounded-control" />
      <div className="mt-1.5 flex justify-between">
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className="h-2.5 w-6 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// Liste "Activité récente" des statistiques : icône ronde, ligne de texte,
// horodatage à droite — répété, séparé par un filet comme le vrai composant.
export function ActivityListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-feature border border-border bg-surface px-5 shadow-card">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3 py-3.5">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <Skeleton className="h-3 flex-1 rounded-full" />
          <Skeleton className="h-3 w-14 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Carte "Effet bouche-à-oreille" : label, deux gros chiffres côte à côte, une
// ligne de conclusion.
export function ReferralCardSkeleton() {
  return (
    <div className="rounded-feature border-2 border-border bg-surface p-6 shadow-card sm:p-8">
      <Skeleton className="h-3 w-40 rounded-full" />
      <div className="mt-4 flex items-center gap-4 sm:gap-8">
        <Skeleton className="h-10 w-16 rounded-control" />
        <Skeleton className="h-10 w-16 rounded-control" />
      </div>
      <Skeleton className="mt-5 h-3 w-full max-w-sm rounded-full" />
    </div>
  );
}

// Écran d'Explorer (voir FeedScreen) : pochette carrée centrée, lignes de
// titre, forme d'onde immobile, rangée de contrôles ronds.
export function FeedScreenSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center px-5 pb-2 pt-14 lg:pb-8 lg:pt-10" aria-hidden="true">
      <Skeleton className="h-3 w-20 shrink-0 rounded-full" />
      <div className="flex w-full max-w-[300px] flex-1 flex-col items-center justify-center gap-3 py-2 lg:max-w-xs lg:gap-4">
        <Skeleton className="aspect-square w-full max-w-[210px] rounded-feature lg:max-w-[240px]" />
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-5 w-40 rounded-control" />
        <div className="flex items-center gap-[3px]">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-[3px] shrink-0 rounded-full" />
          ))}
        </div>
      </div>
      <div className="w-full max-w-sm shrink-0 space-y-2.5 lg:max-w-md lg:space-y-4">
        <Skeleton className="h-1 w-full rounded-full" />
        <div className="flex items-center justify-center gap-6">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
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
