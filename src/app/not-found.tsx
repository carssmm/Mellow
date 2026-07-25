import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-surface">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-on-surface-variant">search_off</span>
      </div>
      <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2">
        Page Not Found
      </h1>
      <p className="text-body-lg text-on-surface-variant max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Head back to the dashboard to get started.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-[#2B2B2B] text-[#F5F2EC] rounded-xl text-label-lg font-label-lg hover:bg-black transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        Back to Dashboard
      </Link>
    </div>
  );
}
