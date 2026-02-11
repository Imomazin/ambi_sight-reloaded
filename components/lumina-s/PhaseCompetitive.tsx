'use client';

import { useState } from 'react';
import { useStrategyEngine, computeCompetitiveMetrics } from '../../state/useStrategyEngine';

export default function PhaseCompetitive() {
  const { market, updateMarket, addCompetitor, removeCompetitor, completeMarket } = useStrategyEngine();
  const [compName, setCompName] = useState('');
  const [compShare, setCompShare] = useState('');

  if (!market) return null;

  const handleAddComp = () => {
    if (!compName.trim()) return;
    addCompetitor({ name: compName.trim(), market_share: Number(compShare) || 0 });
    setCompName('');
    setCompShare('');
  };

  const preview = computeCompetitiveMetrics(market);
  const totalShare = market.competitors.reduce((s, c) => s + c.market_share, 0);

  return (
    <div className="phase-form">
      <p className="phase-description">
        Competitive intensity must be computed before advantage modelling. Define your competitive landscape.
      </p>

      {/* Five Forces */}
      <div className="forces-section">
        <h4>Porter's Five Forces</h4>
        <div className="forces-grid">
          {([
            { key: 'competitive_rivalry' as const, label: 'Competitive Rivalry' },
            { key: 'entry_barriers' as const, label: 'Entry Barriers' },
            { key: 'buyer_power' as const, label: 'Buyer Power' },
            { key: 'supplier_power' as const, label: 'Supplier Power' },
            { key: 'threat_substitution' as const, label: 'Threat of Substitution' },
          ]).map(force => (
            <div key={force.key} className="force-item">
              <label className="force-label">{force.label}</label>
              <input
                type="range" className="form-range" min={1} max={10} step={1}
                value={market[force.key]}
                onChange={e => updateMarket({ [force.key]: Number(e.target.value) })}
              />
              <div className="force-meta">
                <span>Low</span>
                <span className="force-val">{market[force.key]}</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitors */}
      <div className="comp-section">
        <h4>Competitors & Market Share</h4>
        <div className="add-comp">
          <input type="text" className="form-input" value={compName}
            onChange={e => setCompName(e.target.value)} placeholder="Competitor name"
            onKeyDown={e => e.key === 'Enter' && handleAddComp()} />
          <input type="number" className="form-input share-input" value={compShare}
            onChange={e => setCompShare(e.target.value)} placeholder="Share %" />
          <button className="btn-inline" onClick={handleAddComp}>Add</button>
        </div>

        {market.competitors.length > 0 && (
          <div className="comp-list">
            {market.competitors.map((c, i) => (
              <div key={i} className="comp-item">
                <span className="comp-name">{c.name}</span>
                <div className="comp-bar-wrap">
                  <div className="comp-bar" style={{ width: `${Math.min(100, c.market_share)}%` }} />
                </div>
                <span className="comp-share">{c.market_share}%</span>
                <button className="comp-remove" onClick={() => removeCompetitor(c.name)}>×</button>
              </div>
            ))}
            {totalShare > 0 && (
              <div className="comp-total">
                Total tracked: {totalShare.toFixed(1)}%
                {totalShare < 100 && <span className="untracked"> ({(100 - totalShare).toFixed(1)}% untracked)</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Computed Metrics */}
      <div className="metrics-preview">
        <h4>Computed Intelligence</h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Competitive Intensity</span>
            <span className="metric-val" style={{ color: preview.competitive_intensity_index > 60 ? '#EF4444' : '#14B8A6' }}>
              {preview.competitive_intensity_index}%
            </span>
            <div className="metric-bar"><div className="bar-fill intensity" style={{ width: `${preview.competitive_intensity_index}%` }} /></div>
          </div>
          <div className="metric-card">
            <span className="metric-label">Five Forces Score</span>
            <span className="metric-val">{preview.five_forces_score.toFixed(1)}<span className="metric-unit">/10</span></span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Market Attractiveness</span>
            <span className="metric-val" style={{ color: preview.market_attractiveness_score > 50 ? '#22C55E' : '#F59E0B' }}>
              {preview.market_attractiveness_score}%
            </span>
            <div className="metric-bar"><div className="bar-fill attract" style={{ width: `${preview.market_attractiveness_score}%` }} /></div>
          </div>
          <div className="metric-card">
            <span className="metric-label">HHI Index</span>
            <span className="metric-val">{preview.hhi_index.toFixed(0)}</span>
            <span className="metric-hint">
              {preview.hhi_index > 2500 ? 'Highly concentrated' : preview.hhi_index > 1500 ? 'Moderately concentrated' : 'Competitive market'}
            </span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-complete" onClick={completeMarket}>
          Complete Phase 4 & Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      <style jsx>{`
        .phase-form { max-width: 900px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 28px;
          padding: 12px 16px; background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 10px;
          border-left: 3px solid #F59E0B;
        }
        .forces-section, .comp-section, .metrics-preview {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px; margin-bottom: 20px;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .forces-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .force-item { }
        .force-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 4px; display: block; }
        .form-range { width: 100%; accent-color: #A855F7; }
        .force-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); }
        .force-val { font-weight: 700; color: #A855F7; font-size: 14px; }
        .add-comp { display: flex; gap: 8px; margin-bottom: 16px; }
        .form-input {
          flex: 1; padding: 10px 14px;
          background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 8px; font-size: 14px; color: var(--text-primary);
          outline: none;
        }
        .form-input:focus { border-color: #A855F7; }
        .form-input::placeholder { color: var(--text-muted); }
        .share-input { max-width: 100px; }
        .btn-inline {
          padding: 10px 18px; background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px;
          font-size: 13px; font-weight: 600; color: #C084FC; cursor: pointer;
          white-space: nowrap;
        }
        .comp-list { display: flex; flex-direction: column; gap: 8px; }
        .comp-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
        .comp-name { font-size: 13px; color: var(--text-primary); min-width: 120px; font-weight: 500; }
        .comp-bar-wrap { flex: 1; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
        .comp-bar { height: 100%; background: linear-gradient(90deg, #A855F7, #EC4899); border-radius: 3px; transition: width 0.3s; }
        .comp-share { font-size: 13px; color: var(--text-muted); min-width: 40px; text-align: right; }
        .comp-remove {
          width: 22px; height: 22px; background: rgba(239, 68, 68, 0.1);
          border: none; border-radius: 6px; color: #EF4444; cursor: pointer;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
        }
        .comp-total { font-size: 12px; color: var(--text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
        .untracked { color: #F59E0B; }
        .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .metric-card {
          padding: 16px; background: var(--bg-tertiary); border-radius: 10px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .metric-label { font-size: 12px; color: var(--text-muted); }
        .metric-val { font-size: 24px; font-weight: 700; color: var(--text-primary); }
        .metric-unit { font-size: 14px; color: var(--text-muted); font-weight: 400; }
        .metric-bar { height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
        .bar-fill.intensity { background: linear-gradient(90deg, #22C55E, #F59E0B, #EF4444); }
        .bar-fill.attract { background: linear-gradient(90deg, #14B8A6, #22C55E); }
        .metric-hint { font-size: 11px; color: var(--text-muted); }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(20, 184, 166, 0.3); }
        .btn-complete:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 768px) { .metrics-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
