'use client';

import React, { useState, useMemo, useCallback } from 'react';

interface ScenarioVariable {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  default: number;
  current: number;
  unit: string;
  category: 'market' | 'operational' | 'financial' | 'strategic';
  impact: {
    revenue: number; // multiplier per unit change
    risk: number;
    agility: number;
    efficiency: number;
  };
}

interface ScenarioImpact {
  revenue: { value: number; change: number };
  risk: { value: number; change: number };
  agility: { value: number; change: number };
  efficiency: { value: number; change: number };
  overallScore: number;
  recommendation: string;
}

const defaultVariables: ScenarioVariable[] = [
  {
    id: 'market-growth',
    name: 'Market Growth Rate',
    description: 'Expected annual market growth',
    min: -10,
    max: 30,
    default: 8,
    current: 8,
    unit: '%',
    category: 'market',
    impact: { revenue: 0.5, risk: -0.2, agility: 0.1, efficiency: 0 },
  },
  {
    id: 'competition',
    name: 'Competitive Intensity',
    description: 'Level of market competition',
    min: 1,
    max: 10,
    default: 5,
    current: 5,
    unit: '/10',
    category: 'market',
    impact: { revenue: -0.3, risk: 0.4, agility: 0.2, efficiency: -0.1 },
  },
  {
    id: 'digital-investment',
    name: 'Digital Investment',
    description: 'Investment in digital transformation',
    min: 0,
    max: 100,
    default: 40,
    current: 40,
    unit: '%',
    category: 'operational',
    impact: { revenue: 0.2, risk: -0.3, agility: 0.5, efficiency: 0.4 },
  },
  {
    id: 'workforce',
    name: 'Workforce Expansion',
    description: 'Planned headcount change',
    min: -20,
    max: 50,
    default: 10,
    current: 10,
    unit: '%',
    category: 'operational',
    impact: { revenue: 0.3, risk: 0.1, agility: -0.1, efficiency: -0.2 },
  },
  {
    id: 'capex',
    name: 'Capital Expenditure',
    description: 'Annual CAPEX budget',
    min: 50,
    max: 500,
    default: 200,
    current: 200,
    unit: 'M',
    category: 'financial',
    impact: { revenue: 0.15, risk: 0.2, agility: -0.1, efficiency: 0.3 },
  },
  {
    id: 'rd-spend',
    name: 'R&D Spending',
    description: 'Research and development budget',
    min: 5,
    max: 30,
    default: 12,
    current: 12,
    unit: '% rev',
    category: 'financial',
    impact: { revenue: 0.25, risk: -0.1, agility: 0.4, efficiency: 0.2 },
  },
  {
    id: 'market-expansion',
    name: 'Geographic Expansion',
    description: 'New market entries planned',
    min: 0,
    max: 5,
    default: 1,
    current: 1,
    unit: 'markets',
    category: 'strategic',
    impact: { revenue: 0.4, risk: 0.5, agility: -0.2, efficiency: -0.3 },
  },
  {
    id: 'partnerships',
    name: 'Strategic Partnerships',
    description: 'Key partnership initiatives',
    min: 0,
    max: 10,
    default: 3,
    current: 3,
    unit: 'partners',
    category: 'strategic',
    impact: { revenue: 0.2, risk: -0.15, agility: 0.3, efficiency: 0.15 },
  },
];

const categoryColors = {
  market: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: '📊' },
  operational: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '⚙️' },
  financial: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: '💰' },
  strategic: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '🎯' },
};

function calculateImpact(variables: ScenarioVariable[]): ScenarioImpact {
  const baseValues = { revenue: 100, risk: 50, agility: 70, efficiency: 65 };

  let revenue = baseValues.revenue;
  let risk = baseValues.risk;
  let agility = baseValues.agility;
  let efficiency = baseValues.efficiency;

  variables.forEach(v => {
    const change = v.current - v.default;
    const normalizedChange = change / (v.max - v.min) * 10; // Normalize to -5 to 5 range

    revenue += normalizedChange * v.impact.revenue * 5;
    risk += normalizedChange * v.impact.risk * 5;
    agility += normalizedChange * v.impact.agility * 5;
    efficiency += normalizedChange * v.impact.efficiency * 5;
  });

  // Clamp values
  revenue = Math.max(0, Math.min(200, revenue));
  risk = Math.max(0, Math.min(100, risk));
  agility = Math.max(0, Math.min(100, agility));
  efficiency = Math.max(0, Math.min(100, efficiency));

  const overallScore = (revenue * 0.4 + (100 - risk) * 0.25 + agility * 0.2 + efficiency * 0.15);

  let recommendation = '';
  if (overallScore >= 80) {
    recommendation = 'Excellent scenario. Consider implementing with minor risk hedging.';
  } else if (overallScore >= 65) {
    recommendation = 'Solid scenario with balanced risk-reward profile.';
  } else if (overallScore >= 50) {
    recommendation = 'Moderate scenario. Review risk factors before proceeding.';
  } else {
    recommendation = 'High-risk scenario. Significant adjustments recommended.';
  }

  return {
    revenue: { value: Math.round(revenue), change: Math.round(revenue - baseValues.revenue) },
    risk: { value: Math.round(risk), change: Math.round(risk - baseValues.risk) },
    agility: { value: Math.round(agility), change: Math.round(agility - baseValues.agility) },
    efficiency: { value: Math.round(efficiency), change: Math.round(efficiency - baseValues.efficiency) },
    overallScore: Math.round(overallScore),
    recommendation,
  };
}

interface SliderProps {
  variable: ScenarioVariable;
  onChange: (value: number) => void;
}

