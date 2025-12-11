'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WorkflowProgress from '@/components/WorkflowProgress';
import IntelligentAdvisor from '@/components/IntelligentAdvisor';
import DiscoverStep from '@/components/workflow/DiscoverStep';
import DiagnoseStep from '@/components/workflow/DiagnoseStep';
import DesignStep from '@/components/workflow/DesignStep';
import DecideStep from '@/components/workflow/DecideStep';
import DeliverStep from '@/components/workflow/DeliverStep';
import { useProjectState, WorkflowStep, getStepLabel, getStepDescription } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';

export default function StrategyWorkflowPage() {
  const router = useRouter();
  const { currentUser } = useAppState();
  const {
    getActiveProject,
    projects,
    activeProjectId,
    setActiveProject,
    createProject
  } = useProjectState();

  const project = getActiveProject();
  const [showAdvisor, setShowAdvisor] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Redirect to dashboard if no active project and no projects exist
  useEffect(() => {
    if (!activeProjectId && projects.length === 0) {
      // Show create project UI
      setIsCreatingProject(true);
    }
  }, [activeProjectId, projects.length]);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const projectId = createProject(newProjectName.trim());
    setNewProjectName('');
    setIsCreatingProject(false);
  };

  const renderCurrentStep = () => {
    if (!project) return null;

    switch (project.currentStep) {
      case 'discover':
        return <DiscoverStep />;
      case 'diagnose':
        return <DiagnoseStep />;
      case 'design':
        return <DesignStep />;
      case 'decide':
        return <DecideStep />;
      case 'deliver':
        return <DeliverStep />;
      default:
        return <DiscoverStep />;
    }
  };

  // Show project creation UI
  if (isCreatingProject || !project) {
    return (
      <AppShell>
        <div className="strategy-create">
          <div className="create-header">
            <div className="header-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h1>Start Your Strategy Journey</h1>
            <p>Create a new strategy project to begin the guided workflow</p>
          </div>

          <div className="create-form">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., 2024 Growth Strategy, Market Expansion Plan"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                autoFocus
              />
            </div>

            <div className="workflow-preview">
              <h3>Your 5-Step Strategy Workflow</h3>
              <div className="steps-preview">
                {(['discover', 'diagnose', 'design', 'decide', 'deliver'] as WorkflowStep[]).map((step, index) => (
                  <div key={step} className="step-preview-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <span className="step-name">{getStepLabel(step)}</span>
                      <span className="step-desc">{getStepDescription(step)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              {projects.length > 0 && (
                <button
                  className="btn-secondary"
                  onClick={() => setIsCreatingProject(false)}
                >
                  Cancel
                </button>
              )}
              <button
                className="btn-primary"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                Create Project & Start
              </button>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="existing-projects">
              <h3>Or Continue an Existing Project</h3>
              <div className="projects-list">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    className="project-item"
                    onClick={() => {
                      setActiveProject(p.id);
                      setIsCreatingProject(false);
                    }}
                  >
                    <div className="project-info">
                      <span className="project-name">{p.name}</span>
                      <span className="project-step">
                        Step {(['discover', 'diagnose', 'design', 'decide', 'deliver'].indexOf(p.currentStep) + 1)}: {getStepLabel(p.currentStep)}
                      </span>
                    </div>
                    <div className="project-progress">
                      <div
                        className="progress-fill"
                        style={{ width: `${(p.completedSteps.length / 5) * 100}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <style jsx>{`
            .strategy-create {
              max-width: 720px;
              margin: 0 auto;
              padding: 48px 24px;
            }

            .create-header {
              text-align: center;
              margin-bottom: 40px;
            }

            .header-icon {
              width: 80px;
              height: 80px;
              margin: 0 auto 24px;
              background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(168, 85, 247, 0.2));
              border: 1px solid rgba(168, 85, 247, 0.3);
              border-radius: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #A855F7;
            }

            .create-header h1 {
              font-size: 28px;
              font-weight: 700;
              color: var(--text-primary);
              margin: 0 0 8px;
            }

            .create-header p {
              color: var(--text-muted);
              font-size: 16px;
            }

            .create-form {
              background: var(--bg-secondary);
              border: 1px solid var(--border);
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 32px;
            }

            .form-group {
              margin-bottom: 32px;
            }

            .form-group label {
              display: block;
              font-size: 14px;
              font-weight: 500;
              color: var(--text-secondary);
              margin-bottom: 8px;
            }

            .form-group input {
              width: 100%;
              padding: 14px 18px;
              background: var(--bg-tertiary);
              border: 1px solid var(--border);
              border-radius: 12px;
              font-size: 16px;
              color: var(--text-primary);
              outline: none;
              transition: border-color 0.2s ease;
            }

            .form-group input:focus {
              border-color: #A855F7;
            }

            .form-group input::placeholder {
              color: var(--text-muted);
            }

            .workflow-preview {
              margin-bottom: 32px;
            }

            .workflow-preview h3 {
              font-size: 14px;
              font-weight: 600;
              color: var(--text-secondary);
              margin-bottom: 16px;
            }

            .steps-preview {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .step-preview-item {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 12px 16px;
              background: var(--bg-tertiary);
              border-radius: 12px;
            }

            .step-number {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(135deg, #14B8A6, #A855F7);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: 600;
              color: white;
              flex-shrink: 0;
            }

            .step-content {
              display: flex;
              flex-direction: column;
            }

            .step-name {
              font-size: 14px;
              font-weight: 600;
              color: var(--text-primary);
            }

            .step-desc {
              font-size: 12px;
              color: var(--text-muted);
            }

            .form-actions {
              display: flex;
              justify-content: flex-end;
              gap: 12px;
            }

            .btn-secondary {
              padding: 12px 24px;
              background: var(--bg-tertiary);
              border: 1px solid var(--border);
              border-radius: 10px;
              font-size: 14px;
              font-weight: 500;
              color: var(--text-primary);
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .btn-secondary:hover {
              background: var(--bg-secondary);
            }

            .btn-primary {
              padding: 12px 28px;
              background: linear-gradient(135deg, #14B8A6, #2DD4BF);
              border: none;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 600;
              color: white;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .btn-primary:hover:not(:disabled) {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
            }

            .btn-primary:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .existing-projects {
              background: var(--bg-secondary);
              border: 1px solid var(--border);
              border-radius: 16px;
              padding: 24px;
            }

            .existing-projects h3 {
              font-size: 14px;
              font-weight: 600;
              color: var(--text-secondary);
              margin-bottom: 16px;
            }

            .projects-list {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .project-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px;
              background: var(--bg-tertiary);
              border: 1px solid var(--border);
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: left;
            }

            .project-item:hover {
              border-color: #A855F7;
              background: rgba(168, 85, 247, 0.05);
            }

            .project-info {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .project-name {
              font-size: 14px;
              font-weight: 600;
              color: var(--text-primary);
            }

            .project-step {
              font-size: 12px;
              color: var(--text-muted);
            }

            .project-progress {
              width: 60px;
              height: 6px;
              background: var(--bg-secondary);
              border-radius: 3px;
              overflow: hidden;
            }

            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #14B8A6, #A855F7);
              border-radius: 3px;
              transition: width 0.3s ease;
            }
          `}</style>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="strategy-workflow">
        {/* Header */}
        <div className="workflow-header">
          <div className="header-left">
            <Link href="/dashboard" className="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <div className="project-info">
              <h1>{project.name}</h1>
              <div className="project-meta">
                <span className="step-badge">
                  {getStepLabel(project.currentStep)}
                </span>
                <span className="confidence">
                  Confidence: {project.confidenceIndex}%
                </span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className="advisor-toggle"
              onClick={() => setShowAdvisor(!showAdvisor)}
            >
              {showAdvisor ? 'Hide' : 'Show'} Advisor
            </button>
            <button
              className="new-project-btn"
              onClick={() => setIsCreatingProject(true)}
            >
              New Project
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <WorkflowProgress />

        {/* Main Content */}
        <div className={`workflow-content ${showAdvisor ? 'with-advisor' : ''}`}>
          <div className="step-container">
            {renderCurrentStep()}
          </div>

          {showAdvisor && (
            <div className="advisor-panel">
              <IntelligentAdvisor />
            </div>
          )}
        </div>

        <style jsx>{`
          .strategy-workflow {
            max-width: 1600px;
            margin: 0 auto;
            padding: 24px;
          }

          .workflow-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }

          .header-left {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .back-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-muted);
            font-size: 14px;
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .back-link:hover {
            color: var(--text-primary);
          }

          .project-info h1 {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
          }

          .project-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 8px;
          }

          .step-badge {
            padding: 4px 12px;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.2));
            border: 1px solid rgba(168, 85, 247, 0.3);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            color: #C084FC;
          }

          .confidence {
            font-size: 13px;
            color: var(--text-muted);
          }

          .header-right {
            display: flex;
            gap: 12px;
          }

          .advisor-toggle {
            padding: 10px 18px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .advisor-toggle:hover {
            border-color: #A855F7;
            color: var(--text-primary);
          }

          .new-project-btn {
            padding: 10px 18px;
            background: linear-gradient(135deg, #A855F7, #EC4899);
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .new-project-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
          }

          .workflow-content {
            display: grid;
            gap: 24px;
            grid-template-columns: 1fr;
          }

          .workflow-content.with-advisor {
            grid-template-columns: 1fr 380px;
          }

          .step-container {
            min-height: 500px;
          }

          .advisor-panel {
            height: 600px;
            position: sticky;
            top: 24px;
          }

          @media (max-width: 1200px) {
            .workflow-content.with-advisor {
              grid-template-columns: 1fr;
            }

            .advisor-panel {
              position: static;
              height: 450px;
            }
          }

          @media (max-width: 768px) {
            .workflow-header {
              flex-direction: column;
              gap: 16px;
            }

            .header-right {
              width: 100%;
            }

            .advisor-toggle,
            .new-project-btn {
              flex: 1;
            }
          }
        `}</style>
      </div>
    </AppShell>
  );
}
