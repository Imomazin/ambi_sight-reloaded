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
      {/* ── Nav ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <svg className="lp-logo-icon" width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#lg)" strokeWidth="2"/>
              <path d="M10 22V10h4v8h4V10h4v12" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#A855F7"/><stop offset="1" stopColor="#EC4899"/></linearGradient></defs>
            </svg>
            <span className="lp-logo-text">Lumina S</span>
          </div>
          <div className="lp-nav-links">
            <Link href="/pricing" className="lp-nav-link">Pricing</Link>
            <Link href="/tools" className="lp-nav-link">Tools</Link>
            <Link href="/strategy/lumina-s" className="lp-nav-link">Docs</Link>
            {currentUser ? (
              <Link href="/dashboard" className="lp-nav-link">Dashboard</Link>
            ) : (
              <Link href="/strategy/lumina-s" className="lp-nav-link">Dashboard</Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          {/* Left */}
          <div className="lp-hero-left">
            <span className="lp-label">STRATEGY FOR LEADERS</span>

            <h1 className="lp-h1">
              Build winning<br />
              strategies with<br />
              <span className="lp-grad">intelligence</span>
            </h1>

            <p className="lp-sub">
              The strategic intelligence platform for modern enterprises.
              Discover insights, diagnose challenges, design solutions,
              decide with confidence, and deliver results.
            </p>

            <form className="lp-cta-row" onSubmit={handleGetStarted}>
              <input
                type="email"
                className="lp-email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="lp-go-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : 'Get Started'}
                {!isSubmitting && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            <p className="lp-hint">Free to start. No credit card required.</p>

            {currentUser && (
              <div className="lp-logged-in">
                Signed in as <strong>{currentUser.name}</strong> —{' '}
                <Link href="/dashboard">Go to Dashboard</Link>
                {' | '}
                <button onClick={logout} className="lp-signout">Sign out</button>
              </div>
            )}
          </div>

          {/* Right — 3D Cube */}
          <div className="lp-hero-right">
            <div className="lp-glow" />
            <div className="lp-cube-wrap">
              <div className="lp-cube">
                <div className="lp-face lp-f-front" />
                <div className="lp-face lp-f-back" />
                <div className="lp-face lp-f-left" />
                <div className="lp-face lp-f-right" />
                <div className="lp-face lp-f-top" />
                <div className="lp-face lp-f-bottom" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Keyframes must be global for styled-jsx ── */}
      <style jsx global>{`
        @keyframes lp-spin {
          0%   { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }
        @keyframes lp-glow-breathe {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.7;  transform: scale(1.08); }
        }
      `}</style>

      <style jsx>{`
        /* ══ Page ══ */
        .lp {
          min-height: 100vh;
          background: #060609;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }

        /* ══ Nav ══ */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(6,6,9,0.8);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .lp-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
          display: flex; justify-content: space-between; align-items: center;
          height: 60px;
        }
        .lp-logo { display: flex; align-items: center; gap: 10px; }
        .lp-logo-text { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .lp-nav-links { display: flex; align-items: center; gap: 32px; }
        .lp-nav-link {
          color: rgba(255,255,255,0.4); text-decoration: none;
          font-size: 14px; font-weight: 500; transition: color 0.2s;
        }
        .lp-nav-link:hover { color: rgba(255,255,255,0.8); }

        /* ══ Hero ══ */
        .lp-hero {
          min-height: 100vh; display: flex; align-items: center;
          padding: 100px 40px 60px;
        }
        .lp-hero-inner {
          max-width: 1200px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .lp-hero-left { z-index: 2; }

        .lp-label {
          display: inline-block;
          font-size: 12px; font-weight: 700; letter-spacing: 2px;
          color: #A855F7; margin-bottom: 28px;
        }

        .lp-h1 {
          font-size: 56px; font-weight: 800; line-height: 1.08;
          color: #fff; margin: 0 0 24px; letter-spacing: -2px;
        }
        .lp-grad {
          background: linear-gradient(90deg, #C084FC, #F472B6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .lp-sub {
          font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.35);
          margin: 0 0 36px; max-width: 480px;
        }

        /* CTA */
        .lp-cta-row {
          display: flex; gap: 0; max-width: 460px; margin-bottom: 16px;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
        }
        .lp-email {
          flex: 1; padding: 16px 20px;
          background: transparent; border: none;
          font-size: 15px; color: #fff; outline: none; font-family: inherit;
        }
        .lp-email::placeholder { color: rgba(255,255,255,0.2); }
        .lp-go-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 16px 28px; background: #fff;
          border: none; font-size: 14px; font-weight: 700;
          color: #08080F; cursor: pointer; white-space: nowrap;
          transition: all 0.2s; font-family: inherit;
        }
        .lp-go-btn:hover:not(:disabled) { background: #E8E8E8; }
        .lp-go-btn:disabled { opacity: 0.5; cursor: wait; }

        .lp-hint {
          font-size: 13px; color: rgba(255,255,255,0.2); margin: 0;
        }

        .lp-logged-in {
          font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 20px;
        }
        .lp-logged-in a { color: #A855F7; text-decoration: none; font-weight: 600; }
        .lp-logged-in a:hover { text-decoration: underline; }
        .lp-signout {
          background: none; border: none; color: rgba(255,255,255,0.3);
          cursor: pointer; font-size: 13px; font-family: inherit;
        }
        .lp-signout:hover { color: #EC4899; }

        /* ══ Cube ══ */
        .lp-hero-right {
          display: flex; justify-content: center; align-items: center;
          position: relative; z-index: 1; min-height: 480px;
        }
        .lp-glow {
          position: absolute;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.04) 50%, transparent 70%);
          filter: blur(40px);
          animation: lp-glow-breathe 6s ease-in-out infinite;
          pointer-events: none;
        }
        .lp-cube-wrap {
          perspective: 900px;
          width: 300px; height: 300px;
          position: relative; z-index: 2;
        }
        .lp-cube {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          animation: lp-spin 12s linear infinite;
        }
        .lp-face {
          position: absolute; width: 300px; height: 300px;
          border: 1.5px solid rgba(168,85,247,0.3);
          background: linear-gradient(
            135deg,
            rgba(168,85,247,0.08) 0%,
            rgba(139,92,246,0.04) 50%,
            rgba(168,85,247,0.02) 100%
          );
          backdrop-filter: blur(1px);
          box-shadow: inset 0 0 60px rgba(168,85,247,0.04);
        }
        .lp-f-front  { transform: translateZ(150px); }
        .lp-f-back   { transform: rotateY(180deg) translateZ(150px); }
        .lp-f-left   { transform: rotateY(-90deg) translateZ(150px); }
        .lp-f-right  { transform: rotateY(90deg)  translateZ(150px); }
        .lp-f-top    { transform: rotateX(90deg)  translateZ(150px); }
        .lp-f-bottom { transform: rotateX(-90deg) translateZ(150px); }

        /* ══ Responsive ══ */
        @media (max-width: 1024px) {
          .lp-hero-inner {
            grid-template-columns: 1fr; text-align: center; max-width: 600px;
          }
          .lp-hero-right { order: -1; min-height: 360px; }
          .lp-cube-wrap { width: 220px; height: 220px; }
          .lp-face { width: 220px; height: 220px; }
          .lp-f-front  { transform: translateZ(110px); }
          .lp-f-back   { transform: rotateY(180deg) translateZ(110px); }
          .lp-f-left   { transform: rotateY(-90deg) translateZ(110px); }
          .lp-f-right  { transform: rotateY(90deg)  translateZ(110px); }
          .lp-f-top    { transform: rotateX(90deg)  translateZ(110px); }
          .lp-f-bottom { transform: rotateX(-90deg) translateZ(110px); }
          .lp-glow { width: 300px; height: 300px; }
          .lp-sub { margin-left: auto; margin-right: auto; }
          .lp-cta-row { margin-left: auto; margin-right: auto; }
          .lp-h1 { font-size: 42px; letter-spacing: -1.5px; }
        }
        @media (max-width: 640px) {
          .lp-nav-inner { padding: 0 20px; }
          .lp-nav-links { gap: 20px; }
          .lp-hero { padding: 90px 20px 40px; }
          .lp-h1 { font-size: 34px; }
          .lp-cta-row { flex-direction: column; border-radius: 12px; }
          .lp-go-btn { justify-content: center; border-radius: 0 0 12px 12px; }
        }
      `}</style>
    </div>
  );
}
