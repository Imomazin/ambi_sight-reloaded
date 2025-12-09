'use client';

import React from 'react';
import { useRealTimeKPIs } from '@/hooks/useRealTimeData';
import DataUploadButton from './DataUploadButton';

interface HeroMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export default function DashboardHeader() {
  const { kpis } = useRealTimeKPIs();

  const heroMetrics: HeroMetric[] = [
    {
      label: 'Portfolio Value',
      value: '$847M',
      change: kpis.portfolioHealth - 80,
      trend: kpis.portfolioHealth >= 80 ? 'up' : 'down',
      icon: '💎',
    },
    {
      label: 'Strategic Agility',
      value: `${kpis.strategicAgility}%`,
      change: kpis.strategicAgility - 72,
      trend: kpis.strategicAgility >= 72 ? 'up' : 'down',
      icon: '⚡',
    },
    {
      label: 'Risk Exposure',
      value: `${kpis.riskExposure}%`,
      change: 45 - kpis.riskExposure,
      trend: kpis.riskExposure <= 45 ? 'up' : 'down',
      icon: '🛡️',
    },
    {
      label: 'ROI Trajectory',
      value: `${kpis.roiTrajectory}%`,
      change: kpis.roiTrajectory - 18,
      trend: kpis.roiTrajectory >= 18 ? 'up' : 'down',
      icon: '📈',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/90 via-navy-700/80 to-navy-800/90 border border-navy-600/50 mb-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-teal-500/5 to-transparent rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 p-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Strategy Command Center</h1>
                <p className="text-sm text-gray-400">Real-time strategic intelligence at your fingertips</p>
              </div>
            </div>
          </div>

          {/* Live status */}
          <div className="flex items-center gap-4">
            <DataUploadButton label="Upload Data" variant="compact" />
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-400">All Systems Online</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-medium text-white">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Hero metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {heroMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="group relative bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-5 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/0 to-purple-500/0 group-hover:from-teal-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{metric.icon}</span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    metric.trend === 'up'
                      ? 'bg-green-500/20 text-green-400'
                      : metric.trend === 'down'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
