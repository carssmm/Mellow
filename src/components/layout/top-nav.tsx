'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { signOut } from '@/app/(auth)/actions';

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-outline-variant h-[72px]">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <img
              src="/header.png"
              alt="Mellow Logo"
              className="h-16 w-auto max-h-16 object-contain"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg font-nav-link text-nav-link transition-colors flex items-center gap-2",
                  isActive
                    ? "text-primary border-b-2 border-secondary pb-1 rounded-none bg-transparent"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                )}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Owner Badge & Calendar */}
        <div className="flex items-center gap-3">
          <Link
            href="/analytics"
            title={`Today: ${new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })} — View Date Analytics`}
            className="px-3 py-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors flex items-center gap-2 border border-outline-variant/60"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span className="text-label-sm font-label-sm hidden sm:inline">
              {new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
            </span>
          </Link>
          
          <form action={signOut}>
            <button 
              type="submit"
              className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-primary-container/90 transition-colors"
            >
              <span>Owner</span>
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
