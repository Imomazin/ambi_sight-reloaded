'use client';

import { useState } from 'react';
import { useStrategyEngine } from '../../state/useStrategyEngine';

export default function PhaseConstraints() {
  const { constraints, updateConstraints, completeConstraints } = useStrategyEngine();
  const [regInput, setRegInput] = useState('');

  if (!constraints) return null;

  const addRegConstraint = () => {
    if (!regInput.trim()) return;
    updateConstraints({
      regulatory_constraints: [...constraints.regulatory_constraints, regInput.trim()],
    });
    setRegInput('');
  };

  const removeRegConstraint = (idx: number) => {
    updateConstraints({
      regulatory_constraints: constraints.regulatory_constraints.filter((_, i) => i !== idx),
    });
  };

  const totalCapacity = constraints.available_capital + constraints.debt_capacity;

  return (
    <div className="phase-form">
      <p className="phase-description">
        Strategy is resource allocation. No strategic move will be allowed beyond the capital ceiling defined here.
      </p>

      <div className="form-row">
        <div className="form-section">
          <label className="form-label">Available Capital ($) *</label>
          <input
            type="number" className="form-input"
            value={constraints.available_capital || ''}
            onChange={e => updateConstraints({ available_capital: Number(e.target.value) })}
            placeholder="e.g., 5000000"
          />
        </div>
        <div className="form-section">
          <label className="form-label">Debt Capacity ($)</label>
          <input
            type="number" className="form-input"
            value={constraints.debt_capacity || ''}
            onChange={e => updateConstraints({ debt_capacity: Number(e.target.value) })}
            placeholder="e.g., 2000000"
          />
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Talent Capacity</label>
        <input
          type="text" className="form-input"
          value={constraints.talent_capacity}
          onChange={e => updateConstraints({ talent_capacity: e.target.value })}
          placeholder="e.g., 250 FTE, strong engineering but weak sales"
        />
      </div>

      <div className="form-row">
        <div className="form-section">
          <label className="form-label">Technology Maturity (1-5)</label>
          <div className="slider-wrap">
            <input
              type="range" className="form-range" min={1} max={5} step={1}
              value={constraints.technology_maturity}
              onChange={e => updateConstraints({ technology_maturity: Number(e.target.value) })}
            />
            <div className="range-labels">
              <span>Legacy</span>
              <span className="range-val">{constraints.technology_maturity}</span>
              <span>Cutting Edge</span>
            </div>
          </div>
        </div>
        <div className="form-section">
          <label className="form-label">Risk Tolerance (1-10)</label>
          <div className="slider-wrap">
            <input
              type="range" className="form-range" min={1} max={10} step={1}
              value={constraints.risk_tolerance}
              onChange={e => updateConstraints({ risk_tolerance: Number(e.target.value) })}
            />
            <div className="range-labels">
              <span>Conservative</span>
              <span className="range-val">{constraints.risk_tolerance}</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Regulatory Constraints</label>
        <div className="add-inline">
          <input
            type="text" className="form-input"
            value={regInput}
            onChange={e => setRegInput(e.target.value)}
            placeholder="e.g., GDPR compliance, SOX requirements"
            onKeyDown={e => e.key === 'Enter' && addRegConstraint()}
          />
          <button className="btn-inline" onClick={addRegConstraint}>Add</button>
        </div>
        {constraints.regulatory_constraints.length > 0 && (
          <div className="tag-list">
            {constraints.regulatory_constraints.map((r, i) => (
              <span key={i} className="tag">
                {r}
                <button onClick={() => removeRegConstraint(i)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resource Envelope Preview */}
      <div className="envelope-preview">
        <h4>Resource Envelope</h4>
        <div className="envelope-grid">
          <div className="env-item">
            <span className="env-label">Equity Capital</span>
            <span className="env-val">${(constraints.available_capital || 0).toLocaleString()}</span>
          </div>
          <div className="env-item">
            <span className="env-label">Debt Capacity</span>
            <span className="env-val">${(constraints.debt_capacity || 0).toLocaleString()}</span>
          </div>
          <div className="env-item highlight">
            <span className="env-label">Capital Ceiling</span>
            <span className="env-val">${totalCapacity.toLocaleString()}</span>
          </div>
          <div className="env-item">
            <span className="env-label">Risk Coefficient</span>
            <span className="env-val">{(constraints.risk_tolerance / 10).toFixed(1)}</span>
          </div>
        </div>
        {totalCapacity > 0 && (
          <div className="capital-bar">
            <div className="bar-track">
              <div className="bar-equity" style={{ width: `${(constraints.available_capital / totalCapacity) * 100}%` }} />
              <div className="bar-debt" style={{ width: `${(constraints.debt_capacity / totalCapacity) * 100}%` }} />
            </div>
            <div className="bar-legend">
              <span className="leg-equity">Equity</span>
              <span className="leg-debt">Debt</span>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn-complete" onClick={completeConstraints} disabled={constraints.available_capital <= 0}>
          Complete Phase 3 & Continue
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
        .form-section { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
        .form-input {
          width: 100%; padding: 10px 14px;
          background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 8px; font-size: 14px; color: var(--text-primary);
          outline: none; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #A855F7; }
        .form-input::placeholder { color: var(--text-muted); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-range { width: 100%; accent-color: #A855F7; }
        .slider-wrap { margin-top: 4px; }
        .range-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 4px; }
        .range-val { font-weight: 700; color: #A855F7; font-size: 14px; }
        .add-inline { display: flex; gap: 8px; }
        .add-inline .form-input { flex: 1; }
        .btn-inline {
          padding: 10px 18px; background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px;
          font-size: 13px; font-weight: 600; color: #C084FC; cursor: pointer;
        }
        .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .tag {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; background: var(--bg-tertiary);
          border: 1px solid var(--border); border-radius: 6px;
          font-size: 12px; color: var(--text-secondary);
        }
        .tag button {
          background: none; border: none; color: #EF4444; cursor: pointer;
          font-size: 14px; padding: 0;
        }
        .envelope-preview {
          padding: 20px; background: var(--bg-secondary);
          border: 1px solid var(--border); border-radius: 12px;
          margin-bottom: 16px;
        }
        .envelope-preview h4 {
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .envelope-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
        .env-item {
          padding: 12px; background: var(--bg-tertiary); border-radius: 10px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .env-item.highlight { background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.2); }
        .env-label { font-size: 11px; color: var(--text-muted); }
        .env-val { font-size: 16px; font-weight: 700; color: var(--text-primary); }
        .env-item.highlight .env-val { color: #A855F7; }
        .capital-bar { margin-top: 8px; }
        .bar-track { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: var(--bg-tertiary); }
        .bar-equity { background: #A855F7; transition: width 0.3s; }
        .bar-debt { background: #A855F7; transition: width 0.3s; }
        .bar-legend { display: flex; gap: 16px; margin-top: 6px; }
        .leg-equity, .leg-debt { font-size: 11px; display: flex; align-items: center; gap: 4px; color: var(--text-muted); }
        .leg-equity::before { content: ''; width: 8px; height: 8px; border-radius: 2px; background: #A855F7; }
        .leg-debt::before { content: ''; width: 8px; height: 8px; border-radius: 2px; background: #A855F7; }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #A855F7, #C084FC);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3); }
        .btn-complete:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } .envelope-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
