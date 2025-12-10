'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

// Routes that don't require authentication (marketing pages)
const publicRoutes = ['/', '/signin', '/pricing'];

// Routes that redirect logged-in users to dashboard
const authRoutes = ['/signin'];

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

    // Check if current route is an auth route (signin/signup)
    const isAuthRoute = authRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    );

    // If user is logged in and on auth route, redirect to dashboard
    if (currentUser && isAuthRoute) {
      router.push('/dashboard');
      return;
    }

    // If route is protected and user is not logged in, redirect to signin
    if (!isPublicRoute && !currentUser) {
      router.push(`/signin?returnUrl=${encodeURIComponent(pathname)}`);
    } else {
      setIsChecking(false);
    }
  }, [currentUser, pathname, router]);

  // Check if public route for conditional rendering
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Show loading while checking auth
  if (isChecking && !isPublicRoute) {
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
  if (!isPublicRoute && !currentUser) {
    return null;
  }

  return <>{children}</>;
}
