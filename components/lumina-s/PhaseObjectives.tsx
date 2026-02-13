'use client';

import { useState } from 'react';
import { useStrategyEngine, ObjectiveNode } from '../../state/useStrategyEngine';

export default function PhaseObjectives() {
  const { objectives, updateObjectives, addObjective, removeObjective, completeObjectives } = useStrategyEngine();

  const [newObj, setNewObj] = useState<Partial<ObjectiveNode>>({
    level: 1, label: '', metric: '', baseline: 0, target: 0, deadline: '', priority_weight: 3,
  });

  if (!objectives) return null;

  const hasQuantifiedTarget = objectives.objectives.some(o => o.target > 0);

  const handleAdd = () => {
    if (!newObj.label || !newObj.metric) return;
    addObjective({
      id: `obj-${Date.now()}`,
      level: newObj.level as 1 | 2 | 3,
      parent_id: null,
      label: newObj.label || '',
      metric: newObj.metric || '',
      baseline: newObj.baseline || 0,
      target: newObj.target || 0,
      deadline: newObj.deadline || '',
      priority_weight: (newObj.priority_weight || 3) as 1 | 2 | 3 | 4 | 5,
    });
    setNewObj({ level: 1, label: '', metric: '', baseline: 0, target: 0, deadline: '', priority_weight: 3 });
  };

  const grouped = {
    1: objectives.objectives.filter(o => o.level === 1),
    2: objectives.objectives.filter(o => o.level === 2),
    3: objectives.objectives.filter(o => o.level === 3),
  };

  return (
    <div className="phase-form">
      <p className="phase-description">
        Construct a quantified objective hierarchy. At least one quantified target is required before simulation.
      </p>

      <div className="form-row">
        <div className="form-section">
          <label className="form-label">Vision Statement</label>
          <textarea
            className="form-textarea"
            value={objectives.vision}
            onChange={e => updateObjectives({ vision: e.target.value })}
            placeholder="Define the long-term aspirational state of the enterprise..."
            rows={3}
          />
        </div>
        <div className="form-section">
          <label className="form-label">Strategic Intent</label>
          <div className="chip-group">
            {(['growth', 'dominance', 'resilience', 'innovation', 'turnaround'] as const).map(intent => (
              <button
                key={intent}
                className={`chip ${objectives.strategic_intent === intent ? 'active' : ''}`}
                onClick={() => updateObjectives({ strategic_intent: intent })}
              >
                {intent.charAt(0).toUpperCase() + intent.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Objective Form */}
      <div className="add-form">
        <h4>Add Objective</h4>
        <div className="add-grid">
          <div className="form-section">
            <label className="form-label">Level</label>
            <select
              className="form-select"
              value={newObj.level}
              onChange={e => setNewObj({ ...newObj, level: Number(e.target.value) as 1 | 2 | 3 })}
            >
              <option value={1}>L1 - Enterprise Goal</option>
              <option value={2}>L2 - Business Unit Goal</option>
              <option value={3}>L3 - Operational Goal</option>
            </select>
          </div>
          <div className="form-section">
            <label className="form-label">Objective Label *</label>
            <input
              type="text" className="form-input"
              value={newObj.label}
              onChange={e => setNewObj({ ...newObj, label: e.target.value })}
              placeholder="e.g., Increase market share"
            />
          </div>
          <div className="form-section">
            <label className="form-label">Metric *</label>
            <input
              type="text" className="form-input"
              value={newObj.metric}
              onChange={e => setNewObj({ ...newObj, metric: e.target.value })}
              placeholder="e.g., Revenue, EBITDA margin %"
            />
          </div>
          <div className="form-section">
            <label className="form-label">Baseline</label>
            <input
              type="number" className="form-input"
              value={newObj.baseline || ''}
              onChange={e => setNewObj({ ...newObj, baseline: Number(e.target.value) })}
              placeholder="Current value"
            />
          </div>
          <div className="form-section">
            <label className="form-label">Target *</label>
            <input
              type="number" className="form-input"
              value={newObj.target || ''}
              onChange={e => setNewObj({ ...newObj, target: Number(e.target.value) })}
              placeholder="Target value"
            />
          </div>
          <div className="form-section">
            <label className="form-label">Deadline</label>
            <input
              type="date" className="form-input"
              value={newObj.deadline}
              onChange={e => setNewObj({ ...newObj, deadline: e.target.value })}
            />
          </div>
          <div className="form-section">
            <label className="form-label">Priority (1-5)</label>
            <input
              type="range" className="form-range" min={1} max={5} step={1}
              value={newObj.priority_weight}
              onChange={e => setNewObj({ ...newObj, priority_weight: Number(e.target.value) as 1|2|3|4|5 })}
            />
            <span className="range-val">{newObj.priority_weight}</span>
          </div>
        </div>
        <button className="btn-add" onClick={handleAdd} disabled={!newObj.label || !newObj.metric}>
          + Add Objective
        </button>
      </div>

      {/* Objective Tree */}
      <div className="obj-tree">
        <h4>Objective Hierarchy</h4>
        {objectives.objectives.length === 0 ? (
          <p className="empty">No objectives defined yet. Add at least one quantified target.</p>
        ) : (
          <div className="tree-levels">
            {([1, 2, 3] as const).map(level => {
              const items = grouped[level];
              if (items.length === 0) return null;
              return (
                <div key={level} className="tree-level">
                  <span className="level-badge">Level {level}</span>
                  {items.map(obj => (
                    <div key={obj.id} className="obj-card">
                      <div className="obj-main">
                        <span className="obj-label">{obj.label}</span>
                        <span className="obj-metric">{obj.metric}: {obj.baseline} → {obj.target}</span>
                      </div>
                      <div className="obj-meta">
                        <span className="obj-priority">P{obj.priority_weight}</span>
                        {obj.deadline && <span className="obj-deadline">{obj.deadline}</span>}
                        <button className="obj-remove" onClick={() => removeObjective(obj.id)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!hasQuantifiedTarget && objectives.objectives.length > 0 && (
        <div className="warning-box">
          At least one objective must have a quantified target (target &gt; 0) before you can proceed.
        </div>
      )}

      <div className="form-actions">
        <button className="btn-complete" onClick={completeObjectives} disabled={!hasQuantifiedTarget}>
          Complete Phase 2 & Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      <style jsx>{`
        .phase-form { max-width: 900px; }
        .phase-description {
          font-size: 13px; color: rgba(245, 158, 11, 0.8); margin-bottom: 28px;
          padding: 12px 16px; background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.12); border-radius: 12px;
          border-left: 3px solid rgba(245, 158, 11, 0.5); line-height: 1.5;
        }
        .form-section { margin-bottom: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; font-size: 14px; color: #fff;
          outline: none; transition: border-color 0.2s; font-family: inherit;
        }
        .form-textarea { resize: vertical; font-family: inherit; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: rgba(168, 85, 247, 0.4); }
        .form-input::placeholder, .form-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 8px; }
        .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip {
          padding: 8px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5);
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .chip:hover { border-color: rgba(168, 85, 247, 0.25); }
        .chip.active { background: rgba(168, 85, 247, 0.12); border-color: rgba(168, 85, 247, 0.3); color: #C084FC; }
        .add-form {
          padding: 20px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; margin-bottom: 24px;
        }
        .add-form h4 { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 16px; }
        .add-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px; }
        .form-range { width: 100%; }
        .range-val { font-size: 13px; color: #A855F7; font-weight: 600; }
        .btn-add {
          padding: 10px 20px; background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 10px; font-size: 13px; font-weight: 600; color: #C084FC;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .btn-add:hover:not(:disabled) { background: rgba(168, 85, 247, 0.2); }
        .btn-add:disabled { opacity: 0.35; cursor: not-allowed; }
        .obj-tree {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 20px; margin-bottom: 16px;
        }
        .obj-tree h4 { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 16px; }
        .empty { font-size: 13px; color: rgba(255,255,255,0.25); font-style: italic; }
        .tree-levels { display: flex; flex-direction: column; gap: 16px; }
        .tree-level { display: flex; flex-direction: column; gap: 8px; }
        .level-badge {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.25);
          text-transform: uppercase; letter-spacing: 1px;
        }
        .obj-card {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 16px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;
          transition: all 0.2s;
        }
        .obj-card:hover { border-color: rgba(255,255,255,0.1); }
        .obj-main { display: flex; flex-direction: column; gap: 2px; }
        .obj-label { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); }
        .obj-metric { font-size: 12px; color: rgba(255,255,255,0.35); }
        .obj-meta { display: flex; align-items: center; gap: 10px; }
        .obj-priority {
          padding: 3px 8px; background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 6px; font-size: 11px; font-weight: 600; color: #14B8A6;
        }
        .obj-deadline { font-size: 11px; color: rgba(255,255,255,0.3); }
        .obj-remove {
          width: 26px; height: 26px; background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.12); border-radius: 8px; color: #EF4444;
          cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
        }
        .obj-remove:hover { background: rgba(239, 68, 68, 0.12); }
        .warning-box {
          padding: 12px 16px; background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.12); border-radius: 12px;
          font-size: 13px; color: #F87171; margin-bottom: 16px; line-height: 1.5;
        }
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 28px; background: linear-gradient(135deg, #14B8A6, #0D9488);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.25s; font-family: inherit;
        }
        .btn-complete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(20, 184, 166, 0.3); }
        .btn-complete:disabled { opacity: 0.35; cursor: not-allowed; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } .add-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
