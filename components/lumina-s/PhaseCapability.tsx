'use client';

import { useState } from 'react';
import { useStrategyEngine, computeCapabilityMetrics } from '../../state/useStrategyEngine';

export default function PhaseCapability() {
  const { capability, updateCapability, completeCapability } = useStrategyEngine();
  const [compInput, setCompInput] = useState('');
  const [diffInput, setDiffInput] = useState('');

  if (!capability) return null;

  const addCore = () => { if (!compInput.trim()) return; updateCapability({ core_competencies: [...capability.core_competencies, compInput.trim()] }); setCompInput(''); };
  const addDiff = () => { if (!diffInput.trim()) return; updateCapability({ differentiating_capabilities: [...capability.differentiating_capabilities, diffInput.trim()] }); setDiffInput(''); };

  const preview = computeCapabilityMetrics(capability);

  const capabilities = [
    { key: 'operational_efficiency' as const, label: 'Operational Efficiency' },
    { key: 'brand_strength' as const, label: 'Brand Strength' },
    { key: 'innovation_capacity' as const, label: 'Innovation Capacity' },
    { key: 'digital_maturity' as const, label: 'Digital Maturity' },
  ];

  return (
    <div className="phase-form">
      <p className="phase-description">
        Strategy fails if capability cannot execute it. If capability gaps exceed threshold, execution risk will be flagged.
      </p>

      {/* Capability Sliders */}
      <div className="cap-section">
        <h4>Capability Assessment</h4>
        <div className="cap-grid">
          {capabilities.map(cap => (
            <div key={cap.key} className="cap-item">
              <div className="cap-header">
                <span className="cap-label">{cap.label}</span>
                <span className={`cap-val ${capability[cap.key] <= 4 ? 'low' : capability[cap.key] >= 7 ? 'high' : ''}`}>
                  {capability[cap.key]}/10
                </span>
              </div>
              <input
                type="range" className="form-range" min={1} max={10} step={1}
                value={capability[cap.key]}
                onChange={e => updateCapability({ [cap.key]: Number(e.target.value) })}
              />
              <div className="heatmap-bar">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`heat-cell ${i < capability[cap.key] ? (i < 4 ? 'low' : i < 7 ? 'mid' : 'high') : ''}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competencies */}
      <div className="comp-section">
        <h4>Core Competencies</h4>
        <div className="add-inline">
          <input type="text" className="form-input" value={compInput}
            onChange={e => setCompInput(e.target.value)} placeholder="e.g., Supply chain management"
            onKeyDown={e => e.key === 'Enter' && addCore()} />
          <button className="btn-inline" onClick={addCore}>Add</button>
        </div>
        <div className="tag-list">
          {capability.core_competencies.map((c, i) => (
            <span key={i} className="tag">
              {c}
              <button onClick={() => updateCapability({ core_competencies: capability.core_competencies.filter((_, j) => j !== i) })}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="comp-section">
        <h4>Differentiating Capabilities</h4>
        <div className="add-inline">
          <input type="text" className="form-input" value={diffInput}
            onChange={e => setDiffInput(e.target.value)} placeholder="e.g., Proprietary AI engine"
            onKeyDown={e => e.key === 'Enter' && addDiff()} />
          <button className="btn-inline" onClick={addDiff}>Add</button>
        </div>
        <div className="tag-list">
          {capability.differentiating_capabilities.map((c, i) => (
            <span key={i} className="tag diff">
              {c}
              <button onClick={() => updateCapability({ differentiating_capabilities: capability.differentiating_capabilities.filter((_, j) => j !== i) })}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Readiness Dashboard */}
      <div className="readiness-section">
        <h4>Strategic Readiness</h4>
        <div className="readiness-grid">
          <div className="readiness-score">
            <div className="score-ring">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={preview.strategic_readiness_score >= 60 ? '#A855F7' : preview.strategic_readiness_score >= 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${preview.strategic_readiness_score * 3.14} 314`}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="55" textAnchor="middle" className="score-text">{preview.strategic_readiness_score}</text>
                <text x="60" y="72" textAnchor="middle" className="score-label">/ 100</text>
              </svg>
            </div>
          </div>
          <div className="readiness-details">
            {preview.capability_gaps.length > 0 && (
              <div className="gaps">
                <span className="gap-title">Capability Gaps</span>
                {preview.capability_gaps.map((g, i) => (
                  <span key={i} className="gap-tag">{g}</span>
                ))}
              </div>
            )}
            {preview.execution_risk_flagged && (
              <div className="risk-flag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                EXECUTION RISK: Capability gaps exceed threshold
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-complete" onClick={completeCapability}>
          Complete Phase 5 & Generate Options
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
        .cap-section, .comp-section, .readiness-section {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px; margin-bottom: 20px;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .cap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .cap-item { }
        .cap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .cap-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
        .cap-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .cap-val.low { color: #EF4444; }
        .cap-val.high { color: #22C55E; }
        .form-range { width: 100%; accent-color: #A855F7; }
        .heatmap-bar { display: flex; gap: 2px; margin-top: 6px; }
        .heat-cell { flex: 1; height: 6px; background: var(--bg-tertiary); border-radius: 2px; }
        .heat-cell.low { background: #EF4444; }
        .heat-cell.mid { background: #F59E0B; }
        .heat-cell.high { background: #22C55E; }
        .add-inline { display: flex; gap: 8px; margin-bottom: 12px; }
        .form-input {
          flex: 1; padding: 10px 14px; background: var(--bg-tertiary);
          border: 1px solid var(--border); border-radius: 8px;
          font-size: 14px; color: var(--text-primary); outline: none;
        }
        .form-input:focus { border-color: #A855F7; }
        .form-input::placeholder { color: var(--text-muted); }
        .btn-inline {
          padding: 10px 18px; background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px;
          font-size: 13px; font-weight: 600; color: #C084FC; cursor: pointer;
        }
        .tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; background: var(--bg-tertiary);
          border: 1px solid var(--border); border-radius: 6px;
          font-size: 12px; color: var(--text-secondary);
        }
        .tag.diff { border-color: rgba(124, 58, 237, 0.3); color: #A855F7; }
        .tag button { background: none; border: none; color: #EF4444; cursor: pointer; font-size: 14px; padding: 0; }
        .readiness-grid { display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: center; }
        .score-ring { display: flex; justify-content: center; }
        .score-ring svg .score-text { font-size: 28px; font-weight: 800; fill: var(--text-primary); }
        .score-ring svg .score-label { font-size: 12px; fill: var(--text-muted); }
        .readiness-details { display: flex; flex-direction: column; gap: 12px; }
        .gaps { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .gap-title { font-size: 12px; color: var(--text-muted); font-weight: 600; }
        .gap-tag {
          padding: 4px 10px; background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px;
          font-size: 12px; color: #F87171; text-transform: capitalize;
        }
        .risk-flag {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #EF4444;
        }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #A855F7, #C084FC);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3); }
        @media (max-width: 768px) { .cap-grid { grid-template-columns: 1fr; } .readiness-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
