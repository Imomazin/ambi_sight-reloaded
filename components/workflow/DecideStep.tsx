'use client';

import { useState } from 'react';
import { useProjectState, getNextStep, getPreviousStep } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';

interface PriorityItem {
  item: string;
  impact: number;
  effort: number;
}

interface DecideStepProps {
  onComplete?: () => void;
}

export default function DecideStep({ onComplete }: DecideStepProps) {
  const { getActiveProject, updateDecisionData, completeStep, setCurrentStep } = useProjectState();
  const { addNotification } = useAppState();
  const project = getActiveProject();

  const [priorities, setPriorities] = useState<PriorityItem[]>(
    project?.decide?.priorityMatrix || []
  );
  const [newPriority, setNewPriority] = useState({ item: '', impact: 5, effort: 5 });
  const [selectedStrategy, setSelectedStrategy] = useState(project?.decide?.selectedStrategy || '');

  const addPriority = () => {
    if (newPriority.item.trim()) {
      const updated = [...priorities, { ...newPriority, item: newPriority.item.trim() }];
      setPriorities(updated);
      updateDecisionData({ priorityMatrix: updated });
      setNewPriority({ item: '', impact: 5, effort: 5 });
    }
  };

  const removePriority = (index: number) => {
    const updated = priorities.filter((_, i) => i !== index);
    setPriorities(updated);
    updateDecisionData({ priorityMatrix: updated });
  };

  const getQuadrant = (impact: number, effort: number): string => {
    if (impact >= 5 && effort < 5) return 'Quick Wins';
    if (impact >= 5 && effort >= 5) return 'Major Projects';
    if (impact < 5 && effort < 5) return 'Fill-Ins';
    return 'Thankless Tasks';
  };

  const getQuadrantColor = (quadrant: string): string => {
    switch (quadrant) {
      case 'Quick Wins': return '#22C55E';
      case 'Major Projects': return '#3B82F6';
      case 'Fill-Ins': return '#F59E0B';
      case 'Thankless Tasks': return '#EF4444';
      default: return '#64748B';
    }
  };

  const handleSelectStrategy = (strategy: string) => {
    setSelectedStrategy(strategy);
    updateDecisionData({ selectedStrategy: strategy });
    addNotification({
      type: 'success',
      title: 'Strategy Selected',
      message: `You've selected: ${strategy}`,
    });
  };

  const handleComplete = () => {
    if (priorities.length < 2) {
      addNotification({
        type: 'warning',
        title: 'Add Priorities',
        message: 'Please add at least 2 initiatives to prioritize.',
      });
      return;
    }

    completeStep('decide');
    const nextStep = getNextStep('decide');
    if (nextStep) {
      setCurrentStep(nextStep);
    }

    addNotification({
      type: 'success',
      title: 'Decision Complete!',
      message: 'Moving to Deliver phase. Time to execute your strategy.',
    });

    onComplete?.();
  };

  const handleBack = () => {
    const prevStep = getPreviousStep('decide');
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  // Group priorities by quadrant
  const quadrants = {
    'Quick Wins': priorities.filter(p => p.impact >= 5 && p.effort < 5),
    'Major Projects': priorities.filter(p => p.impact >= 5 && p.effort >= 5),
    'Fill-Ins': priorities.filter(p => p.impact < 5 && p.effort < 5),
    'Thankless Tasks': priorities.filter(p => p.impact < 5 && p.effort >= 5),
  };

  return (
    <div className="decide-step">
      <div className="step-header">
        <div className="header-content">
          <span className="step-icon">⚖️</span>
          <div>
            <h2>Decide Your Priorities</h2>
            <p>Prioritize initiatives and make strategic choices</p>
          </div>
        </div>
      </div>

      <div className="decide-content">
        {/* Priority Matrix */}
        <div className="priority-section">
          <h3>Priority Matrix</h3>
          <p className="section-desc">Add initiatives and rate their impact and effort to prioritize effectively.</p>

          <div className="add-priority">
            <input
              type="text"
              value={newPriority.item}
              onChange={(e) => setNewPriority({ ...newPriority, item: e.target.value })}
              placeholder="Enter initiative or action item..."
            />
            <div className="sliders">
              <div className="slider-group">
                <label>Impact: {newPriority.impact}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newPriority.impact}
                  onChange={(e) => setNewPriority({ ...newPriority, impact: parseInt(e.target.value) })}
                />
              </div>
              <div className="slider-group">
                <label>Effort: {newPriority.effort}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newPriority.effort}
                  onChange={(e) => setNewPriority({ ...newPriority, effort: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <button onClick={addPriority} disabled={!newPriority.item.trim()}>
              Add to Matrix
            </button>
          </div>

          {/* Quadrant View */}
          <div className="quadrant-grid">
            {Object.entries(quadrants).map(([name, items]) => (
              <div key={name} className="quadrant" style={{ borderColor: getQuadrantColor(name) }}>
                <h4 style={{ color: getQuadrantColor(name) }}>{name}</h4>
                <p className="quadrant-hint">
                  {name === 'Quick Wins' && 'High impact, Low effort - Do these first!'}
                  {name === 'Major Projects' && 'High impact, High effort - Plan carefully'}
                  {name === 'Fill-Ins' && 'Low impact, Low effort - Do when time permits'}
                  {name === 'Thankless Tasks' && 'Low impact, High effort - Consider delegating'}
                </p>
                <div className="quadrant-items">
                  {items.map((item, index) => (
                    <div key={index} className="priority-item">
                      <span>{item.item}</span>
                      <div className="item-scores">
                        <span className="score">I:{item.impact}</span>
                        <span className="score">E:{item.effort}</span>
                      </div>
                      <button onClick={() => removePriority(priorities.indexOf(item))}>×</button>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="empty">No items in this quadrant</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="strategy-section">
          <h3>Select Primary Strategy Focus</h3>
          <div className="strategy-options">
            {[
              { id: 'growth', label: 'Growth & Expansion', icon: '📈', desc: 'Focus on scaling and market growth' },
              { id: 'efficiency', label: 'Operational Excellence', icon: '⚡', desc: 'Optimize processes and reduce costs' },
              { id: 'innovation', label: 'Innovation & Disruption', icon: '💡', desc: 'Lead with new products and ideas' },
              { id: 'customer', label: 'Customer Centricity', icon: '❤️', desc: 'Deepen customer relationships' },
            ].map(strategy => (
              <div
                key={strategy.id}
                className={`strategy-card ${selectedStrategy === strategy.id ? 'selected' : ''}`}
                onClick={() => handleSelectStrategy(strategy.id)}
              >
                <span className="strategy-icon">{strategy.icon}</span>
                <h4>{strategy.label}</h4>
                <p>{strategy.desc}</p>
                {selectedStrategy === strategy.id && <span className="check">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h3>Export Decision Summary</h3>
          <div className="export-buttons">
            <button className="export-btn">
              📄 Export to PDF
            </button>
            <button className="export-btn">
              📊 Export to CSV
            </button>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={handleBack}>
          ← Back to Design
        </button>
        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={priorities.length < 2}
        >
          Complete Decisions →
        </button>
      </div>

      <style jsx>{`
        .decide-step {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .step-header {
          padding: 24px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-icon {
          font-size: 40px;
        }

        .step-header h2 {
          margin: 0;
          font-size: 24px;
          color: var(--text-primary);
        }

        .step-header p {
          margin: 4px 0 0;
          color: var(--text-muted);
        }

        .decide-content {
          padding: 24px;
        }

        .priority-section, .strategy-section, .export-section {
          margin-bottom: 32px;
        }

        .priority-section h3, .strategy-section h3, .export-section h3 {
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .section-desc {
          margin: 0 0 20px;
          color: var(--text-muted);
        }

        .add-priority {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 12px;
        }

        .add-priority input[type="text"] {
          flex: 1;
          min-width: 200px;
          padding: 12px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .sliders {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .slider-group label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .slider-group input[type="range"] {
          width: 120px;
        }

        .add-priority > button {
          padding: 12px 20px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          font-weight: 500;
          color: white;
          cursor: pointer;
        }

        .add-priority > button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quadrant-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .quadrant {
          padding: 20px;
          background: var(--bg-tertiary);
          border: 2px solid;
          border-radius: 12px;
        }

        .quadrant h4 {
          margin: 0 0 4px;
        }

        .quadrant-hint {
          margin: 0 0 16px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .quadrant-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 60px;
        }

        .priority-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 13px;
        }

        .priority-item span:first-child {
          flex: 1;
          color: var(--text-primary);
        }

        .item-scores {
          display: flex;
          gap: 6px;
        }

        .score {
          padding: 2px 6px;
          background: var(--bg-primary);
          border-radius: 4px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .priority-item button {
          padding: 2px 6px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .empty {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
          font-style: italic;
        }

        .strategy-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .strategy-card {
          position: relative;
          padding: 20px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .strategy-card:hover {
          border-color: var(--accent);
        }

        .strategy-card.selected {
          border-color: #22C55E;
          background: rgba(34, 197, 94, 0.1);
        }

        .strategy-icon {
          font-size: 28px;
          display: block;
          margin-bottom: 8px;
        }

        .strategy-card h4 {
          margin: 0 0 4px;
          color: var(--text-primary);
        }

        .strategy-card p {
          margin: 0;
          font-size: 12px;
          color: var(--text-muted);
        }

        .check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          background: #22C55E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .export-buttons {
          display: flex;
          gap: 12px;
        }

        .export-btn {
          padding: 12px 20px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          border-color: var(--accent);
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          padding: 20px 24px;
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
        }

        .btn-primary {
          padding: 12px 24px;
          background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .quadrant-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
