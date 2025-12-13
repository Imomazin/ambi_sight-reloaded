'use client';

import type { KPI } from '../lib/demoData';
import { useAppState } from '../state/useAppState';

interface KpiCardProps {
  kpi: KPI;
}

export default function KpiCard({ kpi }: KpiCardProps) {
  const { riskMultiplier, currentScenario } = useAppState();

  // Apply multipliers
  let adjustedValue = kpi.value;
  let adjustedChange = kpi.change;

  if (currentScenario) {
    const isRiskMetric = kpi.id.includes('risk') || kpi.id.includes('volatility');
    const multiplier = isRiskMetric
      ? currentScenario.multipliers.risk
      : currentScenario.multipliers.growth;
    adjustedValue = Math.round(kpi.value * multiplier * 10) / 10;
    adjustedChange = Math.round(kpi.change * multiplier * 10) / 10;
  }

  // Apply admin risk multiplier for risk metrics
  if (kpi.id.includes('risk') || kpi.id.includes('volatility')) {
    adjustedValue = Math.round(adjustedValue * riskMultiplier * 10) / 10;
  }

  const colorClasses = {
    teal: 'kpi-teal',
    amber: 'kpi-amber',
    magenta: 'kpi-magenta',
    lime: 'kpi-lime',
    purple: 'kpi-purple',
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    stable: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
  };

  const getTrendColor = () => {
    const isRiskMetric = kpi.id.includes('risk') || kpi.id.includes('volatility');
    if (kpi.trend === 'stable') return 'text-gray-400';
    if (kpi.trend === 'up') {
      return isRiskMetric ? 'text-red-400' : 'text-green-400';
    }
    return isRiskMetric ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className={`card card-hover ${colorClasses[kpi.color]}`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-gray-400">{kpi.name}</span>
        <span className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          {trendIcons[kpi.trend]}
          {adjustedChange > 0 ? '+' : ''}
          {adjustedChange}%
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        {adjustedValue}
        <span className="text-lg text-gray-400 font-normal">/100</span>
      </div>

      {/* Mini sparkline */}
      <div className="flex items-end gap-1 h-8 mt-4">
        {kpi.timeSeries.slice(-8).map((point, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm bg-${kpi.color}-400/30`}
            style={{
              height: `${(point.value / 100) * 100}%`,
              minHeight: '4px',
            }}
          />
        ))}
      </div>
    </div>
  );
}
