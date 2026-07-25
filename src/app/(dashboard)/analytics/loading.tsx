import { SkeletonChart, Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-surface-container-high rounded animate-pulse" />
          <div className="h-4 w-96 bg-surface-container-high rounded animate-pulse" />
        </div>
        <div className="h-10 w-80 bg-surface-container-high rounded-xl animate-pulse" />
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-6 w-28" />
          </div>
          <div className="space-y-1">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-6 w-28" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton variant="text" className="h-10 w-48 rounded-xl" />
          <Skeleton variant="text" className="h-10 w-48 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-card-gap">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
        <Skeleton variant="text" className="h-5 w-48 mb-2" />
        <Skeleton variant="text" className="h-3 w-80 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" className="h-8 w-8" />
              <div className="space-y-1">
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-3 w-48" />
              </div>
            </div>
            <Skeleton variant="text" className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
