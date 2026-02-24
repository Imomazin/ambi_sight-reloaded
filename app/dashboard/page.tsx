'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useProjectState, getStepLabel, WORKFLOW_STEPS } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';
import {
  strategicHealth,
  boardMetrics,
  executiveBriefings,
  marketPulse,
  initiatives,
  competitors,
  kpis,
  riskCategories,
  insights,
} from '@/lib/demoData';

// ---------------------------------------------------------------------------
// Sparkline renderer
// ---------------------------------------------------------------------------
const renderSparkline = (data: number[], color: string) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
    )
    .join(' ');
  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatSpend = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

const statusColor = (s: string) => {
  switch (s) {
    case 'Exceeding':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    case 'On Target':
      return 'text-teal-400 bg-teal-400/10 border-teal-400/30';
    case 'At Risk':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'Below Target':
      return 'text-red-400 bg-red-400/10 border-red-400/30';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
};

const statusSparkColor = (s: string) => {
  switch (s) {
    case 'Exceeding':
      return '#34d399';
    case 'On Target':
      return '#2dd4bf';
    case 'At Risk':
      return '#fbbf24';
    case 'Below Target':
      return '#f87171';
    default:
      return '#9ca3af';
  }
};

const riskBandColor = (r: string) => {
  switch (r) {
    case 'Low':
      return 'text-emerald-400 bg-emerald-400/10';
    case 'Medium':
      return 'text-amber-400 bg-amber-400/10';
    case 'High':
      return 'text-orange-400 bg-orange-400/10';
    case 'Critical':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

const initiativeStatusColor = (s: string) => {
  switch (s) {
    case 'On Track':
      return 'text-emerald-400 bg-emerald-400/10';
    case 'At Risk':
      return 'text-amber-400 bg-amber-400/10';
    case 'Delayed':
      return 'text-red-400 bg-red-400/10';
    case 'Completed':
      return 'text-teal-400 bg-teal-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

const priorityColor = (p: string) => {
  switch (p) {
    case 'Urgent':
      return 'text-red-400 bg-red-500/15 border-red-500/30';
    case 'High':
      return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    case 'Medium':
      return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
    case 'Low':
      return 'text-gray-400 bg-gray-500/15 border-gray-500/30';
    default:
      return 'text-gray-400 bg-gray-500/15 border-gray-500/30';
  }
};

const threatColor = (t: string) => {
  switch (t) {
    case 'Critical':
      return 'text-red-400 bg-red-500/15';
    case 'High':
      return 'text-orange-400 bg-orange-500/15';
    case 'Medium':
      return 'text-amber-400 bg-amber-500/15';
    case 'Low':
      return 'text-emerald-400 bg-emerald-500/15';
    default:
      return 'text-gray-400 bg-gray-500/15';
  }
};

const dimensionBarColor = (score: number, benchmark: number) => {
  if (score >= benchmark + 10) return 'bg-teal-400';
  if (score >= benchmark) return 'bg-teal-500/80';
  if (score >= benchmark - 5) return 'bg-amber-400';
  return 'bg-red-400';
};

const trendIcon = (trend: 'up' | 'down' | 'stable') => {
  if (trend === 'up')
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
        <path d="M7 17l5-5 5 5" />
      </svg>
    );
  if (trend === 'down')
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
        <path d="M7 7l5 5 5-5" />
      </svg>
    );
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500">
      <path d="M5 12h14" />
    </svg>
  );
};

// Navigation modules for the quick nav grid
const navModules = [
  {
    title: 'Competitive Intel',
    href: '/competitive-intel',
    description: 'Track competitor moves, threats, and market positioning',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20M2 12h20" />
      </svg>
    ),
    color: 'from-red-500/20 to-orange-500/10 border-red-500/20',
  },
  {
    title: 'Market Intel',
    href: '/market-intel',
    description: 'Monitor trends, disruptions, and market signals',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 4-10" />
      </svg>
    ),
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
  },
  {
    title: 'M&A Analysis',
    href: '/ma-analysis',
    description: 'Evaluate targets, synergies, and deal pipeline',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="8" height="10" rx="1" />
        <rect x="14" y="7" width="8" height="10" rx="1" />
        <path d="M10 12h4" />
      </svg>
    ),
    color: 'from-purple-500/20 to-violet-500/10 border-purple-500/20',
  },
  {
    title: 'Analytics Hub',
    href: '/analytics',
    description: 'Deep-dive dashboards, benchmarks, and data views',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12a9 9 0 11-6.2-8.56" />
        <path d="M21 3v5h-5" />
      </svg>
    ),
    color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/20',
  },
  {
    title: 'Strategy Tools',
    href: '/tools',
    description: 'Frameworks, models, and strategic planning utilities',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z" />
      </svg>
    ),
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/20',
  },
  {
    title: 'Portfolio',
    href: '/portfolio',
    description: 'Initiative portfolio health, resource allocation',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
      </svg>
    ),
    color: 'from-lime-500/20 to-green-500/10 border-lime-500/20',
  },
];

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function StrategicIntelligenceCockpit() {
  const router = useRouter();
  const { projects, createProject, deleteProject, setActiveProject } = useProjectState();
  const { currentUser } = useAppState();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedBriefing, setExpandedBriefing] = useState<string | null>(null);

  // Project handlers
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const projectId = createProject(newProjectName.trim());
    setNewProjectName('');
    setShowCreateModal(false);
    setActiveProject(projectId);
    router.push('/strategy');
  };

  const handleOpenProject = (projectId: string) => {
    setActiveProject(projectId);
    router.push('/strategy');
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setDeleteConfirm(null);
  };

  const getProgressPercentage = (completedSteps: string[]) => {
    return Math.round((completedSteps.length / WORKFLOW_STEPS.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Sorted competitors by threat
  const topCompetitors = [...competitors]
    .sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (order[a.threatLevel] ?? 4) - (order[b.threatLevel] ?? 4);
    })
    .slice(0, 3);

  return (
    <AppShell>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* ================================================================ */}
        {/* 1. HEADER                                                        */}
        {/* ================================================================ */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Strategic Intelligence Cockpit
              </h1>
              <span className="relative flex h-2.5 w-2.5 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Real-time strategic oversight across all dimensions
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>Last refresh: just now</span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="hidden sm:inline">
              {currentUser?.name ? `Signed in as ${currentUser.name}` : 'Strategy Mode'}
            </span>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. STRATEGIC HEALTH SCORE (Hero)                                 */}
        {/* ================================================================ */}
        <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: big score */}
            <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Strategic Health
              </p>
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Ring SVG */}
                <svg className="absolute inset-0" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={
                      strategicHealth.overallScore >= 70
                        ? '#2dd4bf'
                        : strategicHealth.overallScore >= 50
                        ? '#fbbf24'
                        : '#f87171'
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(strategicHealth.overallScore / 100) * 327} 327`}
                    transform="rotate(-90 60 60)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="text-4xl font-extrabold text-white">
                  {strategicHealth.overallScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {strategicHealth.trend === 'improving' && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                      <path d="M7 17l5-5 5 5" />
                    </svg>
                    <span className="text-emerald-400 text-xs font-medium">Improving</span>
                  </>
                )}
                {strategicHealth.trend === 'stable' && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                      <path d="M5 12h14" />
                    </svg>
                    <span className="text-gray-400 text-xs font-medium">Stable</span>
                  </>
                )}
                {strategicHealth.trend === 'declining' && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
                      <path d="M7 7l5 5 5-5" />
                    </svg>
                    <span className="text-red-400 text-xs font-medium">Declining</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-gray-600 mt-1">
                Updated {strategicHealth.lastUpdated}
              </p>
            </div>

            {/* Right: dimension bars */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {strategicHealth.dimensions.map((dim) => (
                <div
                  key={dim.name}
                  className="bg-[#0a0f1e]/60 border border-[#1e293b]/40 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-300 font-medium truncate pr-2">
                      {dim.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {trendIcon(dim.trend)}
                      <span className="text-xs font-bold text-white">{dim.score}</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div className="relative h-2 bg-[#1e293b]/80 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${dimensionBarColor(
                        dim.score,
                        dim.benchmark
                      )}`}
                      style={{ width: `${dim.score}%` }}
                    />
                    {/* Benchmark marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                      style={{ left: `${dim.benchmark}%` }}
                      title={`Benchmark: ${dim.benchmark}`}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-600">
                      Benchmark: {dim.benchmark}
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        dim.score >= dim.benchmark ? 'text-emerald-500' : 'text-amber-500'
                      }`}
                    >
                      {dim.score >= dim.benchmark
                        ? `+${dim.score - dim.benchmark}`
                        : `${dim.score - dim.benchmark}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. MARKET PULSE STRIP                                            */}
        {/* ================================================================ */}
        <section className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent -mx-1 px-1">
          <div className="flex gap-3 min-w-max pb-1">
            {marketPulse.map((mp) => (
              <div
                key={mp.id}
                className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl px-4 py-3 min-w-[155px] flex-shrink-0"
              >
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 truncate">
                  {mp.name}
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-white">{mp.value}</span>
                  <span className="text-[10px] text-gray-500 mb-0.5">{mp.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {mp.status === 'bullish' && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3">
                      <path d="M7 17l5-5 5 5" />
                    </svg>
                  )}
                  {mp.status === 'bearish' && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3">
                      <path d="M7 7l5 5 5-5" />
                    </svg>
                  )}
                  {mp.status === 'neutral' && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="3">
                      <path d="M5 12h14" />
                    </svg>
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      mp.status === 'bullish'
                        ? 'text-emerald-400'
                        : mp.status === 'bearish'
                        ? 'text-red-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {mp.change > 0 ? '+' : ''}
                    {mp.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. BOARD METRICS GRID                                            */}
        {/* ================================================================ */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Board Metrics
            </h2>
            <span className="text-[10px] text-gray-600">
              {boardMetrics.length} metrics tracked
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {boardMetrics.map((bm) => (
              <div
                key={bm.id}
                className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-4 hover:border-[#2e3f5b]/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[11px] text-gray-500 font-medium leading-tight pr-1">
                    {bm.name}
                  </p>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border whitespace-nowrap ${statusColor(
                      bm.status
                    )}`}
                  >
                    {bm.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-white">{bm.value}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className={`text-xs font-semibold ${
                          bm.change > 0 ? 'text-emerald-400' : bm.change < 0 ? 'text-red-400' : 'text-gray-500'
                        }`}
                      >
                        {bm.change > 0 ? '+' : ''}
                        {bm.change}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {renderSparkline(bm.sparkline, statusSparkColor(bm.status))}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[#1e293b]/40">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-600">Target</span>
                    <span className="text-gray-400 font-medium">{bm.target}</span>
                  </div>
                  <div className="flex justify-between text-[10px] mt-0.5">
                    <span className="text-gray-600">Category</span>
                    <span className="text-gray-500">{bm.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TWO-COLUMN LAYOUT: Briefings + Risk + Competitors                */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Executive Briefings (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 5. EXECUTIVE BRIEFING FEED */}
            <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Executive Briefings
              </h2>
              <div className="space-y-3">
                {executiveBriefings.map((brief) => {
                  const isExpanded = expandedBriefing === brief.id;
                  return (
                    <div
                      key={brief.id}
                      className="bg-[#0a0f1e]/60 border border-[#1e293b]/40 rounded-lg p-3.5 hover:border-[#2e3f5b]/60 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedBriefing(isExpanded ? null : brief.id)
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border whitespace-nowrap mt-0.5 ${priorityColor(
                            brief.priority
                          )}`}
                        >
                          {brief.priority}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-white truncate">
                              {brief.title}
                            </h3>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`text-gray-600 flex-shrink-0 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {brief.summary}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                            <span>{brief.source}</span>
                            <span>{brief.date}</span>
                            <span className="text-gray-700">|</span>
                            <span className="text-purple-400/70">{brief.category}</span>
                          </div>
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#1e293b]/40">
                              <p className="text-xs text-gray-500 mb-2">
                                <span className="text-gray-400 font-medium">Impact:</span>{' '}
                                {brief.impact}
                              </p>
                              <p className="text-xs italic text-teal-400/80">
                                <span className="not-italic font-medium text-teal-400">
                                  Recommendation:
                                </span>{' '}
                                {brief.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. KEY INITIATIVES TABLE */}
            <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Key Initiatives
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="text-left pb-3 pr-3 font-medium">Initiative</th>
                      <th className="text-left pb-3 pr-3 font-medium hidden sm:table-cell">Owner</th>
                      <th className="text-left pb-3 pr-3 font-medium hidden md:table-cell">Portfolio</th>
                      <th className="text-center pb-3 pr-3 font-medium">Risk</th>
                      <th className="text-center pb-3 pr-3 font-medium">Confidence</th>
                      <th className="text-center pb-3 pr-3 font-medium hidden lg:table-cell">Status</th>
                      <th className="text-right pb-3 font-medium">Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/30">
                    {initiatives.map((init) => (
                      <tr
                        key={init.id}
                        className="hover:bg-[#1e293b]/20 transition-colors"
                      >
                        <td className="py-2.5 pr-3">
                          <span className="text-white font-medium">{init.name}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-gray-400 hidden sm:table-cell">
                          {init.owner}
                        </td>
                        <td className="py-2.5 pr-3 text-gray-500 hidden md:table-cell">
                          {init.portfolio}
                        </td>
                        <td className="py-2.5 pr-3 text-center">
                          <span
                            className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${riskBandColor(
                              init.riskBand
                            )}`}
                          >
                            {init.riskBand}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-[#1e293b]/80 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  init.confidence >= 80
                                    ? 'bg-emerald-400'
                                    : init.confidence >= 60
                                    ? 'bg-amber-400'
                                    : 'bg-red-400'
                                }`}
                                style={{ width: `${init.confidence}%` }}
                              />
                            </div>
                            <span className="text-gray-300 font-medium w-7 text-right">
                              {init.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-center hidden lg:table-cell">
                          <span
                            className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${initiativeStatusColor(
                              init.status
                            )}`}
                          >
                            {init.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-gray-300 font-medium whitespace-nowrap">
                          {formatSpend(init.spend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Risk + Competitors */}
          <div className="space-y-6">
            {/* 7. RISK LANDSCAPE */}
            <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Risk Landscape
              </h2>
              <div className="space-y-3">
                {riskCategories.map((rc) => (
                  <div key={rc.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-300">{rc.name}</span>
                      <div className="flex items-center gap-2">
                        {rc.trend === 'improving' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                            <path d="M17 7l-5 5-5-5" />
                          </svg>
                        )}
                        {rc.trend === 'worsening' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
                            <path d="M7 17l5-5 5 5" />
                          </svg>
                        )}
                        {rc.trend === 'stable' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5">
                            <path d="M5 12h14" />
                          </svg>
                        )}
                        <span className="text-xs font-bold text-white w-6 text-right">
                          {rc.score}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-[#1e293b]/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          rc.score >= 50
                            ? 'bg-red-400'
                            : rc.score >= 35
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${rc.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. COMPETITIVE SNAPSHOT */}
            <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Competitive Snapshot
                </h2>
                <Link
                  href="/competitive-intel"
                  className="text-[10px] text-teal-400 hover:text-teal-300 transition-colors font-medium"
                >
                  View All &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {topCompetitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-[#0a0f1e]/60 border border-[#1e293b]/40 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-gray-300 flex-shrink-0">
                        {comp.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate">
                            {comp.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${threatColor(
                              comp.threatLevel
                            )}`}
                          >
                            {comp.threatLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Overlap score bar */}
                    <div className="mb-1.5">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-gray-500">Overlap</span>
                        <span className="text-gray-400 font-medium">{comp.overlapScore}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1e293b]/80 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500/70"
                          style={{ width: `${comp.overlapScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">Mkt Share</span>
                      <span className="text-gray-400">{comp.marketShare}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Insights quick strip */}
            <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                AI Insights
              </h2>
              <div className="space-y-2">
                {insights.slice(0, 4).map((ins) => (
                  <div
                    key={ins.id}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span
                      className={`mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                        ins.type === 'success'
                          ? 'bg-emerald-400'
                          : ins.type === 'warning'
                          ? 'bg-amber-400'
                          : ins.type === 'info'
                          ? 'bg-blue-400'
                          : 'bg-gray-400'
                      }`}
                    />
                    <p className="text-gray-400 leading-relaxed">{ins.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 9. QUICK NAVIGATION GRID                                         */}
        {/* ================================================================ */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Intelligence Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {navModules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className={`group bg-gradient-to-br ${mod.color} backdrop-blur-sm border rounded-xl p-4 hover:scale-[1.02] transition-all duration-200`}
              >
                <div className="text-gray-400 group-hover:text-white transition-colors mb-2">
                  {mod.icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-0.5">{mod.title}</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {mod.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* 10. PROJECTS SECTION                                             */}
        {/* ================================================================ */}
        <section className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Strategy Projects
              </h2>
              <p className="text-[10px] text-gray-600 mt-0.5">
                {projects.length} projects &middot;{' '}
                {projects.filter((p) => p.completedSteps.length < WORKFLOW_STEPS.length).length} in
                progress
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-400">No projects yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Create your first strategy project to begin the guided workflow
              </p>
              <button
                className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {projects.map((project) => {
                const progress = getProgressPercentage(project.completedSteps);
                const isComplete = progress === 100;
                return (
                  <div
                    key={project.id}
                    className="bg-[#0a0f1e]/60 border border-[#1e293b]/40 rounded-lg overflow-hidden hover:border-[#2e3f5b]/60 transition-colors relative group"
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-3 pt-3">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isComplete
                            ? 'text-emerald-400 bg-emerald-400/10'
                            : 'text-teal-400 bg-teal-400/10'
                        }`}
                      >
                        {isComplete ? 'Completed' : 'In Progress'}
                      </span>
                      <button
                        className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(project.id);
                        }}
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Body */}
                    <div
                      className="px-3 py-2 cursor-pointer"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      <h3 className="text-sm font-semibold text-white truncate">
                        {project.name}
                      </h3>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        Step: {getStepLabel(project.currentStep)} &middot; Updated{' '}
                        {formatDate(project.updatedAt)}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="text-gray-400">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#1e293b]/80 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {/* Step dots */}
                        <div className="flex justify-between mt-1.5 px-0.5">
                          {WORKFLOW_STEPS.map((step) => (
                            <div
                              key={step}
                              className={`w-1.5 h-1.5 rounded-full ${
                                project.completedSteps.includes(step)
                                  ? 'bg-emerald-400'
                                  : project.currentStep === step
                                  ? 'bg-purple-400 shadow-[0_0_4px_rgba(139,92,246,0.5)]'
                                  : 'bg-[#1e293b]'
                              }`}
                              title={getStepLabel(step)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Confidence & Risk */}
                      <div className="flex gap-4 mt-2.5">
                        <div>
                          <p className="text-[9px] text-gray-600">Confidence</p>
                          <p className="text-xs font-bold text-white">
                            {project.confidenceIndex}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-600">Risk</p>
                          <p
                            className={`text-xs font-bold ${
                              project.riskGauge > 60
                                ? 'text-red-400'
                                : project.riskGauge > 40
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {project.riskGauge}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-3 pb-3">
                      <button
                        className="w-full py-1.5 text-[11px] font-medium text-gray-500 border border-[#1e293b]/60 rounded-md hover:text-teal-400 hover:border-teal-400/30 transition-colors"
                        onClick={() => handleOpenProject(project.id)}
                      >
                        {isComplete ? 'View Details' : 'Continue'} &rarr;
                      </button>
                    </div>

                    {/* Delete confirm overlay */}
                    {deleteConfirm === project.id && (
                      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 z-10 rounded-lg">
                        <p className="text-white text-sm font-medium">Delete this project?</p>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 text-xs bg-[#1e293b] border border-[#2e3f5b] text-gray-300 rounded-md hover:bg-[#2e3f5b] transition-colors"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* KPI TICKER (bottom)                                              */}
        {/* ================================================================ */}
        <section className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent -mx-1 px-1 pb-2">
          <div className="flex gap-2 min-w-max">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="flex items-center gap-2 bg-[#0f1629]/60 border border-[#1e293b]/40 rounded-lg px-3 py-2"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    kpi.color === 'teal'
                      ? 'bg-teal-400'
                      : kpi.color === 'amber'
                      ? 'bg-amber-400'
                      : kpi.color === 'magenta'
                      ? 'bg-pink-400'
                      : kpi.color === 'lime'
                      ? 'bg-lime-400'
                      : 'bg-purple-400'
                  }`}
                />
                <span className="text-[10px] text-gray-500 whitespace-nowrap">{kpi.name}</span>
                <span className="text-xs font-bold text-white">{kpi.value}</span>
                <span
                  className={`text-[10px] font-semibold ${
                    kpi.trend === 'up'
                      ? 'text-emerald-400'
                      : kpi.trend === 'down'
                      ? 'text-red-400'
                      : 'text-gray-500'
                  }`}
                >
                  {kpi.change > 0 ? '+' : ''}
                  {kpi.change}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* CREATE PROJECT MODAL                                             */}
        {/* ================================================================ */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="w-full max-w-md bg-[#0f1629] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
                <h2 className="text-lg font-semibold text-white">
                  Create New Strategy Project
                </h2>
                <button
                  className="text-gray-600 hover:text-white transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Modal body */}
              <div className="px-6 py-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., 2024 Growth Strategy"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  autoFocus
                  className="w-full px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-xs text-gray-600 mt-3">
                  You will be guided through 5 steps: Discover, Diagnose, Design, Decide,
                  and Deliver
                </p>
              </div>
              {/* Modal footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1e293b] bg-[#0a0f1e]/50">
                <button
                  className="px-4 py-2 text-sm text-gray-400 border border-[#1e293b] rounded-lg hover:bg-[#1e293b]/50 transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
