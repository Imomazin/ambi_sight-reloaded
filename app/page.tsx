'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

function MetricSlider({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="metric-slider">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <span className="metric-value" style={{ color }}>{displayValue}%</span>
      </div>
      <div className="metric-track">
        <div
          className="metric-fill"
          style={{
            width: `${displayValue}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { currentUser, logout } = useAppState();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleSignOut = () => {
    logout();
  };

  const handleOAuth = (provider: 'google' | 'microsoft') => {
    router.push(`/signin?provider=${provider}&mode=${authMode}`);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/signin?email=${encodeURIComponent(email)}&mode=${authMode}`);
    }, 500);
  };

  const metrics = [
    { label: 'Strategic Clarity', value: 87, color: '#10b981' },
    { label: 'Execution Readiness', value: 72, color: '#8b5cf6' },
    { label: 'Risk Awareness', value: 65, color: '#f59e0b' },
    { label: 'Growth Potential', value: 91, color: '#06b6d4' },
  ];

  return (
    <div className="landing-page">
      {/* Subtle ambient glow */}
      <div className="ambient-glow" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="logo-text">Lumina <span className="logo-accent">S</span></span>
          </div>
          <div className="nav-links">
            <Link href="/pricing" className="nav-link">Pricing</Link>
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
              <span className="badge-dot" />
              Strategic Intelligence Platform
            </div>

            <h1 className="hero-title">
              Transform Your <span className="title-gradient">Strategy</span> Into Results
            </h1>

            <p className="hero-description">
              A proven 5-step workflow to discover insights, diagnose challenges, design solutions, decide on priorities, and deliver outcomes.
            </p>

            {/* Auth Card */}
            <div className="auth-section">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => setAuthMode('login')}
                >
                  Log In
                </button>
                <button
                  className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => setAuthMode('register')}
                >
                  Register
                </button>
              </div>

              <div className="auth-content">
                <p className="auth-subtitle">
                  {authMode === 'login'
                    ? 'Welcome back'
                    : 'Create your free account'}
                </p>

                <div className="oauth-buttons">
                  <button onClick={() => handleOAuth('google')} className="oauth-btn" disabled={isSubmitting}>
                    <svg className="oauth-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>{authMode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
                  </button>

                  <button onClick={() => handleOAuth('microsoft')} className="oauth-btn" disabled={isSubmitting}>
                    <svg className="oauth-icon" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                    <span>{authMode === 'login' ? 'Continue with Microsoft' : 'Sign up with Microsoft'}</span>
                  </button>
                </div>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <form onSubmit={handleEmailSubmit} className="email-form">
                  <div className="input-wrapper">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
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
                        {authMode === 'login' ? 'Sign In' : 'Get Started'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {currentUser && (
                  <div className="logged-in-notice">
                    <p>Signed in as <strong>{currentUser.name}</strong></p>
                    <div className="logged-in-actions-inline">
                      <Link href="/dashboard" className="go-dashboard-link">Go to Dashboard</Link>
                      <span className="divider-dot">&middot;</span>
                      <button onClick={handleSignOut} className="signout-link">Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Enterprise Security
              </div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Free to Start
              </div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                2 min Setup
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="hero-right">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span className="dot" style={{ background: '#ef4444' }} />
                  <span className="dot" style={{ background: '#f59e0b' }} />
                  <span className="dot" style={{ background: '#22c55e' }} />
                </div>
                <span className="preview-title">Strategy Dashboard</span>
              </div>

              <div className="preview-content">
                <div className="metrics-section">
                  {metrics.map((metric) => (
                    <MetricSlider
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      color={metric.color}
                    />
                  ))}
                </div>

                <div className="workflow-preview">
                  {['Discover', 'Diagnose', 'Design', 'Decide', 'Deliver'].map((step, i) => (
                    <div key={step} className="workflow-step-wrapper">
                      <div className={`workflow-step ${i === 0 ? 'active' : ''}`}>
                        <span className="step-label">{step}</span>
                      </div>
                      {i < 4 && <div className="workflow-connector" />}
                    </div>
                  ))}
                </div>

                <div className="preview-cta">
                  <span className="cta-text">Ready to build your strategy?</span>
                  {currentUser ? (
                    <Link href="/dashboard" className="preview-btn">Open Dashboard</Link>
                  ) : (
                    <Link href="/signin" className="preview-btn">Get Started</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="features-strip">
        <div className="features-content">
          {[
            { text: '50+ Strategy Tools', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
            { text: 'AI-Powered Insights', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { text: 'Visual Frameworks', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
            { text: 'Team Collaboration', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          ].map((feature) => (
            <div key={feature.text} className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="feature-icon-svg">
                <path d={feature.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="feature-text">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="cta-content">
          <h2>Start building better strategy today</h2>
          <p className="cta-desc">Join teams that use Lumina S to drive strategic decisions with confidence.</p>
          <div className="cta-buttons">
            {currentUser ? (
              <Link href="/dashboard" className="cta-primary">Go to Dashboard</Link>
            ) : (
              <Link href="/signin" className="cta-primary">Get Started Free</Link>
            )}
            <Link href="/pricing" className="cta-secondary">View Pricing</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #08090d;
          position: relative;
          overflow: hidden;
        }

        .ambient-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 20% -20%, rgba(16, 185, 129, 0.08), transparent),
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139, 92, 246, 0.06), transparent),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(6, 182, 212, 0.05), transparent);
        }

        /* Grid pattern */
        .landing-page::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent);
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
          padding: 12px 24px;
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
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        .logo-accent {
          color: #10b981;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
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
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          color: #f1f5f9;
        }

        .nav-cta:hover {
          background: rgba(255, 255, 255, 0.1);
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
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: center;
        }

        .hero-left {
          position: relative;
          z-index: 10;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.12);
          border-radius: 24px;
          font-size: 12px;
          font-weight: 500;
          color: #10b981;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
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
          background: linear-gradient(135deg, #34d399, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 16px;
          line-height: 1.7;
          color: #64748b;
          margin-bottom: 32px;
          max-width: 480px;
        }

        .auth-section {
          background: rgba(15, 17, 24, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          margin-bottom: 24px;
          max-width: 440px;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .auth-tab {
          flex: 1;
          padding: 14px 20px;
          background: transparent;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .auth-tab:hover {
          color: #94a3b8;
        }

        .auth-tab.active {
          color: #f1f5f9;
        }

        .auth-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 2px;
          background: #10b981;
          border-radius: 1px;
        }

        .auth-content {
          padding: 24px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          margin-bottom: 20px;
        }

        .oauth-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: #cbd5e1;
        }

        .oauth-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .oauth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .oauth-icon {
          width: 18px;
          height: 18px;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .auth-divider span {
          font-size: 12px;
          color: #475569;
        }

        .email-form {
          display: flex;
          gap: 8px;
        }

        .input-wrapper {
          flex: 1;
        }

        .email-input {
          width: 100%;
          padding: 12px 16px;
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
          border-color: rgba(16, 185, 129, 0.4);
        }

        .start-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          background: #10b981;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .start-btn:hover:not(:disabled) {
          background: #059669;
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

        .logged-in-notice {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 10px;
          text-align: center;
        }

        .logged-in-notice p {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .logged-in-notice strong {
          color: #10b981;
        }

        .logged-in-actions-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .go-dashboard-link {
          color: #10b981;
          text-decoration: none;
          font-weight: 500;
          font-size: 13px;
        }

        .go-dashboard-link:hover {
          text-decoration: underline;
        }

        .divider-dot {
          color: #334155;
        }

        .signout-link {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
        }

        .signout-link:hover {
          color: #ef4444;
        }

        .trust-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: #64748b;
        }

        .trust-badge svg {
          color: #475569;
        }

        .hero-right {
          position: relative;
          z-index: 10;
        }

        .dashboard-preview {
          background: rgba(15, 17, 24, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(16px);
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .preview-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          opacity: 0.7;
        }

        .preview-title {
          font-size: 12px;
          color: #475569;
          font-weight: 500;
        }

        .preview-content {
          padding: 20px;
        }

        .metrics-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .metric-slider {
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .metric-label {
          flex: 1;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .metric-value {
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .metric-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.1s ease-out;
        }

        .workflow-preview {
          display: flex;
          align-items: center;
          padding: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          margin-bottom: 16px;
          gap: 0;
        }

        .workflow-step-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .workflow-step {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.35;
        }

        .workflow-step.active {
          opacity: 1;
        }

        .step-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
        }

        .workflow-step.active .step-label {
          color: #10b981;
        }

        .workflow-connector {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 0 4px;
        }

        .preview-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: rgba(16, 185, 129, 0.04);
          border: 1px solid rgba(16, 185, 129, 0.08);
          border-radius: 10px;
        }

        .cta-text {
          font-size: 13px;
          color: #94a3b8;
        }

        .preview-btn {
          padding: 8px 14px;
          background: #10b981;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .preview-btn:hover {
          background: #059669;
        }

        .features-strip {
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding: 48px 0;
          position: relative;
          z-index: 1;
        }

        .features-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          transition: border-color 0.15s ease;
        }

        .feature-item:hover {
          border-color: rgba(255, 255, 255, 0.08);
        }

        .feature-icon-svg {
          color: #475569;
          flex-shrink: 0;
        }

        .feature-text {
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
        }

        .bottom-cta {
          padding: 80px 48px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .cta-desc {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .cta-primary {
          padding: 14px 32px;
          background: #10b981;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .cta-primary:hover {
          background: #059669;
        }

        .cta-secondary {
          padding: 14px 32px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
        }

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

          .auth-section {
            margin-left: auto;
            margin-right: auto;
          }

          .trust-badges {
            justify-content: center;
          }

          .features-content {
            justify-content: center;
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

          .features-content {
            flex-direction: column;
            padding: 0 20px;
          }

          .feature-item {
            width: 100%;
          }

          .cta-buttons {
            flex-direction: column;
            padding: 0 20px;
          }

          .cta-content h2 {
            font-size: 28px;
          }

          .bottom-cta {
            padding: 48px 20px;
          }
        }
      `}</style>
    </div>
  );
}
