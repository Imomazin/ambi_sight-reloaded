'use client';

import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { useState } from 'react';
import { maTargets } from '@/lib/demoData';

// ---------------------------------------------------------------------------
// Stage helpers
// ---------------------------------------------------------------------------
const stageOrder = ['Identified', 'Screening', 'Due Diligence', 'Negotiation', 'Closed'] as const;

const stageBadgeClass: Record<string, string> = {
  Identified: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  Screening: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Due Diligence': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Negotiation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Closed: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const stageDotClass: Record<string, string> = {
  Identified: 'bg-gray-400',
  Screening: 'bg-blue-400',
  'Due Diligence': 'bg-amber-400',
  Negotiation: 'bg-purple-400',
  Closed: 'bg-green-400',
};

// ---------------------------------------------------------------------------
// Helpers to parse dollar strings
// ---------------------------------------------------------------------------
function parseDollar(s: string): number {
  const cleaned = s.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (s.includes('B')) return num * 1_000;
  if (s.includes('M')) return num;
  return num;
}

function formatDollar(millions: number): string {
  if (millions >= 1_000) return `$${(millions / 1_000).toFixed(1)}B`;
  return `$${millions.toFixed(0)}M`;
}

// ---------------------------------------------------------------------------
// Due diligence data
// ---------------------------------------------------------------------------
interface DDItem {
  label: string;
  checked: boolean;
}

interface DDCategory {
  name: string;
  icon: string;
  items: DDItem[];
}

