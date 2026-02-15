'use client';

import { useStrategyEngine, PHASE_LABELS } from '../../state/useStrategyEngine';

export default function PhaseGovernance() {
  const {
    audit_log, enterprise, objectives, constraints, market, capability,
    strategic_options, simulations, scenarios, portfolio,
  } = useStrategyEngine();

  const phaseComplete = (phase: string) => {
    switch (phase) {
      case 'context': return enterprise?.completed ? 'Yes' : 'No';
      case 'objectives': return objectives?.completed ? 'Yes' : 'No';
      case 'constraints': return constraints?.completed ? 'Yes' : 'No';
      case 'competitive': return market?.completed ? 'Yes' : 'No';
      case 'capability': return capability?.completed ? 'Yes' : 'No';
      case 'options': return strategic_options.length > 0 ? `${strategic_options.length} options` : 'No';
      case 'simulation': return simulations.length > 0 ? `${simulations.length} simulated` : 'No';
      case 'scenarios': return scenarios.length > 0 ? `${scenarios.length} scenarios` : 'No';
      case 'portfolio': return portfolio ? 'Optimised' : 'No';
      default: return '—';
    }
  };

  return (
    <div className="phase-form">
      <p className="phase-description">
        Full decision log. Track assumption changes, capital constraint updates, scenario parameter changes, and user overrides.
      </p>

      {/* Session Summary */}
      <div className="summary-section">
        <h4>Strategy Session Summary</h4>
        <div className="summary-grid">
          {Object.entries(PHASE_LABELS).filter(([k]) => k !== 'governance').map(([key, label]) => (
            <div key={key} className={`summary-item ${phaseComplete(key) !== 'No' ? 'done' : ''}`}>
              <span className="sum-label">{label}</span>
              <span className={`sum-status ${phaseComplete(key) !== 'No' ? 'complete' : 'pending'}`}>
                {phaseComplete(key)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Outputs */}
      {enterprise?.completed && (
        <div className="output-section">
          <h4>Key Strategic Outputs</h4>
          <div className="output-grid">
            {enterprise && (
              <div className="output-card">
                <span className="out-title">Enterprise</span>
                <span className="out-val">{enterprise.organisation_name}</span>
                <span className="out-sub">{enterprise.industry_label} | {enterprise.market_type} | {enterprise.horizon_years}</span>
              </div>
            )}
            {constraints?.completed && (
              <div className="output-card">
                <span className="out-title">Capital Ceiling</span>
                <span className="out-val">${constraints.capital_ceiling.toLocaleString()}</span>
                <span className="out-sub">Risk coefficient: {constraints.risk_tolerance_coefficient}</span>
              </div>
            )}
            {market?.completed && (
              <div className="output-card">
                <span className="out-title">Competitive Intensity</span>
                <span className="out-val">{market.competitive_intensity_index}%</span>
                <span className="out-sub">Five Forces: {market.five_forces_score.toFixed(1)} | HHI: {market.hhi_index}</span>
              </div>
            )}
            {capability?.completed && (
              <div className="output-card">
                <span className="out-title">Strategic Readiness</span>
                <span className="out-val">{capability.strategic_readiness_score}/100</span>
                <span className="out-sub">{capability.execution_risk_flagged ? 'EXECUTION RISK FLAGGED' : 'Within threshold'}</span>
              </div>
            )}
            {portfolio && (
              <div className="output-card highlight">
                <span className="out-title">Portfolio Score</span>
                <span className="out-val">{portfolio.objective_score}/100</span>
                <span className="out-sub">Return: ${(portfolio.portfolio_expected_return / 1000).toFixed(0)}K | Risk: {portfolio.portfolio_risk}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="audit-section">
        <h4>Decision Audit Log ({audit_log.length} entries)</h4>
        {audit_log.length === 0 ? (
          <p className="empty">No audit entries yet.</p>
        ) : (
          <div className="audit-table">
            <div className="audit-header">
              <span className="ah-col time">Timestamp</span>
              <span className="ah-col phase">Phase</span>
              <span className="ah-col action">Action</span>
              <span className="ah-col field">Field</span>
              <span className="ah-col detail">Detail</span>
            </div>
            {[...audit_log].reverse().map(entry => (
              <div key={entry.id} className="audit-row">
                <span className="ar-col time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className="ar-col phase">
                  <span className="phase-badge">{entry.phase}</span>
                </span>
                <span className="ar-col action">{entry.action}</span>
                <span className="ar-col field">{entry.field}</span>
                <span className="ar-col detail">{entry.new_value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .phase-form { max-width: 960px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 24px;
          padding: 12px 16px; background: rgba(100, 116, 139, 0.08);
          border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 10px;
          border-left: 3px solid #64748B;
        }
        .summary-section, .output-section, .audit-section {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px; margin-bottom: 20px;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .summary-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 14px; background: var(--bg-tertiary); border-radius: 8px;
        }
        .summary-item.done { border-left: 3px solid #22C55E; }
        .sum-label { font-size: 12px; color: var(--text-secondary); }
        .sum-status { font-size: 12px; font-weight: 600; }
        .sum-status.complete { color: #22C55E; }
        .sum-status.pending { color: var(--text-muted); }
        .output-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .output-card { padding: 14px; background: var(--bg-tertiary); border-radius: 10px; }
        .output-card.highlight { border: 1px solid rgba(124, 58, 237, 0.3); background: rgba(124, 58, 237, 0.05); }
        .out-title { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .out-val { display: block; font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
        .out-sub { font-size: 11px; color: var(--text-muted); }
        .empty { font-size: 13px; color: var(--text-muted); font-style: italic; }
        .audit-table { font-size: 12px; }
        .audit-header {
          display: grid; grid-template-columns: 100px 90px 90px 100px 1fr;
          gap: 8px; padding: 8px 12px;
          background: var(--bg-tertiary); border-radius: 8px 8px 0 0;
          font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.3px;
        }
        .audit-row {
          display: grid; grid-template-columns: 100px 90px 90px 100px 1fr;
          gap: 8px; padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .ar-col { color: var(--text-secondary); }
        .ar-col.time { color: var(--text-muted); font-family: monospace; font-size: 11px; }
        .phase-badge {
          padding: 2px 8px; background: rgba(168, 85, 247, 0.1);
          border-radius: 4px; font-size: 10px; color: #C084FC;
        }
        @media (max-width: 768px) {
          .summary-grid { grid-template-columns: 1fr; }
          .audit-header, .audit-row { grid-template-columns: 80px 70px 70px 1fr; }
          .ah-col.field, .ar-col.field { display: none; }
        }
      `}</style>
    </div>
  );
}
