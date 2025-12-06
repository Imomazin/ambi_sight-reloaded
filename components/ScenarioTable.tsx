'use client';

import { useState } from 'react';
import { Scenario } from '@/lib/demoData';

interface ScenarioTableProps {
  scenarios: Scenario[];
  onView?: (scenario: Scenario) => void;
  onDuplicate?: (scenario: Scenario) => void;
  onDelete?: (scenario: Scenario) => void;
}

export default function ScenarioTable({ scenarios, onView, onDuplicate, onDelete }: ScenarioTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || scenario.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const riskBadgeColors = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="bg-navy-700 rounded-xl border border-navy-600 overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-navy-600 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-400"
          />
        </div>
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-200 focus:outline-none focus:border-teal-400"
        >
          <option value="all">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy-800/50">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Scenario
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time Horizon
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Impact
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-600/50">
            {filteredScenarios.map((scenario) => (
              <tr
                key={scenario.id}
                className="hover:bg-navy-600/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-white">{scenario.name}</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-md truncate">
                      {scenario.description}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${riskBadgeColors[scenario.riskLevel]}`}>
                    {scenario.riskLevel}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-300">{scenario.timeHorizon}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4 text-xs">
                    <span className={scenario.multipliers.risk > 1 ? 'text-red-400' : 'text-green-400'}>
                      Risk: {scenario.multipliers.risk > 1 ? '+' : ''}{Math.round((scenario.multipliers.risk - 1) * 100)}%
                    </span>
                    <span className={scenario.multipliers.growth > 1 ? 'text-green-400' : 'text-red-400'}>
                      Growth: {scenario.multipliers.growth > 1 ? '+' : ''}{Math.round((scenario.multipliers.growth - 1) * 100)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView?.(scenario)}
                      className="p-2 text-gray-400 hover:text-teal-400 hover:bg-navy-600 rounded-lg transition-colors"
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDuplicate?.(scenario)}
                      className="p-2 text-gray-400 hover:text-purple-400 hover:bg-navy-600 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      disabled
                      className="p-2 text-gray-500 cursor-not-allowed rounded-lg"
                      title="Delete (disabled)"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredScenarios.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            No scenarios match your search criteria
          </div>
        )}
      </div>
    </div>
  );
}