const ddCategories: DDCategory[] = [
  {
    name: 'Financial DD',
    icon: '\u{1F4CA}',
    items: [
      { label: 'Revenue quality & cohort analysis', checked: true },
      { label: 'Customer concentration risk', checked: true },
      { label: 'Unit economics & CAC payback', checked: true },
      { label: 'Cash flow & burn rate review', checked: false },
    ],
  },
  {
    name: 'Technical DD',
    icon: '\u{1F527}',
    items: [
      { label: 'Architecture & scalability review', checked: true },
      { label: 'Tech debt assessment', checked: false },
      { label: 'IP & patent audit', checked: false },
      { label: 'Security posture evaluation', checked: false },
    ],
  },
  {
    name: 'Commercial DD',
    icon: '\u{1F4BC}',
    items: [
      { label: 'Market position & TAM analysis', checked: true },
      { label: 'Customer reference calls', checked: true },
      { label: 'Pipeline quality & conversion', checked: false },
      { label: 'Retention & churn analysis', checked: true },
    ],
  },
  {
    name: 'Legal DD',
    icon: '\u{2696}',
    items: [
      { label: 'Material contracts review', checked: true },
      { label: 'IP ownership verification', checked: true },
      { label: 'Regulatory compliance check', checked: false },
      { label: 'Litigation history review', checked: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MAAnalysisPage() {
  const [expandedTarget, setExpandedTarget] = useState<string | null>(null);

  // Pipeline counts
  const stageCounts = stageOrder.reduce(
    (acc, stage) => {
      acc[stage] = maTargets.filter((t) => t.stage === stage).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Aggregate stats
  const totalPipelineValue = maTargets.reduce((s, t) => s + parseDollar(t.valuation), 0);
  const avgStrategicFit = Math.round(maTargets.reduce((s, t) => s + t.strategicFit, 0) / maTargets.length);
  const totalSynergies = maTargets.reduce((s, t) => s + parseDollar(t.synergies), 0);
  const avgEvToRevenue = (maTargets.reduce((s, t) => s + t.evToRevenue, 0) / maTargets.length).toFixed(1);

  // Strategic fit gauge color
  const fitColor = (v: number) => (v > 80 ? 'bg-green-500' : v > 60 ? 'bg-amber-500' : 'bg-red-500');
  const fitTextColor = (v: number) => (v > 80 ? 'text-green-400' : v > 60 ? 'text-amber-400' : 'text-red-400');

  // Risk score gauge color (inverted)
  const riskColor = (v: number) => (v < 30 ? 'bg-green-500' : v < 50 ? 'bg-amber-500' : 'bg-red-500');
  const riskTextColor = (v: number) => (v < 30 ? 'text-green-400' : v < 50 ? 'text-amber-400' : 'text-red-400');

  // Logo gradients
  const logoGradients = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-green-500 to-emerald-600',
    'from-rose-500 to-red-600',
  ];

  return (
    <AppShell>
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">M&A Analysis Center</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Confidential
              </span>
            </div>
            <p className="text-gray-400 mt-1">
              Strategic acquisition pipeline and due diligence tracking
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      {/* ===== PIPELINE FLOW STRIP ===== */}
      <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Acquisition Pipeline
          </h2>
          <span className="text-sm text-gray-400">
            Total Pipeline Value:{' '}
            <span className="text-white font-semibold">{formatDollar(totalPipelineValue)}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-2">
          {stageOrder.map((stage, idx) => {
            const count = stageCounts[stage];
            const isActive = count > 0;
            return (
              <div key={stage} className="flex items-center gap-1 flex-shrink-0">
                <div
                  className={`flex flex-col items-center px-4 py-3 rounded-lg border transition-all ${
                    isActive
                      ? `${stageBadgeClass[stage]} border-opacity-100`
                      : 'bg-[#1e293b]/30 text-gray-600 border-[#1e293b]/30'
                  }`}
                >
                  <span className="text-xs font-medium whitespace-nowrap">{stage}</span>
                  <span className={`text-xl font-bold mt-1 ${isActive ? '' : 'text-gray-700'}`}>
                    {count}
                  </span>
                </div>
                {idx < stageOrder.length - 1 && (
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== OVERVIEW CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Pipeline Value',
            value: formatDollar(totalPipelineValue),
            sub: `${maTargets.length} targets`,
            color: 'text-cyan-400',
          },
          {
            label: 'Avg Strategic Fit',
            value: `${avgStrategicFit}/100`,
            sub: avgStrategicFit >= 80 ? 'Strong alignment' : 'Moderate alignment',
            color: 'text-green-400',
          },
          {
            label: 'Total Synergy Potential',
            value: `${formatDollar(totalSynergies)}/yr`,
            sub: 'Estimated annual',
            color: 'text-amber-400',
          },
          {
            label: 'Avg EV/Revenue',
            value: `${avgEvToRevenue}x`,
            sub: 'Blended multiple',
            color: 'text-purple-400',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 hover:border-[#334155]/80 transition-colors"
          >
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {card.label}
            </span>
            <div className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</div>
            <span className="text-xs text-gray-500 mt-1 block">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* ===== TARGET DETAIL CARDS ===== */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Target Companies</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {maTargets.map((target, tIdx) => (
            <div
              key={target.id}
              className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 hover:border-[#334155]/80 transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${logoGradients[tIdx % logoGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {target.logo}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">{target.company}</h3>
                    <span className="text-xs text-gray-500">{target.industry}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border ${stageBadgeClass[target.stage]}`}
                >
                  {target.stage}
                </span>
              </div>

              {/* Financial Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Valuation', value: target.valuation },
                  { label: 'Revenue', value: target.revenue },
                  { label: 'EV/Revenue', value: `${target.evToRevenue}x` },
                  { label: 'Employees', value: target.employees },
                ].map((m) => (
                  <div key={m.label} className="bg-[#1e293b]/40 rounded-lg p-2.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                      {m.label}
                    </span>
                    <span className="text-sm font-semibold text-white">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Strategic Fit Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Strategic Fit</span>
                  <span className={`text-xs font-semibold ${fitTextColor(target.strategicFit)}`}>
                    {target.strategicFit}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1e293b]/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${fitColor(target.strategicFit)}`}
                    style={{ width: `${target.strategicFit}%` }}
                  />
                </div>
              </div>

              {/* Risk Score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Risk Score</span>
                  <span className={`text-xs font-semibold ${riskTextColor(target.riskScore)}`}>
                    {target.riskScore}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1e293b]/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${riskColor(target.riskScore)}`}
                    style={{ width: `${target.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Synergies */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-400">Synergy Potential:</span>
                <span className="text-sm font-semibold text-emerald-400">{target.synergies}</span>
              </div>

              {/* Key Metrics Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {target.keyMetrics.map((km) => (
                  <span
                    key={km.label}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#1e293b]/60 text-gray-300 border border-[#334155]/40"
                  >
                    {km.label}: <span className="text-white font-semibold">{km.value}</span>
                  </span>
                ))}
              </div>

              {/* Rationale */}
              <p className="text-xs text-gray-400 leading-relaxed mb-5 italic">
                &ldquo;{target.rationale}&rdquo;
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setExpandedTarget(expandedTarget === target.id ? null : target.id)
                  }
                  className="flex-1 px-4 py-2 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                >
                  {expandedTarget === target.id ? 'Hide Details' : 'View Details'}
                </button>
                <button className="flex-1 px-4 py-2 text-xs font-medium rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                  Update Stage
                </button>
              </div>

              {/* Expanded Details */}
              {expandedTarget === target.id && (
                <div className="mt-5 pt-5 border-t border-[#1e293b]/60">
                  <h4 className="text-sm font-semibold text-white mb-3">Extended Analysis</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#1e293b]/40 rounded-lg p-3">
                      <span className="text-gray-500 block mb-1">Revenue Multiple Range</span>
                      <span className="text-white font-medium">
                        {(target.evToRevenue * 0.85).toFixed(1)}x &ndash;{' '}
                        {(target.evToRevenue * 1.15).toFixed(1)}x
                      </span>
                    </div>
                    <div className="bg-[#1e293b]/40 rounded-lg p-3">
                      <span className="text-gray-500 block mb-1">Implied Bid Range</span>
                      <span className="text-white font-medium">
                        {formatDollar(parseDollar(target.valuation) * 0.9)} &ndash;{' '}
                        {formatDollar(parseDollar(target.valuation) * 1.1)}
                      </span>
                    </div>
                    <div className="bg-[#1e293b]/40 rounded-lg p-3">
                      <span className="text-gray-500 block mb-1">Synergy NPV (5yr)</span>
                      <span className="text-white font-medium">
                        {formatDollar(parseDollar(target.synergies) * 4.2)}
                      </span>
                    </div>
                    <div className="bg-[#1e293b]/40 rounded-lg p-3">
                      <span className="text-gray-500 block mb-1">Integration Risk</span>
                      <span className={`font-medium ${riskTextColor(target.riskScore)}`}>
                        {target.riskScore < 30 ? 'Low' : target.riskScore < 50 ? 'Medium' : 'High'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== STRATEGIC FIT vs RISK MATRIX ===== */}
      <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Strategic Fit vs Risk Matrix</h2>
        <p className="text-xs text-gray-500 mb-6">
          Targets plotted by strategic alignment and risk profile. Hover over circles for details.
        </p>

        <div className="relative w-full aspect-[2/1] min-h-[320px] border border-[#1e293b]/60 rounded-lg overflow-hidden bg-[#0a0f1e]/60">
          {/* Quadrant backgrounds */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Top-left: Prime Targets (low risk, high fit) */}
            <div className="bg-green-500/5 border-r border-b border-[#1e293b]/40 flex items-start justify-start p-3">
              <span className="text-[10px] font-semibold text-green-400/60 uppercase tracking-wider">
                Prime Targets
              </span>
            </div>
            {/* Top-right: High-Risk Bets (high risk, high fit) */}
            <div className="bg-amber-500/5 border-b border-[#1e293b]/40 flex items-start justify-end p-3">
              <span className="text-[10px] font-semibold text-amber-400/60 uppercase tracking-wider">
                High-Risk Bets
              </span>
            </div>
            {/* Bottom-left: Low Priority (low risk, low fit) */}
            <div className="bg-gray-500/5 border-r border-[#1e293b]/40 flex items-end justify-start p-3">
              <span className="text-[10px] font-semibold text-gray-500/60 uppercase tracking-wider">
                Low Priority
              </span>
            </div>
            {/* Bottom-right: Avoid (high risk, low fit) */}
            <div className="bg-red-500/5 flex items-end justify-end p-3">
              <span className="text-[10px] font-semibold text-red-400/60 uppercase tracking-wider">
                Avoid
              </span>
            </div>
          </div>

          {/* Axis labels */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase tracking-wider">
            Risk Score &rarr;
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Strategic Fit &rarr;
          </div>

          {/* Axis scale markers */}
          <div className="absolute bottom-1 left-3 text-[9px] text-gray-600">0</div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 ml-8 text-[9px] text-gray-600">50</div>
          <div className="absolute bottom-1 right-3 text-[9px] text-gray-600">100</div>
          <div className="absolute top-2 left-3 text-[9px] text-gray-600">100</div>
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-[9px] text-gray-600">50</div>
          <div className="absolute bottom-3 left-3 text-[9px] text-gray-600">0</div>

          {/* Center lines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#1e293b]/50" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-[#1e293b]/50" />

          {/* Target circles */}
          {maTargets.map((target, i) => {
            const xPercent = (target.riskScore / 100) * 100;
            const yPercent = ((100 - target.strategicFit) / 100) * 100;
            const circleColors = [
              'bg-cyan-400 shadow-cyan-400/40',
              'bg-purple-400 shadow-purple-400/40',
              'bg-amber-400 shadow-amber-400/40',
              'bg-emerald-400 shadow-emerald-400/40',
              'bg-rose-400 shadow-rose-400/40',
            ];
            return (
              <div
                key={target.id}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full ${circleColors[i % circleColors.length]} shadow-lg flex items-center justify-center text-[11px] font-bold text-[#0a0f1e] cursor-pointer hover:scale-125 transition-transform z-10 group/dot`}
                style={{
                  left: `${Math.max(8, Math.min(92, xPercent))}%`,
                  top: `${Math.max(8, Math.min(92, yPercent))}%`,
                }}
                title={`${target.company}\nStrategic Fit: ${target.strategicFit}\nRisk: ${target.riskScore}`}
              >
                {target.logo}
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-[#334155]/60 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                  <div className="text-white font-semibold">{target.company}</div>
                  <div className="text-gray-400 mt-0.5">
                    Fit: {target.strategicFit} | Risk: {target.riskScore}
                  </div>
                  <div className="text-gray-500">{target.valuation} valuation</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== DUE DILIGENCE CHECKLIST ===== */}
      <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Due Diligence Tracker</h2>
            <p className="text-xs text-gray-500 mt-1">
              Comprehensive diligence checklist across all workstreams
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">
              {ddCategories.reduce((s, c) => s + c.items.filter((i) => i.checked).length, 0)}/
              {ddCategories.reduce((s, c) => s + c.items.length, 0)}
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Items Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ddCategories.map((cat) => {
            const done = cat.items.filter((i) => i.checked).length;
            const total = cat.items.length;
            const pct = Math.round((done / total) * 100);
            return (
              <div key={cat.name} className="bg-[#1e293b]/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-sm font-semibold text-white">{cat.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {done}/{total} complete
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#0f1629]/60 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct === 100
                        ? 'bg-green-500'
                        : pct >= 50
                          ? 'bg-cyan-500'
                          : 'bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {/* Checklist items */}
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                          item.checked
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-[#0f1629]/40 border border-[#334155]/40'
                        }`}
                      >
                        {item.checked && (
                          <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          item.checked ? 'text-gray-400 line-through' : 'text-gray-300'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== VALUATION MODELS TABLE ===== */}
      <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Valuation Comparison Models</h2>
          <p className="text-xs text-gray-500 mt-1">
            Multi-methodology valuation analysis across all targets
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e293b]/60">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Revenue Multiple
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  DCF (Est.)
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Comparable Txns
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Our Bid Range
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Stage
                </th>
              </tr>
            </thead>
            <tbody>
              {maTargets.map((target, tIdx) => {
                const revM = parseDollar(target.revenue);
                const revMultipleVal = formatDollar(revM * target.evToRevenue);
                const dcfVal = formatDollar(revM * target.evToRevenue * 1.12);
                const compTxnVal = formatDollar(revM * target.evToRevenue * 0.95);
                const bidLow = formatDollar(parseDollar(target.valuation) * 0.88);
                const bidHigh = formatDollar(parseDollar(target.valuation) * 1.05);
                return (
                  <tr
                    key={target.id}
                    className="border-b border-[#1e293b]/30 hover:bg-[#1e293b]/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${logoGradients[tIdx % logoGradients.length]} flex items-center justify-center text-white font-bold text-[10px]`}
                        >
                          {target.logo}
                        </div>
                        <div>
                          <span className="text-white font-medium text-sm">{target.company}</span>
                          <span className="text-gray-500 text-[10px] block">{target.industry}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300 font-mono text-xs">
                      {revMultipleVal}
                      <span className="text-gray-500 ml-1">({target.evToRevenue}x)</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300 font-mono text-xs">
                      {dcfVal}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300 font-mono text-xs">
                      {compTxnVal}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-cyan-400 font-semibold text-xs font-mono">
                        {bidLow} &ndash; {bidHigh}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${stageBadgeClass[target.stage]}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${stageDotClass[target.stage]}`} />
                        {target.stage}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#334155]/40">
                <td className="py-3 px-4 text-xs font-semibold text-gray-400">
                  Portfolio Total
                </td>
                <td className="py-3 px-4 text-right text-white font-semibold text-xs font-mono">
                  {formatDollar(
                    maTargets.reduce(
                      (s, t) => s + parseDollar(t.revenue) * t.evToRevenue,
                      0,
                    ),
                  )}
                </td>
                <td className="py-3 px-4 text-right text-white font-semibold text-xs font-mono">
                  {formatDollar(
                    maTargets.reduce(
                      (s, t) => s + parseDollar(t.revenue) * t.evToRevenue * 1.12,
                      0,
                    ),
                  )}
                </td>
                <td className="py-3 px-4 text-right text-white font-semibold text-xs font-mono">
                  {formatDollar(
                    maTargets.reduce(
                      (s, t) => s + parseDollar(t.revenue) * t.evToRevenue * 0.95,
                      0,
                    ),
                  )}
                </td>
                <td className="py-3 px-4 text-right text-cyan-400 font-semibold text-xs font-mono">
                  {formatDollar(totalPipelineValue * 0.88)} &ndash;{' '}
                  {formatDollar(totalPipelineValue * 1.05)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      <div className="text-center pb-8">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider">
          Confidential &mdash; For internal strategic use only &mdash; Lumina S Platform
        </p>
      </div>
    </AppShell>
  );
}
