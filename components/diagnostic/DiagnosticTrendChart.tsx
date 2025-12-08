'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import type { DiagnosticResult } from '@/lib/database.types';

interface DiagnosticTrendChartProps {
  results: DiagnosticResult[];
  organizationNames: Record<string, string>;
  chartType?: 'line' | 'area';
}

export default function DiagnosticTrendChart({
  results,
  organizationNames,
  chartType = 'area',
}: DiagnosticTrendChartProps) {
  const trendData = useMemo(() => {
    // Sort results by created_at date
    const sorted = [...results].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return sorted.map((result) => ({
      date: new Date(result.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      fullDate: new Date(result.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      name: organizationNames[result.intake_id] || 'Unknown',
      overall: result.scores.overall_health,
      performance: result.scores.performance_score,
      threat: result.scores.threat_score,
      alignment: result.scores.alignment_score,
      readiness: result.scores.readiness_score,
    }));
  }, [results, organizationNames]);

  const averages = useMemo(() => {
    if (trendData.length === 0) return null;

    const sum = trendData.reduce(
      (acc, d) => ({
        overall: acc.overall + d.overall,
        performance: acc.performance + d.performance,
        threat: acc.threat + d.threat,
        alignment: acc.alignment + d.alignment,
        readiness: acc.readiness + d.readiness,
      }),
      { overall: 0, performance: 0, threat: 0, alignment: 0, readiness: 0 }
    );

    return {
      overall: Math.round(sum.overall / trendData.length),
      performance: Math.round(sum.performance / trendData.length),
      threat: Math.round(sum.threat / trendData.length),
      alignment: Math.round(sum.alignment / trendData.length),
      readiness: Math.round(sum.readiness / trendData.length),
    };
  }, [trendData]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = trendData.find((d) => d.date === label);
      return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-1">{data?.fullDate || label}</p>
          <p className="text-xs text-[var(--text-muted)] mb-2">{data?.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (trendData.length === 0) {
    return (
      <div className="card p-6 text-center text-[var(--text-muted)]">
        <p>Complete at least one diagnostic to see trend data.</p>
      </div>
    );
  }

  if (trendData.length === 1) {
    return (
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Single Diagnostic Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-teal-400">{trendData[0].overall}</div>
            <div className="text-xs text-[var(--text-muted)]">Overall Health</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{trendData[0].performance}</div>
            <div className="text-xs text-[var(--text-muted)]">Performance</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-red-400">{trendData[0].threat}</div>
            <div className="text-xs text-[var(--text-muted)]">Threat Level</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-amber-400">{trendData[0].alignment}</div>
            <div className="text-xs text-[var(--text-muted)]">Alignment</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-lime-400">{trendData[0].readiness}</div>
            <div className="text-xs text-[var(--text-muted)]">Readiness</div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)] text-center mt-4">
          Complete more diagnostics to see historical trends.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Diagnostic History Trends</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Score progression over {trendData.length} diagnostics
          </p>
        </div>
        {averages && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--text-muted)]">Avg Health:</span>
            <span className={`font-bold ${
              averages.overall >= 70 ? 'text-lime-400' :
              averages.overall >= 40 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {averages.overall}/100
            </span>
          </div>
        )}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis
                dataKey="date"
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="overall"
                name="Overall Health"
                stroke="#14B8A6"
                fillOpacity={1}
                fill="url(#colorOverall)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="performance"
                name="Performance"
                stroke="#A855F7"
                fillOpacity={1}
                fill="url(#colorPerformance)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="alignment"
                name="Alignment"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="readiness"
                name="Readiness"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', r: 3 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="overall"
                name="Overall Health"
                stroke="#14B8A6"
                strokeWidth={3}
                dot={{ fill: '#14B8A6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="performance"
                name="Performance"
                stroke="#A855F7"
                strokeWidth={2}
                dot={{ fill: '#A855F7', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="alignment"
                name="Alignment"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="readiness"
                name="Readiness"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Score Change Indicators */}
      {trendData.length >= 2 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--border-color)]">
          {[
            { label: 'Overall', key: 'overall', color: 'teal' },
            { label: 'Performance', key: 'performance', color: 'purple' },
            { label: 'Alignment', key: 'alignment', color: 'amber' },
            { label: 'Readiness', key: 'readiness', color: 'lime' },
          ].map(({ label, key, color }) => {
            const first = trendData[0][key as keyof typeof trendData[0]] as number;
            const last = trendData[trendData.length - 1][key as keyof typeof trendData[0]] as number;
            const change = last - first;
            return (
              <div key={key} className="text-center">
                <div className="text-sm text-[var(--text-muted)]">{label} Change</div>
                <div className={`font-bold ${change > 0 ? 'text-lime-400' : change < 0 ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
                  {change > 0 ? '+' : ''}{change} pts
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
