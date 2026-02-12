'use client';

import { useState } from 'react';
import AppShell from '../../../components/AppShell';
import {
  useStrategyEngine, PHASE_ORDER, PHASE_LABELS, InterrogationPhase,
} from '../../../state/useStrategyEngine';
import PhaseContext from '../../../components/lumina-s/PhaseContext';
import PhaseObjectives from '../../../components/lumina-s/PhaseObjectives';
import PhaseConstraints from '../../../components/lumina-s/PhaseConstraints';
import PhaseCompetitive from '../../../components/lumina-s/PhaseCompetitive';
import PhaseCapability from '../../../components/lumina-s/PhaseCapability';
import PhaseOptions from '../../../components/lumina-s/PhaseOptions';
import PhaseSimulation from '../../../components/lumina-s/PhaseSimulation';
import StrategyDashboard from '../../../components/lumina-s/StrategyDashboard';
import UploadFlow from '../../../components/lumina-s/UploadFlow';

const STEP_MAP: { phase: InterrogationPhase; step: number; label: string; desc: string }[] = [
  { phase: 'context', step: 1, label: 'Enterprise Context', desc: 'Industry, market, geography, horizon' },
  { phase: 'objectives', step: 2, label: 'Objective Hierarchy', desc: 'Vision, intent, quantified targets' },
  { phase: 'constraints', step: 3, label: 'Resource Envelope', desc: 'Capital, talent, tech, risk tolerance' },
  { phase: 'competitive', step: 4, label: 'Competitive Scan', desc: 'Five forces, intensity scoring' },
  { phase: 'capability', step: 5, label: 'Capability Mapping', desc: 'Capabilities, digital maturity, brand' },
  { phase: 'options', step: 6, label: 'Strategic Options', desc: 'Revenue, margin, risk, strain' },
  { phase: 'simulation', step: 7, label: 'Scenario & Portfolio', desc: 'Base, optimistic, pessimistic, disruption' },
];

