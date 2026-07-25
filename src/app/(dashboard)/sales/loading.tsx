import { Skeleton } from '@/components/ui/skeleton';

export default function SalesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-surface-container-high rounded animate-pulse" />
          <div className="h-4 w-72 bg-surface-container-high rounded animate-pulse" />
        </div>
        <div className="h-10 w-80 bg-surface-container-high rounded-xl animate-pulse" />
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="text" className="h-9 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
