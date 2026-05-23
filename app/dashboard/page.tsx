'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useAppState } from '@/state/useAppState';

// ---------------------------------------------------------------------------
// Journey phase configuration
// ---------------------------------------------------------------------------

interface JourneyModule {
  name: string;
  href: string;
  description: string;
}

interface JourneyPhase {
  id: number;
  name: string;
  tagline: string;
  description: string;
  color: string;
  modules: JourneyModule[];
  estimatedTime: string;
}

const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 1,
    name: 'Discover',
    tagline: 'Know Your Landscape',
    description:
      'Understand the external market forces, competitive dynamics, and industry trends that shape your strategic environment.',
    color: '#10b981',
    modules: [
      { name: 'Market Intelligence', href: '/market-intel', description: 'Track market trends, disruption signals, and industry benchmarks' },
      { name: 'Competitive Intel', href: '/competitive-intel', description: 'Analyze competitors, market share, and competitive positioning' },
    ],
    estimatedTime: '30-45 min',
  },
  {
    id: 2,
    name: 'Diagnose',
    tagline: 'Assess Your Position',
    description:
      "Diagnose your organization's strengths, weaknesses, and strategic health using proven analytical frameworks.",
    color: '#3b82f6',
    modules: [
      { name: 'Diagnostic Wizard', href: '/diagnosis', description: 'Run guided diagnostics on your strategic position' },
      { name: 'Analytics Hub', href: '/analytics', description: 'Deep-dive analytics with scenario building and risk analysis' },
    ],
    estimatedTime: '45-60 min',
  },
  {
    id: 3,
    name: 'Design',
    tagline: 'Craft Your Strategy',
    description:
      'Build your strategic framework using proven methodologies, tools, and collaborative workspaces.',
    color: '#8b5cf6',
    modules: [
      { name: 'Strategy Workflow', href: '/strategy', description: 'Follow the guided 5-step strategy creation process' },
      { name: 'Strategy Tools', href: '/tools', description: "Access frameworks like Porter's 5 Forces, SWOT, and more" },
      { name: 'Workspace', href: '/workspace', description: 'Your strategic workspace with KPIs and initiative tracking' },
    ],
    estimatedTime: '60-90 min',
  },
  {
    id: 4,
    name: 'Decide',
    tagline: 'Choose Your Path',
    description:
      'Evaluate strategic options through scenario planning, AI-powered advisory, and M&A analysis.',
    color: '#f59e0b',
    modules: [
      { name: 'Scenario Planning', href: '/scenarios', description: 'Model different strategic scenarios and their outcomes' },
      { name: 'Strategic Advisor', href: '/advisor', description: 'Get AI-powered strategic recommendations' },
      { name: 'M&A Analysis', href: '/ma-analysis', description: 'Evaluate acquisition targets and merger opportunities' },
    ],
    estimatedTime: '45-60 min',
  },
  {
    id: 5,
    name: 'Deliver',
    tagline: 'Execute & Monitor',
    description:
      'Track execution, monitor portfolio health, and ensure your strategy translates into measurable results.',
    color: '#14b8a6',
    modules: [
      { name: 'Portfolio Tracker', href: '/portfolio', description: 'Monitor all strategic initiatives and their progress' },
    ],
    estimatedTime: '20-30 min',
  },
];

