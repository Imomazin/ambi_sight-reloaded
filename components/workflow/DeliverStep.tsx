'use client';

import { useState } from 'react';
import { useProjectState, getPreviousStep } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';
import ProgressIndicator from '../ProgressIndicator';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
}

interface DeliverStepProps {
  onComplete?: () => void;
}

export default function DeliverStep({ onComplete }: DeliverStepProps) {
  const { getActiveProject, updateExecutionData, setCurrentStep } = useProjectState();
  const { addNotification, currentUser } = useAppState();
  const project = getActiveProject();

  const [tasks, setTasks] = useState<Task[]>(project?.deliver?.tasks || []);
  const [milestones, setMilestones] = useState<Milestone[]>(project?.deliver?.milestones || []);
  const [newTask, setNewTask] = useState('');
  const [newMilestone, setNewMilestone] = useState({ title: '', targetDate: '' });

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.trim(),
        status: 'todo',
      };
      const updated = [...tasks, task];
      setTasks(updated);
      updateExecutionData({ tasks: updated });
      setNewTask('');
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(updated);
    updateExecutionData({ tasks: updated });
  };

  const removeTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    updateExecutionData({ tasks: updated });
  };

  const addMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.targetDate) {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}`,
        title: newMilestone.title.trim(),
        targetDate: newMilestone.targetDate,
        completed: false,
      };
      const updated = [...milestones, milestone];
      setMilestones(updated);
      updateExecutionData({ milestones: updated });
      setNewMilestone({ title: '', targetDate: '' });
    }
  };

  const toggleMilestone = (milestoneId: string) => {
    const updated = milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    setMilestones(updated);
    updateExecutionData({ milestones: updated });
  };

  const handleBack = () => {
    const prevStep = getPreviousStep('deliver');
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const completedMilestones = milestones.filter(m => m.completed).length;
  const milestoneProgress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  const isPro = currentUser?.plan === 'Pro' || currentUser?.plan === 'Enterprise';

  return (
    <div className="deliver-step">
      <div className="step-header">
        <div className="header-content">
          <span className="step-icon">🚀</span>
          <div>
            <h2>Deliver Your Strategy</h2>
            <p>Execute your plan and track progress</p>
          </div>
        </div>
      </div>

      <div className="deliver-content">
        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-card">
            <h4>Task Progress</h4>
            <ProgressIndicator
              progress={taskProgress}
              color="teal"
              size="md"
              label={`${completedTasks}/${tasks.length} completed`}
            />
          </div>
          <div className="progress-card">
            <h4>Milestone Progress</h4>
            <ProgressIndicator
              progress={milestoneProgress}
              color="purple"
              size="md"
              label={`${completedMilestones}/${milestones.length} reached`}
            />
          </div>
          <div className="progress-card">
            <h4>Confidence Index</h4>
            <ProgressIndicator
              progress={project?.confidenceIndex || 0}
              variant="circular"
              color="amber"
              size="lg"
              label={`${project?.confidenceIndex || 0}%`}
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="tasks-section">
          <h3>Tasks</h3>
          <div className="add-task">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
            />
            <button onClick={addTask}>Add Task</button>
          </div>

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="empty">No tasks yet. Add your first task above.</p>
            ) : (
              <>
                {['todo', 'in_progress', 'done'].map(status => (
                  <div key={status} className="task-column">
                    <h4 className={`column-header ${status}`}>
                      {status === 'todo' && '📋 To Do'}
                      {status === 'in_progress' && '🔄 In Progress'}
                      {status === 'done' && '✅ Done'}
                      <span className="count">
                        {tasks.filter(t => t.status === status).length}
                      </span>
                    </h4>
                    <div className="column-tasks">
                      {tasks.filter(t => t.status === status).map(task => (
                        <div key={task.id} className="task-card">
                          <span className="task-title">{task.title}</span>
                          <div className="task-actions">
                            {status !== 'done' && (
                              <button
                                onClick={() => updateTaskStatus(
                                  task.id,
                                  status === 'todo' ? 'in_progress' : 'done'
                                )}
                              >
                                →
                              </button>
                            )}
                            {status !== 'todo' && (
                              <button
                                onClick={() => updateTaskStatus(
                                  task.id,
                                  status === 'done' ? 'in_progress' : 'todo'
                                )}
                              >
                                ←
                              </button>
                            )}
                            <button className="delete" onClick={() => removeTask(task.id)}>
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="milestones-section">
          <h3>Milestones</h3>
          <div className="add-milestone">
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="Milestone title..."
            />
            <input
              type="date"
              value={newMilestone.targetDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
            />
            <button onClick={addMilestone}>Add</button>
          </div>

          <div className="milestones-list">
            {milestones.map(milestone => (
              <div
                key={milestone.id}
                className={`milestone-card ${milestone.completed ? 'completed' : ''}`}
                onClick={() => toggleMilestone(milestone.id)}
              >
                <span className="milestone-check">
                  {milestone.completed ? '✓' : '○'}
                </span>
                <div className="milestone-info">
                  <span className="milestone-title">{milestone.title}</span>
                  <span className="milestone-date">
                    Target: {new Date(milestone.targetDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Features Preview */}
        {!isPro && (
          <div className="pro-preview">
            <h3>🔒 Pro Features</h3>
            <p>Upgrade to unlock advanced execution features:</p>
            <ul>
              <li>📱 Slack integration for milestone alerts</li>
              <li>📊 Advanced KPI tracking</li>
              <li>👥 Team task assignment</li>
              <li>📈 Real-time progress dashboards</li>
            </ul>
            <a href="/pricing" className="upgrade-btn">Upgrade to Pro</a>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={handleBack}>
          ← Back to Decide
        </button>
        <button
          className="btn-success"
          onClick={() => {
            addNotification({
              type: 'success',
              title: 'Strategy In Progress!',
              message: 'Your strategy journey is underway. Keep tracking your progress.',
            });
          }}
        >
          ✓ Strategy Complete
        </button>
      </div>

      <style jsx>{`
        .deliver-step {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .step-header {
          padding: 24px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(74, 222, 128, 0.05));
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

        .deliver-content {
          padding: 24px;
        }

        .progress-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .progress-card {
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          text-align: center;
        }

        .progress-card h4 {
          margin: 0 0 16px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .tasks-section, .milestones-section {
          margin-bottom: 32px;
        }

        .tasks-section h3, .milestones-section h3 {
          margin: 0 0 16px;
          color: var(--text-primary);
        }

        .add-task, .add-milestone {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .add-task input, .add-milestone input[type="text"] {
          flex: 1;
          padding: 12px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .add-milestone input[type="date"] {
          padding: 12px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .add-task button, .add-milestone button {
          padding: 12px 20px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          font-weight: 500;
          color: white;
          cursor: pointer;
        }

        .tasks-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: var(--text-muted);
        }

        .task-column {
          background: var(--bg-tertiary);
          border-radius: 12px;
          padding: 16px;
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 12px;
          font-size: 14px;
        }

        .column-header.todo { color: var(--text-secondary); }
        .column-header.in_progress { color: #F59E0B; }
        .column-header.done { color: #22C55E; }

        .count {
          padding: 2px 8px;
          background: var(--bg-primary);
          border-radius: 10px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .column-tasks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 100px;
        }

        .task-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 8px;
        }

        .task-title {
          font-size: 13px;
          color: var(--text-primary);
        }

        .task-actions {
          display: flex;
          gap: 4px;
        }

        .task-actions button {
          padding: 4px 8px;
          background: var(--bg-primary);
          border: none;
          border-radius: 4px;
          font-size: 12px;
          color: var(--text-muted);
          cursor: pointer;
        }

        .task-actions button:hover {
          background: var(--accent);
          color: white;
        }

        .task-actions button.delete:hover {
          background: #EF4444;
        }

        .milestones-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .milestone-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .milestone-card:hover {
          border-color: var(--accent);
        }

        .milestone-card.completed {
          border-color: #22C55E;
          background: rgba(34, 197, 94, 0.1);
        }

        .milestone-check {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .milestone-card.completed .milestone-check {
          background: #22C55E;
          border-color: #22C55E;
          color: white;
        }

        .milestone-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .milestone-title {
          font-weight: 500;
          color: var(--text-primary);
        }

        .milestone-card.completed .milestone-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .milestone-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .pro-preview {
          padding: 24px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.05));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
        }

        .pro-preview h3 {
          margin: 0 0 8px;
          color: #C084FC;
        }

        .pro-preview p {
          margin: 0 0 12px;
          color: var(--text-secondary);
        }

        .pro-preview ul {
          margin: 0 0 16px;
          padding-left: 20px;
          color: var(--text-muted);
        }

        .pro-preview li {
          margin-bottom: 4px;
        }

        .upgrade-btn {
          display: inline-block;
          padding: 10px 20px;
          background: linear-gradient(135deg, #A855F7, #EC4899);
          border-radius: 8px;
          font-weight: 600;
          color: white;
          text-decoration: none;
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

        .btn-success {
          padding: 12px 24px;
          background: linear-gradient(135deg, #22C55E, #4ADE80);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .progress-overview {
            grid-template-columns: 1fr;
          }

          .tasks-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
