'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileNavItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/workspace', label: 'Dashboard', icon: '📊' },
  { href: '/tools', label: 'Tools', icon: '🧰' },
  { href: '/advisor', label: 'Advisor', icon: '🤖' },
  { href: '/pricing', label: 'Upgrade', icon: '💎' },
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-teal-400'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-teal-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
