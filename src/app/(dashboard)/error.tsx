'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[32px] text-on-error-container">error</span>
      </div>
      <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
        Something went wrong
      </h2>
      <p className="text-body-md text-on-surface-variant max-w-md mb-6">
        We ran into an unexpected issue loading this page. This may be a temporary problem — please try again.
      </p>
      {error.message && (
        <p className="text-body-sm text-on-surface-variant bg-surface-container border border-outline-variant rounded-lg px-4 py-2 mb-6 max-w-md">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="px-6 py-3 bg-[#2B2B2B] text-[#F5F2EC] rounded-xl text-label-lg font-label-lg hover:bg-black transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">refresh</span>
        Try Again
      </button>
    </div>
  );
}