// ---------------------------------------------------------------------------
// Phase icon SVGs
// ---------------------------------------------------------------------------
const PhaseIcon = ({ phase, size = 28 }: { phase: number; size?: number }) => {
  const icons: Record<number, string> = {
    1: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    2: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    3: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    4: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    5: 'M13 10V3L4 14h7v7l9-11h-7z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[phase] || icons[1]} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter();
  const { visitedModules, journeyStarted, setJourneyStarted, setCurrentJourneyPhase } = useAppState();

  // Calculate journey stats
  const allModules = useMemo(() => JOURNEY_PHASES.flatMap((p) => p.modules.map((m) => m.href)), []);
  const totalModules = allModules.length;
  const visitedCount = allModules.filter((m) => visitedModules.includes(m)).length;
  const overallProgress = totalModules > 0 ? Math.round((visitedCount / totalModules) * 100) : 0;

  const phaseStats = useMemo(
    () =>
      JOURNEY_PHASES.map((phase) => {
        const phaseModuleHrefs = phase.modules.map((m) => m.href);
        const visited = phaseModuleHrefs.filter((h) => visitedModules.includes(h)).length;
        return {
          ...phase,
          visited,
          total: phaseModuleHrefs.length,
          complete: visited === phaseModuleHrefs.length,
          progress: phaseModuleHrefs.length > 0 ? visited / phaseModuleHrefs.length : 0,
        };
      }),
    [visitedModules]
  );

  const completedPhases = phaseStats.filter((p) => p.complete).length;

  // Current phase = first incomplete phase
  const currentPhase = useMemo(() => {
    const firstIncomplete = phaseStats.find((p) => !p.complete);
    return firstIncomplete || phaseStats[phaseStats.length - 1];
  }, [phaseStats]);

  // Next recommended module
  const nextRecommended = useMemo(() => {
    for (const phase of phaseStats) {
      for (const mod of phase.modules) {
        if (!visitedModules.includes(mod.href)) return { phase, module: mod };
      }
    }
    return null;
  }, [phaseStats, visitedModules]);

  // Sync journey phase
  useEffect(() => {
    if (currentPhase) setCurrentJourneyPhase(currentPhase.id);
  }, [currentPhase, setCurrentJourneyPhase]);

  // Begin journey handler
  const handleBeginJourney = () => {
    setJourneyStarted(true);
    router.push('/market-intel');
  };

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* ───── HEADER ───── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Command Center</h1>
            <p className="text-sm text-gray-400 mt-1">
              Your strategy journey at a glance — follow the 5 phases from Discovery to Delivery.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10b98115] border border-[#10b98130] rounded-lg">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* ───── JOURNEY PROGRESS MAP ───── */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Strategy Journey</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{overallProgress}% complete</span>
              <div className="w-24 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-purple-500 to-teal-500 transition-all duration-700"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Phase track */}
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {phaseStats.map((phase, idx) => {
              const isCurrent = phase.id === currentPhase.id;
              const isComplete = phase.complete;
              const isFuture = !isComplete && !isCurrent;

              return (
                <div key={phase.id} className="flex items-start flex-1 min-w-[160px]">
                  {/* Phase card */}
                  <div
                    className={`relative flex-1 rounded-xl p-4 border transition-all cursor-pointer group ${
                      isCurrent
                        ? 'border-opacity-50 scale-[1.02]'
                        : isComplete
                        ? 'border-opacity-30 opacity-90'
                        : 'border-opacity-20 opacity-50'
                    }`}
                    style={{
                      borderColor: isCurrent ? phase.color : isComplete ? `${phase.color}40` : 'var(--border-color)',
                      background: isCurrent
                        ? `linear-gradient(135deg, ${phase.color}10, ${phase.color}05)`
                        : 'transparent',
                      boxShadow: isCurrent ? `0 0 24px ${phase.color}12` : 'none',
                    }}
                    onClick={() => {
                      const firstMod = phase.modules[0];
                      if (firstMod) router.push(firstMod.href);
                    }}
                  >
                    {/* Current indicator */}
                    {isCurrent && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap"
                        style={{ backgroundColor: phase.color, color: '#ffffff' }}>
                        You are here
                      </div>
                    )}

                    {/* Phase icon + number */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${phase.color}15`, color: phase.color }}
                      >
                        {isComplete ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <PhaseIcon phase={phase.id} size={20} />
                        )}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: phase.color }}>
                          Phase {phase.id}
                        </div>
                        <div className="text-sm font-semibold text-white">{phase.name}</div>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-[11px] text-gray-500 mb-3">{phase.tagline}</p>

                    {/* Module dots */}
                    <div className="flex items-center gap-1.5">
                      {phase.modules.map((mod) => (
                        <div
                          key={mod.href}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: visitedModules.includes(mod.href) ? phase.color : `${phase.color}25`,
                          }}
                          title={mod.name}
                        />
                      ))}
                      <span className="text-[10px] text-gray-600 ml-1">
                        {phase.visited}/{phase.total}
                      </span>
                    </div>
                  </div>

                  {/* Connector arrow */}
                  {idx < phaseStats.length - 1 && (
                    <div className="flex items-center justify-center w-6 pt-8 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke={isComplete ? phase.color : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={isComplete ? 'opacity-80' : 'opacity-30'}>
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ───── BEGIN JOURNEY CTA (only when not started) ───── */}
        {!journeyStarted && (
          <div className="relative overflow-hidden bg-gradient-to-r from-[#10b98115] via-[#8b5cf615] to-[#14b8a615] border border-[#10b98130] rounded-2xl p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-purple-500/5 to-teal-500/5 animate-pulse" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-500/30 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Begin Your Strategy Journey</h2>
              <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">
                Lumina S guides you through 5 proven phases — from discovering your market landscape to delivering
                measurable results. Each phase builds on the last.
              </p>
              <button
                onClick={handleBeginJourney}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:brightness-110 transition-all hover:scale-105 active:scale-100"
              >
                Start with Phase 1: Discover
              </button>
              <p className="text-[11px] text-gray-600 mt-3">Takes approximately 4-5 hours to complete all phases</p>
            </div>
          </div>
        )}

        {/* ───── CURRENT PHASE SPOTLIGHT + NEXT ACTION ───── */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Current Phase Detail */}
          <div className="lg:col-span-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${currentPhase.color}15`, color: currentPhase.color }}
              >
                <PhaseIcon phase={currentPhase.id} size={22} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentPhase.color }}>
                  Current Phase
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Phase {currentPhase.id}: {currentPhase.name}
                </h3>
              </div>
              <span className="ml-auto text-xs text-gray-500">{currentPhase.estimatedTime}</span>
            </div>

            <p className="text-sm text-gray-400 mb-5">{currentPhase.description}</p>

            {/* Modules list */}
            <div className="space-y-2">
              {currentPhase.modules.map((mod) => {
                const visited = visitedModules.includes(mod.href);
                return (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-all group hover:border-opacity-40"
                    style={{
                      borderColor: visited ? `${currentPhase.color}30` : 'var(--border-color)',
                      backgroundColor: visited ? `${currentPhase.color}05` : 'transparent',
                    }}
                  >
                    {/* Status icon */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: visited ? `${currentPhase.color}20` : 'var(--bg-tertiary)',
                        color: visited ? currentPhase.color : '#64748b',
                      }}
                    >
                      {visited ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:brightness-110 transition-all">{mod.name}</div>
                      <div className="text-xs text-gray-500 truncate">{mod.description}</div>
                    </div>

                    <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Next Recommended Action */}
          <div className="lg:col-span-2 space-y-6">
            {nextRecommended && (
              <div
                className="bg-[var(--bg-card)] border rounded-2xl p-6 relative overflow-hidden"
                style={{ borderColor: `${nextRecommended.phase.color}30` }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
                  style={{ backgroundColor: nextRecommended.phase.color }}
                />
                <div className="relative">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Recommended Next Step
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${nextRecommended.phase.color}15`, color: nextRecommended.phase.color }}
                  >
                    <PhaseIcon phase={nextRecommended.phase.id} size={24} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{nextRecommended.module.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{nextRecommended.module.description}</p>
                  <Link
                    href={nextRecommended.module.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all hover:brightness-110 hover:scale-105 active:scale-100"
                    style={{ backgroundColor: nextRecommended.phase.color, color: '#ffffff' }}
                  >
                    Continue Journey
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {/* Journey Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Phases Done', value: `${completedPhases}/5`, color: '#10b981' },
                { label: 'Modules', value: `${visitedCount}/${totalModules}`, color: '#8b5cf6' },
                { label: 'Progress', value: `${overallProgress}%`, color: '#3b82f6' },
                { label: 'Status', value: completedPhases === 5 ? 'Complete' : 'In Progress', color: '#f59e0b' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3"
                >
                  <div className="text-lg font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───── ALL PHASES QUICK ACCESS ───── */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">All Phases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {phaseStats.map((phase) => (
              <Link
                key={phase.id}
                href={phase.modules[0]?.href || '/dashboard'}
                className="group bg-[var(--bg-card)] border rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{
                  borderColor: phase.complete ? `${phase.color}30` : 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${phase.color}12`, color: phase.color }}
                  >
                    {phase.complete ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{phase.id}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white">{phase.name}</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">{phase.tagline}</p>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${phase.progress * 100}%`, backgroundColor: phase.color }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600">
                    {phase.visited}/{phase.total}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ───── JOURNEY METHODOLOGY ───── */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">The 5D Methodology</h2>
          <p className="text-xs text-gray-500 mb-6 max-w-2xl">
            Lumina S follows the proven 5D strategic framework used by leading consulting firms. Each phase
            builds upon the previous, creating a comprehensive strategy from market insight to execution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {JOURNEY_PHASES.map((phase, idx) => (
              <div key={phase.id} className="relative">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ backgroundColor: `${phase.color}18`, color: phase.color }}
                  >
                    {phase.id}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{phase.name}</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{phase.tagline}</p>
                    <div className="mt-2 space-y-1">
                      {phase.modules.map((m) => (
                        <div key={m.href} className="text-[10px] text-gray-600 flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: phase.color }} />
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Arrow connector on larger screens */}
                {idx < JOURNEY_PHASES.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-4 text-gray-700">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
