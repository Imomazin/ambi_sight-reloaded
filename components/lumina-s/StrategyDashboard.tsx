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

  const ensureScenarios = () => { if (!hasScenarios) generateAllScenarios(); };
  const ensurePortfolio = () => { if (!hasPortfolio) runPortfolioOptimisation(); };

  // KPIs
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

  const kpiColor = (val: number, thresholds: [number, number] = [40, 70]) =>
    val >= thresholds[1] ? '#22C55E' : val >= thresholds[0] ? '#F59E0B' : '#EF4444';

  return (
    <div className="sd-root">
      {/* Row 1: KPIs */}
      <div className="sd-kpi-row">
        {[
          { label: 'Strategic Alignment', value: `${alignmentScore}%`, pct: alignmentScore, color: kpiColor(alignmentScore), badge: 'AI Verified' },
          { label: 'Market Position', value: `${marketPositionIndex}`, pct: marketPositionIndex, color: '#3B82F6', badge: null },
          { label: 'Capital Utilisation', value: `${capitalUtilisation}%`, pct: Math.min(100, capitalUtilisation), color: capitalUtilisation > 100 ? '#EF4444' : '#A855F7', badge: null },
          { label: 'Strategic Readiness', value: `${readinessScore}`, pct: readinessScore, color: kpiColor(readinessScore), badge: null },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">{kpi.label}</span>
              {kpi.badge && <span className="kpi-badge">{kpi.badge}</span>}
            </div>
            <span className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</span>
            <div className="kpi-track">
              <div className="kpi-fill" style={{ width: `${kpi.pct}%`, background: kpi.color }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Heatmap + Competitive */}
      <div className="sd-two-col">
        <div className="sd-card">
          <div className="card-title-row">
            <h3>Capability Heatmap</h3>
            {capability && <span className="card-tag">Live</span>}
          </div>
          {capability ? (
            <div className="heatmap-grid">
              {([
                { key: 'operational_efficiency', label: 'Operations' },
                { key: 'brand_strength', label: 'Brand' },
                { key: 'innovation_capacity', label: 'Innovation' },
                { key: 'digital_maturity', label: 'Digital' },
              ] as const).map(cap => {
                const val = capability[cap.key];
                const color = val <= 4 ? '#EF4444' : val <= 7 ? '#F59E0B' : '#22C55E';
                return (
                  <div key={cap.key} className="hm-row">
                    <span className="hm-label">{cap.label}</span>
                    <div className="hm-bar-track">
                      <div className="hm-bar-fill" style={{ width: `${val * 10}%`, background: color }}/>
                    </div>
                    <span className="hm-val" style={{ color }}>{val}/10</span>
                  </div>
                );
              })}
              {capability.capability_gaps.length > 0 && (
                <div className="hm-gaps">
                  {capability.capability_gaps.map((g, i) => (
                    <span key={i} className="gap-pill">{g}</span>
                  ))}
                </div>
              )}
            </div>
          ) : <p className="sd-empty">Complete capability mapping to view</p>}
        </div>

        <div className="sd-card">
          <div className="card-title-row">
            <h3>Competitive Position</h3>
            {market && <span className="card-tag">Live</span>}
          </div>
          {market ? (
            <div className="comp-grid">
              {([
                { key: 'competitive_rivalry' as const, label: 'Rivalry' },
                { key: 'entry_barriers' as const, label: 'Barriers' },
                { key: 'buyer_power' as const, label: 'Buyers' },
                { key: 'supplier_power' as const, label: 'Suppliers' },
                { key: 'threat_substitution' as const, label: 'Substitutes' },
              ]).map(f => {
                const v = market[f.key];
                const c = v > 7 ? '#EF4444' : v > 4 ? '#F59E0B' : '#22C55E';
                return (
                  <div key={f.key} className="cm-row">
                    <span className="cm-label">{f.label}</span>
                    <div className="cm-track"><div className="cm-fill" style={{ width: `${v * 10}%`, background: c }}/></div>
                    <span className="cm-val" style={{ color: c }}>{v}</span>
                  </div>
                );
              })}
              <div className="cm-footer">
                <div className="cm-stat">
                  <span className="cm-stat-label">Five Forces</span>
                  <span className="cm-stat-val">{market.five_forces_score.toFixed(1)}</span>
                </div>
                <div className="cm-stat">
                  <span className="cm-stat-label">HHI</span>
                  <span className="cm-stat-val">{market.hhi_index.toFixed(0)}</span>
                </div>
                <div className="cm-stat">
                  <span className="cm-stat-label">Intensity</span>
                  <span className="cm-stat-val" style={{ color: market.competitive_intensity_index > 60 ? '#EF4444' : '#A855F7' }}>
                    {market.competitive_intensity_index}%
                  </span>
                </div>
              </div>
            </div>
          ) : <p className="sd-empty">Complete competitive scan to view</p>}
        </div>
      </div>

      {/* Row 3: Scenarios + Frontier */}
      <div className="sd-two-col">
        <div className="sd-card">
          <div className="card-title-row">
            <h3>Scenario Analysis</h3>
            {!hasScenarios && simulations.length > 0 && (
              <button className="card-action" onClick={ensureScenarios}>Generate</button>
            )}
          </div>
          {hasScenarios ? (
            <div className="sc-grid">
              {scenarios.map(sc => (
                <div key={sc.id} className="sc-card" style={{ borderLeftColor: scenarioColors[sc.name] }}>
                  <div className="sc-head">
                    <span className="sc-dot" style={{ background: scenarioColors[sc.name] }}/>
                    <span className="sc-name">{sc.label}</span>
                  </div>
                  <div className="sc-bars">
                    {sc.revenue_trajectory.map((rev, i) => {
                      const maxAll = Math.max(...scenarios.flatMap(s => s.revenue_trajectory.map(Math.abs)), 1);
                      return (
                        <div key={i} className="sc-bar" style={{
                          height: `${Math.max(6, (Math.abs(rev) / maxAll) * 56)}px`,
                          background: scenarioColors[sc.name],
                          opacity: 0.35 + (i * 0.15),
                        }}/>
                      );
                    })}
                  </div>
                  <div className="sc-meta">
                    <span className="sc-metric">Breach: <b>{sc.constraint_breach_probability}%</b></span>
                    <span className="sc-metric">BEP: <b>{sc.breakeven_months}mo</b></span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="sd-empty">{simulations.length > 0 ? 'Click Generate to create scenarios' : 'Run simulations first'}</p>}
        </div>

        <div className="sd-card">
          <div className="card-title-row">
            <h3>Efficient Frontier</h3>
            {!hasPortfolio && hasScenarios && (
              <button className="card-action" onClick={ensurePortfolio}>Optimise</button>
            )}
          </div>
          {hasPortfolio && portfolio ? (
            <div className="ef-container">
              <div className="ef-plot">
                {portfolio.efficient_frontier.map((pt, i) => (
                  <div key={i} className="ef-dot" style={{ left: `${pt.risk}%`, bottom: `${Math.min(92, pt.return_)}%` }}
                    title={`Risk: ${pt.risk}, Return: ${pt.return_}`}/>
                ))}
                <div className="ef-current" style={{
                  left: `${Math.min(90, portfolio.portfolio_risk)}%`,
                  bottom: `${Math.min(90, Math.max(8, (portfolio.portfolio_expected_return / Math.max(1, constraints?.capital_ceiling || 1)) * 100))}%`,
                }} title="Your Portfolio"/>
                <span className="ef-x-label">Risk</span>
                <span className="ef-y-label">Return</span>
              </div>
              <div className="ef-stats">
                <div className="ef-stat"><span className="ef-sl">Return</span><span className="ef-sv">${(portfolio.portfolio_expected_return/1000).toFixed(0)}K</span></div>
                <div className="ef-stat"><span className="ef-sl">Risk</span><span className="ef-sv">{portfolio.portfolio_risk}</span></div>
                <div className="ef-stat"><span className="ef-sl">Score</span><span className="ef-sv">{portfolio.objective_score}/100</span></div>
              </div>
            </div>
          ) : <p className="sd-empty">{hasScenarios ? 'Click Optimise to generate frontier' : 'Generate scenarios first'}</p>}
        </div>
      </div>

      {/* Row 4: Risk Flags */}
      <div className="sd-card sd-full">
        <div className="card-title-row">
          <h3>Strategic Risk Flags</h3>
          <span className="flag-count">{riskFlags.filter(f => f.severity === 'high').length} critical</span>
        </div>
        <div className="flags-row">
          {riskFlags.map((f, i) => (
            <div key={i} className={`flag-card ${f.severity}`}>
              <div className="flag-icon-wrap">
                {f.severity === 'high' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ) : f.severity === 'medium' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className="flag-content">
                <span className="flag-label">{f.label}</span>
                <span className="flag-detail">{f.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sd-root { display: flex; flex-direction: column; gap: 16px; }

        /* ── KPI Row ── */
        .sd-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .kpi-card {
          padding: 22px 20px;
          background: linear-gradient(135deg, rgba(26,26,37,0.7), rgba(20,20,30,0.85));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; backdrop-filter: blur(12px);
          transition: all 0.25s;
        }
        .kpi-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .kpi-label { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; }
        .kpi-badge {
          padding: 3px 8px; background: rgba(124, 58, 237, 0.12);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 6px; font-size: 9px; font-weight: 700;
          color: #A855F7; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .kpi-value { display: block; font-size: 32px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; }
        .kpi-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .kpi-fill { height: 100%; border-radius: 2px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }

        /* ── Cards ── */
        .sd-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .sd-card {
          padding: 24px;
          background: linear-gradient(135deg, rgba(26,26,37,0.7), rgba(20,20,30,0.85));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; backdrop-filter: blur(12px);
        }
        .sd-full { }
        .card-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-title-row h3 { font-size: 14px; font-weight: 600; color: #fff; margin: 0; letter-spacing: -0.2px; }
        .card-tag {
          padding: 3px 10px; background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 6px; font-size: 10px; font-weight: 600; color: #22C55E;
        }
        .card-action {
          padding: 6px 16px; background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 8px; font-size: 12px; font-weight: 600;
          color: #C084FC; cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .card-action:hover { background: rgba(168, 85, 247, 0.2); }
        .sd-empty { font-size: 13px; color: rgba(255,255,255,0.25); font-style: italic; margin: 0; }

        /* ── Heatmap ── */
        .heatmap-grid { display: flex; flex-direction: column; gap: 14px; }
        .hm-row { display: flex; align-items: center; gap: 14px; }
        .hm-label { font-size: 13px; color: rgba(255,255,255,0.5); min-width: 80px; font-weight: 500; }
        .hm-bar-track { flex: 1; height: 8px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; }
        .hm-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .hm-val { font-size: 13px; font-weight: 700; min-width: 40px; text-align: right; }
        .hm-gaps { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
        .gap-pill {
          padding: 4px 10px; background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 6px; font-size: 11px; color: #F87171; font-weight: 500;
        }

        /* ── Competitive ── */
        .comp-grid { display: flex; flex-direction: column; gap: 12px; }
        .cm-row { display: flex; align-items: center; gap: 12px; }
        .cm-label { font-size: 13px; color: rgba(255,255,255,0.5); min-width: 76px; font-weight: 500; }
        .cm-track { flex: 1; height: 8px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; }
        .cm-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
        .cm-val { font-size: 13px; font-weight: 700; min-width: 24px; text-align: right; }
        .cm-footer {
          display: flex; gap: 20px; padding-top: 14px; margin-top: 6px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cm-stat { display: flex; flex-direction: column; gap: 2px; }
        .cm-stat-label { font-size: 11px; color: rgba(255,255,255,0.3); }
        .cm-stat-val { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }

        /* ── Scenarios ── */
        .sc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .sc-card {
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid;
          border-radius: 12px;
        }
        .sc-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .sc-dot { width: 8px; height: 8px; border-radius: 50%; }
        .sc-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); }
        .sc-bars { display: flex; gap: 4px; align-items: flex-end; height: 60px; margin-bottom: 10px; }
        .sc-bar { flex: 1; border-radius: 3px 3px 0 0; min-height: 6px; transition: height 0.4s; }
        .sc-meta { display: flex; gap: 14px; }
        .sc-metric { font-size: 11px; color: rgba(255,255,255,0.35); }
        .sc-metric b { color: rgba(255,255,255,0.7); font-weight: 600; }

        /* ── Efficient Frontier ── */
        .ef-container { }
        .ef-plot {
          position: relative; height: 200px;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border-left: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 14px;
        }
        .ef-dot {
          position: absolute; width: 8px; height: 8px;
          background: rgba(168, 85, 247, 0.6);
          border: 1px solid #A855F7;
          border-radius: 50%; transform: translate(-50%, 50%);
          transition: all 0.3s;
        }
        .ef-dot:hover { transform: translate(-50%, 50%) scale(1.5); background: #A855F7; }
        .ef-current {
          position: absolute; width: 16px; height: 16px;
          background: #A855F7; border: 2px solid rgba(124, 58, 237, 0.4);
          border-radius: 50%; transform: translate(-50%, 50%);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.4); z-index: 2;
        }
        .ef-x-label { position: absolute; bottom: 6px; right: 12px; font-size: 10px; color: rgba(255,255,255,0.2); }
        .ef-y-label { position: absolute; top: 6px; left: 8px; font-size: 10px; color: rgba(255,255,255,0.2); }
        .ef-stats { display: flex; gap: 20px; }
        .ef-stat { display: flex; flex-direction: column; gap: 2px; }
        .ef-sl { font-size: 11px; color: rgba(255,255,255,0.3); }
        .ef-sv { font-size: 16px; font-weight: 700; color: #fff; }

        /* ── Risk Flags ── */
        .flag-count { font-size: 12px; color: rgba(239, 68, 68, 0.7); font-weight: 600; }
        .flags-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
        .flag-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 16px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.2s;
        }
        .flag-card:hover { border-color: rgba(255,255,255,0.08); }
        .flag-card.high { background: rgba(239, 68, 68, 0.04); border-color: rgba(239, 68, 68, 0.12); }
        .flag-card.medium { background: rgba(245, 158, 11, 0.04); border-color: rgba(245, 158, 11, 0.12); }
        .flag-card.low { background: rgba(34, 197, 94, 0.04); border-color: rgba(34, 197, 94, 0.12); }
        .flag-icon-wrap { flex-shrink: 0; margin-top: 1px; }
        .flag-card.high .flag-icon-wrap { color: #EF4444; }
        .flag-card.medium .flag-icon-wrap { color: #F59E0B; }
        .flag-card.low .flag-icon-wrap { color: #22C55E; }
        .flag-content { display: flex; flex-direction: column; gap: 3px; }
        .flag-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); }
        .flag-detail { font-size: 12px; color: rgba(255,255,255,0.35); }

        @media (max-width: 900px) {
          .sd-kpi-row { grid-template-columns: 1fr 1fr; }
          .sd-two-col { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .sd-kpi-row { grid-template-columns: 1fr; }
          .sc-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
