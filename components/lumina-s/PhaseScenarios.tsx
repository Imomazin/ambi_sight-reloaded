'use client';

import { useStrategyEngine } from '../../state/useStrategyEngine';

export default function PhaseScenarios() {
  const { scenarios, generateAllScenarios, setPhase } = useStrategyEngine();

  const colorMap: Record<string, string> = {
    base: '#3B82F6',
    upside: '#22C55E',
    downside: '#F59E0B',
    extreme_disruption: '#EF4444',
  };

  return (
    <div className="phase-form">
      <p className="phase-description">
        Base, Upside, Downside, and Extreme Disruption cases. Each scenario shows revenue trajectory, constraint breach probability, and breakeven timing.
      </p>

      {scenarios.length === 0 ? (
        <div className="gen-section">
          <button className="btn-gen" onClick={generateAllScenarios}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
            Generate Scenario Architecture
          </button>
        </div>
      ) : (
        <div className="scenarios-grid">
          {scenarios.map(sc => (
            <div key={sc.id} className="scenario-card" style={{ borderTopColor: colorMap[sc.name] || '#3B82F6' }}>
              <div className="sc-header">
                <span className="sc-dot" style={{ background: colorMap[sc.name] }} />
                <h5>{sc.label}</h5>
              </div>

              {/* Revenue Trajectory Mini Chart */}
              <div className="sc-chart">
                <span className="sc-chart-label">Revenue Trajectory</span>
                <div className="sc-bars">
                  {sc.revenue_trajectory.map((rev, i) => {
                    const maxRev = Math.max(...sc.revenue_trajectory.map(Math.abs), 1);
                    return (
                      <div key={i} className="sc-bar-wrap">
                        <div className={`sc-bar ${rev >= 0 ? 'pos' : 'neg'}`}
                          style={{ height: `${Math.max(4, (Math.abs(rev) / maxRev) * 60)}px`, background: colorMap[sc.name] }} />
                        <span className="sc-bar-yr">Y{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="sc-metrics">
                <div className="sc-metric">
                  <span className="scm-label">Market Share Shift</span>
                  <span className="scm-val" style={{ color: sc.market_share_shift >= 0 ? '#22C55E' : '#EF4444' }}>
                    {sc.market_share_shift > 0 ? '+' : ''}{sc.market_share_shift}%
                  </span>
                </div>
                <div className="sc-metric">
                  <span className="scm-label">Margin Shift</span>
                  <span className="scm-val" style={{ color: sc.margin_shift >= 0 ? '#22C55E' : '#EF4444' }}>
                    {sc.margin_shift > 0 ? '+' : ''}{sc.margin_shift}pp
                  </span>
                </div>
                <div className="sc-metric">
                  <span className="scm-label">Capital Stress</span>
                  <span className="scm-val" style={{ color: sc.capital_stress > 50 ? '#EF4444' : '#A855F7' }}>
                    {sc.capital_stress}%
                  </span>
                </div>
                <div className="sc-metric">
                  <span className="scm-label">Liquidity Stress</span>
                  <span className="scm-val">{sc.liquidity_stress}%</span>
                </div>
                <div className="sc-metric">
                  <span className="scm-label">Breakeven</span>
                  <span className="scm-val">{sc.breakeven_months} mo</span>
                </div>
                <div className="sc-metric highlight">
                  <span className="scm-label">Constraint Breach Prob</span>
                  <span className="scm-val" style={{ color: sc.constraint_breach_probability > 40 ? '#EF4444' : '#22C55E' }}>
                    {sc.constraint_breach_probability}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {scenarios.length > 0 && (
        <div className="form-actions">
          <button className="btn-complete" onClick={() => setPhase('portfolio')}>
            Proceed to Portfolio Optimisation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .phase-form { max-width: 960px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 24px;
          padding: 12px 16px; background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 10px;
          border-left: 3px solid #3B82F6;
        }
        .gen-section { text-align: center; padding: 48px 24px; }
        .btn-gen {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 32px; background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-gen:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4); }
        .scenarios-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .scenario-card {
          padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; border-top: 3px solid;
        }
        .sc-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .sc-dot { width: 10px; height: 10px; border-radius: 50%; }
        h5 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0; }
        .sc-chart { margin-bottom: 16px; }
        .sc-chart-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
        .sc-bars { display: flex; gap: 6px; align-items: flex-end; height: 70px; }
        .sc-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
        .sc-bar { width: 100%; border-radius: 3px 3px 0 0; transition: height 0.3s; min-height: 4px; }
        .sc-bar.neg { border-radius: 0 0 3px 3px; }
        .sc-bar-yr { font-size: 9px; color: var(--text-muted); margin-top: 2px; }
        .sc-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .sc-metric { padding: 8px 10px; background: var(--bg-tertiary); border-radius: 8px; }
        .sc-metric.highlight { background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15); }
        .scm-label { display: block; font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
        .scm-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3); }
        @media (max-width: 768px) { .scenarios-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
