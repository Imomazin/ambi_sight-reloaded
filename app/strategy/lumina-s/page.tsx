'use client';

import { useState, useEffect } from 'react';
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

const STEP_MAP: { phase: InterrogationPhase; step: number; label: string; desc: string; icon: string }[] = [
  { phase: 'context', step: 1, label: 'Enterprise Context', desc: 'Industry, market, geography', icon: '◆' },
  { phase: 'objectives', step: 2, label: 'Objective Hierarchy', desc: 'Vision, intent, targets', icon: '◎' },
  { phase: 'constraints', step: 3, label: 'Resource Envelope', desc: 'Capital, talent, risk', icon: '▣' },
  { phase: 'competitive', step: 4, label: 'Competitive Scan', desc: 'Five forces, intensity', icon: '⬡' },
  { phase: 'capability', step: 5, label: 'Capability Mapping', desc: 'Maturity, digital, brand', icon: '◈' },
  { phase: 'options', step: 6, label: 'Strategic Options', desc: 'Revenue, margin, risk', icon: '⬢' },
  { phase: 'simulation', step: 7, label: 'Scenario & Portfolio', desc: 'Simulate, optimise', icon: '◉' },
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  /* ═══════════════════════════════════════════════
     LANDING PAGE — Full-screen dark with 3D cube
     ═══════════════════════════════════════════════ */
  if (!session_id) {
    return (
      <div className="ls-landing-root">
        {/* Nav */}
        <nav className="ls-nav">
          <div className="nav-logo">
            <div className="logo-mark">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#lg)" strokeWidth="2" fill="none"/>
                <path d="M10 22V10h4v8h4V10h4v12" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#14B8A6"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs>
              </svg>
            </div>
            <span className="logo-text">Lumina <span className="logo-s">S</span></span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#tools">Tools</a>
            <a href="#docs">Docs</a>
            <button className="nav-dash" onClick={() => startSession('architect')}>Dashboard</button>
          </div>
          <button className="nav-cta" onClick={() => startSession('architect')}>Get Started</button>
        </nav>

        {/* Hero */}
        <div className="ls-hero">
          <div className="hero-content">
            <div className="hero-badge-row">
              <span className="hero-badge">Strategic Intelligence Engine</span>
            </div>
            <h1 className={`hero-title ${mounted ? 'visible' : ''}`}>
              Build winning strategies<br/>
              <span className="hero-gradient">with intelligence</span>
            </h1>
            <p className="hero-sub">
              AI-powered strategic planning and simulation engine. Model scenarios,
              optimise portfolios, and make decisions backed by computational intelligence.
            </p>
            <div className="hero-actions">
              <button className="hero-btn primary" onClick={() => startSession('architect')}>
                Start Strategy Session
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="hero-btn secondary" onClick={() => startSession('workspace')}>
                Upload Data
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">9</span><span className="stat-label">Computation Engines</span></div>
              <div className="stat-divider"/>
              <div className="stat"><span className="stat-num">7</span><span className="stat-label">Strategic Phases</span></div>
              <div className="stat-divider"/>
              <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Scenarios</span></div>
            </div>
          </div>

          {/* 3D Rotating Cube */}
          <div className="cube-container">
            <div className="cube-glow"/>
            <div className="cube-scene">
              <div className="cube">
                <div className="cube-face front"/>
                <div className="cube-face back"/>
                <div className="cube-face right"/>
                <div className="cube-face left"/>
                <div className="cube-face top"/>
                <div className="cube-face bottom"/>
              </div>
            </div>
            <div className="cube-particles">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="particle" style={{
                  '--delay': `${i * 0.5}s`,
                  '--x': `${Math.random() * 200 - 100}px`,
                  '--y': `${Math.random() * 200 - 100}px`,
                  '--size': `${2 + Math.random() * 3}px`,
                } as React.CSSProperties}/>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="feature-strip">
          {[
            { icon: '◎', title: 'Five Forces Analysis', desc: 'Porter\'s competitive dynamics scoring' },
            { icon: '◈', title: 'Capability Heatmap', desc: 'Readiness and gap identification' },
            { icon: '⬡', title: 'Monte Carlo Simulation', desc: 'Probabilistic scenario modelling' },
            { icon: '◉', title: 'Portfolio Optimisation', desc: 'Constrained efficient frontier' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <span className="fc-icon">{f.icon}</span>
              <span className="fc-title">{f.title}</span>
              <span className="fc-desc">{f.desc}</span>
            </div>
          ))}
        </div>

        <style jsx>{`
          .ls-landing-root {
            min-height: 100vh; background: #06060B;
            color: #fff; overflow-x: hidden;
            font-family: 'Inter', system-ui, sans-serif;
          }

          /* ── Nav ── */
          .ls-nav {
            display: flex; align-items: center; justify-content: space-between;
            padding: 16px 40px; position: relative; z-index: 10;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .nav-logo { display: flex; align-items: center; gap: 10px; }
          .logo-mark { display: flex; align-items: center; }
          .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
          .logo-s {
            background: linear-gradient(135deg, #14B8A6, #A855F7);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .nav-links { display: flex; align-items: center; gap: 32px; }
          .nav-links a {
            font-size: 14px; color: rgba(255,255,255,0.5); text-decoration: none;
            font-weight: 500; transition: color 0.2s;
          }
          .nav-links a:hover { color: #fff; }
          .nav-dash {
            font-size: 14px; color: rgba(255,255,255,0.5); background: none;
            border: none; font-weight: 500; cursor: pointer; transition: color 0.2s;
            font-family: inherit;
          }
          .nav-dash:hover { color: #fff; }
          .nav-cta {
            padding: 10px 24px; background: #fff; color: #06060B;
            border: none; border-radius: 10px; font-size: 14px;
            font-weight: 600; cursor: pointer; transition: all 0.2s;
            font-family: inherit;
          }
          .nav-cta:hover { background: #E0E0E0; transform: translateY(-1px); }

          /* ── Hero ── */
          .ls-hero {
            display: grid; grid-template-columns: 1fr 1fr;
            max-width: 1280px; margin: 0 auto; padding: 80px 40px 40px;
            align-items: center; gap: 40px; min-height: calc(100vh - 200px);
          }
          .hero-badge-row { margin-bottom: 20px; }
          .hero-badge {
            display: inline-block; padding: 6px 16px;
            background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(20, 184, 166, 0.2);
            border-radius: 20px; font-size: 12px; font-weight: 600; color: #2DD4BF;
            text-transform: uppercase; letter-spacing: 1.5px;
          }
          .hero-title {
            font-size: 56px; font-weight: 800; line-height: 1.1;
            letter-spacing: -2px; margin: 0 0 20px;
            opacity: 0; transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .hero-title.visible { opacity: 1; transform: translateY(0); }
          .hero-gradient {
            background: linear-gradient(135deg, #14B8A6 0%, #A855F7 50%, #E879F9 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .hero-sub {
            font-size: 17px; color: rgba(255,255,255,0.45); line-height: 1.7;
            max-width: 480px; margin-bottom: 36px;
          }
          .hero-actions { display: flex; gap: 14px; margin-bottom: 48px; }
          .hero-btn {
            display: inline-flex; align-items: center; gap: 10px;
            padding: 14px 28px; border-radius: 12px;
            font-size: 15px; font-weight: 600; cursor: pointer;
            transition: all 0.25s; border: none; font-family: inherit;
          }
          .hero-btn.primary {
            background: linear-gradient(135deg, #14B8A6, #0D9488);
            color: #fff; box-shadow: 0 8px 32px rgba(20, 184, 166, 0.25);
          }
          .hero-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(20, 184, 166, 0.35);
          }
          .hero-btn.secondary {
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.8);
          }
          .hero-btn.secondary:hover {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.2);
          }
          .hero-stats { display: flex; align-items: center; gap: 24px; }
          .stat { display: flex; flex-direction: column; gap: 2px; }
          .stat-num { font-size: 24px; font-weight: 800; color: #fff; }
          .stat-label { font-size: 12px; color: rgba(255,255,255,0.35); font-weight: 500; }
          .stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.1); }

          /* ── 3D Cube ── */
          .cube-container {
            position: relative; display: flex; align-items: center;
            justify-content: center; height: 460px;
          }
          .cube-glow {
            position: absolute; width: 260px; height: 260px;
            background: radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%);
            border-radius: 50%; filter: blur(40px);
            animation: glow-breathe 4s ease-in-out infinite;
          }
          @keyframes glow-breathe {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          .cube-scene {
            width: 200px; height: 200px;
            perspective: 600px;
            position: relative; z-index: 2;
          }
          .cube {
            width: 100%; height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: cube-rotate 12s linear infinite;
          }
          @keyframes cube-rotate {
            0% { transform: rotateX(-20deg) rotateY(0deg); }
            100% { transform: rotateX(-20deg) rotateY(360deg); }
          }
          .cube-face {
            position: absolute; width: 200px; height: 200px;
            border: 1.5px solid rgba(20, 184, 166, 0.4);
            background: rgba(20, 184, 166, 0.03);
            backdrop-filter: blur(2px);
          }
          .cube-face.front  { transform: translateZ(100px); }
          .cube-face.back   { transform: rotateY(180deg) translateZ(100px); }
          .cube-face.right  { transform: rotateY(90deg) translateZ(100px); }
          .cube-face.left   { transform: rotateY(-90deg) translateZ(100px); }
          .cube-face.top    { transform: rotateX(90deg) translateZ(100px); }
          .cube-face.bottom { transform: rotateX(-90deg) translateZ(100px); }

          /* Particles */
          .cube-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
          .particle {
            position: absolute; top: 50%; left: 50%;
            width: var(--size); height: var(--size);
            background: #14B8A6; border-radius: 50%;
            opacity: 0;
            animation: particle-float 6s ease-in-out infinite;
            animation-delay: var(--delay);
          }
          @keyframes particle-float {
            0% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.3; }
            100% { transform: translate(var(--x), var(--y)); opacity: 0; }
          }

          /* ── Feature strip ── */
          .feature-strip {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
            background: rgba(255,255,255,0.04); max-width: 1280px;
            margin: 0 auto; padding: 0 40px 60px;
          }
          .feature-card {
            display: flex; flex-direction: column; gap: 8px;
            padding: 28px 24px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.04);
            border-radius: 16px;
            transition: all 0.3s;
          }
          .feature-card:hover {
            background: rgba(20, 184, 166, 0.04);
            border-color: rgba(20, 184, 166, 0.15);
            transform: translateY(-4px);
          }
          .fc-icon { font-size: 22px; color: #14B8A6; }
          .fc-title { font-size: 14px; font-weight: 600; color: #fff; }
          .fc-desc { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.5; }

          @media (max-width: 900px) {
            .ls-hero { grid-template-columns: 1fr; text-align: center; padding: 40px 20px; }
            .hero-title { font-size: 36px; }
            .hero-sub { margin: 0 auto 28px; }
            .hero-actions { justify-content: center; flex-wrap: wrap; }
            .hero-stats { justify-content: center; }
            .cube-container { height: 300px; }
            .cube-scene { width: 140px; height: 140px; }
            .cube-face { width: 140px; height: 140px; }
            .cube-face.front  { transform: translateZ(70px); }
            .cube-face.back   { transform: rotateY(180deg) translateZ(70px); }
            .cube-face.right  { transform: rotateY(90deg) translateZ(70px); }
            .cube-face.left   { transform: rotateY(-90deg) translateZ(70px); }
            .cube-face.top    { transform: rotateX(90deg) translateZ(70px); }
            .cube-face.bottom { transform: rotateX(-90deg) translateZ(70px); }
            .feature-strip { grid-template-columns: 1fr 1fr; padding: 0 20px 40px; }
            .nav-links { display: none; }
            .ls-nav { padding: 16px 20px; }
          }
          @media (max-width: 480px) {
            .feature-strip { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     UPLOAD PATHWAY
     ═══════════════════════════════════════════════ */
  if (entry_pathway === 'workspace') {
    return <AppShell><UploadFlow /></AppShell>;
  }

  /* ═══════════════════════════════════════════════
     ARCHITECT JOURNEY — Overhauled UX
     ═══════════════════════════════════════════════ */
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
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                <circle cx="8" cy="8" r="6" fill="none" stroke="#14B8A6" strokeWidth="2"
                  strokeDasharray={`${(readiness / 100) * 37.7} 37.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 8 8)"
                  style={{ transition: 'stroke-dasharray 0.5s' }}
                />
              </svg>
              <span className="readiness-text">{readiness}% Ready</span>
            </div>
          </div>
          <div className="topbar-right">
            {allDone && (
              <button className={`view-toggle ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => setView(view === 'dashboard' ? 'journey' : 'dashboard')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {view === 'dashboard'
                    ? <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>
                    : <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>
                  }
                </svg>
                {view === 'dashboard' ? 'Journey' : 'Dashboard'}
              </button>
            )}
            <button className="topbar-reset" onClick={resetSession} title="New Session">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
              </svg>
            </button>
          </div>
        </div>

        {view === 'dashboard' && allDone ? (
          <StrategyDashboard />
        ) : (
          <div className="engine-body">
            {/* Step Rail */}
            <div className="step-rail">
              <div className="rail-header">
                <span className="rail-title">Phases</span>
                <span className="rail-progress">{STEP_MAP.filter(s => getPhaseStatus(s.phase) === 'completed').length}/{STEP_MAP.length}</span>
              </div>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : <span className="step-icon">{s.icon}</span>}
                    </div>
                    <div className="step-text">
                      <span className="sn">{s.label}</span>
                      <span className="sd">{s.desc}</span>
                    </div>
                    {isActive && <div className="active-mark"/>}
                  </button>
                );
              })}
            </div>

            {/* Phase Content */}
            <div className="step-content">
              <div className="content-header">
                <div className="content-badge">Step {currentStepInfo?.step || 1} of 7</div>
                <h2 className="content-title">{currentStepInfo?.label}</h2>
                <p className="content-desc">{currentStepInfo?.desc}</p>
              </div>
              <div className="content-body">
                {renderPhase()}
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .ls-engine { min-height: calc(100vh - 120px); display: flex; flex-direction: column; }

          /* ── Top Bar ── */
          .engine-topbar {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 20px;
            background: linear-gradient(135deg, rgba(26,26,37,0.8), rgba(20,20,30,0.9));
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px; margin-bottom: 16px;
            backdrop-filter: blur(20px);
          }
          .topbar-left { display: flex; align-items: center; gap: 16px; }
          .topbar-logo { font-size: 18px; font-weight: 800; color: #fff; }
          .la {
            background: linear-gradient(135deg, #14B8A6, #A855F7);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .topbar-org {
            font-size: 13px; color: rgba(255,255,255,0.35); padding-left: 16px;
            border-left: 1px solid rgba(255,255,255,0.08);
          }
          .topbar-center { flex: 1; display: flex; justify-content: center; }
          .readiness-pill { display: flex; align-items: center; gap: 8px; }
          .readiness-text { font-size: 13px; font-weight: 600; color: #14B8A6; }
          .topbar-right { display: flex; align-items: center; gap: 10px; }
          .view-toggle {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 16px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px; font-size: 12px; font-weight: 600;
            color: rgba(255,255,255,0.6); cursor: pointer;
            transition: all 0.2s; font-family: inherit;
          }
          .view-toggle:hover { background: rgba(255,255,255,0.08); color: #fff; }
          .view-toggle.active { background: rgba(20, 184, 166, 0.12); border-color: rgba(20, 184, 166, 0.25); color: #14B8A6; }
          .topbar-reset {
            width: 36px; height: 36px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px; display: flex; align-items: center;
            justify-content: center; color: rgba(255,255,255,0.4); cursor: pointer;
            transition: all 0.2s;
          }
          .topbar-reset:hover { color: #EF4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); }

          /* ── Body Layout ── */
          .engine-body { display: grid; grid-template-columns: 260px 1fr; gap: 16px; flex: 1; }

          /* ── Step Rail ── */
          .step-rail {
            display: flex; flex-direction: column; gap: 4px;
            background: linear-gradient(180deg, rgba(26,26,37,0.8), rgba(20,20,30,0.9));
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px; padding: 20px 14px;
            align-self: start; position: sticky; top: 80px;
            backdrop-filter: blur(20px);
          }
          .rail-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.06);
            margin-bottom: 8px;
          }
          .rail-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; }
          .rail-progress { font-size: 12px; font-weight: 700; color: #14B8A6; }
          .rail-step {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 12px; border: none;
            background: transparent; cursor: pointer; transition: all 0.2s;
            text-align: left; position: relative; font-family: inherit;
          }
          .rail-step:hover:not(:disabled) { background: rgba(255,255,255,0.04); }
          .rail-step.active { background: rgba(20, 184, 166, 0.08); }
          .rail-step.locked { opacity: 0.3; cursor: not-allowed; }
          .step-ind {
            width: 32px; height: 32px; border-radius: 10px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.06);
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.3); flex-shrink: 0;
            transition: all 0.2s;
          }
          .step-icon { font-size: 14px; }
          .rail-step.active .step-ind {
            background: rgba(20, 184, 166, 0.15);
            border-color: rgba(20, 184, 166, 0.3);
            color: #14B8A6;
          }
          .rail-step.done .step-ind {
            background: rgba(34, 197, 94, 0.12);
            border-color: rgba(34, 197, 94, 0.25);
            color: #22C55E;
          }
          .step-text { display: flex; flex-direction: column; min-width: 0; }
          .sn { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); transition: color 0.2s; }
          .rail-step.active .sn { color: #fff; }
          .rail-step.done .sn { color: rgba(255,255,255,0.7); }
          .sd {
            font-size: 11px; color: rgba(255,255,255,0.2); line-height: 1.3;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          }
          .active-mark {
            position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px;
            background: linear-gradient(180deg, #14B8A6, #0D9488);
            border-radius: 2px;
          }

          /* ── Content ── */
          .step-content {
            background: linear-gradient(135deg, rgba(26,26,37,0.6), rgba(20,20,30,0.8));
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px; padding: 32px; min-height: 500px;
            backdrop-filter: blur(20px);
          }
          .content-header { margin-bottom: 28px; }
          .content-badge {
            display: inline-block; padding: 4px 12px; margin-bottom: 12px;
            background: rgba(20, 184, 166, 0.08);
            border: 1px solid rgba(20, 184, 166, 0.15);
            border-radius: 8px; font-size: 11px; font-weight: 600;
            color: #14B8A6; text-transform: uppercase; letter-spacing: 0.5px;
          }
          .content-title {
            font-size: 22px; font-weight: 700; color: #fff;
            margin: 0 0 6px; letter-spacing: -0.5px;
          }
          .content-desc { font-size: 14px; color: rgba(255,255,255,0.35); margin: 0; }
          .content-body { }

          @media (max-width: 900px) {
            .engine-body { grid-template-columns: 1fr; }
            .step-rail {
              flex-direction: row; overflow-x: auto; position: static;
              padding: 14px; gap: 6px;
            }
            .rail-header { display: none; }
            .sd { display: none; }
            .rail-step { padding: 8px 14px; flex-shrink: 0; }
            .active-mark { top: auto; bottom: 0; left: 10px; right: 10px; width: auto; height: 3px; }
            .topbar-center { display: none; }
          }
        `}</style>
      </div>
    </AppShell>
  );
}
