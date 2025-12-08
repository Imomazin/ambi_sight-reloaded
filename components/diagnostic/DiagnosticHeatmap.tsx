'use client';

import type { DiagnosticIntake, DiagnosticResult } from '@/lib/database.types';

interface DiagnosticHeatmapProps {
  intake: DiagnosticIntake;
  result: DiagnosticResult;
}

interface HeatmapCell {
  label: string;
  value: number;
  category: string;
}

export default function DiagnosticHeatmap({ intake, result }: DiagnosticHeatmapProps) {
  const getCellColor = (value: number, isRisk: boolean = false) => {
    if (isRisk) {
      // For risks: 1-2 = green, 3 = amber, 4-5 = red
      if (value <= 2) return 'bg-lime-500/40 border-lime-500/50';
      if (value <= 3) return 'bg-amber-500/40 border-amber-500/50';
      return 'bg-red-500/40 border-red-500/50';
    }
    // For performance: higher is better
    if (value >= 70) return 'bg-lime-500/40 border-lime-500/50';
    if (value >= 40) return 'bg-amber-500/40 border-amber-500/50';
    return 'bg-red-500/40 border-red-500/50';
  };

  // Performance KPIs for heatmap
  const performanceData: HeatmapCell[] = [
    { label: 'Revenue Growth', value: intake.performance_kpis.revenue_growth.value, category: 'Financial' },
    { label: 'Gross Margin', value: intake.performance_kpis.gross_margin.value, category: 'Financial' },
    { label: 'Operating Margin', value: intake.performance_kpis.operating_margin.value, category: 'Financial' },
    { label: 'Market Share', value: intake.performance_kpis.market_share.value * 2, category: 'Market' }, // Scale for display
    { label: 'Employee Productivity', value: intake.performance_kpis.employee_productivity.value, category: 'Operations' },
    { label: 'Customer Satisfaction', value: intake.performance_kpis.customer_satisfaction.value, category: 'Customer' },
    { label: 'Innovation Rate', value: intake.performance_kpis.innovation_rate.value * 2, category: 'Innovation' }, // Scale for display
    { label: 'Operational Efficiency', value: intake.performance_kpis.operational_efficiency.value, category: 'Operations' },
  ];

  // Risk signals for heatmap
  const riskLabels: { key: keyof typeof intake.risk_signals; label: string }[] = [
    { key: 'regulatory_risk', label: 'Regulatory' },
    { key: 'supply_chain_risk', label: 'Supply Chain' },
    { key: 'technology_disruption', label: 'Tech Disruption' },
    { key: 'talent_risk', label: 'Talent' },
    { key: 'market_risk', label: 'Market' },
    { key: 'financial_risk', label: 'Financial' },
    { key: 'competitive_risk', label: 'Competitive' },
    { key: 'cybersecurity_risk', label: 'Cybersecurity' },
    { key: 'reputation_risk', label: 'Reputation' },
    { key: 'operational_risk', label: 'Operational' },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-6">Strategic Health Heatmap</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance Heatmap */}
        <div>
          <h3 className="text-sm font-medium text-[var(--text-muted)] mb-4 uppercase tracking-wider">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {performanceData.map((cell) => (
              <div
                key={cell.label}
                className={`p-3 rounded-lg border ${getCellColor(cell.value)} transition-all hover:scale-105`}
                title={`${cell.label}: ${cell.value}`}
              >
                <div className="text-xs text-[var(--text-muted)] truncate mb-1">
                  {cell.label}
                </div>
                <div className="text-lg font-bold">
                  {Math.round(cell.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-lime-500/40" />
              <span>Good (70+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-500/40" />
              <span>Moderate (40-69)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500/40" />
              <span>Poor (&lt;40)</span>
            </div>
          </div>
        </div>

        {/* Risk Heatmap */}
        <div>
          <h3 className="text-sm font-medium text-[var(--text-muted)] mb-4 uppercase tracking-wider">
            Risk Profile
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {riskLabels.map(({ key, label }) => {
              const risk = intake.risk_signals[key];
              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${getCellColor(risk.score, true)} transition-all hover:scale-105`}
                  title={`${label}: ${risk.score}/5 (${risk.trend})`}
                >
                  <div className="text-xs text-[var(--text-muted)] truncate mb-1">
                    {label}
                  </div>
                  <div className="text-lg font-bold flex items-center gap-1">
                    {risk.score}
                    <span className="text-xs">
                      {risk.trend === 'improving' ? '↓' : risk.trend === 'worsening' ? '↑' : '→'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-lime-500/40" />
              <span>Low (1-2)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-500/40" />
              <span>Medium (3)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500/40" />
              <span>High (4-5)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Bar */}
      <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Performance', score: result.scores.performance_score, color: 'teal' },
            { label: 'Risk (Inverted)', score: 100 - result.scores.threat_score, color: 'amber' },
            { label: 'Alignment', score: result.scores.alignment_score, color: 'purple' },
            { label: 'Readiness', score: result.scores.readiness_score, color: 'lime' },
          ].map(({ label, score, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-muted)]">{label}</span>
                <span className="font-medium">{score}</span>
              </div>
              <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${color}-500 transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
