'use client';

import AppShell from '../../components/AppShell';
import ScenarioCard from '../../components/ScenarioCard';
import DataUploadButton from '../../components/DataUploadButton';
import { useAppState } from '../../state/useAppState';
import { scenarios } from '../../lib/demoData';

export default function ScenariosPage() {
  const { currentScenario, setScenario } = useAppState();

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Scenario Library</h1>
            <p className="text-gray-400 mt-1">
              Explore strategic alternatives and model their impact on your portfolio
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DataUploadButton label="Upload Scenario Data" variant="compact" />
            {currentScenario && (
              <button
                onClick={() => setScenario(null)}
                className="px-4 py-2 bg-navy-700 border border-navy-600 rounded-xl text-sm text-gray-300 hover:text-white hover:border-teal-400/50 transition-colors"
              >
                Clear Active Scenario
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Scenario Banner */}
      {currentScenario && (
        <div className="mb-8 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-sm text-teal-400 font-medium">Active Scenario</span>
                <p className="text-white font-semibold">{currentScenario.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-400">Risk Impact:</span>
                <span
                  className={`ml-2 font-medium ${
                    currentScenario.multipliers.risk > 1 ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {currentScenario.multipliers.risk > 1 ? '+' : ''}
                  {Math.round((currentScenario.multipliers.risk - 1) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-gray-400">Growth Impact:</span>
                <span
                  className={`ml-2 font-medium ${
                    currentScenario.multipliers.growth > 1 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {currentScenario.multipliers.growth > 1 ? '+' : ''}
                  {Math.round((currentScenario.multipliers.growth - 1) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>

      {/* Comparison View Teaser */}
      <div className="mt-8 card border-dashed">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Compare Scenarios</h3>
            <p className="text-sm text-gray-400">
              Select multiple scenarios to view side-by-side KPI comparisons
            </p>
          </div>
          <button
            className="btn-secondary opacity-50 cursor-not-allowed"
            disabled
            title="Coming soon"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </AppShell>
  );
}