export default function LuminaSPage() {
  const {
    session_id, current_phase, entry_pathway,
    startSession, resetSession, setPhase,
    canAdvanceTo, getPhaseStatus,
    enterprise, objectives, constraints, market, capability,
    strategic_options, simulations,
  } = useStrategyEngine();

  const [view, setView] = useState<'journey' | 'dashboard'>('journey');

  const readiness = (() => {
    let score = 0;
    if (enterprise?.completed) score += 14;
    if (objectives?.completed) score += 14;
    if (constraints?.completed) score += 14;
    if (market?.completed) score += 14;
    if (capability?.completed) score += 14;
    if (strategic_options.some(o => o.selected)) score += 15;
    if (simulations.length > 0) score += 15;
    return score;
  })();

  // ============ LANDING (NO SESSION) ============
  if (!session_id) {
    return (
      <AppShell>
        <div className="ls-landing">
          <div className="landing-hero">
            <div className="hero-badge">Strategic Intelligence Engine</div>
            <h1>Lumina <span className="hero-accent">S</span></h1>
            <p className="hero-tagline">
              Strategy is structured choice under constraint, competition, capability and capital.
            </p>
          </div>

          <div className="landing-split">
            <button className="pathway-panel architect" onClick={() => startSession('architect')}>
              <div className="pw-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2>AI Strategy Architect</h2>
              <p>Guided strategic interrogation through 7 structured phases. The system leads — you decide.</p>
              <div className="pw-steps">
                {STEP_MAP.map(s => (
                  <div key={s.step} className="pw-step">
                    <span className="pw-num">{s.step}</span>
                    <span className="pw-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="pw-cta">
                Start Guided Journey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </button>

            <div className="split-divider"><span>OR</span></div>

            <button className="pathway-panel upload" onClick={() => startSession('workspace')}>
              <div className="pw-icon upload-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2>Upload Strategic Data</h2>
              <p>Upload Excel, CSV or PDF. Auto-parse market data, revenue forecasts, competitor intelligence into the Strategic Object Model.</p>
              <div className="pw-formats">
                <span className="format-tag">Excel / XLSX</span>
                <span className="format-tag">CSV</span>
                <span className="format-tag">PDF</span>
              </div>
              <div className="pw-cta upload-cta">
                Upload & Begin
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </div>
            </button>
          </div>

          <style jsx>{`
            .ls-landing { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }
            .landing-hero { text-align: center; margin-bottom: 48px; }
            .hero-badge {
              display: inline-block; padding: 6px 16px; margin-bottom: 16px;
              background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.25);
              border-radius: 20px; font-size: 12px; font-weight: 600; color: #C084FC;
              text-transform: uppercase; letter-spacing: 1px;
            }
            .landing-hero h1 { font-size: 48px; font-weight: 800; color: var(--text-primary); margin: 0 0 12px; }
            .hero-accent {
              background: linear-gradient(135deg, #14B8A6, #A855F7);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }
            .hero-tagline { font-size: 16px; color: var(--text-muted); max-width: 520px; margin: 0 auto; line-height: 1.6; }
            .landing-split { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: stretch; }
            .split-divider {
              display: flex; align-items: center; justify-content: center;
              padding: 0 20px; color: var(--text-muted); font-size: 13px; font-weight: 600;
            }
            .split-divider span {
              writing-mode: vertical-rl; text-orientation: mixed;
              padding: 16px 12px; border-left: 1px solid var(--border);
            }
            .pathway-panel {
              display: flex; flex-direction: column; padding: 36px 28px;
              background: var(--bg-secondary); border: 1px solid var(--border);
              border-radius: 20px; cursor: pointer; transition: all 0.3s ease; text-align: left;
            }
            .pathway-panel:hover { transform: translateY(-6px); }
            .pathway-panel.architect:hover { border-color: rgba(20, 184, 166, 0.4); box-shadow: 0 20px 60px rgba(20, 184, 166, 0.12); }
            .pathway-panel.upload:hover { border-color: rgba(168, 85, 247, 0.4); box-shadow: 0 20px 60px rgba(168, 85, 247, 0.12); }
            .pw-icon {
              width: 64px; height: 64px; margin-bottom: 20px;
              background: rgba(20, 184, 166, 0.1); border-radius: 16px;
              display: flex; align-items: center; justify-content: center; color: #14B8A6;
            }
            .pw-icon.upload-icon { background: rgba(168, 85, 247, 0.1); color: #A855F7; }
            .pathway-panel h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
            .pathway-panel p { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin: 0 0 20px; }
            .pw-steps { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; flex: 1; }
            .pw-step { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
            .pw-num {
              width: 22px; height: 22px; border-radius: 6px;
              background: linear-gradient(135deg, #14B8A6, #0D9488);
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
            }
            .pw-label { font-size: 13px; color: var(--text-secondary); }
            .pw-formats { display: flex; gap: 8px; margin-bottom: 24px; flex: 1; align-items: flex-start; }
            .format-tag {
              padding: 6px 14px; background: var(--bg-tertiary);
              border: 1px solid var(--border); border-radius: 8px;
              font-size: 12px; font-weight: 600; color: var(--text-secondary);
            }
            .pw-cta {
              display: flex; align-items: center; justify-content: center; gap: 8px;
              padding: 14px; background: linear-gradient(135deg, #14B8A6, #0D9488);
              border-radius: 12px; font-size: 15px; font-weight: 600; color: white;
            }
            .pw-cta.upload-cta { background: linear-gradient(135deg, #A855F7, #7C3AED); }
            @media (max-width: 800px) {
              .landing-split { grid-template-columns: 1fr; gap: 16px; }
              .split-divider span { writing-mode: horizontal-tb; border-left: none; border-top: 1px solid var(--border); padding: 12px 16px; }
            }
          `}</style>
        </div>
      </AppShell>
    );
  }

  // ============ UPLOAD PATHWAY ============
  if (entry_pathway === 'workspace') {
    return <AppShell><UploadFlow /></AppShell>;
  }

  // ============ ARCHITECT JOURNEY ============
  const currentStepInfo = STEP_MAP.find(s => s.phase === current_phase);
  const allDone = simulations.length > 0;

  const renderPhase = () => {
    switch (current_phase) {
      case 'context': return <PhaseContext />;
      case 'objectives': return <PhaseObjectives />;
      case 'constraints': return <PhaseConstraints />;
      case 'competitive': return <PhaseCompetitive />;
      case 'capability': return <PhaseCapability />;
      case 'options': return <PhaseOptions />;
      case 'simulation': return <PhaseSimulation />;
      default: return <PhaseContext />;
    }
  };

  return (
    <AppShell>
      <div className="ls-engine">
        {/* Top Bar */}
        <div className="engine-topbar">
          <div className="topbar-left">
            <span className="topbar-logo">Lumina <span className="la">S</span></span>
            {enterprise?.organisation_name && (
              <span className="topbar-org">{enterprise.organisation_name}</span>
            )}
          </div>
          <div className="topbar-center">
            <div className="readiness-pill">
              <div className="readiness-bar"><div className="readiness-fill" style={{ width: `${readiness}%` }} /></div>
              <span className="readiness-text">Readiness {readiness}%</span>
            </div>
          </div>
          <div className="topbar-right">
            {allDone && (
              <button className={`view-toggle ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => setView(view === 'dashboard' ? 'journey' : 'dashboard')}>
                {view === 'dashboard' ? 'Journey View' : 'Dashboard'}
              </button>
            )}
            <button className="topbar-reset" onClick={resetSession} title="New Session">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </button>
          </div>
        </div>

        {view === 'dashboard' && allDone ? (
          <StrategyDashboard />
        ) : (
          <div className="engine-body">
            <div className="step-rail">
              {STEP_MAP.map(s => {
                const status = getPhaseStatus(s.phase);
                const isActive = s.phase === current_phase;
                const canClick = canAdvanceTo(s.phase);
                return (
                  <button key={s.phase}
                    className={`rail-step ${isActive ? 'active' : ''} ${status === 'completed' ? 'done' : ''} ${!canClick ? 'locked' : ''}`}
                    onClick={() => canClick && setPhase(s.phase)} disabled={!canClick}>
                    <div className="step-ind">
                      {status === 'completed' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : <span>{s.step}</span>}
                    </div>
                    <div className="step-text">
                      <span className="sn">{s.label}</span>
                      <span className="sd">{s.desc}</span>
                    </div>
                    {isActive && <div className="active-mark" />}
                  </button>
                );
              })}
            </div>
            <div className="step-content">
              <div className="content-badge">Step {currentStepInfo?.step || 1} of 7</div>
              {renderPhase()}
            </div>
          </div>
        )}

        <style jsx>{`
          .ls-engine { min-height: calc(100vh - 120px); display: flex; flex-direction: column; }
          .engine-topbar {
            display: flex; align-items: center; justify-content: space-between;
            padding: 12px 20px; background: var(--bg-secondary);
            border: 1px solid var(--border); border-radius: 14px; margin-bottom: 16px;
          }
          .topbar-left { display: flex; align-items: center; gap: 16px; }
          .topbar-logo { font-size: 18px; font-weight: 800; color: var(--text-primary); }
          .la { background: linear-gradient(135deg, #14B8A6, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .topbar-org { font-size: 13px; color: var(--text-muted); padding-left: 16px; border-left: 1px solid var(--border); }
          .topbar-center { flex: 1; display: flex; justify-content: center; padding: 0 24px; }
          .readiness-pill { display: flex; align-items: center; gap: 10px; }
          .readiness-bar { width: 120px; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
          .readiness-fill { height: 100%; border-radius: 3px; transition: width 0.5s; background: linear-gradient(90deg, #14B8A6, #22C55E); }
          .readiness-text { font-size: 12px; font-weight: 600; color: #14B8A6; white-space: nowrap; }
          .topbar-right { display: flex; align-items: center; gap: 10px; }
          .view-toggle {
            padding: 8px 16px; background: rgba(168, 85, 247, 0.1);
            border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 8px;
            font-size: 12px; font-weight: 600; color: #C084FC; cursor: pointer;
          }
          .view-toggle.active { background: #A855F7; color: white; border-color: #A855F7; }
          .topbar-reset {
            width: 32px; height: 32px; background: var(--bg-tertiary);
            border: 1px solid var(--border); border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            color: var(--text-muted); cursor: pointer;
          }
          .topbar-reset:hover { color: #EF4444; border-color: rgba(239, 68, 68, 0.3); }
          .engine-body { display: grid; grid-template-columns: 240px 1fr; gap: 16px; flex: 1; }
          .step-rail {
            display: flex; flex-direction: column; gap: 4px;
            background: var(--bg-secondary); border: 1px solid var(--border);
            border-radius: 14px; padding: 16px 12px; align-self: start;
            position: sticky; top: 80px;
          }
          .rail-step {
            display: flex; align-items: center; gap: 12px;
            padding: 12px; border-radius: 10px; border: none;
            background: transparent; cursor: pointer; transition: all 0.2s;
            text-align: left; position: relative;
          }
          .rail-step:hover:not(:disabled) { background: var(--bg-tertiary); }
          .rail-step.active { background: rgba(20, 184, 166, 0.08); }
          .rail-step.locked { opacity: 0.35; cursor: not-allowed; }
          .step-ind {
            width: 28px; height: 28px; border-radius: 8px;
            background: var(--bg-tertiary); display: flex; align-items: center;
            justify-content: center; font-size: 12px; font-weight: 700;
            color: var(--text-muted); flex-shrink: 0;
          }
          .rail-step.active .step-ind { background: #14B8A6; color: white; }
          .rail-step.done .step-ind { background: #22C55E; color: white; }
          .step-text { display: flex; flex-direction: column; min-width: 0; }
          .sn { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
          .rail-step.active .sn { color: var(--text-primary); }
          .sd { font-size: 10px; color: var(--text-muted); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .active-mark { position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; background: #14B8A6; border-radius: 2px; }
          .step-content {
            background: var(--bg-secondary); border: 1px solid var(--border);
            border-radius: 14px; padding: 28px 32px; min-height: 500px;
          }
          .content-badge {
            display: inline-block; padding: 4px 12px; margin-bottom: 20px;
            background: var(--bg-tertiary); border-radius: 6px;
            font-size: 11px; font-weight: 600; color: var(--text-muted);
            text-transform: uppercase; letter-spacing: 0.5px;
          }
          @media (max-width: 900px) {
            .engine-body { grid-template-columns: 1fr; }
            .step-rail { flex-direction: row; overflow-x: auto; position: static; padding: 12px; }
            .sd { display: none; }
            .rail-step { padding: 8px 12px; flex-shrink: 0; }
            .active-mark { top: auto; bottom: 0; left: 8px; right: 8px; width: auto; height: 3px; }
            .topbar-center { display: none; }
          }
        `}</style>
      </div>
    </AppShell>
  );
}
