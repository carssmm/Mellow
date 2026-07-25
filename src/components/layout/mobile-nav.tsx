'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: 'dashboard' },
  { label: 'Sales', href: '/sales', icon: 'point_of_sale' },
  { label: 'Inventory', href: '/inventory', icon: 'inventory_2' },
  { label: 'Analytics', href: '/analytics', icon: 'bar_chart' },
  { label: 'Calc', href: '/calculators', icon: 'calculate' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] px-2 rounded-lg transition-colors touch-manipulation",
                isActive
                  ? "text-[#D4A359]"
                  : "text-on-surface-variant"
              )}
            >
              <span className={cn(
                "material-symbols-outlined text-[24px]",
                isActive && "font-variation-settings: 'FILL' 1"
              )}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
