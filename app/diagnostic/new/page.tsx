'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import IntakeWizard from '@/components/intake/IntakeWizard';

function IntakeContent() {
  const searchParams = useSearchParams();
  const intakeId = searchParams.get('id') || undefined;

  return <IntakeWizard intakeId={intakeId} />;
}

export default function NewDiagnosticPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)]">Loading...</p>
          </div>
        </div>
      }>
        <IntakeContent />
      </Suspense>
    </AppShell>
  );
}
