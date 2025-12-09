'use client';

import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, height]);

  const areaPath = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M 0,${height} L ${points.join(' L ')} L 100,${height} Z`;
  }, [data, height]);

  return (
    <svg className="w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#gradient-${color})`}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface EnhancedKPICardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  sparklineData: number[];
  icon: string;
  color: 'teal' | 'purple' | 'amber' | 'red' | 'blue' | 'green';
  subtitle?: string;
  target?: number;
  format?: 'number' | 'percentage' | 'currency';
}

const colorMap = {
  teal: { text: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/30', hex: '#2dd4bf' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', hex: '#a855f7' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', hex: '#fbbf24' },
  red: { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', hex: '#f87171' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', hex: '#60a5fa' },
  green: { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', hex: '#4ade80' },
};

export default function EnhancedKPICard({
  title,
  value,
  change,
  trend,
  sparklineData,
  icon,
  color,
  subtitle,
  target,
  format = 'number',
}: EnhancedKPICardProps) {
  const colors = colorMap[color];

  const formattedValue = useMemo(() => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'percentage': return `${value}%`;
      case 'currency': return `$${value.toLocaleString()}`;
      default: return value.toLocaleString();
    }
  }, [value, format]);

  const targetProgress = target ? (Number(value) / target) * 100 : null;

  return (
    <div className="group relative bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-5 hover:border-teal-500/30 transition-all duration-300 overflow-hidden">
      {/* Background glow on hover */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-lg`}>
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">{title}</h4>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Trend indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up'
              ? 'bg-green-500/20 text-green-400'
              : trend === 'down'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {trend === 'up' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend === 'stable' && '→'}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>

        {/* Value */}
        <div className={`text-3xl font-bold ${colors.text} mb-3`}>
          {formattedValue}
        </div>

        {/* Sparkline */}
        <div className="h-10 mb-3">
          <Sparkline data={sparklineData} color={colors.hex} />
        </div>

        {/* Target progress (if provided) */}
        {target && targetProgress !== null && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Target: {format === 'percentage' ? `${target}%` : target}</span>
              <span className={targetProgress >= 100 ? 'text-green-400' : 'text-gray-400'}>
                {targetProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 bg-navy-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  targetProgress >= 100 ? 'bg-green-500' : `bg-gradient-to-r from-${color}-500 to-${color}-400`
                }`}
                style={{ width: `${Math.min(targetProgress, 100)}%`, background: colors.hex }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className={`absolute -top-10 -right-10 w-20 h-20 ${colors.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
}
