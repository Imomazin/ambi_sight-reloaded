'use client';

import { Suspense } from 'react';
import AuthGuard from './AuthGuard';

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
