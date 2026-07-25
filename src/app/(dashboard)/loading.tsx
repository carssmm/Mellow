import { SkeletonCard } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-80 bg-surface-container-high rounded animate-pulse" />
        <div className="h-4 w-96 bg-surface-container-high rounded animate-pulse" />
      </div>

      {/* 4-metric grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Lower section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
        <div className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <div className="h-5 w-40 bg-surface-container-high rounded animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-10 w-10 rounded-full bg-surface-container-high animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse" />
                <div className="h-3 w-48 bg-surface-container-high rounded animate-pulse" />
              </div>
              <div className="h-5 w-20 bg-surface-container-high rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
