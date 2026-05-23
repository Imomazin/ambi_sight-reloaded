'use client';

import { useProjectState, WORKFLOW_STEPS, getStepLabel, getStepIndex, WorkflowStep } from '@/state/useProjectState';

interface WorkflowProgressProps {
  onStepClick?: (step: WorkflowStep) => void;
}

export default function WorkflowProgress({ onStepClick }: WorkflowProgressProps) {
  const { getActiveProject, setCurrentStep } = useProjectState();
  const project = getActiveProject();

  if (!project) return null;

  const currentIndex = getStepIndex(project.currentStep);

  const handleStepClick = (step: WorkflowStep, index: number) => {
    // Can only go to completed steps or current step
    if (index <= currentIndex || project.completedSteps.includes(step)) {
      setCurrentStep(step);
      onStepClick?.(step);
    }
  };

  const stepIcons: Record<WorkflowStep, string> = {
    discover: '🔍',
    diagnose: '🩺',
    design: '📐',
    decide: '⚖️',
    deliver: '🚀',
  };

  return (
    <div className="workflow-progress">
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(currentIndex / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <div className="steps-container">
        {WORKFLOW_STEPS.map((step, index) => {
          const isCompleted = project.completedSteps.includes(step);
          const isCurrent = project.currentStep === step;
          const isAccessible = index <= currentIndex || isCompleted;

          return (
            <div
              key={step}
              className={`step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isAccessible ? 'accessible' : ''}`}
              onClick={() => handleStepClick(step, index)}
            >
              <div className="step-indicator">
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="step-icon">{stepIcons[step]}</span>
                )}
              </div>
              <div className="step-info">
                <span className="step-label">{getStepLabel(step)}</span>
                <span className="step-number">Step {index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .workflow-progress {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .progress-track {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #8b5cf6);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .steps-container {
          display: flex;
          justify-content: space-between;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: not-allowed;
          opacity: 0.4;
          transition: all 0.2s ease;
        }

        .step.accessible {
          cursor: pointer;
          opacity: 0.6;
        }

        .step.accessible:hover {
          opacity: 0.8;
        }

        .step.current {
          opacity: 1;
        }

        .step.completed {
          opacity: 1;
        }

        .step-indicator {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .step.current .step-indicator {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.2));
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }

        .step.completed .step-indicator {
          background: linear-gradient(135deg, #10b981, #34d399);
          border-color: transparent;
          color: white;
        }

        .step-icon {
          font-size: 20px;
        }

        .step-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-label {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
        }

        .step-number {
          font-size: 11px;
          color: var(--text-muted);
        }

        .step.current .step-label {
          color: #8b5cf6;
        }

        .step.completed .step-label {
          color: #34d399;
        }

        @media (max-width: 640px) {
          .steps-container {
            overflow-x: auto;
            gap: 16px;
            padding-bottom: 8px;
          }

          .step {
            flex-shrink: 0;
          }

          .step-indicator {
            width: 40px;
            height: 40px;
          }

          .step-label {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
