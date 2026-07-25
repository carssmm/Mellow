import { SkeletonTable } from '@/components/ui/skeleton';
import { SkeletonCard } from '@/components/ui/skeleton';

export default function InventoryLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-72 bg-surface-container-high rounded animate-pulse" />
        <div className="h-4 w-96 bg-surface-container-high rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonTable rows={6} />
        </div>
        <div className="lg:col-span-1">
          <SkeletonCard className="min-h-[400px]" />
        </div>
      </div>
    </div>
  );
}
