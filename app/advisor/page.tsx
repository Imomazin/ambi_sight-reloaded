'use client';

import React from 'react';

import AppShell from '@/components/AppShell';
import AIAssistant from '@/components/AIAssistant';
import LockedFeature from '@/components/LockedFeature';
import { useAppState } from '@/state/useAppState';
import * as advisorResponses from '@/lib/advisorResponses';

const AdvisorPage: React.FC = () => {
  // keep types relaxed so TS doesn't complain if shapes change
  const appState = (useAppState as any)();
  const AIAssistantAny = AIAssistant as any;
  const LockedFeatureAny = LockedFeature as any;
  const responses = advisorResponses as any;

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Strategy AI Advisor
          </h1>
          <p className="text-sm text-slate-500">
            Use Lumina S to ask focused questions, explore scenarios, and stress-test your
            current strategy.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <section className="space-y-4">
            {/* Cast to any so we don&apos;t fight prop types right now */}
            <AIAssistantAny appState={appState} advisorResponses={responses} />
          </section>

          <aside className="space-y-4">
            {/* Feature gating for future premium capabilities */}
            <LockedFeatureAny featureKey="advisor_scenarios" />
          </aside>
        </main>
      </div>
    </AppShell>
  );
};

export default AdvisorPage;
