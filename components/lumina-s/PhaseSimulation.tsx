'use client';

import { useStrategyEngine } from '../../state/useStrategyEngine';

export default function PhaseSimulation() {
  const { strategic_options, simulations, runSimulations, setPhase } = useStrategyEngine();
  const selected = strategic_options.filter(o => o.selected);

  const handleRun = () => {
    runSimulations();
  };

  return (
    <div className="phase-form">
      <p className="phase-description">
        Every option must show risk-adjusted outcome. Financial projections, competitive reaction models, real options analysis, and sensitivity testing.
      </p>

      {simulations.length === 0 ? (
        <div className="run-section">
          <h4>Selected Options for Simulation ({selected.length})</h4>
          <div className="selected-list">
            {selected.map(o => (
              <div key={o.id} className="selected-item">
                <span className="sel-name">{o.name}</span>
                <span className="sel-cap">${o.required_capital.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button className="btn-run" onClick={handleRun}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Run Strategic Simulations
          </button>
        </div>
      ) : (
        <div className="results-section">
          <h4>Simulation Results</h4>
          {simulations.map(sim => {
            const option = strategic_options.find(o => o.id === sim.option_id);
            if (!option) return null;
            return (
              <div key={sim.option_id} className="sim-card">
                <div className="sim-header">
                  <h5>{option.name}</h5>
                  <span className={`npv-badge ${sim.risk_adjusted_npv >= 0 ? 'positive' : 'negative'}`}>
                    NPV: ${(sim.risk_adjusted_npv / 1000).toFixed(0)}K
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="sim-metrics">
                  <div className="sim-metric">
                    <span className="sm-label">Expected Value</span>
                    <span className="sm-val">${(sim.expected_value / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="sim-metric">
                    <span className="sm-label">Risk-Adj NPV</span>
                    <span className="sm-val" style={{ color: sim.risk_adjusted_npv >= 0 ? '#22C55E' : '#EF4444' }}>
                      ${(sim.risk_adjusted_npv / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="sim-metric">
                    <span className="sm-label">Target Prob</span>
                    <span className="sm-val">{sim.probability_of_target}%</span>
                  </div>
                  <div className="sim-metric">
                    <span className="sm-label">Volatility</span>
                    <span className="sm-val" style={{ color: sim.volatility_score > 60 ? '#EF4444' : sim.volatility_score > 30 ? '#F59E0B' : '#22C55E' }}>
                      {sim.volatility_score}
                    </span>
                  </div>
                </div>

                {/* Cash Flow */}
                <div className="cf-section">
                  <span className="cf-title">Cash Flow Trajectory (5yr)</span>
                  <div className="cf-bars">
                    {sim.cash_flow_trajectory.map((cf, i) => (
                      <div key={i} className="cf-bar-wrap">
                        <div className={`cf-bar ${cf >= 0 ? 'pos' : 'neg'}`}
                          style={{ height: `${Math.min(100, Math.abs(cf) / (Math.max(...sim.cash_flow_trajectory.map(Math.abs)) || 1) * 80)}px` }} />
                        <span className="cf-val">${(cf / 1000).toFixed(0)}K</span>
                        <span className="cf-yr">Y{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitive Reaction */}
                <div className="reaction-box">
                  <span className="rb-title">Competitive Reaction</span>
                  <p className="rb-response">{sim.competitor_response}</p>
                  <p className="rb-outcome">{sim.game_theory_outcome}</p>
                </div>

                {/* Real Options */}
                <div className="ro-grid">
                  <div className="ro-item">
                    <span className="ro-label">Option to Expand</span>
                    <span className="ro-val">${(sim.option_to_expand_value / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="ro-item">
                    <span className="ro-label">Option to Abandon</span>
                    <span className="ro-val">${(sim.option_to_abandon_value / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="ro-item">
                    <span className="ro-label">Option to Delay</span>
                    <span className="ro-val">${(sim.option_to_delay_value / 1000).toFixed(0)}K</span>
                  </div>
                </div>

                {/* Sensitivity */}
                <div className="sens-section">
                  <span className="sens-title">Sensitivity Analysis (±20%)</span>
                  <div className="sens-table">
                    {sim.sensitivity_results.map((s, i) => (
                      <div key={i} className="sens-row">
                        <span className="sens-var">{s.variable}</span>
                        <div className="sens-bar-wrap">
                          <div className="sens-bar-neg" style={{ width: `${Math.max(5, 50 - (s.low / Math.max(1, Math.abs(s.base))) * 25)}%` }} />
                          <div className="sens-center" />
                          <div className="sens-bar-pos" style={{ width: `${Math.max(5, (s.high / Math.max(1, Math.abs(s.base))) * 25)}%` }} />
                        </div>
                        <span className="sens-range">{(s.low / 1000).toFixed(0)}K — {(s.high / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="form-actions">
            <button className="btn-complete" onClick={() => setPhase('scenarios')}>
              Generate Scenarios
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .phase-form { max-width: 960px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 24px;
          padding: 12px 16px; background: rgba(168, 85, 247, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 10px;
          border-left: 3px solid #A855F7;
        }
        .run-section, .results-section {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 24px;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .selected-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .selected-item {
          display: flex; justify-content: space-between; padding: 12px 16px;
          background: var(--bg-tertiary); border-radius: 10px;
        }
        .sel-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
        .sel-cap { font-size: 14px; color: var(--text-muted); }
        .btn-run {
          display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
          padding: 16px; background: linear-gradient(135deg, #A855F7, #EC4899);
          border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-run:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4); }
        .sim-card {
          padding: 20px; background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 12px; margin-bottom: 16px;
        }
        .sim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        h5 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0; }
        .npv-badge {
          padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 700;
        }
        .npv-badge.positive { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .npv-badge.negative { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
        .sim-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
        .sim-metric { padding: 12px; background: rgba(0,0,0,0.2); border-radius: 10px; text-align: center; }
        .sm-label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .sm-val { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .cf-section { margin-bottom: 16px; }
        .cf-title, .rb-title, .sens-title { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
        .cf-bars { display: flex; gap: 12px; align-items: flex-end; height: 120px; padding: 8px 0; }
        .cf-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
        .cf-bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.3s; }
        .cf-bar.pos { background: linear-gradient(180deg, #22C55E, #14B8A6); }
        .cf-bar.neg { background: linear-gradient(180deg, #EF4444, #F97316); }
        .cf-val { font-size: 10px; font-weight: 600; color: var(--text-primary); margin-top: 4px; }
        .cf-yr { font-size: 10px; color: var(--text-muted); }
        .reaction-box {
          padding: 14px; background: rgba(168, 85, 247, 0.06);
          border: 1px solid rgba(168, 85, 247, 0.15); border-radius: 10px;
          margin-bottom: 16px;
        }
        .rb-response { font-size: 13px; color: var(--text-secondary); margin: 4px 0; }
        .rb-outcome { font-size: 13px; color: #A855F7; font-weight: 500; margin: 0; }
        .ro-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
        .ro-item { padding: 12px; background: rgba(0,0,0,0.15); border-radius: 10px; text-align: center; }
        .ro-label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .ro-val { font-size: 16px; font-weight: 700; color: #14B8A6; }
        .sens-section { }
        .sens-table { display: flex; flex-direction: column; gap: 8px; }
        .sens-row { display: flex; align-items: center; gap: 12px; }
        .sens-var { font-size: 12px; color: var(--text-secondary); min-width: 110px; }
        .sens-bar-wrap { flex: 1; display: flex; align-items: center; height: 8px; }
        .sens-bar-neg { height: 100%; background: #EF4444; border-radius: 4px 0 0 4px; }
        .sens-center { width: 2px; height: 12px; background: var(--text-muted); }
        .sens-bar-pos { height: 100%; background: #22C55E; border-radius: 0 4px 4px 0; }
        .sens-range { font-size: 11px; color: var(--text-muted); min-width: 100px; text-align: right; }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #A855F7, #EC4899);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168, 85, 247, 0.3); }
        @media (max-width: 768px) { .sim-metrics { grid-template-columns: 1fr 1fr; } .ro-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
