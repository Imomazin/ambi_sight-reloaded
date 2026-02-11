'use client';

import { useState } from 'react';
import AppShell from '../../../components/AppShell';
import { useStrategyEngine, PHASE_ORDER, PHASE_LABELS, InterrogationPhase } from '../../../state/useStrategyEngine';
import PhaseContext from '../../../components/lumina-s/PhaseContext';
import PhaseObjectives from '../../../components/lumina-s/PhaseObjectives';
import PhaseConstraints from '../../../components/lumina-s/PhaseConstraints';
import PhaseCompetitive from '../../../components/lumina-s/PhaseCompetitive';
import PhaseCapability from '../../../components/lumina-s/PhaseCapability';
import PhaseOptions from '../../../components/lumina-s/PhaseOptions';
import PhaseSimulation from '../../../components/lumina-s/PhaseSimulation';
import PhaseScenarios from '../../../components/lumina-s/PhaseScenarios';
import PhasePortfolio from '../../../components/lumina-s/PhasePortfolio';
import PhaseGovernance from '../../../components/lumina-s/PhaseGovernance';

const PHASE_ICONS: Record<InterrogationPhase, string> = {
  context: '1',
  objectives: '2',
  constraints: '3',
  competitive: '4',
  capability: '5',
  options: '6',
  simulation: '7',
  scenarios: '8',
  portfolio: '9',
  governance: 'A',
};

