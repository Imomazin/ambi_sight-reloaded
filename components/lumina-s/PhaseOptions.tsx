'use client';

import { useState } from 'react';
import { useStrategyEngine, StrategicOptionObject } from '../../state/useStrategyEngine';

const OPTION_TYPES: { key: StrategicOptionObject['type']; label: string }[] = [
  { key: 'market_penetration', label: 'Market Penetration' },
  { key: 'product_diversification', label: 'Product Diversification' },
  { key: 'geographic_expansion', label: 'Geographic Expansion' },
  { key: 'vertical_integration', label: 'Vertical Integration' },
  { key: 'cost_leadership', label: 'Cost Leadership' },
  { key: 'premium_differentiation', label: 'Premium Differentiation' },
  { key: 'platform_strategy', label: 'Platform Strategy' },
  { key: 'custom', label: 'Custom Strategy' },
];

export default function PhaseOptions() {
  const { strategic_options, addOption, removeOption, toggleOptionSelected, constraints, setPhase } = useStrategyEngine();

  const [form, setForm] = useState({
    name: '', type: 'market_penetration' as StrategicOptionObject['type'],
    description: '', required_capital: 0, expected_revenue_uplift: 0,
    margin_impact: 0, risk_exposure: 5, capability_strain_index: 30, time_to_impact_months: 12,
  });

  const handleAdd = () => {
    if (!form.name) return;
    addOption(form);
    setForm({ name: '', type: 'market_penetration', description: '', required_capital: 0, expected_revenue_uplift: 0, margin_impact: 0, risk_exposure: 5, capability_strain_index: 30, time_to_impact_months: 12 });
  };

  const capitalCeiling = constraints?.capital_ceiling || 0;
  const selectedCapital = strategic_options.filter(o => o.selected).reduce((s, o) => s + o.required_capital, 0);
  const hasSelected = strategic_options.some(o => o.selected);

  return (
    <div className="phase-form">
      <p className="phase-description">
        Now and only now. Generate structured strategic options tied to context, objectives, constraints, competitive intelligence and capability.
      </p>

      {/* Capital Budget Indicator */}
      {capitalCeiling > 0 && (
        <div className="budget-bar">
          <div className="budget-header">
            <span>Capital Budget</span>
            <span className={selectedCapital > capitalCeiling ? 'over' : ''}>
              ${selectedCapital.toLocaleString()} / ${capitalCeiling.toLocaleString()}
            </span>
          </div>
          <div className="budget-track">
            <div className="budget-fill" style={{ width: `${Math.min(100, (selectedCapital / capitalCeiling) * 100)}%`, background: selectedCapital > capitalCeiling ? '#EF4444' : '#A855F7' }} />
          </div>
        </div>
      )}

      {/* Add Option Form */}
      <div className="add-form">
        <h4>Create Strategic Option</h4>
        <div className="form-grid">
          <div className="form-section span-2">
            <label className="form-label">Option Name *</label>
            <input type="text" className="form-input" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Enter Southeast Asian market" />
          </div>
          <div className="form-section">
            <label className="form-label">Strategy Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value as StrategicOptionObject['type']})}>
              {OPTION_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-section">
            <label className="form-label">Required Capital ($)</label>
            <input type="number" className="form-input" value={form.required_capital || ''}
              onChange={e => setForm({...form, required_capital: Number(e.target.value)})} placeholder="Investment needed" />
          </div>
          <div className="form-section">
            <label className="form-label">Revenue Uplift (%)</label>
            <input type="number" className="form-input" value={form.expected_revenue_uplift || ''}
              onChange={e => setForm({...form, expected_revenue_uplift: Number(e.target.value)})} />
          </div>
          <div className="form-section">
            <label className="form-label">Margin Impact (pp)</label>
            <input type="number" className="form-input" value={form.margin_impact || ''}
              onChange={e => setForm({...form, margin_impact: Number(e.target.value)})} />
          </div>
          <div className="form-section">
            <label className="form-label">Risk Exposure (1-10): {form.risk_exposure}</label>
            <input type="range" className="form-range" min={1} max={10} value={form.risk_exposure}
              onChange={e => setForm({...form, risk_exposure: Number(e.target.value)})} />
          </div>
          <div className="form-section">
            <label className="form-label">Capability Strain (0-100): {form.capability_strain_index}</label>
            <input type="range" className="form-range" min={0} max={100} value={form.capability_strain_index}
              onChange={e => setForm({...form, capability_strain_index: Number(e.target.value)})} />
          </div>
          <div className="form-section">
            <label className="form-label">Time to Impact (months)</label>
            <input type="number" className="form-input" value={form.time_to_impact_months || ''}
              onChange={e => setForm({...form, time_to_impact_months: Number(e.target.value)})} />
          </div>
          <div className="form-section span-2">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} rows={2}
              onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the strategic option..." />
          </div>
        </div>
        <button className="btn-add" onClick={handleAdd} disabled={!form.name}>+ Add Option</button>
      </div>

      {/* Options List */}
      <div className="options-list">
        <h4>Strategic Options ({strategic_options.length})</h4>
        {strategic_options.length === 0 ? (
          <p className="empty">No options created yet. Add at least one option and select it to proceed.</p>
        ) : (
          <div className="option-cards">
            {strategic_options.map(opt => (
              <div key={opt.id} className={`option-card ${opt.selected ? 'selected' : ''}`}>
                <div className="opt-header">
                  <button className={`select-btn ${opt.selected ? 'on' : ''}`} onClick={() => toggleOptionSelected(opt.id)}>
                    {opt.selected ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <span className="select-empty" />
                    )}
                  </button>
                  <div className="opt-title">
                    <span className="opt-name">{opt.name}</span>
                    <span className="opt-type">{OPTION_TYPES.find(t => t.key === opt.type)?.label}</span>
                  </div>
                  <button className="opt-remove" onClick={() => removeOption(opt.id)}>×</button>
                </div>
                {opt.description && <p className="opt-desc">{opt.description}</p>}
                <div className="opt-metrics">
                  <div className="opt-metric"><span className="m-label">Capital</span><span className="m-val">${opt.required_capital.toLocaleString()}</span></div>
                  <div className="opt-metric"><span className="m-label">Revenue +</span><span className="m-val">{opt.expected_revenue_uplift}%</span></div>
                  <div className="opt-metric"><span className="m-label">Margin</span><span className="m-val">{opt.margin_impact > 0 ? '+' : ''}{opt.margin_impact}pp</span></div>
                  <div className="opt-metric"><span className="m-label">Risk</span><span className="m-val" style={{color: opt.risk_exposure > 7 ? '#EF4444' : opt.risk_exposure > 4 ? '#F59E0B' : '#22C55E'}}>{opt.risk_exposure}/10</span></div>
                  <div className="opt-metric"><span className="m-label">Strain</span><span className="m-val">{opt.capability_strain_index}%</span></div>
                  <div className="opt-metric"><span className="m-label">Timeline</span><span className="m-val">{opt.time_to_impact_months}mo</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn-complete" onClick={() => setPhase('simulation')} disabled={!hasSelected}>
          Proceed to Simulation
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      <style jsx>{`
        .phase-form { max-width: 960px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 24px;
          padding: 12px 16px; background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 10px;
          border-left: 3px solid #22C55E;
        }
        .budget-bar { margin-bottom: 20px; padding: 16px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; }
        .budget-header { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
        .budget-header .over { color: #EF4444; font-weight: 600; }
        .budget-track { height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
        .budget-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .add-form { padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px; }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .span-2 { grid-column: span 2; }
        .form-section { }
        .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 10px 14px; background: var(--bg-tertiary);
          border: 1px solid var(--border); border-radius: 8px;
          font-size: 14px; color: var(--text-primary); outline: none;
        }
        .form-textarea { resize: vertical; font-family: inherit; }
        .form-input:focus, .form-select:focus { border-color: #A855F7; }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--text-muted); }
        .form-range { width: 100%; accent-color: #A855F7; }
        .btn-add {
          padding: 10px 20px; background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px;
          font-size: 13px; font-weight: 600; color: #C084FC; cursor: pointer;
        }
        .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
        .options-list { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .empty { font-size: 13px; color: var(--text-muted); font-style: italic; }
        .option-cards { display: flex; flex-direction: column; gap: 12px; }
        .option-card {
          padding: 16px; background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 12px; transition: all 0.2s;
        }
        .option-card.selected { border-color: #A855F7; background: rgba(124, 58, 237, 0.05); }
        .opt-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .select-btn {
          width: 28px; height: 28px; border-radius: 8px;
          border: 2px solid var(--border); background: var(--bg-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: var(--text-muted);
        }
        .select-btn.on { background: #A855F7; border-color: #A855F7; color: white; }
        .select-empty { width: 12px; height: 12px; border-radius: 3px; background: var(--bg-tertiary); }
        .opt-title { flex: 1; }
        .opt-name { display: block; font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .opt-type { font-size: 12px; color: var(--text-muted); }
        .opt-remove {
          width: 28px; height: 28px; background: rgba(239, 68, 68, 0.1);
          border: none; border-radius: 8px; color: #EF4444; cursor: pointer;
          font-size: 16px; display: flex; align-items: center; justify-content: center;
        }
        .opt-desc { font-size: 13px; color: var(--text-muted); margin: 0 0 12px; }
        .opt-metrics { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
        .opt-metric { padding: 8px; background: rgba(0,0,0,0.15); border-radius: 8px; text-align: center; }
        .m-label { display: block; font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
        .m-val { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #A855F7, #EC4899);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168, 85, 247, 0.3); }
        .btn-complete:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } .opt-metrics { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </div>
  );
}
