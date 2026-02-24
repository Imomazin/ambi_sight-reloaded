'use client';

import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { useState } from 'react';
import { competitors, marketPulse } from '@/lib/demoData';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Competitor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  marketCap: string;
  revenue: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  overlapScore: number;
  strengths: string[];
  weaknesses: string[];
  recentMoves: { date: string; action: string; impact: 'Positive' | 'Negative' | 'Neutral' }[];
  marketShare: number;
  growthRate: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const threatColor = (level: string) => {
  switch (level) {
    case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'High': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'Medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'Low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const threatDot = (level: string) => {
  switch (level) {
    case 'Critical': return 'bg-red-500';
    case 'High': return 'bg-amber-500';
    case 'Medium': return 'bg-blue-500';
    case 'Low': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
};

const impactColor = (impact: string) => {
  switch (impact) {
    case 'Positive': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    case 'Negative': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'Neutral': return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const impactDotColor = (impact: string) => {
  switch (impact) {
    case 'Positive': return 'bg-emerald-400';
    case 'Negative': return 'bg-red-400';
    case 'Neutral': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const logoGradients = [
  'from-cyan-500 to-blue-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-red-600',
  'from-indigo-500 to-violet-600',
];

const barColors = [
  'bg-cyan-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-indigo-500',
];

const threatSeverityOrder: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const recommendedActions: Record<string, string> = {
  Critical: 'Immediate counter-strategy required. Mobilize war-room.',
  High: 'Accelerate differentiation. Monitor weekly.',
  Medium: 'Track quarterly. Build defensive moats.',
  Low: 'Maintain awareness. Opportunistic monitoring.',
};

const keyRisks: Record<string, string> = {
  'comp-1': 'Enterprise account displacement via aggressive pricing',
  'comp-2': 'Direct product overlap with AI-first positioning',
  'comp-3': 'Government contract pipeline competition',
  'comp-4': 'Technology leapfrog via ML model innovation',
  'comp-5': 'Brand-driven enterprise inertia in consulting segment',
};

// Our company metrics
const ourMarketShare = 15.2;
const ourGrowthRate = 32;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type SectionId = 'overview' | 'cards' | 'timeline' | 'positioning' | 'threat';

function SectionNav({ active, onSelect }: { active: SectionId; onSelect: (s: SectionId) => void }) {
  const sections: { id: SectionId; label: string }[] = [
    { id: 'overview', label: 'Market Overview' },
    { id: 'cards', label: 'Competitor Profiles' },
    { id: 'timeline', label: 'Moves Timeline' },
    { id: 'positioning', label: 'Strategic Map' },
    { id: 'threat', label: 'Threat Assessment' },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === s.id
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Market Pulse Strip
// ---------------------------------------------------------------------------

function MarketPulseStrip() {
  return (
    <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Market Pulse &mdash; Live Indicators</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {marketPulse.map((mp) => (
          <div
            key={mp.id}
            className="bg-[#0a0f1e]/60 border border-[#1e293b]/40 rounded-lg p-3 hover:border-cyan-500/30 transition-colors"
          >
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1 truncate">{mp.name}</p>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-white">{mp.value}</span>
              <span
                className={`text-xs font-medium ${
                  mp.status === 'bullish'
                    ? 'text-emerald-400'
                    : mp.status === 'bearish'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
              >
                {mp.change > 0 ? '+' : ''}
                {mp.change}%
              </span>
            </div>
            <div className="mt-1.5 h-1 bg-[#1e293b] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  mp.status === 'bullish'
                    ? 'bg-emerald-500'
                    : mp.status === 'bearish'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
                style={{ width: `${mp.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Market Share Overview
// ---------------------------------------------------------------------------

function MarketShareOverview() {
  const allEntries = [
    ...competitors.map((c, i) => ({
      name: c.name,
      share: c.marketShare,
      color: barColors[i % barColors.length],
      isUs: false,
    })),
    { name: 'Lumina S (Us)', share: ourMarketShare, color: 'bg-cyan-400', isUs: true },
  ].sort((a, b) => b.share - a.share);

  const totalShown = allEntries.reduce((s, e) => s + e.share, 0);
  const tam = '$14.2B';

  return (
    <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Market Share Distribution</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Estimated share of Total Addressable Market &mdash;{' '}
            <span className="text-cyan-400 font-semibold">{tam}</span>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">TAM {tam}</span>
        </div>
      </div>

      <div className="space-y-3">
        {allEntries.map((entry) => (
          <div key={entry.name} className="group">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-sm font-medium ${
                  entry.isUs ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                {entry.name}
                {entry.isUs && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    You
                  </span>
                )}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  entry.isUs ? 'text-cyan-400' : 'text-white'
                }`}
              >
                {entry.share}%
              </span>
            </div>
            <div className="h-3 bg-[#1e293b]/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${entry.color} ${
                  entry.isUs ? 'shadow-[0_0_12px_rgba(34,211,238,0.4)]' : ''
                } group-hover:opacity-90`}
                style={{ width: `${(entry.share / 35) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate bar */}
      <div className="mt-6 pt-4 border-t border-[#1e293b]/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Combined Tracked Market</span>
          <span className="text-xs text-gray-400 tabular-nums">{totalShown.toFixed(1)}% of TAM mapped</span>
        </div>
        <div className="h-2.5 bg-[#1e293b]/60 rounded-full overflow-hidden flex">
          {allEntries.map((entry, i) => (
            <div
              key={i}
              className={`h-full ${entry.color} ${entry.isUs ? 'shadow-[0_0_8px_rgba(34,211,238,0.3)]' : ''}`}
              style={{ width: `${(entry.share / 100) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Competitor Card
// ---------------------------------------------------------------------------

function CompetitorCard({ comp, index }: { comp: Competitor; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const gradient = logoGradients[index % logoGradients.length];

  return (
    <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 hover:border-[#2e3f5b]/80 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
          >
            {comp.logo}
          </div>
          <div>
            <h4 className="text-white font-semibold text-base leading-tight">{comp.name}</h4>
            <p className="text-gray-500 text-xs mt-0.5">{comp.industry}</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${threatColor(
            comp.threatLevel
          )}`}
        >
          {comp.threatLevel}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Market Cap', value: comp.marketCap },
          { label: 'Revenue', value: comp.revenue },
          { label: 'Growth Rate', value: `${comp.growthRate}%` },
          { label: 'Overlap', value: `${comp.overlapScore}%` },
        ].map((m) => (
          <div key={m.label} className="bg-[#0a0f1e]/60 rounded-lg p-2.5 border border-[#1e293b]/30">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{m.label}</p>
            <p className="text-sm font-bold text-white mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Overlap Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">Competitive Overlap</span>
          <span
            className={`text-xs font-bold ${
              comp.overlapScore >= 80
                ? 'text-red-400'
                : comp.overlapScore >= 60
                ? 'text-amber-400'
                : comp.overlapScore >= 40
                ? 'text-blue-400'
                : 'text-emerald-400'
            }`}
          >
            {comp.overlapScore}%
          </span>
        </div>
        <div className="h-2 bg-[#1e293b]/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              comp.overlapScore >= 80
                ? 'bg-gradient-to-r from-red-500 to-red-400'
                : comp.overlapScore >= 60
                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                : comp.overlapScore >= 40
                ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
            }`}
            style={{ width: `${comp.overlapScore}%` }}
          />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Strengths</p>
          <ul className="space-y-1.5">
            {comp.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Weaknesses</p>
          <ul className="space-y-1.5">
            {comp.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Moves */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors mb-2"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Recent Moves ({comp.recentMoves.length})
        </button>
        {expanded && (
          <div className="space-y-2 pl-2 border-l border-[#1e293b]/60">
            {comp.recentMoves.map((move, i) => (
              <div key={i} className="pl-3 py-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${impactDotColor(move.impact)}`} />
                  <span className="text-[10px] text-gray-500 tabular-nums">{move.date}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${impactColor(
                      move.impact
                    )}`}
                  >
                    {move.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-300 ml-3.5">{move.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Competitive Moves Timeline
// ---------------------------------------------------------------------------

function CompetitiveTimeline() {
  const allMoves = competitors
    .flatMap((c) =>
      c.recentMoves.map((m) => ({
        ...m,
        competitorName: c.name,
        competitorLogo: c.logo,
        threatLevel: c.threatLevel,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Competitive Moves Timeline</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            All tracked competitor actions &mdash; sorted by recency
          </p>
        </div>
        <span className="text-xs text-gray-500 tabular-nums">{allMoves.length} events tracked</span>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-[#1e293b] to-transparent" />

        <div className="space-y-1">
          {allMoves.map((move, i) => (
            <div key={i} className="flex items-start gap-4 pl-1 group">
              {/* Dot */}
              <div className="relative z-10 mt-2.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 ${
                    move.impact === 'Negative'
                      ? 'bg-red-500/30 border-red-400'
                      : move.impact === 'Positive'
                      ? 'bg-emerald-500/30 border-emerald-400'
                      : 'bg-gray-500/30 border-gray-400'
                  } group-hover:scale-125 transition-transform`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 bg-[#0a0f1e]/40 border border-[#1e293b]/30 rounded-lg p-3.5 hover:border-[#2e3f5b]/60 transition-colors mb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-gray-500 tabular-nums font-mono">{move.date}</span>
                  <span className="text-[10px] text-gray-600">|</span>
                  <span className={`text-xs font-semibold ${threatColor(move.threatLevel).includes('red') ? 'text-red-400' : threatColor(move.threatLevel).includes('amber') ? 'text-amber-400' : threatColor(move.threatLevel).includes('blue') ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {move.competitorName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${impactColor(
                      move.impact
                    )}`}
                  >
                    {move.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-200">{move.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Strategic Positioning Map (2x2 Matrix)
// ---------------------------------------------------------------------------

function StrategicPositioningMap() {
  const allEntities = [
    ...competitors.map((c, i) => ({
      name: c.name,
      logo: c.logo,
      growthRate: c.growthRate,
      marketShare: c.marketShare,
      gradient: logoGradients[i % logoGradients.length],
      isUs: false,
      threatLevel: c.threatLevel,
    })),
    {
      name: 'Lumina S',
      logo: 'LS',
      growthRate: ourGrowthRate,
      marketShare: ourMarketShare,
      gradient: 'from-cyan-400 to-blue-500',
      isUs: true,
      threatLevel: '' as const,
    },
  ];

  // Normalization
  const maxGrowth = Math.max(...allEntities.map((e) => e.growthRate)) * 1.15;
  const maxShare = Math.max(...allEntities.map((e) => e.marketShare)) * 1.15;

  const getQuadrant = (growthRate: number, marketShare: number) => {
    const highGrowth = growthRate > maxGrowth / 2;
    const highShare = marketShare > maxShare / 2;
    if (highGrowth && highShare) return 'Stars';
    if (highGrowth && !highShare) return 'Question Marks';
    if (!highGrowth && highShare) return 'Cash Cows';
    return 'Dogs';
  };

  return (
    <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Strategic Positioning Map</h3>
        <p className="text-sm text-gray-400 mt-0.5">
          Growth Rate vs. Market Share &mdash; BCG-style quadrant analysis
        </p>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0">
          {/* Grid background */}
          <div className="absolute inset-8 sm:inset-12">
            {/* Quadrant backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-amber-500/[0.03] border-b border-r border-dashed border-[#1e293b]/40 flex items-center justify-center">
                <span className="text-[11px] text-amber-500/40 font-semibold uppercase tracking-widest">Question Marks</span>
              </div>
              <div className="bg-cyan-500/[0.03] border-b border-dashed border-[#1e293b]/40 flex items-center justify-center">
                <span className="text-[11px] text-cyan-500/40 font-semibold uppercase tracking-widest">Stars</span>
              </div>
              <div className="bg-gray-500/[0.03] border-r border-dashed border-[#1e293b]/40 flex items-center justify-center">
                <span className="text-[11px] text-gray-500/30 font-semibold uppercase tracking-widest">Dogs</span>
              </div>
              <div className="bg-emerald-500/[0.03] flex items-center justify-center">
                <span className="text-[11px] text-emerald-500/40 font-semibold uppercase tracking-widest">Cash Cows</span>
              </div>
            </div>

            {/* Entities plotted */}
            {allEntities.map((entity, i) => {
              const xPct = (entity.growthRate / maxGrowth) * 100;
              const yPct = 100 - (entity.marketShare / maxShare) * 100;

              return (
                <div
                  key={i}
                  className="absolute z-10 group"
                  style={{
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Glow ring for us */}
                  {entity.isUs && (
                    <div className="absolute inset-0 -m-2 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDuration: '3s' }} />
                  )}
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${entity.gradient} flex items-center justify-center text-white text-[10px] font-bold shadow-lg border-2 ${
                      entity.isUs ? 'border-cyan-300 shadow-cyan-500/30' : 'border-[#1e293b]'
                    } group-hover:scale-125 transition-transform cursor-default`}
                    title={`${entity.name}: Growth ${entity.growthRate}%, Share ${entity.marketShare}%`}
                  >
                    {entity.logo}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <span className="text-[10px] bg-[#0a0f1e]/95 border border-[#1e293b] rounded px-2 py-1 text-gray-300">
                      {entity.name} &middot; {entity.growthRate}% growth &middot; {entity.marketShare}% share
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="absolute bottom-0 left-8 sm:left-12 right-0 flex items-center justify-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              Growth Rate &rarr; High
            </span>
          </div>
          <div className="absolute top-8 sm:top-12 bottom-0 left-0 flex items-center">
            <span
              className="text-[10px] text-gray-500 uppercase tracking-widest"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Market Share &rarr; High
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[#1e293b]/60">
        {allEntities.map((entity, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${entity.gradient} ${entity.isUs ? 'ring-1 ring-cyan-400' : ''}`} />
            <span className={`text-[11px] ${entity.isUs ? 'text-cyan-400 font-semibold' : 'text-gray-400'}`}>
              {entity.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Threat Assessment Table
// ---------------------------------------------------------------------------

function ThreatAssessmentTable() {
  const sorted = [...competitors].sort(
    (a, b) => (threatSeverityOrder[b.threatLevel] ?? 0) - (threatSeverityOrder[a.threatLevel] ?? 0)
  );

  return (
    <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Threat Assessment Summary</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Competitors ranked by threat severity with recommended actions
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
          <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-xs font-medium text-red-400">{sorted.filter((c) => c.threatLevel === 'Critical' || c.threatLevel === 'High').length} High-Priority Threats</span>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b]/60">
              <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3 pr-4">Rank</th>
              <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3 pr-4">Competitor</th>
              <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3 pr-4">Threat Level</th>
              <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3 pr-4">Overlap %</th>
              <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3 pr-4">Key Risk</th>
              <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider pb-3">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((comp, i) => (
              <tr key={comp.id} className="border-b border-[#1e293b]/30 hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${threatDot(comp.threatLevel)} text-white`}>
                    {i + 1}
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${logoGradients[i % logoGradients.length]} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {comp.logo}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{comp.name}</p>
                      <p className="text-[10px] text-gray-500">{comp.industry}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${threatColor(comp.threatLevel)}`}>
                    {comp.threatLevel}
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#1e293b]/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          comp.overlapScore >= 80 ? 'bg-red-500' : comp.overlapScore >= 60 ? 'bg-amber-500' : comp.overlapScore >= 40 ? 'bg-blue-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${comp.overlapScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-300 tabular-nums font-mono">{comp.overlapScore}%</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <p className="text-xs text-gray-300 max-w-[220px]">{keyRisks[comp.id] ?? 'General competitive pressure'}</p>
                </td>
                <td className="py-3.5">
                  <p className="text-xs text-gray-400 max-w-[240px]">
                    {recommendedActions[comp.threatLevel]}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((comp, i) => (
          <div key={comp.id} className="bg-[#0a0f1e]/40 border border-[#1e293b]/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${threatDot(comp.threatLevel)} text-white`}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{comp.name}</p>
                  <p className="text-[10px] text-gray-500">{comp.industry}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${threatColor(comp.threatLevel)}`}>
                {comp.threatLevel}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Overlap</span>
                <span className="text-gray-300 font-mono">{comp.overlapScore}%</span>
              </div>
              <p className="text-gray-400">
                <span className="text-gray-500">Risk: </span>
                {keyRisks[comp.id] ?? 'General competitive pressure'}
              </p>
              <p className="text-gray-500 text-[11px]">{recommendedActions[comp.threatLevel]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CompetitiveIntelPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');

  return (
    <AppShell>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Competitive Intelligence Center
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Real-time competitive landscape monitoring and analysis
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f1629]/80 border border-[#1e293b]/60">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-400">
                Tracking <span className="text-white font-semibold">{competitors.length}</span> competitors
              </span>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-[#0f1629]/80 border border-[#1e293b]/60 text-sm text-gray-400 hover:text-white hover:border-cyan-500/40 transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Market Pulse */}
        <MarketPulseStrip />

        {/* Section Nav */}
        <SectionNav active={activeSection} onSelect={setActiveSection} />

        {/* Conditional Sections */}
        {(activeSection === 'overview' || activeSection === 'cards') && (
          <>
            {/* Market Share */}
            {activeSection === 'overview' && <MarketShareOverview />}

            {/* Competitor Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Competitor Profiles</h2>
                <span className="text-xs text-gray-500">{competitors.length} tracked entities</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {competitors.map((comp, i) => (
                  <CompetitorCard key={comp.id} comp={comp} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'overview' && (
          <>
            {/* Timeline */}
            <CompetitiveTimeline />

            {/* Positioning Map */}
            <StrategicPositioningMap />

            {/* Threat Assessment */}
            <ThreatAssessmentTable />
          </>
        )}

        {activeSection === 'timeline' && <CompetitiveTimeline />}

        {activeSection === 'positioning' && <StrategicPositioningMap />}

        {activeSection === 'threat' && <ThreatAssessmentTable />}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]/40">
          <p className="text-[11px] text-gray-600">
            Data refreshed every 15 minutes &middot; Sources: Internal CI, Market APIs, Public Filings
          </p>
          <p className="text-[11px] text-gray-600">
            Lumina S &mdash; Competitive Intelligence Module
          </p>
        </div>
      </div>
    </AppShell>
  );
}
