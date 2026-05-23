'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAppState } from '@/state/useAppState';

const PHASE_MODULES: Record<number, string[]> = {
  1: ['/market-intel', '/competitive-intel'],
  2: ['/diagnosis', '/analytics'],
  3: ['/strategy', '/tools', '/workspace'],
  4: ['/scenarios', '/advisor', '/ma-analysis'],
  5: ['/portfolio'],
};

interface JourneyBannerProps {
  currentModule: string;
  moduleHref: string;
  phase: number;
  phaseName: string;
  phaseColor: string;
  nextModule?: { name: string; href: string };
  nextPhase?: { number: number; name: string; firstModule: string; firstModuleHref: string };
}

export default function JourneyBanner({
  currentModule,
  moduleHref,
  phase,
  phaseName,
  phaseColor,
  nextModule,
  nextPhase,
}: JourneyBannerProps) {
  const { visitedModules, markModuleVisited, setJourneyStarted } = useAppState();

  useEffect(() => {
    markModuleVisited(moduleHref);
    setJourneyStarted(true);
  }, [moduleHref, markModuleVisited, setJourneyStarted]);

  const phaseModules = PHASE_MODULES[phase] || [];
  const visitedInPhase = phaseModules.filter((m) => visitedModules.includes(m));
  const phaseComplete = visitedInPhase.length === phaseModules.length;

  // Determine the next destination
  let nextHref: string | null = null;
  let nextLabel: string | null = null;

  if (nextModule) {
    nextHref = nextModule.href;
    nextLabel = nextModule.name;
  }
  if (phaseComplete && nextPhase) {
    nextHref = nextPhase.firstModuleHref;
    nextLabel = `Phase ${nextPhase.number}: ${nextPhase.name}`;
  }

  return (
    <div
      className="mb-6 rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${phaseColor}08, ${phaseColor}04, transparent)`,
        borderLeft: `3px solid ${phaseColor}`,
      }}
    >
      <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-3">
        {/* Left: Phase + Module + Progress */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Phase badge */}
          <span
            className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border"
            style={{
              color: phaseColor,
              backgroundColor: `${phaseColor}15`,
              borderColor: `${phaseColor}30`,
            }}
          >
            Phase {phase} &middot; {phaseName}
          </span>

          {/* Module name */}
          <span className="text-sm font-medium text-white">{currentModule}</span>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {phaseModules.map((m) => (
              <div
                key={m}
                className={`w-2 h-2 rounded-full transition-all ${
                  m === moduleHref
                    ? 'scale-125'
                    : ''
                }`}
                style={{
                  backgroundColor: visitedModules.includes(m) ? phaseColor : `${phaseColor}30`,
                  boxShadow: m === moduleHref ? `0 0 6px ${phaseColor}60` : 'none',
                }}
              />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">
              {visitedInPhase.length}/{phaseModules.length}
            </span>
          </div>
        </div>

        {/* Right: Next step */}
        {nextHref && nextLabel && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">
              {phaseComplete ? 'Next Phase' : 'Next Step'}
            </span>
            <Link
              href={nextHref}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:brightness-110"
              style={{
                color: phaseColor,
                backgroundColor: `${phaseColor}12`,
                border: `1px solid ${phaseColor}25`,
              }}
            >
              {nextLabel}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
