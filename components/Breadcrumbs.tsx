'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Route metadata for breadcrumbs
const routeMetadata: Record<string, { label: string; icon: string; parent?: string }> = {
  '/': { label: 'Home', icon: '🏠' },
  '/workspace': { label: 'Workspace', icon: '📊', parent: '/' },
  '/tools': { label: 'Strategy Tools', icon: '🧰', parent: '/' },
  '/diagnosis': { label: 'Diagnostic Wizard', icon: '🔍', parent: '/' },
  '/advisor': { label: 'AI Advisor', icon: '🤖', parent: '/' },
  '/pricing': { label: 'Pricing', icon: '💎', parent: '/' },
  '/scenarios': { label: 'Scenarios', icon: '📁', parent: '/workspace' },
  '/portfolio': { label: 'Portfolio', icon: '📈', parent: '/workspace' },
  '/admin': { label: 'Admin Studio', icon: '⚙️', parent: '/' },
};

interface BreadcrumbItem {
  label: string;
  href: string;
  icon: string;
  isLast: boolean;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];
  let currentPath = pathname;

  // Build breadcrumb trail by following parent chain
  while (currentPath) {
    const meta = routeMetadata[currentPath];
    if (meta) {
      crumbs.unshift({
        label: meta.label,
        href: currentPath,
        icon: meta.icon,
        isLast: currentPath === pathname,
      });
      currentPath = meta.parent || '';
    } else {
      break;
    }
  }

  return crumbs;
}

interface BreadcrumbsProps {
  className?: string;
  showIcon?: boolean;
}

export default function Breadcrumbs({ className = '', showIcon = true }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  // Don't show breadcrumbs on home page or if only one item
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {crumb.isLast ? (
              <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                {showIcon && <span className="text-base">{crumb.icon}</span>}
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              >
                {showIcon && <span className="text-base">{crumb.icon}</span>}
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Export route metadata for use in page titles
export { routeMetadata };
