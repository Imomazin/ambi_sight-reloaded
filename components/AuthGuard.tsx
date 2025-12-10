'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

// Routes that don't require authentication
const publicRoutes = ['/', '/signin', '/pricing'];

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    );

    if (!isPublicRoute && !currentUser) {
      // Redirect to sign-in with return URL
      router.push(`/signin?returnUrl=${encodeURIComponent(pathname)}`);
    } else {
      setIsChecking(false);
    }
  }, [currentUser, pathname, router]);

  // Show loading while checking auth
  if (isChecking && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!publicRoutes.includes(pathname) && !currentUser) {
    return null;
  }

  return <>{children}</>;
}
