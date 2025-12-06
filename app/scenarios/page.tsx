'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import PageContainer from '@/components/PageContainer';
import ScenarioTable from '@/components/ScenarioTable';
import { useAppState } from '@/state/useAppState';
import { scenarios, Scenario } from '@/lib/demoData';

export default function ScenariosPage() {
  const { currentScenario, setScenario } = useAppState();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const handleView = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const handleDuplicate = (scenario: Scenario) => {
    alert(`Duplicating "${scenario.name}" - This is a demo placeholder`);
  };

  const handleActivate = (scenario: Scenario) => {
    setScenario(scenario);
    setSelectedScenario(null);
  };

  return (
    <AppShell>
      <PageContainer
        title="Scenarios"
        subtitle="Explore strategic alternatives and model their impact"
        actions={
          currentScenario && (
            <button
              onClick={() => setScenario(null)}
              className="px-4 py-2 bg-navy-700 border border-navy-600 rounded-xl text-sm text-gray-300 hover:text-white hover:border-teal-400/50 transition-colors"
            >
              Clear Active Scenario
            </button>
          )
        }
      >
        {/* Active Scenario Banner */}
        {currentScenario && (
          <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-teal-400 font-medium">Active Scenario</span>
                  <p className="text-white font-semibold">{currentScenario.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Risk: </span>
                  <span className={currentScenario.multipliers.risk > 1 ? 'text-red-400' : 'text-green-400'}>
                    {currentScenario.multipliers.risk > 1 ? '+' : ''}{Math.round((currentScenario.multipliers.risk - 1) * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Growth: </span>
                  <span className={currentScenario.multipliers.growth > 1 ? 'text-green-400' : 'text-red-400'}>
                    {currentScenario.multipliers.growth > 1 ? '+' : ''}{Math.round((currentScenario.multipliers.growth - 1) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Main Content - Table */}
          <div className={`${selectedScenario ? 'flex-1' : 'w-full'} transition-all duration-300`}>
            <ScenarioTable
              scenarios={scenarios}
              onView={handleView}
              onDuplicate={handleDuplicate}
            />
          </div>

          {/* Side Panel - Scenario Details */}
          {selectedScenario && (
            <div className="w-96 bg-navy-700 rounded-xl border border-navy-600 overflow-hidden animate-slide-in flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b border-navy-600 flex items-center justify-between">
                <h3 className="font-semibold text-white">Scenario Details</h3>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{selectedScenario.name}</h4>
                  <p className="text-sm text-gray-400">{selectedScenario.description}</p>
                </div>

                {/* Risk Level */}
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">Risk Level</span>
                  <span className={`text-sm font-medium ${
                    selectedScenario.riskLevel === 'Low' ? 'text-green-400' :
                    selectedScenario.riskLevel === 'Medium' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedScenario.riskLevel}
                  </span>
                </div>

                {/* Time Horizon */}
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">Time Horizon</span>
                  <span className="text-sm text-white">{selectedScenario.timeHorizon}</span>
                </div>

                {/* Impact Multipliers */}
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-2">Impact Multipliers</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Risk</span>
                      <span className={selectedScenario.multipliers.risk > 1 ? 'text-red-400' : 'text-green-400'}>
                        {selectedScenario.multipliers.risk}x
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Growth</span>
                      <span className={selectedScenario.multipliers.growth > 1 ? 'text-green-400' : 'text-red-400'}>
                        {selectedScenario.multipliers.growth}x
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Volatility</span>
                      <span className="text-gray-300">{selectedScenario.multipliers.volatility}x</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedScenario.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-navy-700 text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Linked Initiatives */}
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">Linked Initiatives</span>
                  <span className="text-sm text-white">{selectedScenario.linkedInitiatives.length} initiatives</span>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="p-4 border-t border-navy-600">
                <button
                  onClick={() => handleActivate(selectedScenario)}
                  className="w-full py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors font-medium"
                >
                  Activate Scenario
                </button>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}
