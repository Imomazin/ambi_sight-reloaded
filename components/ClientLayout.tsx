'use client';

import { Suspense, useEffect } from 'react';
import AuthGuard from './AuthGuard';
import CommandPalette from './CommandPalette';
import OnboardingTour from './OnboardingTour';
import { useAppState } from '../state/useAppState';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    </div>
  );
}

function ThemeInitializer() {
  const { theme } = useAppState();

  useEffect(() => {
    // Apply theme on mount and when it changes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return null;
}

function GlobalComponents() {
  return (
    <>
      <ThemeInitializer />
      <CommandPalette />
      <OnboardingTour />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GlobalComponents />
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