export default function LuminaSPage() {
  const {
    session_id, current_phase, entry_pathway,
    startSession, resetSession, setPhase,
    canAdvanceTo, getPhaseStatus,
  } = useStrategyEngine();

  // If no session, show entry pathway selection
  if (!session_id) {
    return (
      <AppShell>
        <div className="lumina-s-entry">
          <div className="entry-header">
            <div className="entry-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h1>Lumina <span className="accent">S</span></h1>
            <p className="subtitle">Strategic Intelligence & Simulation Engine</p>
            <p className="principle">
              Strategy is structured choice under constraint, competition, capability and capital.
            </p>
          </div>

          <div className="entry-pathways">
            <button className="pathway-card primary" onClick={() => startSession('architect')}>
              <div className="pathway-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3>AI Strategy Architect</h3>
              <p>Guided strategic interrogation. The system leads you through 9 phases of structured analysis.</p>
              <span className="pathway-tag">Recommended</span>
            </button>

            <button className="pathway-card" onClick={() => startSession('workspace')}>
              <div className="pathway-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Strategy Workspace</h3>
              <p>Upload data (Excel, CSV, PDF) and enter structured data directly into the model.</p>
              <span className="pathway-tag secondary">Advanced</span>
            </button>
          </div>

          <div className="engine-overview">
            <h3>9-Engine Architecture</h3>
            <div className="engines-grid">
              {PHASE_ORDER.map((phase, i) => (
                <div key={phase} className="engine-item">
                  <span className="engine-num">{i + 1}</span>
                  <span className="engine-label">{PHASE_LABELS[phase]}</span>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            .lumina-s-entry {
              max-width: 800px;
              margin: 0 auto;
              padding: 48px 24px;
            }
            .entry-header {
              text-align: center;
              margin-bottom: 48px;
            }
            .entry-icon {
              width: 80px; height: 80px; margin: 0 auto 24px;
              background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(168, 85, 247, 0.2));
              border: 1px solid rgba(168, 85, 247, 0.3);
              border-radius: 24px;
              display: flex; align-items: center; justify-content: center;
              color: #A855F7;
            }
            .entry-header h1 {
              font-size: 36px; font-weight: 800; color: var(--text-primary); margin: 0 0 8px;
            }
            .accent {
              background: linear-gradient(135deg, #14B8A6, #A855F7);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }
            .subtitle {
              font-size: 16px; color: var(--text-muted); margin: 0 0 16px;
            }
            .principle {
              font-size: 14px; color: #A855F7; font-style: italic;
              padding: 12px 20px;
              background: rgba(168, 85, 247, 0.08);
              border: 1px solid rgba(168, 85, 247, 0.2);
              border-radius: 12px;
              display: inline-block;
            }
            .entry-pathways {
              display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
              margin-bottom: 48px;
            }
            .pathway-card {
              background: var(--bg-secondary);
              border: 1px solid var(--border);
              border-radius: 16px;
              padding: 32px 24px;
              text-align: left;
              cursor: pointer;
              transition: all 0.3s ease;
              position: relative;
            }
            .pathway-card:hover {
              border-color: #A855F7;
              transform: translateY(-4px);
              box-shadow: 0 12px 40px rgba(168, 85, 247, 0.15);
            }
            .pathway-card.primary {
              border-color: rgba(20, 184, 166, 0.3);
            }
            .pathway-card.primary:hover {
              border-color: #14B8A6;
              box-shadow: 0 12px 40px rgba(20, 184, 166, 0.15);
            }
            .pathway-icon {
              width: 56px; height: 56px;
              background: rgba(168, 85, 247, 0.1);
              border-radius: 14px;
              display: flex; align-items: center; justify-content: center;
              color: #A855F7;
              margin-bottom: 16px;
            }
            .pathway-card.primary .pathway-icon {
              background: rgba(20, 184, 166, 0.1);
              color: #14B8A6;
            }
            .pathway-card h3 {
              font-size: 18px; font-weight: 700; color: var(--text-primary);
              margin: 0 0 8px;
            }
            .pathway-card p {
              font-size: 14px; color: var(--text-muted); line-height: 1.5; margin: 0;
            }
            .pathway-tag {
              position: absolute; top: 16px; right: 16px;
              padding: 4px 10px;
              background: rgba(20, 184, 166, 0.15);
              border: 1px solid rgba(20, 184, 166, 0.3);
              border-radius: 8px;
              font-size: 11px; font-weight: 600; color: #14B8A6;
            }
            .pathway-tag.secondary {
              background: rgba(168, 85, 247, 0.1);
              border-color: rgba(168, 85, 247, 0.2);
              color: #A855F7;
            }
            .engine-overview {
              background: var(--bg-secondary);
              border: 1px solid var(--border);
              border-radius: 16px;
              padding: 24px;
            }
            .engine-overview h3 {
              font-size: 14px; font-weight: 600; color: var(--text-secondary);
              margin: 0 0 16px;
            }
            .engines-grid {
              display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;
            }
            .engine-item {
              display: flex; align-items: center; gap: 8px;
              padding: 10px 12px;
              background: var(--bg-tertiary);
              border-radius: 10px;
            }
            .engine-num {
              width: 24px; height: 24px;
              background: linear-gradient(135deg, #14B8A6, #A855F7);
              border-radius: 6px;
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 700; color: white;
              flex-shrink: 0;
            }
            .engine-label {
              font-size: 11px; font-weight: 500; color: var(--text-secondary);
              line-height: 1.2;
            }
            @media (max-width: 768px) {
              .entry-pathways { grid-template-columns: 1fr; }
              .engines-grid { grid-template-columns: repeat(2, 1fr); }
            }
          `}</style>
        </div>
      </AppShell>
    );
  }

  const renderPhase = () => {
    switch (current_phase) {
      case 'context': return <PhaseContext />;
      case 'objectives': return <PhaseObjectives />;
      case 'constraints': return <PhaseConstraints />;
      case 'competitive': return <PhaseCompetitive />;
      case 'capability': return <PhaseCapability />;
      case 'options': return <PhaseOptions />;
      case 'simulation': return <PhaseSimulation />;
      case 'scenarios': return <PhaseScenarios />;
      case 'portfolio': return <PhasePortfolio />;
      case 'governance': return <PhaseGovernance />;
      default: return <PhaseContext />;
    }
  };

  const currentIdx = PHASE_ORDER.indexOf(current_phase);

  return (
    <AppShell>
      <div className="lumina-s-engine">
        {/* Phase Navigation Rail */}
        <div className="phase-rail">
          <div className="rail-header">
            <span className="rail-logo">L<span className="rail-accent">S</span></span>
            <button className="rail-reset" onClick={resetSession} title="Reset Session">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </button>
          </div>
          {PHASE_ORDER.map((phase, i) => {
            const status = getPhaseStatus(phase);
            const isActive = phase === current_phase;
            return (
              <button
                key={phase}
                className={`phase-step ${status} ${isActive ? 'active' : ''}`}
                onClick={() => canAdvanceTo(phase) && setPhase(phase)}
                disabled={status === 'locked'}
                title={PHASE_LABELS[phase]}
              >
                <span className="phase-num">
                  {status === 'completed' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : status === 'locked' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ) : (
                    PHASE_ICONS[phase]
                  )}
                </span>
                <span className="phase-label">{PHASE_LABELS[phase]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="phase-content">
          <div className="content-header">
            <div className="header-breadcrumb">
              <span className="breadcrumb-phase">Phase {currentIdx + 1} of {PHASE_ORDER.length}</span>
              <h2>{PHASE_LABELS[current_phase]}</h2>
            </div>
            <div className="header-badge">
              {entry_pathway === 'architect' ? 'AI Strategy Architect' : 'Strategy Workspace'}
            </div>
          </div>
          {renderPhase()}
        </div>

        <style jsx>{`
          .lumina-s-engine {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 0;
            min-height: calc(100vh - 120px);
          }
          .phase-rail {
            background: var(--bg-secondary);
            border-right: 1px solid var(--border);
            border-radius: 12px 0 0 12px;
            padding: 16px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .rail-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 8px 8px 16px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 8px;
          }
          .rail-logo {
            font-size: 18px; font-weight: 800; color: var(--text-primary);
          }
          .rail-accent {
            background: linear-gradient(135deg, #14B8A6, #A855F7);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .rail-reset {
            width: 32px; height: 32px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.2s;
          }
          .rail-reset:hover {
            color: #EF4444;
            border-color: rgba(239, 68, 68, 0.3);
          }
          .phase-step {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
          }
          .phase-step:hover:not(:disabled) {
            background: var(--bg-tertiary);
          }
          .phase-step.active {
            background: rgba(168, 85, 247, 0.1);
            border-color: rgba(168, 85, 247, 0.3);
          }
          .phase-step.locked {
            opacity: 0.4;
            cursor: not-allowed;
          }
          .phase-step.completed .phase-num {
            background: linear-gradient(135deg, #14B8A6, #22C55E);
          }
          .phase-step.active .phase-num {
            background: linear-gradient(135deg, #A855F7, #EC4899);
          }
          .phase-num {
            width: 28px; height: 28px;
            background: var(--bg-tertiary);
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 700; color: white;
            flex-shrink: 0;
          }
          .phase-label {
            font-size: 12px; font-weight: 500;
            color: var(--text-secondary);
          }
          .phase-step.active .phase-label {
            color: var(--text-primary);
            font-weight: 600;
          }
          .phase-step.locked .phase-label {
            color: var(--text-muted);
          }
          .phase-content {
            padding: 24px 32px;
            overflow-y: auto;
          }
          .content-header {
            display: flex; justify-content: space-between; align-items: flex-start;
            margin-bottom: 24px;
          }
          .breadcrumb-phase {
            font-size: 12px; color: var(--text-muted);
            text-transform: uppercase; letter-spacing: 0.5px;
          }
          .content-header h2 {
            font-size: 24px; font-weight: 700; color: var(--text-primary);
            margin: 4px 0 0;
          }
          .header-badge {
            padding: 6px 14px;
            background: rgba(168, 85, 247, 0.1);
            border: 1px solid rgba(168, 85, 247, 0.2);
            border-radius: 8px;
            font-size: 12px; font-weight: 500; color: #C084FC;
          }
          @media (max-width: 900px) {
            .lumina-s-engine {
              grid-template-columns: 1fr;
            }
            .phase-rail {
              flex-direction: row;
              overflow-x: auto;
              border-radius: 12px 12px 0 0;
              border-right: none;
              border-bottom: 1px solid var(--border);
              padding: 12px;
              gap: 4px;
            }
            .rail-header { display: none; }
            .phase-label { display: none; }
            .phase-step { padding: 8px; }
          }
        `}</style>
      </div>
    </AppShell>
  );
}
