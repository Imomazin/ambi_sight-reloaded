'use client';

import React from 'react';
import { useRealTimeKPIs } from '@/hooks/useRealTimeData';

interface HealthSegment {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

export default function PortfolioHealthWidget() {
  const { kpis } = useRealTimeKPIs();

  const segments: HealthSegment[] = [
    { label: 'On Track', value: 68, color: 'text-green-400', bgColor: 'bg-green-500' },
    { label: 'At Risk', value: 22, color: 'text-amber-400', bgColor: 'bg-amber-500' },
    { label: 'Critical', value: 10, color: 'text-red-400', bgColor: 'bg-red-500' },
  ];

  const initiatives = [
    { name: 'Digital Transformation', status: 'on-track', progress: 78, health: 92 },
    { name: 'Market Expansion', status: 'at-risk', progress: 45, health: 64 },
    { name: 'Cloud Migration', status: 'on-track', progress: 89, health: 88 },
    { name: 'AI Integration', status: 'on-track', progress: 34, health: 95 },
    { name: 'Supply Chain Opt.', status: 'critical', progress: 23, health: 42 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'at-risk': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'from-green-500 to-green-400';
    if (health >= 60) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Portfolio Health</h3>
            <p className="text-xs text-gray-400">12 active initiatives</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-teal-400">{kpis.portfolioHealth}%</div>
          <div className="text-xs text-gray-500">Overall Score</div>
        </div>
      </div>

      {/* Health distribution bar */}
      <div className="mb-6">
        <div className="flex h-3 rounded-full overflow-hidden bg-navy-700/50">
          {segments.map((segment, index) => (
            <div
              key={segment.label}
              className={`${segment.bgColor} transition-all duration-500`}
              style={{ width: `${segment.value}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {segments.map(segment => (
            <div key={segment.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${segment.bgColor}`} />
              <span className={`text-xs ${segment.color}`}>{segment.label}: {segment.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Initiative list */}
      <div className="space-y-3">
        {initiatives.map((initiative, index) => (
          <div
            key={initiative.name}
            className="group flex items-center gap-4 p-3 rounded-lg bg-navy-700/30 hover:bg-navy-700/50 transition-colors cursor-pointer"
          >
            {/* Health indicator */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className={`stroke-current ${initiative.health >= 80 ? 'text-green-400' : initiative.health >= 60 ? 'text-amber-400' : 'text-red-400'}`}
                  strokeWidth="3"
                  strokeDasharray={`${initiative.health}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{initiative.health}</span>
              </div>
            </div>

            {/* Initiative details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white truncate group-hover:text-teal-400 transition-colors">
                  {initiative.name}
                </span>
                <span className={`px-2 py-0.5 text-[10px] rounded-full border ${getStatusColor(initiative.status)}`}>
                  {initiative.status.replace('-', ' ')}
                </span>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-navy-600/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getHealthColor(initiative.health)} transition-all duration-500`}
                    style={{ width: `${initiative.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">{initiative.progress}%</span>
              </div>
            </div>

            {/* Arrow */}
            <svg className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>

      {/* View all link */}
      <button className="w-full mt-4 py-2 text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center justify-center gap-2">
        View All Initiatives
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
}
