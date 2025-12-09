'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import HeatmapGrid from '@/components/HeatmapGrid';
import DataUploadButton from '@/components/DataUploadButton';
import { initiatives, portfolios, owners, horizons } from '@/lib/demoData';

export default function PortfolioPage() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');

  const filteredInitiatives = initiatives.filter((init) => {
    if (selectedPortfolio !== 'all' && init.portfolio !== selectedPortfolio) return false;
    if (selectedOwner !== 'all' && init.owner !== selectedOwner) return false;
    return true;
  });

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio Heatmap</h1>
            <p className="text-gray-400 mt-1">
              Visual matrix of initiatives across key strategic dimensions
            </p>
          </div>
          <DataUploadButton label="Upload Portfolio Data" variant="compact" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Initiative Health Matrix</h2>
              <span className="text-sm text-gray-400">
                {filteredInitiatives.length} of {initiatives.length} initiatives
              </span>
            </div>

            <HeatmapGrid filteredInitiatives={filteredInitiatives} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              {
                label: 'Critical Risk',
                count: filteredInitiatives.filter((i) => i.riskBand === 'Critical').length,
                color: 'red',
              },
              {
                label: 'High Risk',
                count: filteredInitiatives.filter((i) => i.riskBand === 'High').length,
                color: 'amber',
              },
              {
                label: 'On Track',
                count: filteredInitiatives.filter((i) => i.status === 'On Track').length,
                color: 'green',
              },
              {
                label: 'High Confidence',
                count: filteredInitiatives.filter((i) => i.confidence >= 80).length,
                color: 'teal',
              },
            ].map((stat) => (
              <div key={stat.label} className="card">
                <span className="text-sm text-gray-400">{stat.label}</span>
                <div className={`text-2xl font-bold text-${stat.color}-400 mt-1`}>
                  {stat.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Sidebar */}
        <div className="w-72 space-y-6">
          <div className="card">
            <h3 className="text-sm font-medium text-white mb-4">Filters</h3>

            {/* Portfolio Filter */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Portfolio</label>
              <select
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-teal-400"
              >
                <option value="all">All Portfolios</option>
                {portfolios.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Owner</label>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-teal-400"
              >
                <option value="all">All Owners</option>
                {owners.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedPortfolio('all');
                setSelectedOwner('all');
              }}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Dimension Legend */}
          <div className="card">
            <h3 className="text-sm font-medium text-white mb-4">Dimension Guide</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-300 font-medium">Growth</span>
                <p className="text-gray-500 text-xs mt-1">
                  Revenue and market expansion potential
                </p>
              </div>
              <div>
                <span className="text-gray-300 font-medium">Risk</span>
                <p className="text-gray-500 text-xs mt-1">
                  Execution and strategic risk exposure
                </p>
              </div>
              <div>
                <span className="text-gray-300 font-medium">Strategic Fit</span>
                <p className="text-gray-500 text-xs mt-1">
                  Alignment with core strategy objectives
                </p>
              </div>
              <div>
                <span className="text-gray-300 font-medium">Capability Strain</span>
                <p className="text-gray-500 text-xs mt-1">
                  Resource and team capacity pressure
                </p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="card">
            <h3 className="text-sm font-medium text-white mb-4">Export</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-3 bg-navy-800 border border-navy-600 rounded-lg text-sm text-gray-300 hover:text-white hover:border-teal-400/50 transition-colors">
                Export as PNG
              </button>
              <button className="w-full py-2 px-3 bg-navy-800 border border-navy-600 rounded-lg text-sm text-gray-300 hover:text-white hover:border-teal-400/50 transition-colors">
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
