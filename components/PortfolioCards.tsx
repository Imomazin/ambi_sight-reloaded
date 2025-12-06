'use client';

import { useState } from 'react';
import { Initiative } from '@/lib/demoData';

interface PortfolioCardsProps {
  initiatives: Initiative[];
  onAddClick?: () => void;
}

export default function PortfolioCards({ initiatives, onAddClick }: PortfolioCardsProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredInitiatives = initiatives.filter((init) => {
    if (filter === 'all') return true;
    return init.riskBand === filter;
  });

  const getRiskColor = (riskBand: string) => {
    switch (riskBand) {
      case 'Low': return 'border-green-500/50 bg-green-500/5';
      case 'Medium': return 'border-amber-500/50 bg-amber-500/5';
      case 'High': return 'border-red-500/50 bg-red-500/5';
      case 'Critical': return 'border-red-600/50 bg-red-600/10';
      default: return 'border-navy-600 bg-navy-700';
    }
  };

  const getRiskBadgeColor = (riskBand: string) => {
    switch (riskBand) {
      case 'Low': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-amber-500/20 text-amber-400';
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Critical': return 'bg-red-600/30 text-red-300';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTimeHorizon = (spend: number) => {
    if (spend < 2000000) return '6-12 months';
    if (spend < 4000000) return '12-18 months';
    return '18-24 months';
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm text-gray-400">Filter by risk:</span>
        {['all', 'Low', 'Medium', 'High', 'Critical'].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === level
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-navy-700 text-gray-400 border border-navy-600 hover:text-white hover:border-navy-500'
            }`}
          >
            {level === 'all' ? 'All' : level}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInitiatives.map((init, index) => (
          <div
            key={init.id}
            className={`
              p-5 rounded-xl border-2 transition-all duration-300
              hover:shadow-lg hover:scale-[1.02] cursor-pointer
              ${getRiskColor(init.riskBand)}
              animate-fade-in
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white truncate">{init.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{init.portfolio}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeColor(init.riskBand)}`}>
                {init.riskBand}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500 block">Value</span>
                <span className="text-lg font-bold text-white">${(init.spend / 1000000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Risk Score</span>
                <span className={`text-lg font-bold ${init.riskScore > 60 ? 'text-red-400' : init.riskScore > 40 ? 'text-amber-400' : 'text-green-400'}`}>
                  {init.riskScore}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Confidence</span>
                <span className={`text-lg font-bold ${init.confidence > 75 ? 'text-green-400' : init.confidence > 60 ? 'text-teal-400' : 'text-amber-400'}`}>
                  {init.confidence}%
                </span>
              </div>
            </div>

            {/* Time Horizon */}
            <div className="flex items-center justify-between pt-4 border-t border-navy-600/50">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getTimeHorizon(init.spend)}
              </div>
              <span className={`text-xs font-medium ${
                init.status === 'On Track' ? 'text-green-400' :
                init.status === 'At Risk' ? 'text-amber-400' :
                init.status === 'Delayed' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {init.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredInitiatives.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No portfolio items match the selected filter
        </div>
      )}
    </div>
  );
}
