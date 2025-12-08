'use client';

import { useState } from 'react';
import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import type { DiagnosticScores, ScenarioAdjustments } from '@/lib/database.types';

interface ScenarioSimulatorProps {
  intakeId: string;
  baseScores: DiagnosticScores;
}

const DEFAULT_ADJUSTMENTS: ScenarioAdjustments = {
  revenue_growth_delta: 0,
  margin_delta: 0,
  market_share_delta: 0,
  risk_level_delta: 0,
  capability_delta: 0,
  time_horizon_months: 12,
};

export default function ScenarioSimulator({ intakeId, baseScores }: ScenarioSimulatorProps) {
  const { createSimulation, simulations, deleteSimulation } = useDiagnosticStore();
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({ ...DEFAULT_ADJUSTMENTS });
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const existingSimulations = simulations.filter((s) => s.diagnostic_id === intakeId);

  // Calculate projected scores based on adjustments
  const calculateProjectedScores = (): DiagnosticScores => {
    const projected: DiagnosticScores = {
      performance_score: Math.min(100, Math.max(0,
        baseScores.performance_score + adjustments.revenue_growth_delta * 0.5 + adjustments.margin_delta * 0.3
      )),
      threat_score: Math.min(100, Math.max(0,
        baseScores.threat_score + adjustments.risk_level_delta * 10
      )),
      alignment_score: Math.min(100, Math.max(0,
        baseScores.alignment_score + adjustments.capability_delta * 5
      )),
      readiness_score: Math.min(100, Math.max(0,
        baseScores.readiness_score + adjustments.capability_delta * 3
      )),
      overall_health: 0,
    };

    projected.overall_health = Math.round(
      (projected.performance_score * 0.3 +
        (100 - projected.threat_score) * 0.25 +
        projected.alignment_score * 0.25 +
        projected.readiness_score * 0.2)
    );

    return projected;
  };

  const projectedScores = calculateProjectedScores();

  const getScoreDelta = (base: number, projected: number): string => {
    const delta = projected - base;
    if (delta > 0) return `+${delta.toFixed(0)}`;
    if (delta < 0) return delta.toFixed(0);
    return '0';
  };

  const getDeltaColor = (delta: number, isInverse: boolean = false): string => {
    const adjusted = isInverse ? -delta : delta;
    if (adjusted > 0) return 'text-lime-400';
    if (adjusted < 0) return 'text-red-400';
    return 'text-[var(--text-muted)]';
  };

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) return;
    createSimulation(intakeId, scenarioName.trim(), adjustments);
    setScenarioName('');
    setShowSaveModal(false);
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
  };

  const handleLoadScenario = (simulation: typeof existingSimulations[0]) => {
    setAdjustments(simulation.adjustments);
  };

  const handleReset = () => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
  };

  const SliderField = ({
    label,
    value,
    onChange,
    min,
    max,
    unit,
    description,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    unit: string;
    description: string;
  }) => (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="font-medium">{label}</label>
        <span className={`font-bold ${value > 0 ? 'text-lime-400' : value < 0 ? 'text-red-400' : ''}`}>
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        className="w-full h-2 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-teal-500"
      />
      <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
        <span>{min}{unit}</span>
        <span>{description}</span>
        <span>+{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Scenario Simulator</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Adjust variables to see how changes affect your strategic scores
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Reset
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn-primary px-4 py-2 text-sm"
            >
              Save Scenario
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adjustment Controls */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-[var(--text-muted)] uppercase tracking-wider text-sm">
            Adjustment Sliders
          </h3>

          <SliderField
            label="Revenue Growth Change"
            value={adjustments.revenue_growth_delta}
            onChange={(v) => setAdjustments({ ...adjustments, revenue_growth_delta: v })}
            min={-20}
            max={30}
            unit="%"
            description="Impact on performance"
          />

          <SliderField
            label="Margin Improvement"
            value={adjustments.margin_delta}
            onChange={(v) => setAdjustments({ ...adjustments, margin_delta: v })}
            min={-15}
            max={20}
            unit="%"
            description="Operating margin delta"
          />

          <SliderField
            label="Market Share Change"
            value={adjustments.market_share_delta}
            onChange={(v) => setAdjustments({ ...adjustments, market_share_delta: v })}
            min={-10}
            max={15}
            unit="%"
            description="Competitive position"
          />

          <SliderField
            label="Risk Level Change"
            value={adjustments.risk_level_delta}
            onChange={(v) => setAdjustments({ ...adjustments, risk_level_delta: v })}
            min={-3}
            max={3}
            unit=" pts"
            description="Risk multiplier (-3 to +3)"
          />

          <SliderField
            label="Capability Investment"
            value={adjustments.capability_delta}
            onChange={(v) => setAdjustments({ ...adjustments, capability_delta: v })}
            min={-5}
            max={10}
            unit=" pts"
            description="Capability building"
          />

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Time Horizon</label>
              <span className="font-bold text-teal-400">
                {adjustments.time_horizon_months} months
              </span>
            </div>
            <input
              type="range"
              value={adjustments.time_horizon_months}
              onChange={(e) => setAdjustments({ ...adjustments, time_horizon_months: parseInt(e.target.value) })}
              min={3}
              max={36}
              step={3}
              className="w-full h-2 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>3 mo</span>
              <span>Planning horizon</span>
              <span>36 mo</span>
            </div>
          </div>
        </div>

        {/* Projected Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[var(--text-muted)] uppercase tracking-wider text-sm">
            Projected Impact
          </h3>

          {/* Score Comparison Cards */}
          {[
            { label: 'Overall Health', base: baseScores.overall_health, projected: projectedScores.overall_health, isMain: true },
            { label: 'Performance', base: baseScores.performance_score, projected: projectedScores.performance_score },
            { label: 'Risk Level', base: baseScores.threat_score, projected: projectedScores.threat_score, isInverse: true },
            { label: 'Alignment', base: baseScores.alignment_score, projected: projectedScores.alignment_score },
            { label: 'Readiness', base: baseScores.readiness_score, projected: projectedScores.readiness_score },
          ].map(({ label, base, projected, isMain, isInverse }) => {
            const delta = projected - base;
            return (
              <div
                key={label}
                className={`card p-4 ${isMain ? 'border-teal-500/30' : ''}`}
              >
                <div className="text-sm text-[var(--text-muted)] mb-1">{label}</div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">{Math.round(projected)}</span>
                    <span className="text-sm text-[var(--text-muted)]">/100</span>
                  </div>
                  <div className={`text-lg font-bold ${getDeltaColor(delta, isInverse)}`}>
                    {getScoreDelta(base, projected)}
                    {isInverse && delta > 0 && <span className="text-xs ml-1">⚠️</span>}
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      projected >= 70 ? 'bg-lime-500' : projected >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${projected}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                  <span>Baseline: {Math.round(base)}</span>
                  <span>Projected: {Math.round(projected)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Scenarios */}
      {existingSimulations.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Saved Scenarios ({existingSimulations.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingSimulations.map((sim) => (
              <div
                key={sim.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{sim.name}</h4>
                  <button
                    onClick={() => deleteSimulation(sim.id)}
                    className="text-[var(--text-muted)] hover:text-red-400 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm text-[var(--text-muted)] mb-3">
                  Overall: {Math.round(sim.projected_scores.overall_health)} (
                  <span className={getDeltaColor(sim.delta_from_baseline.overall_health)}>
                    {getScoreDelta(0, sim.delta_from_baseline.overall_health)}
                  </span>
                  )
                </div>
                <button
                  onClick={() => handleLoadScenario(sim)}
                  className="btn-secondary w-full py-2 text-sm"
                >
                  Load Scenario
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Scenario</h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Enter scenario name"
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn-secondary flex-1 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScenario}
                disabled={!scenarioName.trim()}
                className="btn-primary flex-1 py-2 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
