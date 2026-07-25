import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-container-high rounded",
        variant === 'text' && "h-4 w-full rounded",
        variant === 'card' && "h-32 w-full rounded-xl",
        variant === 'circle' && "h-10 w-10 rounded-full",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="circle" className="h-10 w-10" />
      </div>
      <Skeleton variant="text" className="h-8 w-36" />
      <Skeleton variant="text" className="h-3 w-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
      <Skeleton variant="text" className="h-5 w-40 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-4 w-20" />
            <Skeleton variant="text" className="h-4 w-16" />
            <Skeleton variant="text" className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn("bg-surface-container border border-outline-variant rounded-xl p-6", className)}>
      <Skeleton variant="text" className="h-5 w-48 mb-2" />
      <Skeleton variant="text" className="h-3 w-64 mb-6" />
      <Skeleton variant="card" className="h-[300px]" />
    </div>
  );
}
