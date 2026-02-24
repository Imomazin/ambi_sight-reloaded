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

  const handleSignOut = () => {
    logout();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/signin?email=${encodeURIComponent(email)}&mode=register`);
    }, 500);
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="logo-text">Lumina <span className="logo-accent">S</span></span>
          </div>
          <div className="nav-links">
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/tools" className="nav-link">Tools</Link>
            <Link href="/diagnosis" className="nav-link">Docs</Link>
            {currentUser ? (
              <Link href="/dashboard" className="nav-link nav-cta">Dashboard</Link>
            ) : (
              <Link href="/signin" className="nav-link nav-cta">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <div className="brand-badge">
              STRATEGY FOR LEADERS
            </div>

            <h1 className="hero-title">
              Build winning strategies with <span className="title-gradient">intelligence</span>
            </h1>

            <p className="hero-description">
              The strategic intelligence platform for modern enterprises. Discover insights, diagnose challenges, design solutions, decide with confidence, and deliver results.
            </p>

            {/* Email signup */}
            <form onSubmit={handleEmailSubmit} className="email-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="email-input"
                  required
                />
              </div>
              <button type="submit" className="start-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                ) : (
                  <>
                    Get Started
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="trust-line">Free to start. No credit card required.</p>

            {currentUser && (
              <div className="logged-in-notice">
                <p>Signed in as <strong>{currentUser.name}</strong> &mdash;{' '}
                  <Link href="/dashboard" className="go-dashboard-link">Go to Dashboard</Link>
                  <span className="divider-pipe"> | </span>
                  <button onClick={handleSignOut} className="signout-link">Sign out</button>
                </p>
              </div>
            )}
          </div>

          {/* Right: 3D Rotating Cube */}
          <div className="hero-right">
            <div className="cube-scene">
              <div className="cube">
                <div className="cube-face front" />
                <div className="cube-face back" />
                <div className="cube-face right" />
                <div className="cube-face left" />
                <div className="cube-face top" />
                <div className="cube-face bottom" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #08090d;
          position: relative;
          overflow: hidden;
        }

        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(8, 9, 13, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-size: 19px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        .logo-accent {
          color: #a855f7;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #f1f5f9;
        }

        .nav-cta {
          padding: 8px 18px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 8px;
          color: #c4b5fd;
        }

        .nav-cta:hover {
          background: rgba(168, 85, 247, 0.15);
          color: #f1f5f9;
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 48px 60px;
        }

        .hero-content {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .hero-left {
          position: relative;
          z-index: 10;
        }

        .brand-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(168, 85, 247, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.15);
          border-radius: 24px;
          font-size: 11px;
          font-weight: 600;
          color: #c4b5fd;
          margin-bottom: 28px;
          letter-spacing: 0.1em;
        }

        .hero-title {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #f1f5f9;
          letter-spacing: -0.03em;
        }

        .title-gradient {
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 17px;
          line-height: 1.7;
          color: #64748b;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .email-form {
          display: flex;
          gap: 8px;
          max-width: 460px;
          margin-bottom: 14px;
        }

        .input-wrapper {
          flex: 1;
        }

        .email-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          font-size: 14px;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .email-input::placeholder {
          color: #475569;
        }

        .email-input:focus {
          border-color: rgba(168, 85, 247, 0.4);
        }

        .start-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 14px 24px;
          background: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .start-btn:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .start-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .trust-line {
          font-size: 13px;
          color: #475569;
          margin-bottom: 16px;
        }

        .logged-in-notice {
          margin-top: 4px;
        }

        .logged-in-notice p {
          font-size: 13px;
          color: #94a3b8;
        }

        .logged-in-notice strong {
          color: #c4b5fd;
        }

        .go-dashboard-link {
          color: #a855f7;
          text-decoration: none;
          font-weight: 500;
        }

        .go-dashboard-link:hover {
          text-decoration: underline;
        }

        .divider-pipe {
          color: #334155;
        }

        .signout-link {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }

        .signout-link:hover {
          color: #ef4444;
        }

        /* 3D Cube */
        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .cube-scene {
          width: 320px;
          height: 320px;
          perspective: 800px;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 12s linear infinite;
        }

        @keyframes rotateCube {
          0% {
            transform: rotateX(-20deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(-20deg) rotateY(360deg);
          }
        }

        .cube-face {
          position: absolute;
          width: 240px;
          height: 240px;
          left: 50%;
          top: 50%;
          margin-left: -120px;
          margin-top: -120px;
          border: 1.5px solid rgba(168, 85, 247, 0.35);
          background: rgba(168, 85, 247, 0.03);
          backdrop-filter: blur(2px);
        }

        .cube-face.front  { transform: translateZ(120px); }
        .cube-face.back   { transform: rotateY(180deg) translateZ(120px); }
        .cube-face.right  { transform: rotateY(90deg) translateZ(120px); }
        .cube-face.left   { transform: rotateY(-90deg) translateZ(120px); }
        .cube-face.top    { transform: rotateX(90deg) translateZ(120px); }
        .cube-face.bottom { transform: rotateX(-90deg) translateZ(120px); }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            max-width: 600px;
          }

          .hero-right {
            order: 2;
          }

          .hero-description {
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
          }

          .email-form {
            margin-left: auto;
            margin-right: auto;
          }

          .trust-line {
            text-align: center;
          }

          .logged-in-notice {
            text-align: center;
          }

          .cube-scene {
            width: 260px;
            height: 260px;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 80px 20px 40px;
          }

          .hero-title {
            font-size: 36px;
          }

          .email-form {
            flex-direction: column;
          }

          .cube-scene {
            width: 220px;
            height: 220px;
          }

          .nav-links {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
