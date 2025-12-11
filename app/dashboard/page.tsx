'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useProjectState, getStepLabel, WORKFLOW_STEPS } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';

export default function ProjectDashboardPage() {
  const router = useRouter();
  const { projects, createProject, deleteProject, setActiveProject } = useProjectState();
  const { currentUser } = useAppState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const projectId = createProject(newProjectName.trim());
    setNewProjectName('');
    setShowCreateModal(false);
    setActiveProject(projectId);
    router.push('/strategy');
  };

  const handleOpenProject = (projectId: string) => {
    setActiveProject(projectId);
    router.push('/strategy');
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setDeleteConfirm(null);
  };

  const getProgressPercentage = (completedSteps: string[]) => {
    return Math.round((completedSteps.length / WORKFLOW_STEPS.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AppShell>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}!</h1>
              <p>Manage your strategy projects and track progress</p>
            </div>
            <button className="create-btn" onClick={() => setShowCreateModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Strategy Project
            </button>
          </div>

          {/* Quick Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon projects">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{projects.length}</span>
                <span className="stat-label">Total Projects</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {projects.filter(p => p.completedSteps.length < 5).length}
                </span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {projects.filter(p => p.completedSteps.length === 5).length}
                </span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2>No Projects Yet</h2>
            <p>Create your first strategy project to get started with the guided workflow</p>
            <button className="create-btn-large" onClick={() => setShowCreateModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {/* Create New Card */}
            <button className="project-card create-card" onClick={() => setShowCreateModal(true)}>
              <div className="create-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="create-text">Create New Project</span>
            </button>

            {/* Project Cards */}
            {projects.map((project) => {
              const progress = getProgressPercentage(project.completedSteps);
              const isComplete = progress === 100;

              return (
                <div key={project.id} className="project-card">
                  <div className="card-header">
                    <div className="card-status">
                      {isComplete ? (
                        <span className="status-badge completed">Completed</span>
                      ) : (
                        <span className="status-badge in-progress">In Progress</span>
                      )}
                    </div>
                    <div className="card-actions">
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(project.id);
                        }}
                        title="Delete project"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="card-body" onClick={() => handleOpenProject(project.id)}>
                    <h3>{project.name}</h3>
                    <div className="card-meta">
                      <span className="current-step">
                        Current: {getStepLabel(project.currentStep)}
                      </span>
                      <span className="last-updated">
                        Updated {formatDate(project.updatedAt)}
                      </span>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="steps-dots">
                        {WORKFLOW_STEPS.map((step, index) => (
                          <div
                            key={step}
                            className={`step-dot ${project.completedSteps.includes(step) ? 'completed' : ''} ${project.currentStep === step ? 'current' : ''}`}
                            title={getStepLabel(step)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="metrics-row">
                      <div className="metric">
                        <span className="metric-label">Confidence</span>
                        <span className="metric-value">{project.confidenceIndex}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Risk</span>
                        <span className={`metric-value ${project.riskGauge > 60 ? 'high' : project.riskGauge > 40 ? 'medium' : 'low'}`}>
                          {project.riskGauge}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="continue-btn"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      {isComplete ? 'View Details' : 'Continue'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === project.id && (
                    <div className="delete-confirm">
                      <p>Delete this project?</p>
                      <div className="confirm-actions">
                        <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        <button className="danger" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Strategy Project</h2>
                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g., 2024 Growth Strategy"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                    autoFocus
                  />
                </div>
                <p className="modal-hint">
                  You'll be guided through 5 steps: Discover, Diagnose, Design, Decide, and Deliver
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 32px 24px;
          }

          .dashboard-header {
            margin-bottom: 32px;
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }

          .welcome-section h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 4px;
          }

          .welcome-section p {
            color: var(--text-muted);
            font-size: 15px;
            margin: 0;
          }

          .create-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #14B8A6, #2DD4BF);
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .create-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
          }

          .stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .stat-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .stat-icon.projects {
            background: rgba(168, 85, 247, 0.2);
            color: #A855F7;
          }

          .stat-icon.active {
            background: rgba(20, 184, 166, 0.2);
            color: #14B8A6;
          }

          .stat-icon.completed {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
          }

          .stat-content {
            display: flex;
            flex-direction: column;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary);
          }

          .stat-label {
            font-size: 13px;
            color: var(--text-muted);
          }

          .empty-state {
            text-align: center;
            padding: 80px 24px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
          }

          .empty-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1));
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #A855F7;
          }

          .empty-state h2 {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 8px;
          }

          .empty-state p {
            color: var(--text-muted);
            margin: 0 0 24px;
          }

          .create-btn-large {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: linear-gradient(135deg, #14B8A6, #2DD4BF);
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .create-btn-large:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(20, 184, 166, 0.4);
          }

          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
          }

          .project-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.2s ease;
            position: relative;
          }

          .project-card:hover {
            border-color: rgba(168, 85, 247, 0.3);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .create-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 280px;
            cursor: pointer;
            border-style: dashed;
          }

          .create-card:hover {
            background: rgba(168, 85, 247, 0.05);
            border-color: #A855F7;
          }

          .create-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: var(--bg-tertiary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            margin-bottom: 16px;
            transition: all 0.2s ease;
          }

          .create-card:hover .create-icon {
            background: rgba(168, 85, 247, 0.2);
            color: #A855F7;
          }

          .create-text {
            font-size: 15px;
            font-weight: 500;
            color: var(--text-muted);
          }

          .create-card:hover .create-text {
            color: #A855F7;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 16px 0;
          }

          .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .status-badge.in-progress {
            background: rgba(20, 184, 166, 0.2);
            color: #2DD4BF;
          }

          .status-badge.completed {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
          }

          .card-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            padding: 6px;
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .action-btn:hover {
            background: var(--bg-tertiary);
          }

          .action-btn.delete:hover {
            color: #EF4444;
          }

          .card-body {
            padding: 16px;
            cursor: pointer;
          }

          .card-body h3 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 8px;
          }

          .card-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 16px;
          }

          .current-step {
            font-size: 13px;
            color: #A855F7;
            font-weight: 500;
          }

          .last-updated {
            font-size: 12px;
            color: var(--text-muted);
          }

          .progress-section {
            margin-bottom: 16px;
          }

          .progress-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--text-muted);
            margin-bottom: 8px;
          }

          .progress-bar {
            height: 6px;
            background: var(--bg-tertiary);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 8px;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #14B8A6, #A855F7);
            border-radius: 3px;
            transition: width 0.3s ease;
          }

          .steps-dots {
            display: flex;
            justify-content: space-between;
            padding: 0 4px;
          }

          .step-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--bg-tertiary);
            transition: all 0.2s ease;
          }

          .step-dot.completed {
            background: #14B8A6;
          }

          .step-dot.current {
            background: #A855F7;
            box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
          }

          .metrics-row {
            display: flex;
            gap: 24px;
          }

          .metric {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .metric-label {
            font-size: 11px;
            color: var(--text-muted);
          }

          .metric-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .metric-value.high { color: #EF4444; }
          .metric-value.medium { color: #F59E0B; }
          .metric-value.low { color: #22C55E; }

          .card-footer {
            padding: 12px 16px;
            border-top: 1px solid var(--border);
            background: var(--bg-tertiary);
          }

          .continue-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 10px;
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .continue-btn:hover {
            background: rgba(168, 85, 247, 0.1);
            border-color: #A855F7;
            color: #A855F7;
          }

          .delete-confirm {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 24px;
            z-index: 10;
          }

          .delete-confirm p {
            color: white;
            font-size: 16px;
            font-weight: 500;
          }

          .confirm-actions {
            display: flex;
            gap: 12px;
          }

          .confirm-actions button {
            padding: 8px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .confirm-actions button:first-child {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            color: var(--text-primary);
          }

          .confirm-actions button.danger {
            background: #EF4444;
            border: none;
            color: white;
          }

          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            padding: 24px;
          }

          .modal {
            width: 100%;
            max-width: 480px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
          }

          .modal-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
          }

          .close-btn {
            padding: 4px;
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
          }

          .modal-body {
            padding: 24px;
          }

          .form-group {
            margin-bottom: 16px;
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
            padding: 12px 16px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 10px;
            font-size: 15px;
            color: var(--text-primary);
            outline: none;
          }

          .form-group input:focus {
            border-color: #A855F7;
          }

          .modal-hint {
            font-size: 13px;
            color: var(--text-muted);
            margin: 0;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 16px 24px;
            border-top: 1px solid var(--border);
            background: var(--bg-tertiary);
          }

          .btn-secondary {
            padding: 10px 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            cursor: pointer;
          }

          .btn-primary {
            padding: 10px 24px;
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

          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 16px;
            }

            .create-btn {
              width: 100%;
              justify-content: center;
            }

            .stats-row {
              grid-template-columns: 1fr;
            }

            .projects-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </AppShell>
  );
}
