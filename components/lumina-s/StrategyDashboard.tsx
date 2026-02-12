'use client';

import { useStrategyEngine } from '../../state/useStrategyEngine';

export default function StrategyDashboard() {
  const {
    enterprise, objectives, constraints, market, capability,
    strategic_options, simulations, scenarios, portfolio,
    generateAllScenarios, runPortfolioOptimisation, audit_log,
  } = useStrategyEngine();

  const selected = strategic_options.filter(o => o.selected);
  const hasScenarios = scenarios.length > 0;
  const hasPortfolio = !!portfolio;

  // Auto-generate if missing
  const ensureScenarios = () => { if (!hasScenarios) generateAllScenarios(); };
  const ensurePortfolio = () => { if (!hasPortfolio) runPortfolioOptimisation(); };

  // Compute dashboard KPIs
  const alignmentScore = (() => {
    let s = 0;
    if (enterprise?.completed) s += 15;
    if (objectives?.completed) s += 20;
    if (constraints?.completed) s += 15;
    if (market?.completed) s += 15;
    if (capability?.completed) s += 15;
    if (selected.length > 0) s += 10;
    if (simulations.length > 0) s += 10;
    return s;
  })();

  const marketPositionIndex = market ? market.market_attractiveness_score : 0;
  const capitalUtilisation = constraints && portfolio
    ? Math.round((portfolio.total_capital_deployed / Math.max(1, constraints.capital_ceiling)) * 100)
    : 0;
  const readinessScore = capability?.strategic_readiness_score || 0;

  const scenarioColors: Record<string, string> = {
    base: '#3B82F6', upside: '#22C55E', downside: '#F59E0B', extreme_disruption: '#EF4444',
  };

  // Risk flags
  const riskFlags: { label: string; severity: 'high' | 'medium' | 'low'; detail: string }[] = [];
  if (capability?.execution_risk_flagged) {
    riskFlags.push({ label: 'Execution Risk', severity: 'high', detail: 'Capability gaps exceed threshold' });
  }
  if (market && market.competitive_intensity_index > 70) {
    riskFlags.push({ label: 'High Competition', severity: 'high', detail: `Intensity: ${market.competitive_intensity_index}%` });
  }
  if (constraints && portfolio && portfolio.total_capital_deployed > constraints.capital_ceiling) {
    riskFlags.push({ label: 'Capital Overrun', severity: 'high', detail: 'Deployed exceeds ceiling' });
  }
  if (scenarios.some(s => s.constraint_breach_probability > 50)) {
    riskFlags.push({ label: 'Constraint Breach', severity: 'medium', detail: 'Downside breach probability > 50%' });
  }
  if (selected.some(o => o.risk_exposure > 7)) {
    riskFlags.push({ label: 'High-Risk Option', severity: 'medium', detail: 'One or more options rated > 7/10 risk' });
  }
  if (riskFlags.length === 0) {
    riskFlags.push({ label: 'No Critical Flags', severity: 'low', detail: 'Strategy within acceptable parameters' });
  }

  return (
    <div className="strategy-dash">
      {/* Row 1: Top KPIs */}
      <div className="dash-row kpi-row">
        <div className="kpi-card">
          <span className="kpi-label">Strategic Alignment</span>
          <span className="kpi-value">{alignmentScore}%</span>
          <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${alignmentScore}%`, background: alignmentScore >= 70 ? '#22C55E' : '#F59E0B' }} /></div>
          <span className="kpi-badge ai">AI Verified</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Market Position Index</span>
          <span className="kpi-value" style={{ color: marketPositionIndex > 50 ? '#22C55E' : '#F59E0B' }}>{marketPositionIndex}</span>
          <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${marketPositionIndex}%`, background: '#3B82F6' }} /></div>
          <span className="kpi-sub">Attractiveness score</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Capital Utilisation</span>
          <span className="kpi-value">{capitalUtilisation}%</span>
          <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${Math.min(100, capitalUtilisation)}%`, background: capitalUtilisation > 100 ? '#EF4444' : '#14B8A6' }} /></div>
          <span className="kpi-sub">{portfolio ? `$${(portfolio.total_capital_deployed/1000).toFixed(0)}K deployed` : 'Run portfolio first'}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Strategic Readiness</span>
          <span className="kpi-value">{readinessScore}/100</span>
          <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${readinessScore}%`, background: readinessScore >= 60 ? '#22C55E' : readinessScore >= 40 ? '#F59E0B' : '#EF4444' }} /></div>
          <span className="kpi-sub">Capability score</span>
        </div>
      </div>

      {/* Row 2: Capability Heatmap + Competitive Matrix */}
      <div className="dash-row two-col">
        {/* Capability Heatmap */}
        <div className="dash-card">
          <h4>Capability Heatmap</h4>
          {capability ? (
            <div className="heatmap">
              {([
                { key: 'operational_efficiency', label: 'Operational Efficiency' },
                { key: 'brand_strength', label: 'Brand Strength' },
                { key: 'innovation_capacity', label: 'Innovation Capacity' },
                { key: 'digital_maturity', label: 'Digital Maturity' },
              ] as const).map(cap => {
                const val = capability[cap.key];
                return (
                  <div key={cap.key} className="heat-row">
                    <span className="heat-label">{cap.label}</span>
                    <div className="heat-cells">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className={`heat-cell ${i < val ? (val <= 4 ? 'low' : val <= 7 ? 'mid' : 'high') : ''}`} />
                      ))}
                    </div>
                    <span className={`heat-val ${val <= 4 ? 'low' : val >= 7 ? 'high' : ''}`}>{val}/10</span>
                  </div>
                );
              })}
              {capability.capability_gaps.length > 0 && (
                <div className="heat-gaps">
                  <span className="gap-label">Gaps:</span>
                  {capability.capability_gaps.map((g, i) => <span key={i} className="gap-tag">{g}</span>)}
                </div>
              )}
            </div>
          ) : <p className="empty">Complete capability mapping first</p>}
        </div>

        {/* Competitive Position Matrix */}
        <div className="dash-card">
          <h4>Competitive Position Matrix</h4>
          {market ? (
            <div className="comp-matrix">
              {([
                { key: 'competitive_rivalry' as const, label: 'Rivalry' },
                { key: 'entry_barriers' as const, label: 'Entry Barriers' },
                { key: 'buyer_power' as const, label: 'Buyer Power' },
                { key: 'supplier_power' as const, label: 'Supplier Power' },
                { key: 'threat_substitution' as const, label: 'Substitution' },
              ]).map(f => (
                <div key={f.key} className="cm-row">
                  <span className="cm-label">{f.label}</span>
                  <div className="cm-bar-track">
                    <div className="cm-bar-fill" style={{
                      width: `${market[f.key] * 10}%`,
                      background: market[f.key] > 7 ? '#EF4444' : market[f.key] > 4 ? '#F59E0B' : '#22C55E',
                    }} />
                  </div>
                  <span className="cm-val">{market[f.key]}/10</span>
                </div>
              ))}
              <div className="cm-summary">
                <div className="cm-sum-item">
                  <span>Five Forces</span><span className="cm-sum-val">{market.five_forces_score.toFixed(1)}</span>
                </div>
                <div className="cm-sum-item">
                  <span>HHI Index</span><span className="cm-sum-val">{market.hhi_index.toFixed(0)}</span>
                </div>
                <div className="cm-sum-item">
                  <span>Intensity</span>
                  <span className="cm-sum-val" style={{ color: market.competitive_intensity_index > 60 ? '#EF4444' : '#14B8A6' }}>
                    {market.competitive_intensity_index}%
                  </span>
                </div>
              </div>
            </div>
          ) : <p className="empty">Complete competitive scan first</p>}
        </div>
      </div>

      {/* Row 3: Scenario Comparison + Efficient Frontier */}
      <div className="dash-row two-col">
        <div className="dash-card">
          <div className="card-header">
            <h4>Scenario Comparison</h4>
            {!hasScenarios && simulations.length > 0 && (
              <button className="card-btn" onClick={ensureScenarios}>Generate</button>
            )}
          </div>
          {hasScenarios ? (
            <div className="scenario-chart">
              {scenarios.map(sc => (
                <div key={sc.id} className="sc-row">
                  <span className="sc-label" style={{ color: scenarioColors[sc.name] }}>{sc.label}</span>
                  <div className="sc-bars">
                    {sc.revenue_trajectory.map((rev, i) => {
                      const maxAll = Math.max(...scenarios.flatMap(s => s.revenue_trajectory.map(Math.abs)), 1);
                      return (
                        <div key={i} className="sc-bar" style={{
                          height: `${Math.max(4, (Math.abs(rev) / maxAll) * 48)}px`,
                          background: scenarioColors[sc.name],
                          opacity: 0.3 + (i * 0.15),
                        }} />
                      );
                    })}
                  </div>
                  <div className="sc-meta">
                    <span>Breach: {sc.constraint_breach_probability}%</span>
                    <span>BEP: {sc.breakeven_months}mo</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="empty">{simulations.length > 0 ? 'Click generate to create scenarios' : 'Run simulations first'}</p>}
        </div>

        <div className="dash-card">
          <div className="card-header">
            <h4>Efficient Frontier</h4>
            {!hasPortfolio && hasScenarios && (
              <button className="card-btn" onClick={ensurePortfolio}>Optimise</button>
            )}
          </div>
          {hasPortfolio && portfolio ? (
            <div className="frontier">
              <div className="frontier-plot">
                {portfolio.efficient_frontier.map((pt, i) => (
                  <div key={i} className="f-dot" style={{ left: `${pt.risk}%`, bottom: `${Math.min(95, pt.return_)}%` }} />
                ))}
                <div className="f-current" style={{
                  left: `${Math.min(95, portfolio.portfolio_risk)}%`,
                  bottom: `${Math.min(95, Math.max(5, (portfolio.portfolio_expected_return / Math.max(1, constraints?.capital_ceiling || 1)) * 100))}%`,
                }} title="Your Portfolio" />
              </div>
              <div className="frontier-labels">
                <span>Risk →</span><span>Return →</span>
              </div>
              <div className="frontier-summary">
                <span>Return: ${(portfolio.portfolio_expected_return/1000).toFixed(0)}K</span>
                <span>Risk: {portfolio.portfolio_risk}</span>
                <span>Score: {portfolio.objective_score}/100</span>
              </div>
            </div>
          ) : <p className="empty">{hasScenarios ? 'Click optimise to generate frontier' : 'Generate scenarios first'}</p>}
        </div>
      </div>

      {/* Row 4: Risk Flags */}
      <div className="dash-row">
        <div className="dash-card full">
          <h4>Strategic Risk Flags</h4>
          <div className="flags-grid">
            {riskFlags.map((f, i) => (
              <div key={i} className={`flag-item ${f.severity}`}>
                <div className="flag-icon">
                  {f.severity === 'high' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ) : f.severity === 'medium' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flag-text">
                  <span className="flag-label">{f.label}</span>
                  <span className="flag-detail">{f.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .strategy-dash { display: flex; flex-direction: column; gap: 16px; }
        .dash-row { display: flex; gap: 16px; }
        .dash-row.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); }
        .dash-row.two-col { display: grid; grid-template-columns: 1fr 1fr; }
        .kpi-card {
          padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 14px; position: relative;
        }
        .kpi-label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
        .kpi-value { display: block; font-size: 28px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
        .kpi-bar { height: 4px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; margin-bottom: 6px; }
        .kpi-fill { height: 100%; border-radius: 2px; transition: width 0.5s; }
        .kpi-sub { font-size: 11px; color: var(--text-muted); }
        .kpi-badge {
          position: absolute; top: 12px; right: 12px;
          padding: 3px 8px; border-radius: 6px;
          font-size: 9px; font-weight: 700; text-transform: uppercase;
        }
        .kpi-badge.ai { background: rgba(20, 184, 166, 0.15); color: #14B8A6; }
        .dash-card {
          padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 14px;
        }
        .dash-card.full { flex: 1; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-header h4 { margin-bottom: 0; }
        .card-btn {
          padding: 6px 14px; background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px;
          font-size: 12px; font-weight: 600; color: #C084FC; cursor: pointer;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .empty { font-size: 13px; color: var(--text-muted); font-style: italic; }

        /* Heatmap */
        .heatmap { display: flex; flex-direction: column; gap: 10px; }
        .heat-row { display: flex; align-items: center; gap: 12px; }
        .heat-label { font-size: 12px; color: var(--text-secondary); min-width: 140px; }
        .heat-cells { display: flex; gap: 3px; flex: 1; }
        .heat-cell { flex: 1; height: 20px; background: var(--bg-tertiary); border-radius: 3px; }
        .heat-cell.low { background: #EF4444; }
        .heat-cell.mid { background: #F59E0B; }
        .heat-cell.high { background: #22C55E; }
        .heat-val { font-size: 13px; font-weight: 700; color: var(--text-primary); min-width: 36px; text-align: right; }
        .heat-val.low { color: #EF4444; }
        .heat-val.high { color: #22C55E; }
        .heat-gaps { display: flex; align-items: center; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
        .gap-label { font-size: 11px; color: var(--text-muted); }
        .gap-tag { padding: 2px 8px; background: rgba(239, 68, 68, 0.1); border-radius: 4px; font-size: 11px; color: #F87171; }

        /* Competitive Matrix */
        .comp-matrix { display: flex; flex-direction: column; gap: 10px; }
        .cm-row { display: flex; align-items: center; gap: 12px; }
        .cm-label { font-size: 12px; color: var(--text-secondary); min-width: 100px; }
        .cm-bar-track { flex: 1; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
        .cm-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .cm-val { font-size: 12px; font-weight: 600; color: var(--text-primary); min-width: 36px; text-align: right; }
        .cm-summary {
          display: flex; gap: 16px; margin-top: 12px; padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .cm-sum-item { display: flex; flex-direction: column; font-size: 11px; color: var(--text-muted); }
        .cm-sum-val { font-size: 16px; font-weight: 700; color: var(--text-primary); }

        /* Scenarios */
        .scenario-chart { display: flex; flex-direction: column; gap: 12px; }
        .sc-row { display: flex; align-items: flex-end; gap: 12px; }
        .sc-label { font-size: 12px; font-weight: 600; min-width: 120px; }
        .sc-bars { display: flex; gap: 4px; align-items: flex-end; height: 52px; flex: 1; }
        .sc-bar { flex: 1; border-radius: 3px 3px 0 0; min-height: 4px; }
        .sc-meta { display: flex; flex-direction: column; font-size: 10px; color: var(--text-muted); min-width: 80px; text-align: right; }

        /* Frontier */
        .frontier { }
        .frontier-plot {
          position: relative; height: 180px; background: var(--bg-tertiary);
          border-radius: 10px; border-left: 2px solid var(--border);
          border-bottom: 2px solid var(--border); margin-bottom: 8px;
        }
        .f-dot {
          position: absolute; width: 8px; height: 8px; background: #A855F7;
          border-radius: 50%; transform: translate(-50%, 50%);
        }
        .f-current {
          position: absolute; width: 14px; height: 14px; background: #14B8A6;
          border: 2px solid white; border-radius: 50%; transform: translate(-50%, 50%);
          box-shadow: 0 0 12px rgba(20, 184, 166, 0.5); z-index: 2;
        }
        .frontier-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); }
        .frontier-summary {
          display: flex; gap: 16px; margin-top: 8px; padding-top: 8px;
          border-top: 1px solid var(--border); font-size: 12px; color: var(--text-secondary);
        }

        /* Flags */
        .flags-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
        .flag-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 14px; border-radius: 10px;
        }
        .flag-item.high { background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.2); }
        .flag-item.medium { background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.2); }
        .flag-item.low { background: rgba(34, 197, 94, 0.06); border: 1px solid rgba(34, 197, 94, 0.2); }
        .flag-icon { flex-shrink: 0; margin-top: 2px; }
        .flag-item.high .flag-icon { color: #EF4444; }
        .flag-item.medium .flag-icon { color: #F59E0B; }
        .flag-item.low .flag-icon { color: #22C55E; }
        .flag-text { display: flex; flex-direction: column; }
        .flag-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .flag-detail { font-size: 11px; color: var(--text-muted); }

        @media (max-width: 900px) {
          .dash-row.kpi-row { grid-template-columns: 1fr 1fr; }
          .dash-row.two-col { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dash-row.kpi-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
