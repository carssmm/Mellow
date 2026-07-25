import Link from 'next/link';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant opacity-60">
          {icon}
        </span>
      </div>
      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1.5">
        {title}
      </h3>
      <p className="text-body-md text-on-surface-variant max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-5 py-2.5 bg-[#2B2B2B] text-[#F5F2EC] rounded-xl text-label-lg font-label-lg hover:bg-black transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
