'use client';

import { useState } from 'react';
import { useProjectState, DiagnosticData, getNextStep, getPreviousStep } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';

type DiagnosticTool = 'swot' | 'pestel' | 'porter';

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface DiagnoseStepProps {
  onComplete?: () => void;
}

export default function DiagnoseStep({ onComplete }: DiagnoseStepProps) {
  const { getActiveProject, addDiagnosticData, completeStep, setCurrentStep } = useProjectState();
  const { addNotification } = useAppState();
  const project = getActiveProject();

  const [activeTool, setActiveTool] = useState<DiagnosticTool | null>(null);
  const [swotData, setSwotData] = useState<SWOTData>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  });
  const [newItem, setNewItem] = useState('');
  const [activeQuadrant, setActiveQuadrant] = useState<keyof SWOTData>('strengths');

  const tools = [
    {
      id: 'swot' as DiagnosticTool,
      name: 'SWOT Analysis',
      icon: '📊',
      description: 'Map strengths, weaknesses, opportunities, and threats',
      recommended: true,
    },
    {
      id: 'pestel' as DiagnosticTool,
      name: 'PESTEL Analysis',
      icon: '🌍',
      description: 'Analyze macro-environmental factors',
      recommended: project?.discover?.growthStage === 'mature',
    },
    {
      id: 'porter' as DiagnosticTool,
      name: "Porter's Five Forces",
      icon: '⚔️',
      description: 'Assess competitive intensity and market attractiveness',
      recommended: project?.discover?.industry === 'Technology',
    },
  ];

  const swotQuadrants = [
    { key: 'strengths' as const, label: 'Strengths', icon: '💪', color: '#22C55E', hint: 'Internal positive factors' },
    { key: 'weaknesses' as const, label: 'Weaknesses', icon: '🔧', color: '#F59E0B', hint: 'Internal areas for improvement' },
    { key: 'opportunities' as const, label: 'Opportunities', icon: '🚀', color: '#3B82F6', hint: 'External favorable conditions' },
    { key: 'threats' as const, label: 'Threats', icon: '⚠️', color: '#EF4444', hint: 'External risks and challenges' },
  ];

  const addToQuadrant = (quadrant: keyof SWOTData) => {
    if (newItem.trim()) {
      setSwotData(prev => ({
        ...prev,
        [quadrant]: [...prev[quadrant], newItem.trim()],
      }));
      setNewItem('');
    }
  };

  const removeFromQuadrant = (quadrant: keyof SWOTData, index: number) => {
    setSwotData(prev => ({
      ...prev,
      [quadrant]: prev[quadrant].filter((_, i) => i !== index),
    }));
  };

  const saveSWOT = () => {
    const totalItems = Object.values(swotData).flat().length;
    if (totalItems < 4) {
      addNotification({
        type: 'warning',
        title: 'Add More Items',
        message: 'Please add at least one item to each SWOT quadrant.',
      });
      return;
    }

    const diagnostic: DiagnosticData = {
      toolUsed: 'SWOT Analysis',
      completedAt: new Date().toISOString(),
      scores: {
        strengths: swotData.strengths.length,
        weaknesses: swotData.weaknesses.length,
        opportunities: swotData.opportunities.length,
        threats: swotData.threats.length,
      },
      insights: generateInsights(swotData),
      recommendations: generateRecommendations(swotData),
      swotData,
    };

    addDiagnosticData(diagnostic);
    setActiveTool(null);
    addNotification({
      type: 'success',
      title: 'SWOT Analysis Saved',
      message: 'Your analysis has been recorded. You can run additional diagnostics.',
    });
  };

  const generateInsights = (data: SWOTData): string[] => {
    const insights: string[] = [];

    if (data.strengths.length > data.weaknesses.length) {
      insights.push('Strong internal position with more strengths than weaknesses');
    } else {
      insights.push('Internal areas need attention - weaknesses match or exceed strengths');
    }

    if (data.opportunities.length > data.threats.length) {
      insights.push('Favorable external environment with more opportunities than threats');
    } else {
      insights.push('Challenging external environment - monitor threats closely');
    }

    if (data.strengths.length > 0 && data.opportunities.length > 0) {
      insights.push('Growth potential: Leverage strengths to capture opportunities');
    }

    return insights;
  };

  const generateRecommendations = (data: SWOTData): string[] => {
    const recommendations: string[] = [];

    if (data.weaknesses.length > 2) {
      recommendations.push('Prioritize addressing top weaknesses before expansion');
    }

    if (data.threats.length > 2) {
      recommendations.push('Develop contingency plans for identified threats');
    }

    if (data.strengths.length > 0 && data.opportunities.length > 0) {
      recommendations.push('Create initiatives that combine strengths with opportunities');
    }

    recommendations.push('Review and update this analysis quarterly');

    return recommendations;
  };

  const handleComplete = () => {
    if (!project?.diagnose || project.diagnose.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Complete a Diagnostic',
        message: 'Please complete at least one diagnostic analysis before proceeding.',
      });
      return;
    }

    completeStep('diagnose');
    const nextStep = getNextStep('diagnose');
    if (nextStep) {
      setCurrentStep(nextStep);
    }

    addNotification({
      type: 'success',
      title: 'Diagnosis Complete!',
      message: 'Moving to Design phase. Time to build your strategic framework.',
    });

    onComplete?.();
  };

  const handleBack = () => {
    const prevStep = getPreviousStep('diagnose');
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  return (
    <div className="diagnose-step">
      <div className="step-header">
        <div className="header-content">
          <span className="step-icon">🩺</span>
          <div>
            <h2>Diagnose Your Position</h2>
            <p>Use strategic frameworks to analyze where you stand</p>
          </div>
        </div>
        {project?.diagnose && project.diagnose.length > 0 && (
          <div className="completed-count">
            {project.diagnose.length} diagnostic(s) completed
          </div>
        )}
      </div>

      {!activeTool ? (
        <div className="tool-selection">
          <h3>Select a Diagnostic Tool</h3>
          <p className="selection-hint">
            {project?.discover
              ? `Based on ${project.discover.name}'s profile, we recommend starting with the tools marked below.`
              : 'Choose a framework to begin your analysis.'}
          </p>

          <div className="tools-grid">
            {tools.map(tool => (
              <div
                key={tool.id}
                className={`tool-card ${tool.recommended ? 'recommended' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="tool-icon">{tool.icon}</span>
                <h4>{tool.name}</h4>
                <p>{tool.description}</p>
                {tool.recommended && <span className="badge">Recommended</span>}
              </div>
            ))}
          </div>

          {/* Previously completed diagnostics */}
          {project?.diagnose && project.diagnose.length > 0 && (
            <div className="completed-diagnostics">
              <h4>Completed Diagnostics</h4>
              <div className="diagnostics-list">
                {project.diagnose.map((diag, index) => (
                  <div key={index} className="diagnostic-item">
                    <span className="diag-tool">{diag.toolUsed}</span>
                    <span className="diag-date">
                      {new Date(diag.completedAt).toLocaleDateString()}
                    </span>
                    <span className="diag-insights">{diag.insights.length} insights</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeTool === 'swot' ? (
        <div className="swot-analysis">
          <div className="swot-header">
            <button className="back-btn" onClick={() => setActiveTool(null)}>
              ← Back to Tools
            </button>
            <h3>SWOT Analysis</h3>
          </div>

          <div className="swot-grid">
            {swotQuadrants.map(quadrant => (
              <div
                key={quadrant.key}
                className={`swot-quadrant ${activeQuadrant === quadrant.key ? 'active' : ''}`}
                onClick={() => setActiveQuadrant(quadrant.key)}
              >
                <div className="quadrant-header" style={{ borderColor: quadrant.color }}>
                  <span>{quadrant.icon}</span>
                  <h4 style={{ color: quadrant.color }}>{quadrant.label}</h4>
                  <span className="count">{swotData[quadrant.key].length}</span>
                </div>
                <p className="quadrant-hint">{quadrant.hint}</p>
                <div className="quadrant-items">
                  {swotData[quadrant.key].map((item, index) => (
                    <div key={index} className="swot-item">
                      <span>{item}</span>
                      <button onClick={() => removeFromQuadrant(quadrant.key, index)}>×</button>
                    </div>
                  ))}
                </div>
                {activeQuadrant === quadrant.key && (
                  <div className="add-item">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addToQuadrant(quadrant.key)}
                      placeholder={`Add ${quadrant.label.toLowerCase().slice(0, -1)}...`}
                      autoFocus
                    />
                    <button onClick={() => addToQuadrant(quadrant.key)}>+</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="swot-actions">
            <button className="btn-secondary" onClick={() => setActiveTool(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={saveSWOT}>
              Save SWOT Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-placeholder">
          <p>This diagnostic tool is coming soon. Please use SWOT Analysis for now.</p>
          <button className="btn-secondary" onClick={() => setActiveTool(null)}>
            ← Back to Tools
          </button>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-secondary" onClick={handleBack}>
          ← Back to Discover
        </button>
        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={!project?.diagnose || project.diagnose.length === 0}
        >
          Complete Diagnosis →
        </button>
      </div>

      <style jsx>{`
        .diagnose-step {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.05));
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

        .completed-count {
          padding: 8px 16px;
          background: rgba(34, 197, 94, 0.2);
          border-radius: 20px;
          font-size: 13px;
          color: #22C55E;
        }

        .tool-selection {
          padding: 24px;
        }

        .tool-selection h3 {
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .selection-hint {
          margin: 0 0 24px;
          color: var(--text-muted);
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .tool-card {
          position: relative;
          padding: 24px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tool-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .tool-card.recommended {
          border-color: rgba(168, 85, 247, 0.3);
        }

        .tool-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 12px;
        }

        .tool-card h4 {
          margin: 0 0 8px;
          color: var(--text-primary);
        }

        .tool-card p {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #A855F7, #EC4899);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: white;
        }

        .completed-diagnostics {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .completed-diagnostics h4 {
          margin: 0 0 16px;
          color: var(--text-secondary);
        }

        .diagnostics-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .diagnostic-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background: var(--bg-primary);
          border-radius: 8px;
        }

        .diag-tool {
          font-weight: 500;
          color: var(--text-primary);
        }

        .diag-date {
          font-size: 13px;
          color: var(--text-muted);
        }

        .diag-insights {
          margin-left: auto;
          padding: 4px 10px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 4px;
          font-size: 12px;
          color: #3B82F6;
        }

        .swot-analysis {
          padding: 24px;
        }

        .swot-header {
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

        .back-btn:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }

        .swot-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .swot-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .swot-quadrant {
          padding: 20px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .swot-quadrant.active {
          border-color: var(--accent);
        }

        .quadrant-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 8px;
          border-bottom: 2px solid;
        }

        .quadrant-header h4 {
          margin: 0;
          flex: 1;
        }

        .count {
          width: 24px;
          height: 24px;
          background: var(--bg-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .quadrant-hint {
          margin: 8px 0 12px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .quadrant-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 60px;
        }

        .swot-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: var(--bg-primary);
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-primary);
        }

        .swot-item button {
          padding: 2px 6px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 16px;
          cursor: pointer;
        }

        .swot-item button:hover {
          color: #EF4444;
        }

        .add-item {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .add-item input {
          flex: 1;
          padding: 8px 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
        }

        .add-item button {
          padding: 8px 14px;
          background: var(--accent);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .swot-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .tool-placeholder {
          padding: 48px;
          text-align: center;
        }

        .tool-placeholder p {
          margin: 0 0 16px;
          color: var(--text-muted);
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
          transition: all 0.2s ease;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .swot-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
