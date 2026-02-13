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
     LANDING PAGE — Dark with 3D rotating cube
     ═══════════════════════════════════════════════ */
  if (!session_id) {
    return (
      <div className="lp">
        {/* ── Navbar ── */}
        <nav className="lp-nav">
          <div className="lp-nav-inner">
            <div className="nav-left">
              <svg className="nav-icon" width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#navg)" strokeWidth="2"/>
                <path d="M10 22V10h4v8h4V10h4v12" stroke="url(#navg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="navg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#14B8A6"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs>
              </svg>
              <span className="nav-brand">Lumina <span className="nav-s">S</span></span>
            </div>
            <div className="nav-center">
              <a className="nav-link" href="#pricing">Pricing</a>
              <a className="nav-link" href="#tools">Tools</a>
              <a className="nav-link" href="#docs">Docs</a>
              <button className="nav-link nav-link-btn" onClick={() => startSession('architect')}>Dashboard</button>
            </div>
            <button className="nav-get-started" onClick={() => startSession('architect')}>Get Started</button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="lp-hero">
          <div className="hero-left">
            <h1 className={`hero-h1 ${mounted ? 'hero-visible' : ''}`}>
              Build winning<br/>strategies<br/>
              <span className="hero-grad">with intelligence</span>
            </h1>
            <p className="hero-p">
              AI-powered strategic intelligence engine. Model competitive dynamics,
              simulate scenarios, and optimise portfolios — all computationally grounded.
            </p>
            <div className="hero-email-row">
              <input
                type="email"
                className="hero-email"
                placeholder="Enter your email"
                onKeyDown={e => { if (e.key === 'Enter') startSession('architect'); }}
              />
              <button className="hero-go" onClick={() => startSession('architect')}>
                Get Started
              </button>
            </div>
            <div className="hero-stats">
              <div className="hs"><span className="hs-n">9</span><span className="hs-l">Engines</span></div>
              <div className="hs-d"/>
              <div className="hs"><span className="hs-n">7</span><span className="hs-l">Strategic Phases</span></div>
              <div className="hs-d"/>
              <div className="hs"><span className="hs-n">&infin;</span><span className="hs-l">Scenarios</span></div>
            </div>
          </div>

          {/* ── 3D Cube ── */}
          <div className="hero-right">
            <div className="cube-glow-outer"/>
            <div className="cube-glow-inner"/>
            <div className="cube-wrapper">
              <div className="cube-box">
                <div className="face face-front"/>
                <div className="face face-back"/>
                <div className="face face-right"/>
                <div className="face face-left"/>
                <div className="face face-top"/>
                <div className="face face-bottom"/>
                {/* edge lines for extra wireframe feel */}
                <div className="face face-front wire"/>
                <div className="face face-back wire"/>
                <div className="face face-right wire"/>
                <div className="face face-left wire"/>
                <div className="face face-top wire"/>
                <div className="face face-bottom wire"/>
              </div>
            </div>
            {/* floating particles */}
            <div className="ptcls">
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const radius = 160 + Math.random() * 80;
                return (
                  <div key={i} className="ptcl" style={{
                    '--px': `${Math.cos(angle) * radius}px`,
                    '--py': `${Math.sin(angle) * radius}px`,
                    '--d': `${i * 0.4}s`,
                    '--sz': `${2 + Math.random() * 3}px`,
                    '--dur': `${4 + Math.random() * 4}s`,
                  } as React.CSSProperties}/>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Feature row ── */}
        <section className="lp-features">
          {[
            { icon: '◎', t: 'Five Forces Analysis', d: 'Porter\'s competitive dynamics scoring' },
            { icon: '◈', t: 'Capability Heatmap', d: 'Readiness and gap identification' },
            { icon: '⬡', t: 'Scenario Simulation', d: 'Probabilistic Monte Carlo modelling' },
            { icon: '◉', t: 'Portfolio Optimisation', d: 'Constrained efficient frontier' },
          ].map((f, i) => (
            <div key={i} className="feat-card">
              <span className="feat-icon">{f.icon}</span>
              <span className="feat-t">{f.t}</span>
              <span className="feat-d">{f.d}</span>
            </div>
          ))}
        </section>

        <style jsx global>{`
          @keyframes lp-cube-spin {
            0%   { transform: rotateX(-25deg) rotateY(0deg); }
            100% { transform: rotateX(-25deg) rotateY(360deg); }
          }
          @keyframes lp-glow-pulse {
            0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
            50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.85; }
          }
          @keyframes lp-ptcl-orbit {
            0%   { transform: translate(0,0) scale(0); opacity: 0; }
            15%  { opacity: 0.7; transform: translate(calc(var(--px) * 0.3), calc(var(--py) * 0.3)) scale(1); }
            85%  { opacity: 0.3; }
            100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
          }
          @keyframes lp-hero-in {
            0%   { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <style jsx>{`
          /* ─── Root ─── */
          .lp {
            min-height: 100vh;
            background: #08080F;
            color: #fff;
            overflow-x: hidden;
          }

          /* ─── Navbar ─── */
          .lp-nav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            padding: 0 32px;
            background: rgba(8,8,15,0.7);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .lp-nav-inner {
            max-width: 1280px; margin: 0 auto;
            display: flex; align-items: center; justify-content: space-between;
            height: 64px;
          }
          .nav-left { display: flex; align-items: center; gap: 10px; }
          .nav-brand { font-size: 19px; font-weight: 800; letter-spacing: -0.5px; }
          .nav-s {
            background: linear-gradient(135deg, #14B8A6, #A855F7);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .nav-center { display: flex; align-items: center; gap: 36px; }
          .nav-link {
            font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45);
            text-decoration: none; transition: color 0.2s; cursor: pointer;
          }
          .nav-link:hover { color: #fff; }
          .nav-link-btn { background: none; border: none; font-family: inherit; padding: 0; }
          .nav-get-started {
            padding: 9px 22px;
            background: #fff; color: #08080F;
            border: none; border-radius: 10px;
            font-size: 13px; font-weight: 700; cursor: pointer;
            transition: all 0.2s; font-family: inherit;
          }
          .nav-get-started:hover { background: #E8E8E8; transform: translateY(-1px); }

          /* ─── Hero Section ─── */
          .lp-hero {
            display: grid; grid-template-columns: 1fr 1fr;
            max-width: 1280px; margin: 0 auto;
            padding: 140px 40px 60px;
            align-items: center; gap: 20px;
            min-height: 100vh;
          }

          /* Hero Left */
          .hero-left { z-index: 2; }
          .hero-h1 {
            font-size: 60px; font-weight: 800;
            line-height: 1.05; letter-spacing: -2.5px;
            margin: 0 0 24px;
            opacity: 0; transform: translateY(30px);
            transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .hero-h1.hero-visible { opacity: 1; transform: translateY(0); }
          .hero-grad {
            background: linear-gradient(135deg, #14B8A6 0%, #818CF8 50%, #C084FC 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .hero-p {
            font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.4);
            max-width: 460px; margin: 0 0 32px;
          }
          .hero-email-row {
            display: flex; gap: 0; max-width: 440px; margin-bottom: 40px;
            border-radius: 14px; overflow: hidden;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.04);
          }
          .hero-email {
            flex: 1; padding: 16px 20px;
            background: transparent; border: none;
            font-size: 15px; color: #fff; outline: none;
            font-family: inherit;
          }
          .hero-email::placeholder { color: rgba(255,255,255,0.25); }
          .hero-go {
            padding: 16px 28px; white-space: nowrap;
            background: linear-gradient(135deg, #14B8A6, #0D9488);
            border: none; color: #fff; font-size: 14px; font-weight: 700;
            cursor: pointer; transition: all 0.2s; font-family: inherit;
          }
          .hero-go:hover { filter: brightness(1.1); }
          .hero-stats { display: flex; align-items: center; gap: 28px; }
          .hs { display: flex; flex-direction: column; gap: 2px; }
          .hs-n { font-size: 26px; font-weight: 800; color: #fff; }
          .hs-l { font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 500; }
          .hs-d { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }

          /* ─── 3D Rotating Cube ─── */
          .hero-right {
            position: relative;
            display: flex; align-items: center; justify-content: center;
            height: 520px;
          }
          .cube-glow-outer {
            position: absolute; top: 50%; left: 50%;
            width: 380px; height: 380px;
            background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%,-50%);
            filter: blur(60px);
            animation: lp-glow-pulse 5s ease-in-out infinite;
          }
          .cube-glow-inner {
            position: absolute; top: 50%; left: 50%;
            width: 200px; height: 200px;
            background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%,-50%);
            filter: blur(30px);
            animation: lp-glow-pulse 5s ease-in-out infinite 0.5s;
          }
          .cube-wrapper {
            width: 280px; height: 280px;
            perspective: 800px;
            position: relative; z-index: 2;
          }
          .cube-box {
            width: 100%; height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: lp-cube-spin 10s linear infinite;
          }
          .face {
            position: absolute; width: 280px; height: 280px;
            backface-visibility: visible;
          }
          .face:not(.wire) {
            background: linear-gradient(
              135deg,
              rgba(20, 184, 166, 0.04) 0%,
              rgba(168, 85, 247, 0.02) 100%
            );
          }
          .face.wire {
            background: none;
            border: 1.5px solid rgba(20, 184, 166, 0.35);
            box-shadow:
              inset 0 0 30px rgba(20, 184, 166, 0.03),
              0 0 15px rgba(20, 184, 166, 0.05);
          }
          .face-front  { transform: translateZ(140px); }
          .face-back   { transform: rotateY(180deg) translateZ(140px); }
          .face-right  { transform: rotateY(90deg) translateZ(140px); }
          .face-left   { transform: rotateY(-90deg) translateZ(140px); }
          .face-top    { transform: rotateX(90deg) translateZ(140px); }
          .face-bottom { transform: rotateX(-90deg) translateZ(140px); }

          /* Particles */
          .ptcls {
            position: absolute; top: 50%; left: 50%;
            width: 0; height: 0; z-index: 1; pointer-events: none;
          }
          .ptcl {
            position: absolute;
            width: var(--sz); height: var(--sz);
            background: #2DD4BF; border-radius: 50%;
            opacity: 0;
            animation: lp-ptcl-orbit var(--dur) ease-in-out infinite;
            animation-delay: var(--d);
          }

          /* ─── Feature Cards ─── */
          .lp-features {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
            max-width: 1280px; margin: 0 auto;
            padding: 0 40px 80px;
          }
          .feat-card {
            display: flex; flex-direction: column; gap: 10px;
            padding: 28px 24px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px; transition: all 0.3s;
          }
          .feat-card:hover {
            background: rgba(20,184,166,0.04);
            border-color: rgba(20,184,166,0.15);
            transform: translateY(-4px);
          }
          .feat-icon { font-size: 24px; color: #14B8A6; }
          .feat-t { font-size: 14px; font-weight: 600; color: #fff; }
          .feat-d { font-size: 13px; color: rgba(255,255,255,0.3); line-height: 1.5; }

          /* ─── Responsive ─── */
          @media (max-width: 960px) {
            .lp-hero { grid-template-columns: 1fr; text-align: center; padding: 120px 24px 40px; }
            .hero-h1 { font-size: 40px; }
            .hero-p { margin: 0 auto 28px; }
            .hero-email-row { max-width: 100%; margin: 0 auto 32px; }
            .hero-stats { justify-content: center; }
            .hero-right { height: 360px; }
            .cube-wrapper { width: 200px; height: 200px; }
            .face { width: 200px; height: 200px; }
            .face-front  { transform: translateZ(100px); }
            .face-back   { transform: rotateY(180deg) translateZ(100px); }
            .face-right  { transform: rotateY(90deg) translateZ(100px); }
            .face-left   { transform: rotateY(-90deg) translateZ(100px); }
            .face-top    { transform: rotateX(90deg) translateZ(100px); }
            .face-bottom { transform: rotateX(-90deg) translateZ(100px); }
            .lp-features { grid-template-columns: 1fr 1fr; padding: 0 24px 60px; }
            .nav-center { display: none; }
            .lp-nav { padding: 0 20px; }
          }
          @media (max-width: 520px) {
            .hero-h1 { font-size: 32px; letter-spacing: -1.5px; }
            .hero-email-row { flex-direction: column; }
            .hero-go { padding: 14px; }
            .lp-features { grid-template-columns: 1fr; }
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
