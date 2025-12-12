'use client';

import { useRouter } from 'next/navigation';
import { useAppState } from '../state/useAppState';
import type { Scenario } from '../lib/demoData';

interface ScenarioCardProps {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const router = useRouter();
  const { setScenario } = useAppState();

  const getRiskColor = (level: Scenario['riskLevel']) => {
    switch (level) {
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const handleOpenInWorkspace = () => {
    setScenario(scenario);
    router.push('/workspace');
  };

  return (
    <div className="card card-hover group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
          {scenario.name}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(
            scenario.riskLevel
          )}`}
        >
          {scenario.riskLevel} Risk
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{scenario.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {scenario.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-navy-600 text-gray-300 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-navy-600">
        <div className="text-xs text-gray-500">
          <span className="block">Time Horizon</span>
          <span className="text-gray-300">{scenario.timeHorizon}</span>
        </div>

        <button
          onClick={handleOpenInWorkspace}
          className="px-4 py-2 text-sm font-medium text-teal-400 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:bg-teal-500/20 transition-colors"
        >
          Open in Workspace →
        </button>
      </div>

      {/* Multiplier indicators */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-navy-600">
        <div className="text-center flex-1">
          <span className="text-xs text-gray-500 block">Risk</span>
          <span className={`text-sm font-medium ${scenario.multipliers.risk > 1 ? 'text-red-400' : 'text-green-400'}`}>
            {scenario.multipliers.risk > 1 ? '+' : ''}{Math.round((scenario.multipliers.risk - 1) * 100)}%
          </span>
        </div>
        <div className="text-center flex-1">
          <span className="text-xs text-gray-500 block">Growth</span>
          <span className={`text-sm font-medium ${scenario.multipliers.growth > 1 ? 'text-green-400' : 'text-red-400'}`}>
            {scenario.multipliers.growth > 1 ? '+' : ''}{Math.round((scenario.multipliers.growth - 1) * 100)}%
          </span>
        </div>
        <div className="text-center flex-1">
          <span className="text-xs text-gray-500 block">Volatility</span>
          <span className={`text-sm font-medium ${scenario.multipliers.volatility > 1 ? 'text-amber-400' : 'text-teal-400'}`}>
            {scenario.multipliers.volatility > 1 ? '+' : ''}{Math.round((scenario.multipliers.volatility - 1) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
