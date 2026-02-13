'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

export default function LandingPage() {
  const router = useRouter();
  const { currentUser, logout } = useAppState();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/signin?email=${encodeURIComponent(email)}&mode=register`);
    }, 400);
  };

  return (
    <div className="lp">
      {/* Navbar */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="lp-logo-text">Lumina <span className="lp-accent">S</span></span>
          </div>
          <div className="lp-nav-links">
            <Link href="/pricing" className="lp-nav-link">Pricing</Link>
            <Link href="/tools" className="lp-nav-link">Tools</Link>
            <Link href="/strategy/lumina-s" className="lp-nav-link">Dashboard</Link>
            {currentUser ? (
              <Link href="/dashboard" className="lp-nav-cta">Go to Dashboard</Link>
            ) : (
              <Link href="/signin" className="lp-nav-cta">Get Started</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          {/* Left Content */}
          <div className="lp-hero-left">
            <div className="lp-badge">
              <span className="lp-badge-dot" />
              Strategic Intelligence Platform
            </div>

            <h1 className="lp-h1">
              Build winning strategies with{' '}
              <span className="lp-grad">intelligence</span>
            </h1>

            <p className="lp-sub">
              Leverage data-driven insights to create, optimize, and execute strategies
              that deliver measurable results for your enterprise.
            </p>

            {/* Email CTA */}
            <form className="lp-cta-row" onSubmit={handleGetStarted}>
              <div className="lp-input-wrap">
                <svg className="lp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className="lp-email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="lp-go-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : 'Get Started'}
                {!isSubmitting && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            {currentUser && (
              <div className="lp-logged-in">
                Signed in as <strong>{currentUser.name}</strong> —{' '}
                <Link href="/dashboard">Go to Dashboard</Link>
                {' '}<span className="lp-divider-dot">|</span>{' '}
                <button onClick={logout} className="lp-signout">Sign out</button>
              </div>
            )}

            {/* Stats */}
            <div className="lp-stats">
              <div className="lp-stat">
                <span className="lp-stat-val">50K+</span>
                <span className="lp-stat-label">Strategies</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-val">99.9%</span>
                <span className="lp-stat-label">Uptime</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-val">24/7</span>
                <span className="lp-stat-label">Support</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Rotating Cube */}
          <div className="lp-hero-right">
            <div className="lp-cube-stage">
              {/* Glow layers */}
              <div className="lp-glow lp-glow-1" />
              <div className="lp-glow lp-glow-2" />
              {/* Orbiting particles */}
              <div className="lp-particles">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`lp-particle lp-particle-${i}`} />
                ))}
              </div>
              {/* Cube */}
              <div className="lp-cube-wrap">
                <div className="lp-cube">
                  {/* Filled faces */}
                  <div className="lp-face lp-face-front" />
                  <div className="lp-face lp-face-back" />
                  <div className="lp-face lp-face-left" />
                  <div className="lp-face lp-face-right" />
                  <div className="lp-face lp-face-top" />
                  <div className="lp-face lp-face-bottom" />
                  {/* Wireframe edges */}
                  <div className="lp-wire lp-wire-front" />
                  <div className="lp-wire lp-wire-back" />
                  <div className="lp-wire lp-wire-left" />
                  <div className="lp-wire lp-wire-right" />
                  <div className="lp-wire lp-wire-top" />
                  <div className="lp-wire lp-wire-bottom" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <div className="lp-features-inner">
          <div className="lp-feat-card">
            <div className="lp-feat-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3>Advanced Analytics</h3>
            <p>Deep insights powered by AI to uncover hidden strategic opportunities.</p>
          </div>
          <div className="lp-feat-card">
            <div className="lp-feat-icon lp-feat-icon-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3>Real-time Collaboration</h3>
            <p>Work together with your team seamlessly across all strategy phases.</p>
          </div>
          <div className="lp-feat-card">
            <div className="lp-feat-icon lp-feat-icon-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>Smart Insights</h3>
            <p>Intelligent recommendations that adapt to your enterprise context.</p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes lp-cube-spin {
          0%   { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }
        @keyframes lp-pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes lp-pulse-glow2 {
          0%, 100% { opacity: 0.3; transform: scale(1.1); }
          50%      { opacity: 0.6; transform: scale(0.9); }
        }
        @keyframes lp-orbit-0  { 0% { transform: rotate(0deg)   translateX(180px) rotate(0deg);   } 100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); } }
        @keyframes lp-orbit-1  { 0% { transform: rotate(18deg)  translateX(190px) rotate(-18deg);  } 100% { transform: rotate(378deg) translateX(190px) rotate(-378deg); } }
        @keyframes lp-orbit-2  { 0% { transform: rotate(36deg)  translateX(170px) rotate(-36deg);  } 100% { transform: rotate(396deg) translateX(170px) rotate(-396deg); } }
        @keyframes lp-orbit-3  { 0% { transform: rotate(54deg)  translateX(200px) rotate(-54deg);  } 100% { transform: rotate(414deg) translateX(200px) rotate(-414deg); } }
        @keyframes lp-orbit-4  { 0% { transform: rotate(72deg)  translateX(160px) rotate(-72deg);  } 100% { transform: rotate(432deg) translateX(160px) rotate(-432deg); } }
        @keyframes lp-orbit-5  { 0% { transform: rotate(90deg)  translateX(185px) rotate(-90deg);  } 100% { transform: rotate(450deg) translateX(185px) rotate(-450deg); } }
        @keyframes lp-orbit-6  { 0% { transform: rotate(108deg) translateX(195px) rotate(-108deg); } 100% { transform: rotate(468deg) translateX(195px) rotate(-468deg); } }
        @keyframes lp-orbit-7  { 0% { transform: rotate(126deg) translateX(175px) rotate(-126deg); } 100% { transform: rotate(486deg) translateX(175px) rotate(-486deg); } }
        @keyframes lp-orbit-8  { 0% { transform: rotate(144deg) translateX(165px) rotate(-144deg); } 100% { transform: rotate(504deg) translateX(165px) rotate(-504deg); } }
        @keyframes lp-orbit-9  { 0% { transform: rotate(162deg) translateX(190px) rotate(-162deg); } 100% { transform: rotate(522deg) translateX(190px) rotate(-522deg); } }
        @keyframes lp-orbit-10 { 0% { transform: rotate(180deg) translateX(180px) rotate(-180deg); } 100% { transform: rotate(540deg) translateX(180px) rotate(-540deg); } }
        @keyframes lp-orbit-11 { 0% { transform: rotate(198deg) translateX(200px) rotate(-198deg); } 100% { transform: rotate(558deg) translateX(200px) rotate(-558deg); } }
        @keyframes lp-orbit-12 { 0% { transform: rotate(216deg) translateX(170px) rotate(-216deg); } 100% { transform: rotate(576deg) translateX(170px) rotate(-576deg); } }
        @keyframes lp-orbit-13 { 0% { transform: rotate(234deg) translateX(185px) rotate(-234deg); } 100% { transform: rotate(594deg) translateX(185px) rotate(-594deg); } }
        @keyframes lp-orbit-14 { 0% { transform: rotate(252deg) translateX(195px) rotate(-252deg); } 100% { transform: rotate(612deg) translateX(195px) rotate(-612deg); } }
        @keyframes lp-orbit-15 { 0% { transform: rotate(270deg) translateX(175px) rotate(-270deg); } 100% { transform: rotate(630deg) translateX(175px) rotate(-630deg); } }
        @keyframes lp-orbit-16 { 0% { transform: rotate(288deg) translateX(160px) rotate(-288deg); } 100% { transform: rotate(648deg) translateX(160px) rotate(-648deg); } }
        @keyframes lp-orbit-17 { 0% { transform: rotate(306deg) translateX(190px) rotate(-306deg); } 100% { transform: rotate(666deg) translateX(190px) rotate(-666deg); } }
        @keyframes lp-orbit-18 { 0% { transform: rotate(324deg) translateX(180px) rotate(-324deg); } 100% { transform: rotate(684deg) translateX(180px) rotate(-684deg); } }
        @keyframes lp-orbit-19 { 0% { transform: rotate(342deg) translateX(200px) rotate(-342deg); } 100% { transform: rotate(702deg) translateX(200px) rotate(-702deg); } }
      `}</style>

      <style jsx>{`
        .lp {
          min-height: 100vh;
          background: #08080F;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(8,8,15,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 16px 40px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp-logo { display: flex; align-items: center; gap: 10px; }
        .lp-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #14B8A6, #A855F7);
          display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .lp-logo-text { font-size: 22px; font-weight: 700; color: #fff; }
        .lp-accent {
          background: linear-gradient(135deg, #14B8A6, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-nav-links { display: flex; align-items: center; gap: 28px; }
        .lp-nav-link {
          color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500;
          transition: color 0.2s;
        }
        .lp-nav-link:hover { color: #fff; }
        .lp-nav-cta {
          padding: 10px 22px; background: #fff; color: #08080F;
          border-radius: 10px; font-size: 14px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
        }
        .lp-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,255,255,0.15); }

        /* ── HERO ── */
        .lp-hero {
          min-height: 100vh; display: flex; align-items: center;
          padding: 120px 40px 80px;
        }
        .lp-hero-inner {
          max-width: 1280px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .lp-hero-left { position: relative; z-index: 2; }

        .lp-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; margin-bottom: 24px;
          background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.25);
          border-radius: 24px; font-size: 13px; font-weight: 500; color: #C084FC;
        }
        .lp-badge-dot {
          width: 8px; height: 8px; background: #A855F7; border-radius: 50%;
          animation: lp-pulse-glow 2s infinite;
        }

        .lp-h1 {
          font-size: 52px; font-weight: 800; line-height: 1.15;
          color: #fff; margin: 0 0 20px; letter-spacing: -0.02em;
        }
        .lp-grad {
          background: linear-gradient(135deg, #2DD4BF, #C084FC, #F472B6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-sub {
          font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.55);
          margin: 0 0 32px; max-width: 520px;
        }

        /* CTA Row */
        .lp-cta-row {
          display: flex; gap: 12px; margin-bottom: 24px; max-width: 520px;
        }
        .lp-input-wrap {
          flex: 1; position: relative;
        }
        .lp-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); pointer-events: none;
        }
        .lp-email {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; font-size: 15px; color: #fff; outline: none;
          transition: border-color 0.2s;
        }
        .lp-email::placeholder { color: rgba(255,255,255,0.3); }
        .lp-email:focus { border-color: rgba(168,85,247,0.5); }
        .lp-go-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: #fff; cursor: pointer; white-space: nowrap; transition: all 0.25s;
        }
        .lp-go-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(20,184,166,0.4); }
        .lp-go-btn:disabled { opacity: 0.6; cursor: wait; }

        .lp-logged-in {
          font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 24px;
        }
        .lp-logged-in a { color: #14B8A6; text-decoration: none; font-weight: 600; }
        .lp-logged-in a:hover { text-decoration: underline; }
        .lp-divider-dot { color: rgba(255,255,255,0.2); margin: 0 4px; }
        .lp-signout {
          background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer;
          font-size: 13px; transition: color 0.2s;
        }
        .lp-signout:hover { color: #EC4899; }

        /* Stats */
        .lp-stats { display: flex; align-items: center; gap: 24px; margin-top: 8px; }
        .lp-stat { display: flex; flex-direction: column; gap: 2px; }
        .lp-stat-val { font-size: 22px; font-weight: 700; color: #fff; }
        .lp-stat-label { font-size: 12px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; }
        .lp-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }

        /* ── CUBE ── */
        .lp-hero-right { display: flex; justify-content: center; align-items: center; position: relative; z-index: 1; }
        .lp-cube-stage {
          width: 420px; height: 420px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-glow {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .lp-glow-1 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
          animation: lp-pulse-glow 4s ease-in-out infinite;
        }
        .lp-glow-2 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(20,184,166,0.2), transparent 70%);
          animation: lp-pulse-glow2 5s ease-in-out infinite;
        }
        .lp-particles {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-particles > div {
          position: absolute; width: 3px; height: 3px; border-radius: 50%;
          background: rgba(168,85,247,0.6);
        }
        .lp-particle-0  { animation: lp-orbit-0  12s linear infinite; }
        .lp-particle-1  { animation: lp-orbit-1  14s linear infinite; background: rgba(20,184,166,0.5); }
        .lp-particle-2  { animation: lp-orbit-2  11s linear infinite; }
        .lp-particle-3  { animation: lp-orbit-3  16s linear infinite; background: rgba(20,184,166,0.5); }
        .lp-particle-4  { animation: lp-orbit-4  13s linear infinite; }
        .lp-particle-5  { animation: lp-orbit-5  15s linear infinite; background: rgba(244,114,182,0.5); }
        .lp-particle-6  { animation: lp-orbit-6  10s linear infinite; }
        .lp-particle-7  { animation: lp-orbit-7  17s linear infinite; background: rgba(20,184,166,0.5); }
        .lp-particle-8  { animation: lp-orbit-8  12s linear infinite; }
        .lp-particle-9  { animation: lp-orbit-9  14s linear infinite; background: rgba(244,114,182,0.5); }
        .lp-particle-10 { animation: lp-orbit-10 11s linear infinite; }
        .lp-particle-11 { animation: lp-orbit-11 16s linear infinite; background: rgba(20,184,166,0.5); }
        .lp-particle-12 { animation: lp-orbit-12 13s linear infinite; }
        .lp-particle-13 { animation: lp-orbit-13 15s linear infinite; background: rgba(244,114,182,0.5); }
        .lp-particle-14 { animation: lp-orbit-14 10s linear infinite; }
        .lp-particle-15 { animation: lp-orbit-15 17s linear infinite; background: rgba(20,184,166,0.5); }
        .lp-particle-16 { animation: lp-orbit-16 12s linear infinite; }
        .lp-particle-17 { animation: lp-orbit-17 14s linear infinite; background: rgba(244,114,182,0.5); }
        .lp-particle-18 { animation: lp-orbit-18 11s linear infinite; }
        .lp-particle-19 { animation: lp-orbit-19 16s linear infinite; background: rgba(20,184,166,0.5); }

        .lp-cube-wrap {
          perspective: 800px;
          width: 280px; height: 280px;
          position: relative; z-index: 2;
        }
        .lp-cube {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          animation: lp-cube-spin 10s linear infinite;
        }
        .lp-face, .lp-wire {
          position: absolute; width: 280px; height: 280px;
        }
        .lp-face {
          background: rgba(168,85,247,0.04);
          border: 1.5px solid rgba(168,85,247,0.18);
          backdrop-filter: blur(2px);
        }
        .lp-wire {
          background: transparent;
          border: 1px solid rgba(20,184,166,0.12);
        }
        .lp-face-front, .lp-wire-front   { transform: translateZ(140px); }
        .lp-face-back,  .lp-wire-back    { transform: translateZ(-140px) rotateY(180deg); }
        .lp-face-left,  .lp-wire-left    { transform: translateX(-140px) rotateY(-90deg); }
        .lp-face-right, .lp-wire-right   { transform: translateX(140px)  rotateY(90deg); }
        .lp-face-top,   .lp-wire-top     { transform: translateY(-140px) rotateX(90deg); }
        .lp-face-bottom,.lp-wire-bottom  { transform: translateY(140px)  rotateX(-90deg); }

        /* ── FEATURES ── */
        .lp-features {
          padding: 80px 40px; border-top: 1px solid rgba(255,255,255,0.04);
        }
        .lp-features-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
        }
        .lp-feat-card {
          padding: 32px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 18px;
          transition: all 0.3s;
        }
        .lp-feat-card:hover {
          border-color: rgba(168,85,247,0.2); transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(168,85,247,0.08);
        }
        .lp-feat-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.15);
          display: flex; align-items: center; justify-content: center;
          color: #C084FC; margin-bottom: 20px;
        }
        .lp-feat-icon-2 {
          background: rgba(20,184,166,0.1); border-color: rgba(20,184,166,0.15); color: #14B8A6;
        }
        .lp-feat-icon-3 {
          background: rgba(244,114,182,0.1); border-color: rgba(244,114,182,0.15); color: #F472B6;
        }
        .lp-feat-card h3 {
          font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 10px;
        }
        .lp-feat-card p {
          font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.4); margin: 0;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .lp-hero-inner { grid-template-columns: 1fr; text-align: center; max-width: 640px; }
          .lp-hero-right { order: -1; }
          .lp-cube-stage { width: 320px; height: 320px; }
          .lp-cube-wrap { width: 200px; height: 200px; }
          .lp-face, .lp-wire { width: 200px; height: 200px; }
          .lp-face-front, .lp-wire-front   { transform: translateZ(100px); }
          .lp-face-back,  .lp-wire-back    { transform: translateZ(-100px) rotateY(180deg); }
          .lp-face-left,  .lp-wire-left    { transform: translateX(-100px) rotateY(-90deg); }
          .lp-face-right, .lp-wire-right   { transform: translateX(100px)  rotateY(90deg); }
          .lp-face-top,   .lp-wire-top     { transform: translateY(-100px) rotateX(90deg); }
          .lp-face-bottom,.lp-wire-bottom  { transform: translateY(100px)  rotateX(-90deg); }
          .lp-sub { margin-left: auto; margin-right: auto; }
          .lp-cta-row { justify-content: center; margin-left: auto; margin-right: auto; }
          .lp-stats { justify-content: center; }
          .lp-features-inner { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .lp-h1 { font-size: 38px; }
        }
        @media (max-width: 640px) {
          .lp-nav-inner { padding: 14px 20px; }
          .lp-nav-links { gap: 16px; }
          .lp-hero { padding: 100px 20px 60px; }
          .lp-h1 { font-size: 30px; }
          .lp-cta-row { flex-direction: column; }
          .lp-features { padding: 60px 20px; }
        }
      `}</style>
    </div>
  );
}
