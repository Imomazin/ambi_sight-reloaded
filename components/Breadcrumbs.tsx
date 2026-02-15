'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routeMetadata: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Home' },
  '/workspace': { label: 'Workspace', parent: '/' },
  '/tools': { label: 'Tools', parent: '/' },
  '/diagnosis': { label: 'Diagnosis', parent: '/' },
  '/advisor': { label: 'Advisor', parent: '/' },
  '/pricing': { label: 'Pricing', parent: '/' },
  '/scenarios': { label: 'Scenarios', parent: '/workspace' },
  '/portfolio': { label: 'Portfolio', parent: '/workspace' },
  '/admin': { label: 'Settings', parent: '/' },
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];
  let currentPath = pathname;

  while (currentPath) {
    const meta = routeMetadata[currentPath];
    if (meta) {
      crumbs.unshift({
        label: meta.label,
        href: currentPath,
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

export default function Breadcrumbs({ className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && (
              <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            {crumb.isLast ? (
              <span className="text-[var(--accent)] font-medium text-[13px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-[13px]"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { routeMetadata };
