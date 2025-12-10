'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

// ONLY these exact routes don't require authentication
const publicRoutes = ['/signin', '/pricing'];

// The landing page - shown to non-authenticated users, redirects authenticated users
const landingRoute = '/';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if on landing page
    const isLandingPage = pathname === landingRoute;

    // Check if current route is public (signin, pricing)
    const isPublicRoute = publicRoutes.includes(pathname);

    // Landing page logic: show to non-authenticated, redirect authenticated to dashboard
    if (isLandingPage) {
      if (currentUser) {
        router.push('/dashboard');
        return;
      } else {
        // Show landing page to non-authenticated users
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }
    }

    // Public routes (signin, pricing) - accessible to all
    if (isPublicRoute) {
      // If logged in and on signin page, redirect to dashboard
      if (currentUser && pathname === '/signin') {
        router.push('/dashboard');
        return;
      }
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Protected routes - require authentication
    if (!currentUser) {
      // Not logged in - redirect to signin with return URL
      router.push(`/signin?returnUrl=${encodeURIComponent(pathname)}`);
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }

    // User is authenticated and on protected route
    setIsAuthorized(true);
    setIsChecking(false);
  }, [currentUser, pathname, router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
