'use client';

import { useState } from 'react';
import { useProjectState, FrameworkData, getNextStep, getPreviousStep } from '../../state/useProjectState';
import { useAppState } from '../../state/useAppState';

interface OKR {
  objective: string;
  keyResults: string[];
}

interface DesignStepProps {
  onComplete?: () => void;
}

export default function DesignStep({ onComplete }: DesignStepProps) {
  const { getActiveProject, addFrameworkData, completeStep, setCurrentStep } = useProjectState();
  const { addNotification } = useAppState();
  const project = getActiveProject();

  const [activeFramework, setActiveFramework] = useState<'canvas' | 'okr' | null>(null);
  const [okrs, setOkrs] = useState<OKR[]>([{ objective: '', keyResults: [''] }]);

  const [canvasData, setCanvasData] = useState<Record<string, string[]>>({
    keyPartners: [],
    keyActivities: [],
    keyResources: [],
    valuePropositions: [],
    customerRelationships: [],
    channels: [],
    customerSegments: [],
    costStructure: [],
    revenueStreams: [],
  });

  const [activeCanvasSection, setActiveCanvasSection] = useState('valuePropositions');
  const [newCanvasItem, setNewCanvasItem] = useState('');

  const frameworks = [
    {
      id: 'canvas' as const,
      name: 'Business Model Canvas',
      icon: '🎨',
      description: 'Design or refine your business model',
    },
    {
      id: 'okr' as const,
      name: 'OKRs',
      icon: '🎯',
      description: 'Define objectives and key results',
    },
  ];

  const canvasSections = [
    { key: 'keyPartners', label: 'Key Partners', icon: '🤝' },
    { key: 'keyActivities', label: 'Key Activities', icon: '⚙️' },
    { key: 'keyResources', label: 'Key Resources', icon: '💎' },
    { key: 'valuePropositions', label: 'Value Propositions', icon: '💡' },
    { key: 'customerRelationships', label: 'Customer Relationships', icon: '❤️' },
    { key: 'channels', label: 'Channels', icon: '📢' },
    { key: 'customerSegments', label: 'Customer Segments', icon: '👥' },
    { key: 'costStructure', label: 'Cost Structure', icon: '💰' },
    { key: 'revenueStreams', label: 'Revenue Streams', icon: '💵' },
  ];

  const addCanvasItem = () => {
    if (newCanvasItem.trim()) {
      setCanvasData(prev => ({
        ...prev,
        [activeCanvasSection]: [...prev[activeCanvasSection], newCanvasItem.trim()],
      }));
      setNewCanvasItem('');
    }
  };

  const removeCanvasItem = (section: string, index: number) => {
    setCanvasData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const saveCanvas = () => {
    const totalItems = Object.values(canvasData).flat().length;
    if (totalItems < 5) {
      addNotification({
        type: 'warning',
        title: 'Add More Items',
        message: 'Please fill in at least a few sections of the canvas.',
      });
      return;
    }

    const framework: FrameworkData = {
      frameworkUsed: 'Business Model Canvas',
      completedAt: new Date().toISOString(),
      canvasData,
    };

    addFrameworkData(framework);
    setActiveFramework(null);
    addNotification({
      type: 'success',
      title: 'Canvas Saved',
      message: 'Your Business Model Canvas has been recorded.',
    });
  };

  const addOKR = () => {
    setOkrs([...okrs, { objective: '', keyResults: [''] }]);
  };

  const updateObjective = (index: number, value: string) => {
    const updated = [...okrs];
    updated[index].objective = value;
    setOkrs(updated);
  };

  const addKeyResult = (okrIndex: number) => {
    const updated = [...okrs];
    updated[okrIndex].keyResults.push('');
    setOkrs(updated);
  };

  const updateKeyResult = (okrIndex: number, krIndex: number, value: string) => {
    const updated = [...okrs];
    updated[okrIndex].keyResults[krIndex] = value;
    setOkrs(updated);
  };

  const removeKeyResult = (okrIndex: number, krIndex: number) => {
    const updated = [...okrs];
    updated[okrIndex].keyResults = updated[okrIndex].keyResults.filter((_, i) => i !== krIndex);
    setOkrs(updated);
  };

  const saveOKRs = () => {
    const validOkrs = okrs.filter(okr => okr.objective.trim() && okr.keyResults.some(kr => kr.trim()));
    if (validOkrs.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Add OKRs',
        message: 'Please add at least one objective with key results.',
      });
      return;
    }

    const framework: FrameworkData = {
      frameworkUsed: 'OKRs',
      completedAt: new Date().toISOString(),
      okrs: validOkrs,
    };

    addFrameworkData(framework);
    setActiveFramework(null);
    addNotification({
      type: 'success',
      title: 'OKRs Saved',
      message: 'Your Objectives and Key Results have been recorded.',
    });
  };

  const handleComplete = () => {
    if (!project?.design || project.design.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Complete a Framework',
        message: 'Please complete at least one strategic framework before proceeding.',
      });
      return;
    }

    completeStep('design');
    const nextStep = getNextStep('design');
    if (nextStep) {
      setCurrentStep(nextStep);
    }

    addNotification({
      type: 'success',
      title: 'Design Complete!',
      message: 'Moving to Decide phase. Time to prioritize your initiatives.',
    });

    onComplete?.();
  };

  const handleBack = () => {
    const prevStep = getPreviousStep('design');
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  return (
    <div className="design-step">
      <div className="step-header">
        <div className="header-content">
          <span className="step-icon">📐</span>
          <div>
            <h2>Design Your Strategy</h2>
            <p>Build strategic frameworks that translate insights into action</p>
          </div>
        </div>
      </div>

      {!activeFramework ? (
        <div className="framework-selection">
          <h3>Select a Framework</h3>
          <div className="frameworks-grid">
            {frameworks.map(fw => (
              <div
                key={fw.id}
                className="framework-card"
                onClick={() => setActiveFramework(fw.id)}
              >
                <span className="fw-icon">{fw.icon}</span>
                <h4>{fw.name}</h4>
                <p>{fw.description}</p>
              </div>
            ))}
          </div>

          {project?.design && project.design.length > 0 && (
            <div className="completed-frameworks">
              <h4>Completed Frameworks</h4>
              {project.design.map((fw, index) => (
                <div key={index} className="fw-item">
                  <span>{fw.frameworkUsed}</span>
                  <span>{new Date(fw.completedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeFramework === 'canvas' ? (
        <div className="canvas-editor">
          <div className="canvas-header">
            <button className="back-btn" onClick={() => setActiveFramework(null)}>
              ← Back
            </button>
            <h3>Business Model Canvas</h3>
          </div>

          <div className="canvas-sections">
            {canvasSections.map(section => (
              <button
                key={section.key}
                className={`section-tab ${activeCanvasSection === section.key ? 'active' : ''}`}
                onClick={() => setActiveCanvasSection(section.key)}
              >
                {section.icon} {section.label}
                <span className="count">{canvasData[section.key].length}</span>
              </button>
            ))}
          </div>

          <div className="canvas-content">
            <div className="section-header">
              <span>{canvasSections.find(s => s.key === activeCanvasSection)?.icon}</span>
              <h4>{canvasSections.find(s => s.key === activeCanvasSection)?.label}</h4>
            </div>

            <div className="section-items">
              {canvasData[activeCanvasSection].map((item, index) => (
                <div key={index} className="canvas-item">
                  <span>{item}</span>
                  <button onClick={() => removeCanvasItem(activeCanvasSection, index)}>×</button>
                </div>
              ))}
            </div>

            <div className="add-item">
              <input
                type="text"
                value={newCanvasItem}
                onChange={(e) => setNewCanvasItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCanvasItem()}
                placeholder="Add item..."
              />
              <button onClick={addCanvasItem}>Add</button>
            </div>
          </div>

          <div className="canvas-actions">
            <button className="btn-secondary" onClick={() => setActiveFramework(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={saveCanvas}>
              Save Canvas
            </button>
          </div>
        </div>
      ) : (
        <div className="okr-editor">
          <div className="okr-header">
            <button className="back-btn" onClick={() => setActiveFramework(null)}>
              ← Back
            </button>
            <h3>Objectives & Key Results</h3>
          </div>

          <div className="okrs-list">
            {okrs.map((okr, okrIndex) => (
              <div key={okrIndex} className="okr-card">
                <div className="objective-input">
                  <label>Objective {okrIndex + 1}</label>
                  <input
                    type="text"
                    value={okr.objective}
                    onChange={(e) => updateObjective(okrIndex, e.target.value)}
                    placeholder="What do you want to achieve?"
                  />
                </div>
                <div className="key-results">
                  {okr.keyResults.map((kr, krIndex) => (
                    <div key={krIndex} className="kr-input">
                      <input
                        type="text"
                        value={kr}
                        onChange={(e) => updateKeyResult(okrIndex, krIndex, e.target.value)}
                        placeholder={`Key Result ${krIndex + 1} - Measurable outcome`}
                      />
                      {okr.keyResults.length > 1 && (
                        <button onClick={() => removeKeyResult(okrIndex, krIndex)}>×</button>
                      )}
                    </div>
                  ))}
                  <button className="add-kr-btn" onClick={() => addKeyResult(okrIndex)}>
                    + Add Key Result
                  </button>
                </div>
              </div>
            ))}
            <button className="add-okr-btn" onClick={addOKR}>
              + Add Another Objective
            </button>
          </div>

          <div className="okr-actions">
            <button className="btn-secondary" onClick={() => setActiveFramework(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={saveOKRs}>
              Save OKRs
            </button>
          </div>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-secondary" onClick={handleBack}>
          ← Back to Diagnose
        </button>
        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={!project?.design || project.design.length === 0}
        >
          Complete Design →
        </button>
      </div>

      <style jsx>{`
        .design-step {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .step-header {
          padding: 24px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.05));
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

        .framework-selection {
          padding: 24px;
        }

        .framework-selection h3 {
          margin: 0 0 16px;
          color: var(--text-primary);
        }

        .frameworks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .framework-card {
          padding: 24px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .framework-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .fw-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 12px;
        }

        .framework-card h4 {
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .framework-card p {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
        }

        .completed-frameworks {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .completed-frameworks h4 {
          margin: 0 0 12px;
          color: var(--text-secondary);
        }

        .fw-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: var(--bg-primary);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
        }

        .canvas-editor, .okr-editor {
          padding: 24px;
        }

        .canvas-header, .okr-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
          padding: 8px 16px;
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
        }

        .canvas-header h3, .okr-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .canvas-sections {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .section-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .section-tab:hover {
          border-color: var(--accent);
        }

        .section-tab.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        .section-tab .count {
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-size: 11px;
        }

        .canvas-content {
          background: var(--bg-tertiary);
          border-radius: 12px;
          padding: 20px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .section-header span {
          font-size: 24px;
        }

        .section-header h4 {
          margin: 0;
          color: var(--text-primary);
        }

        .section-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 100px;
          margin-bottom: 16px;
        }

        .canvas-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
        }

        .canvas-item button {
          padding: 4px 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 16px;
          cursor: pointer;
        }

        .add-item {
          display: flex;
          gap: 8px;
        }

        .add-item input {
          flex: 1;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .add-item button {
          padding: 10px 18px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
        }

        .canvas-actions, .okr-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .okrs-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .okr-card {
          background: var(--bg-tertiary);
          border-radius: 12px;
          padding: 20px;
        }

        .objective-input label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .objective-input input {
          width: 100%;
          padding: 12px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .key-results {
          margin-top: 16px;
        }

        .kr-input {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .kr-input input {
          flex: 1;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .kr-input button {
          padding: 8px 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 16px;
          cursor: pointer;
        }

        .add-kr-btn, .add-okr-btn {
          padding: 10px 16px;
          background: none;
          border: 1px dashed var(--border);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          width: 100%;
        }

        .add-kr-btn:hover, .add-okr-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
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
      `}</style>
    </div>
  );
}
