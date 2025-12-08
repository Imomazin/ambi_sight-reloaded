'use client';

import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import type { RiskScore, RiskSignals } from '@/lib/database.types';

interface RiskFieldProps {
  label: string;
  description: string;
  riskKey: keyof RiskSignals;
}

const RISK_LEVELS = [
  { value: 1, label: 'Low', color: 'bg-lime-500' },
  { value: 2, label: 'Moderate', color: 'bg-lime-400' },
  { value: 3, label: 'Medium', color: 'bg-amber-500' },
  { value: 4, label: 'High', color: 'bg-amber-600' },
  { value: 5, label: 'Critical', color: 'bg-red-500' },
];

function RiskField({ label, description, riskKey }: RiskFieldProps) {
  const { currentIntake, updateRiskSignals } = useDiagnosticStore();
  const risk = currentIntake?.risk_signals?.[riskKey];

  if (!risk) return null;

  const handleScoreChange = (score: RiskScore['score']) => {
    updateRiskSignals({
      [riskKey]: { ...risk, score },
    });
  };

  const handleTrendChange = (trend: RiskScore['trend']) => {
    updateRiskSignals({
      [riskKey]: { ...risk, trend },
    });
  };

  const currentLevel = RISK_LEVELS.find((l) => l.value === risk.score);

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium">{label}</h4>
          <p className="text-xs text-[var(--text-muted)]">{description}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${currentLevel?.color} text-white`}>
          {currentLevel?.label}
        </span>
      </div>

      {/* Risk Score Slider */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {RISK_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handleScoreChange(level.value as RiskScore['score'])}
              className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                risk.score === level.value
                  ? `${level.color} text-white`
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:bg-[var(--border-color)]'
              }`}
            >
              {level.value}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>Low Risk</span>
          <span>Critical Risk</span>
        </div>
      </div>

      {/* Trend Selector */}
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Trend Direction</label>
        <div className="flex gap-2">
          {['improving', 'stable', 'worsening'].map((trend) => (
            <button
              key={trend}
              onClick={() => handleTrendChange(trend as RiskScore['trend'])}
              className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                risk.trend === trend
                  ? trend === 'improving'
                    ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                    : trend === 'stable'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--border-color)]'
              }`}
            >
              {trend === 'improving' ? '↓ Improving' : trend === 'stable' ? '→ Stable' : '↑ Worsening'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RiskSignalsStep() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Assess your organization&apos;s risk landscape. Rate each risk category on a 1-5 scale and indicate the trend direction.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskField
          label="Regulatory Risk"
          description="Compliance, legal, and regulatory changes"
          riskKey="regulatory_risk"
        />

        <RiskField
          label="Supply Chain Risk"
          description="Supplier dependencies and logistics"
          riskKey="supply_chain_risk"
        />

        <RiskField
          label="Technology Disruption"
          description="Technology shifts threatening your business"
          riskKey="technology_disruption"
        />

        <RiskField
          label="Talent Risk"
          description="Key person dependency and talent retention"
          riskKey="talent_risk"
        />

        <RiskField
          label="Market Risk"
          description="Market volatility and demand changes"
          riskKey="market_risk"
        />

        <RiskField
          label="Financial Risk"
          description="Cash flow, debt, and capital structure"
          riskKey="financial_risk"
        />

        <RiskField
          label="Competitive Risk"
          description="Competitor actions and market position"
          riskKey="competitive_risk"
        />

        <RiskField
          label="Cybersecurity Risk"
          description="Data breaches and security threats"
          riskKey="cybersecurity_risk"
        />

        <RiskField
          label="Reputation Risk"
          description="Brand, PR, and stakeholder perception"
          riskKey="reputation_risk"
        />

        <RiskField
          label="Operational Risk"
          description="Process failures and execution gaps"
          riskKey="operational_risk"
        />
      </div>

      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
        <p className="text-sm text-red-400">
          High risk scores (4-5) will flag areas requiring immediate attention in your diagnostic results.
        </p>
      </div>
    </div>
  );
}
