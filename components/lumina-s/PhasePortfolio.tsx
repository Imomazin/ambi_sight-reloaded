'use client';

import { useStrategyEngine } from '../../state/useStrategyEngine';

export default function PhasePortfolio() {
  const { portfolio, strategic_options, constraints, runPortfolioOptimisation, setPhase } = useStrategyEngine();

  const selected = strategic_options.filter(o => o.selected);
  const budget = constraints?.capital_ceiling || 0;

  return (
    <div className="phase-form">
      <p className="phase-description">
        Constrained optimisation: maximise strategic objective score subject to capital &le; budget and risk &le; tolerance.
      </p>

      {!portfolio ? (
        <div className="run-section">
          <div className="pre-summary">
            <h4>Portfolio Inputs</h4>
            <div className="pre-grid">
              <div className="pre-item">
                <span className="pre-label">Selected Options</span>
                <span className="pre-val">{selected.length}</span>
              </div>
              <div className="pre-item">
                <span className="pre-label">Capital Budget</span>
                <span className="pre-val">${budget.toLocaleString()}</span>
              </div>
              <div className="pre-item">
                <span className="pre-label">Total Required</span>
                <span className="pre-val">${selected.reduce((s, o) => s + o.required_capital, 0).toLocaleString()}</span>
              </div>
              <div className="pre-item">
                <span className="pre-label">Risk Tolerance</span>
                <span className="pre-val">{constraints?.risk_tolerance || 0}/10</span>
              </div>
            </div>
          </div>
          <button className="btn-run" onClick={runPortfolioOptimisation}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            Run Portfolio Optimisation
          </button>
        </div>
      ) : (
        <div className="portfolio-results">
          {/* Headline Metrics */}
          <div className="port-metrics">
            <div className="port-metric primary">
              <span className="pm-label">Objective Score</span>
              <span className="pm-val">{portfolio.objective_score}/100</span>
              <div className="score-ring-mini">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="32" fill="none"
                    stroke={portfolio.objective_score >= 60 ? '#22C55E' : portfolio.objective_score >= 40 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${portfolio.objective_score * 2.01} 201`}
                    transform="rotate(-90 40 40)" />
                </svg>
              </div>
            </div>
            <div className="port-metric">
              <span className="pm-label">Expected Return</span>
              <span className="pm-val" style={{ color: portfolio.portfolio_expected_return >= 0 ? '#22C55E' : '#EF4444' }}>
                ${(portfolio.portfolio_expected_return / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="port-metric">
              <span className="pm-label">Portfolio Risk</span>
              <span className="pm-val" style={{ color: portfolio.portfolio_risk > 60 ? '#EF4444' : '#14B8A6' }}>
                {portfolio.portfolio_risk}
              </span>
            </div>
            <div className="port-metric">
              <span className="pm-label">Capital Deployed</span>
              <span className="pm-val">${(portfolio.total_capital_deployed / 1000).toFixed(0)}K</span>
            </div>
          </div>

          {/* Allocation Pie (CSS-based) */}
          <div className="alloc-section">
            <h4>Optimal Capital Allocation</h4>
            <div className="alloc-list">
              {Object.entries(portfolio.optimal_allocation).map(([optId, amount], i) => {
                const option = strategic_options.find(o => o.id === optId);
                const pct = budget > 0 ? (amount / budget) * 100 : 0;
                const colors = ['#14B8A6', '#A855F7', '#3B82F6', '#F59E0B', '#EC4899', '#22C55E'];
                return (
                  <div key={optId} className="alloc-item">
                    <div className="alloc-color" style={{ background: colors[i % colors.length] }} />
                    <div className="alloc-info">
                      <span className="alloc-name">{option?.name || optId}</span>
                      <span className="alloc-amount">${amount.toLocaleString()}</span>
                    </div>
                    <div className="alloc-bar-wrap">
                      <div className="alloc-bar" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                    </div>
                    <span className="alloc-pct">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Efficient Frontier */}
          <div className="frontier-section">
            <h4>Efficient Frontier</h4>
            <div className="frontier-chart">
              <div className="frontier-grid">
                {portfolio.efficient_frontier.map((pt, i) => (
                  <div key={i} className="frontier-dot"
                    style={{
                      left: `${pt.risk}%`,
                      bottom: `${Math.min(100, pt.return_)}%`,
                    }}
                    title={`Risk: ${pt.risk}, Return: ${pt.return_}`}
                  />
                ))}
                {/* Current portfolio position */}
                <div className="frontier-current"
                  style={{
                    left: `${Math.min(100, portfolio.portfolio_risk)}%`,
                    bottom: `${Math.min(100, Math.max(0, (portfolio.portfolio_expected_return / Math.max(1, budget)) * 100))}%`,
                  }}
                />
              </div>
              <div className="frontier-axes">
                <span className="axis-x">Risk →</span>
                <span className="axis-y">Return →</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-complete" onClick={() => setPhase('governance')}>
              View Governance & Audit Log
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .phase-form { max-width: 960px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 24px;
          padding: 12px 16px; background: rgba(20, 184, 166, 0.08);
          border: 1px solid rgba(20, 184, 166, 0.2); border-radius: 10px;
          border-left: 3px solid #14B8A6;
        }
        .run-section { text-align: center; }
        .pre-summary {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: left;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .pre-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .pre-item { padding: 12px; background: var(--bg-tertiary); border-radius: 10px; text-align: center; }
        .pre-label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .pre-val { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .btn-run {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 32px; background: linear-gradient(135deg, #14B8A6, #22C55E);
          border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-run:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(20, 184, 166, 0.4); }
        .port-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .port-metric {
          padding: 16px; background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; text-align: center;
        }
        .port-metric.primary { position: relative; }
        .pm-label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .pm-val { font-size: 22px; font-weight: 800; color: var(--text-primary); }
        .score-ring-mini { display: flex; justify-content: center; margin-top: 8px; }
        .alloc-section, .frontier-section {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px; margin-bottom: 20px;
        }
        .alloc-list { display: flex; flex-direction: column; gap: 10px; }
        .alloc-item { display: flex; align-items: center; gap: 12px; }
        .alloc-color { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
        .alloc-info { flex: 0 0 200px; }
        .alloc-name { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .alloc-amount { font-size: 11px; color: var(--text-muted); }
        .alloc-bar-wrap { flex: 1; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
        .alloc-bar { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .alloc-pct { font-size: 13px; font-weight: 600; color: var(--text-primary); min-width: 50px; text-align: right; }
        .frontier-chart { position: relative; height: 200px; }
        .frontier-grid {
          position: relative; width: 100%; height: 100%;
          background: var(--bg-tertiary); border-radius: 10px;
          border-left: 2px solid var(--border); border-bottom: 2px solid var(--border);
        }
        .frontier-dot {
          position: absolute; width: 8px; height: 8px;
          background: #A855F7; border-radius: 50%;
          transform: translate(-50%, 50%);
        }
        .frontier-current {
          position: absolute; width: 14px; height: 14px;
          background: #14B8A6; border: 2px solid white;
          border-radius: 50%; transform: translate(-50%, 50%);
          box-shadow: 0 0 12px rgba(20, 184, 166, 0.5);
          z-index: 2;
        }
        .frontier-axes { display: flex; justify-content: space-between; margin-top: 8px; }
        .axis-x, .axis-y { font-size: 11px; color: var(--text-muted); }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #14B8A6, #22C55E);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(20, 184, 166, 0.3); }
        @media (max-width: 768px) { .port-metrics { grid-template-columns: 1fr 1fr; } .pre-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
