'use client';

import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { useState } from 'react';
import { marketTrends, disruptionSignals, marketPulse, industryBenchmarks } from '@/lib/demoData';

type TrendCategory = 'All' | 'Technology' | 'Regulatory' | 'Economic' | 'Social' | 'Environmental';

const trendCategories: TrendCategory[] = ['All', 'Technology', 'Regulatory', 'Economic', 'Social', 'Environmental'];

const impactColors: Record<string, string> = {
  Transformative: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Significant: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const severityColors: Record<string, { border: string; badge: string; pulse: boolean }> = {
  Critical: { border: 'border-l-red-500', badge: 'bg-red-500/20 text-red-400 border-red-500/30', pulse: true },
  High: { border: 'border-l-amber-500', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', pulse: false },
  Medium: { border: 'border-l-blue-500', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', pulse: false },
  Low: { border: 'border-l-gray-500', badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', pulse: false },
};

const statusColors: Record<string, { text: string; bg: string }> = {
  bullish: { text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  bearish: { text: 'text-red-400', bg: 'bg-red-500/10' },
  neutral: { text: 'text-gray-400', bg: 'bg-gray-500/10' },
};

const velocityConfig: Record<string, { color: string; arrow: string; bg: string }> = {
  Accelerating: { color: 'text-emerald-400', arrow: '\u2191', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  Steady: { color: 'text-blue-400', arrow: '\u2192', bg: 'bg-blue-500/15 border-blue-500/30' },
  Decelerating: { color: 'text-red-400', arrow: '\u2193', bg: 'bg-red-500/15 border-red-500/30' },
};

export default function MarketIntelPage() {
  const [activeCategory, setActiveCategory] = useState<TrendCategory>('All');

  const filteredTrends = activeCategory === 'All'
    ? marketTrends
    : marketTrends.filter((t) => t.category === activeCategory);

  const benchmarkCategories = Array.from(new Set(industryBenchmarks.map((b) => b.category)));

  return (
    <AppShell>
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Market Intelligence Hub
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 text-teal-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                </span>
                AI-Powered
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Continuous market monitoring, trend analysis, and disruption detection
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
        </div>

        {/* ========== MARKET PULSE STRIP ========== */}
        <div className="w-full overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-3 min-w-max">
            {marketPulse.map((indicator) => {
              const status = statusColors[indicator.status];
              const isPositive = indicator.change >= 0;
              return (
                <div
                  key={indicator.id}
                  className={`flex-shrink-0 w-52 ${status.bg} backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-4 hover:border-[#334155]/80 transition-all duration-200 group`}
                >
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                    {indicator.name}
                  </p>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${status.text}`}>
                        {indicator.value}
                      </span>
                      <span className="text-xs text-gray-500">{indicator.unit}</span>
                    </div>
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span>{isPositive ? '\u25B2' : '\u25BC'}</span>
                      {Math.abs(indicator.change).toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${indicator.status === 'bullish' ? 'bg-emerald-400' : indicator.status === 'bearish' ? 'bg-red-400' : 'bg-gray-400'}`} />
                    <span className={`text-[10px] uppercase font-semibold tracking-wider ${status.text}`}>
                      {indicator.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== TREND RADAR ========== */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                </svg>
                Trend Radar
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{marketTrends.length} trends being tracked across {trendCategories.length - 1} categories</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                      : 'bg-[#0f1629]/50 border-[#1e293b]/40 text-gray-400 hover:text-gray-300 hover:border-[#334155]/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredTrends.map((trend) => {
              const vel = velocityConfig[trend.velocity];
              return (
                <div
                  key={trend.id}
                  className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6 hover:border-[#334155]/80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group"
                >
                  {/* Impact badge + category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${impactColors[trend.impact]}`}>
                      {trend.impact}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      {trend.category}
                    </span>
                  </div>

                  {/* Name + Description */}
                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-teal-300 transition-colors">
                    {trend.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {trend.description}
                  </p>

                  {/* Confidence bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Confidence</span>
                      <span className="text-xs font-bold text-white">{trend.confidence}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${trend.confidence}%`,
                          background: trend.confidence >= 80
                            ? 'linear-gradient(90deg, #14b8a6, #34d399)'
                            : trend.confidence >= 60
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : 'linear-gradient(90deg, #ef4444, #f87171)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1e293b]/60">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500">Relevance:</span>
                      <span className="text-xs font-bold text-white">{trend.relevance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500">Timeframe:</span>
                      <span className="text-[10px] font-medium text-gray-300">{trend.timeframe}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${vel.bg} ${vel.color}`}>
                      {vel.arrow} {trend.velocity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTrends.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-sm">No trends found for this category.</p>
            </div>
          )}
        </section>

        {/* ========== DISRUPTION SIGNALS ========== */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Disruption Signals
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{disruptionSignals.length} active signals detected</p>
          </div>

          <div className="space-y-3">
            {disruptionSignals.map((signal) => {
              const sev = severityColors[signal.severity];
              return (
                <div
                  key={signal.id}
                  className={`bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-5 hover:border-[#334155]/80 transition-all duration-200 border-l-4 ${sev.border}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Left: severity + signal info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sev.badge}`}>
                          {sev.pulse && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
                            </span>
                          )}
                          {signal.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#1e293b]/80 text-gray-300 border border-[#334155]/40">
                          {signal.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{signal.signal}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{signal.description}</p>
                    </div>

                    {/* Right: source + date */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 whitespace-nowrap">
                        {signal.source}
                      </span>
                      <span className="text-[10px] text-gray-500">{signal.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== INDUSTRY BENCHMARKS ========== */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                <path d="M16 8v8m-8-4v4m4-12v12" /><rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              Industry Benchmarks
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Performance comparison across key metrics</p>
          </div>

          <div className="space-y-6">
            {benchmarkCategories.map((category) => {
              const categoryBenchmarks = industryBenchmarks.filter((b) => b.category === category);
              return (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pl-1">{category}</h3>
                  <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-[#1e293b]/60 bg-[#0a0e1a]/50">
                      <div className="col-span-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Metric</div>
                      <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Us</div>
                      <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Ind. Avg</div>
                      <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Top 25%</div>
                      <div className="col-span-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Position</div>
                    </div>

                    {/* Table rows */}
                    {categoryBenchmarks.map((bm, idx) => {
                      // For "Time to Value" lower is better
                      const lowerIsBetter = bm.metric === 'Time to Value';
                      const aboveAvg = lowerIsBetter
                        ? bm.ourValue <= bm.industryAvg
                        : bm.ourValue >= bm.industryAvg;

                      // Calculate position on a normalized scale (0-100) for the visual bar
                      const allVals = [bm.industryAvg, bm.topQuartile, bm.ourValue];
                      const minVal = Math.min(...allVals) * 0.5;
                      const maxVal = Math.max(...allVals) * 1.2;
                      const range = maxVal - minVal || 1;
                      const normalize = (v: number) => ((v - minVal) / range) * 100;

                      const ourPos = normalize(bm.ourValue);
                      const avgPos = normalize(bm.industryAvg);
                      const topPos = normalize(bm.topQuartile);

                      return (
                        <div
                          key={bm.metric}
                          className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-[#1e293b]/20 transition-colors ${
                            idx < categoryBenchmarks.length - 1 ? 'border-b border-[#1e293b]/30' : ''
                          }`}
                        >
                          <div className="col-span-3 text-sm font-medium text-gray-300">
                            {bm.metric}
                          </div>
                          <div className={`col-span-2 text-center text-sm font-bold ${aboveAvg ? 'text-emerald-400' : 'text-red-400'}`}>
                            {bm.ourValue}{bm.unit}
                          </div>
                          <div className="col-span-2 text-center text-sm text-gray-400">
                            {bm.industryAvg}{bm.unit}
                          </div>
                          <div className="col-span-2 text-center text-sm text-gray-400">
                            {bm.topQuartile}{bm.unit}
                          </div>
                          <div className="col-span-3 flex items-center gap-2">
                            {/* Visual comparison bar */}
                            <div className="flex-1 relative h-2 bg-[#1e293b] rounded-full overflow-visible">
                              {/* Industry avg marker */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-500 rounded-full z-10"
                                style={{ left: `${Math.min(Math.max(avgPos, 2), 98)}%` }}
                                title="Industry Avg"
                              />
                              {/* Top quartile marker */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-purple-400 rounded-full z-10"
                                style={{ left: `${Math.min(Math.max(topPos, 2), 98)}%` }}
                                title="Top Quartile"
                              />
                              {/* Our value dot */}
                              <div
                                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 z-20 ${
                                  aboveAvg ? 'bg-emerald-400 border-emerald-300' : 'bg-red-400 border-red-300'
                                }`}
                                style={{ left: `${Math.min(Math.max(ourPos - 1.5, 0), 96)}%` }}
                                title={`Us: ${bm.ourValue}${bm.unit}`}
                              />
                            </div>
                            {aboveAvg ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-400 flex-shrink-0">
                                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-red-400 flex-shrink-0">
                                <path d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== TAM ANALYSIS ========== */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime-400">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              TAM Analysis
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Total addressable market sizing and growth projections</p>
          </div>

          <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Nested circles visualization */}
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  {/* TAM - outermost */}
                  <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 flex items-center justify-center relative">
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-teal-400 uppercase tracking-widest">TAM</span>
                    {/* SAM */}
                    <div className="w-52 h-52 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/25 flex items-center justify-center relative">
                      <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-purple-400 uppercase tracking-widest">SAM</span>
                      {/* SOM */}
                      <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center relative">
                        <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">SOM</span>
                        <div className="text-center mt-2">
                          <span className="block text-xl md:text-2xl font-black text-amber-300">$840M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data breakdown */}
              <div className="space-y-5">
                {/* TAM */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-400 text-xs font-black">TAM</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Addressable Market</p>
                    <p className="text-2xl font-black text-teal-300">$14B <span className="text-xs font-semibold text-gray-500">by 2027</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">Full market opportunity for AI-powered strategy platforms globally</p>
                  </div>
                </div>

                {/* SAM */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 text-xs font-black">SAM</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Serviceable Addressable Market</p>
                    <p className="text-2xl font-black text-purple-300">$4.2B</p>
                    <p className="text-xs text-gray-400 mt-0.5">Enterprise segment within our geographic and product reach</p>
                  </div>
                </div>

                {/* SOM */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-xs font-black">SOM</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Serviceable Obtainable Market</p>
                    <p className="text-2xl font-black text-amber-300">$840M</p>
                    <p className="text-xs text-gray-400 mt-0.5">Realistic capture target based on current capacity and positioning</p>
                  </div>
                </div>

                {/* Growth rate */}
                <div className="mt-4 p-4 bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Projected Growth Rate</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
                        34% CAGR
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">2024 - 2027</p>
                      <p className="text-xs text-teal-400 font-semibold mt-1">Source: Gartner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== QUICK ACTIONS ========== */}
        <section className="pb-8">
          <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                  Generate Report
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e293b]/80 hover:bg-[#334155]/60 border border-[#334155]/60 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                  Set Alert
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e293b]/80 hover:bg-[#334155]/60 border border-[#334155]/60 hover:border-purple-500/30 text-gray-300 hover:text-purple-300 text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export Data
                </button>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-teal-400 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                Return to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
