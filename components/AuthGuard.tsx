'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppState } from '../state/useAppState';

// Public routes - accessible to everyone (logged in or not)
const publicRoutes = ['/', '/signin', '/pricing'];

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
    // Check if current route is public
    const isPublicRoute = publicRoutes.includes(pathname);

    // Public routes - accessible to everyone
    if (isPublicRoute) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Protected routes - require authentication
    if (!currentUser) {
      // Not logged in - redirect to landing page (which has login gate)
      router.push('/');
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
