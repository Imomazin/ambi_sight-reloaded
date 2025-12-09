'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileNavItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/workspace', label: 'Dashboard', icon: '📊' },
  { href: '/diagnosis', label: 'Diagnose', icon: '🔍' },
  { href: '/tools', label: 'Tools', icon: '🧰' },
  { href: '/advisor', label: 'Advisor', icon: '💬' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--navbar-bg)] backdrop-blur-sm border-t border-[var(--border-color)] safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 min-w-[56px] py-2 rounded-lg transition-colors touch-manipulation ${
                isActive
                  ? 'text-teal-400'
                  : 'text-[var(--text-muted)] active:text-[var(--text-primary)]'
              }`}
            >
              <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 bg-teal-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