function VariableSlider({ variable, onChange }: SliderProps) {
  const category = categoryColors[variable.category];
  const percentChange = ((variable.current - variable.default) / variable.default * 100);
  const isChanged = Math.abs(percentChange) > 0.5;

  return (
    <div className={`p-4 rounded-xl ${category.bg} border ${category.border} transition-all`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{category.icon}</span>
          <div>
            <h4 className="text-sm font-medium text-white">{variable.name}</h4>
            <p className="text-xs text-gray-500">{variable.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${category.text}`}>
            {variable.current}{variable.unit}
          </span>
          {isChanged && (
            <span className={`block text-xs ${percentChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-3">
        <input
          type="range"
          min={variable.min}
          max={variable.max}
          value={variable.current}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-navy-600 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, ${
              variable.category === 'market' ? '#3B82F6' :
              variable.category === 'operational' ? '#22C55E' :
              variable.category === 'financial' ? '#F59E0B' : '#A855F7'
            } 0%, ${
              variable.category === 'market' ? '#3B82F6' :
              variable.category === 'operational' ? '#22C55E' :
              variable.category === 'financial' ? '#F59E0B' : '#A855F7'
            } ${((variable.current - variable.min) / (variable.max - variable.min)) * 100}%, #1E293B ${((variable.current - variable.min) / (variable.max - variable.min)) * 100}%, #1E293B 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{variable.min}{variable.unit}</span>
          <span className="text-gray-600">Default: {variable.default}</span>
          <span>{variable.max}{variable.unit}</span>
        </div>
      </div>
    </div>
  );
}

function ImpactGauge({
  label,
  value,
  change,
  color,
  icon,
}: {
  label: string;
  value: number;
  change: number;
  color: string;
  icon: string;
}) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#1E293B"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className="text-lg font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="text-sm text-gray-400 mt-2">{label}</span>
      {change !== 0 && (
        <span className={`text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)} pts
        </span>
      )}
    </div>
  );
}

export default function ScenarioBuilder() {
  const [variables, setVariables] = useState<ScenarioVariable[]>(defaultVariables);
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; variables: ScenarioVariable[] }[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ScenarioVariable['category']>('all');

  const impact = useMemo(() => calculateImpact(variables), [variables]);

  const handleVariableChange = useCallback((id: string, value: number) => {
    setVariables(prev =>
      prev.map(v => (v.id === id ? { ...v, current: value } : v))
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setVariables(prev => prev.map(v => ({ ...v, current: v.default })));
  }, []);

  const saveScenario = useCallback(() => {
    if (!scenarioName.trim()) return;
    setSavedScenarios(prev => [...prev, { name: scenarioName, variables: [...variables] }]);
    setScenarioName('');
  }, [scenarioName, variables]);

  const loadScenario = useCallback((scenario: { name: string; variables: ScenarioVariable[] }) => {
    setVariables(scenario.variables);
  }, []);

  const filteredVariables = activeCategory === 'all'
    ? variables
    : variables.filter(v => v.category === activeCategory);

  return (
    <div className="bg-navy-800/50 border border-navy-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-navy-600 bg-gradient-to-r from-purple-900/20 to-teal-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🎛️</span>
              Interactive Scenario Builder
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Adjust variables to see real-time impact on strategic outcomes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-navy-600 rounded-lg hover:bg-navy-700 transition-colors"
            >
              Reset
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Scenario name..."
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="px-3 py-2 text-sm bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={saveScenario}
                disabled={!scenarioName.trim()}
                className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mt-4">
          {(['all', 'market', 'operational', 'financial', 'strategic'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-700 border border-transparent'
              }`}
            >
              {cat === 'all' ? '🌐 All' : `${categoryColors[cat].icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Variables Panel */}
        <div className="lg:col-span-2 p-6 border-r border-navy-600">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredVariables.map(variable => (
              <VariableSlider
                key={variable.id}
                variable={variable}
                onChange={(value) => handleVariableChange(variable.id, value)}
              />
            ))}
          </div>
        </div>

        {/* Impact Panel */}
        <div className="p-6 bg-navy-900/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span>📈</span> Impact Analysis
          </h3>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 border-2 border-teal-500/30">
              <div>
                <div className="text-4xl font-bold text-white">{impact.overallScore}</div>
                <div className="text-xs text-gray-400">Overall Score</div>
              </div>
            </div>
          </div>

          {/* Impact Gauges */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <ImpactGauge
              label="Revenue"
              value={impact.revenue.value}
              change={impact.revenue.change}
              color="#22C55E"
              icon="💰"
            />
            <ImpactGauge
              label="Risk Level"
              value={impact.risk.value}
              change={impact.risk.change}
              color="#EF4444"
              icon="⚠️"
            />
            <ImpactGauge
              label="Agility"
              value={impact.agility.value}
              change={impact.agility.change}
              color="#3B82F6"
              icon="⚡"
            />
            <ImpactGauge
              label="Efficiency"
              value={impact.efficiency.value}
              change={impact.efficiency.change}
              color="#A855F7"
              icon="🎯"
            />
          </div>

          {/* Recommendation */}
          <div className={`p-4 rounded-xl ${
            impact.overallScore >= 65 ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'
          } border`}>
            <h4 className={`text-sm font-medium ${
              impact.overallScore >= 65 ? 'text-green-400' : 'text-amber-400'
            } mb-1`}>
              AI Recommendation
            </h4>
            <p className="text-xs text-gray-400">{impact.recommendation}</p>
          </div>

          {/* Saved Scenarios */}
          {savedScenarios.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Saved Scenarios</h4>
              <div className="space-y-2">
                {savedScenarios.map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => loadScenario(scenario)}
                    className="w-full text-left px-3 py-2 text-sm bg-navy-700/50 border border-navy-600 rounded-lg text-white hover:bg-navy-600 transition-colors"
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
