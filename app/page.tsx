'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

// Animated metric slider component
function MetricSlider({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
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
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
        <span className="metric-value" style={{ color }}>{displayValue}%</span>
      </div>
      <div className="metric-track">
        <div
          className="metric-fill"
          style={{
            width: `${displayValue}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

// Floating orb animation
function FloatingOrbs() {
  return (
    <div className="orbs-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, logout } = useAppState();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle sign out
  const handleSignOut = () => {
    logout();
  };

  // Handle OAuth login directly from landing page
  const handleOAuth = (provider: 'google' | 'microsoft' | 'github') => {
    setIsSubmitting(true);
    const providerNames = { google: 'Google User', microsoft: 'Microsoft User', github: 'GitHub User' };
    const providerEmails = { google: 'gmail.com', microsoft: 'outlook.com', github: 'github.com' };
    const providerAvatars = { google: 'G', microsoft: 'M', github: 'H' };

    setTimeout(() => {
      setCurrentUser({
        id: `${provider}-${Date.now()}`,
        name: providerNames[provider],
        email: `user@${providerEmails[provider]}`,
        role: 'User',
        plan: 'Free',
        level: 1,
        avatar: providerAvatars[provider],
        lastActive: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        authProvider: provider,
      });
      router.push('/dashboard');
    }, 1000);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/signin?email=${encodeURIComponent(email)}`);
    }, 500);
  };

  const metrics = [
    { label: 'Strategic Clarity', value: 87, color: '#14B8A6', icon: '🎯' },
    { label: 'Execution Readiness', value: 72, color: '#A855F7', icon: '⚡' },
    { label: 'Risk Awareness', value: 65, color: '#F59E0B', icon: '🛡️' },
    { label: 'Growth Potential', value: 91, color: '#22C55E', icon: '📈' },
  ];

  return (
    <div className="landing-page">
      <FloatingOrbs />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-mark">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="logo-text">Lumina <span className="logo-accent">S</span></span>
          </div>
          <div className="nav-links">
            <Link href="/pricing" className="nav-link">Pricing</Link>
            {currentUser ? (
              <Link href="/dashboard" className="nav-link signin-link">Go to Dashboard</Link>
            ) : (
              <Link href="/signin" className="nav-link signin-link">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          {/* Left: Branding & CTA */}
          <div className="hero-left">
            <div className="brand-badge">
              <span className="badge-dot" />
              Strategic Intelligence Platform
            </div>

            <h1 className="hero-title">
              <span className="title-line">Transform Your</span>
              <span className="title-gradient">Strategy</span>
              <span className="title-line">Into Results</span>
            </h1>

            <p className="hero-description">
              Lumina S guides you through a proven 5-step workflow to discover insights,
              diagnose challenges, design solutions, decide on priorities, and deliver outcomes.
            </p>

            {/* Auth Section - Only show if not logged in */}
            {!currentUser && (
              <div className="auth-section">
                <div className="auth-header">
                  <h3 className="auth-title">Get Started for Free</h3>
                  <p className="auth-subtitle">Sign in or register to access your strategic workspace</p>
                </div>

                {/* OAuth Buttons */}
                <div className="oauth-buttons">
                  <button onClick={() => handleOAuth('google')} className="oauth-btn google">
                    <svg className="oauth-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button onClick={() => handleOAuth('microsoft')} className="oauth-btn microsoft">
                    <svg className="oauth-icon" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                    <span>Continue with Microsoft</span>
                  </button>

                  <button onClick={() => handleOAuth('github')} className="oauth-btn github">
                    <svg className="oauth-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                  <span>or register with email</span>
                </div>

                {/* Email Form */}
                <form onSubmit={handleMagicLink} className="email-form">
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="email-input"
                      required
                    />
                  </div>
                  <button type="submit" className="start-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="btn-loading">
                        <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </svg>
                      </span>
                    ) : (
                      <>
                        Register Free
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <p className="auth-hint">
                  Already have an account? <Link href="/signin" className="auth-link">Sign In</Link>
                </p>
              </div>
            )}

            {/* Show dashboard link if logged in */}
            {currentUser && (
              <div className="logged-in-section">
                <div className="welcome-card">
                  <div className="welcome-avatar">{currentUser.avatar}</div>
                  <div className="welcome-info">
                    <p className="welcome-name">Welcome back, {currentUser.name}!</p>
                    <p className="welcome-plan">{currentUser.plan} Plan</p>
                  </div>
                </div>
                <div className="logged-in-actions">
                  <Link href="/dashboard" className="dashboard-btn">
                    Go to Dashboard
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button onClick={handleSignOut} className="signout-btn">
                    Not you? Sign out
                  </button>
                </div>
              </div>
            )}

            {/* Social Proof */}
            <div className="social-proof">
              <div className="trust-badges">
                <div className="trust-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Enterprise Security</span>
                </div>
                <div className="trust-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Free to Start</span>
                </div>
                <div className="trust-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Setup in 2 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Dashboard Preview */}
          <div className="hero-right">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="preview-title">Strategy Dashboard</span>
              </div>

              <div className="preview-content">
                {/* Metrics Sliders */}
                <div className="metrics-section">
                  {metrics.map((metric) => (
                    <MetricSlider
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      color={metric.color}
                      icon={metric.icon}
                    />
                  ))}
                </div>

                {/* Mini Workflow */}
                <div className="workflow-preview">
                  <div className="workflow-step active">
                    <span className="step-icon">🔍</span>
                    <span className="step-label">Discover</span>
                  </div>
                  <div className="workflow-connector" />
                  <div className="workflow-step">
                    <span className="step-icon">🩺</span>
                    <span className="step-label">Diagnose</span>
                  </div>
                  <div className="workflow-connector" />
                  <div className="workflow-step">
                    <span className="step-icon">📐</span>
                    <span className="step-label">Design</span>
                  </div>
                  <div className="workflow-connector" />
                  <div className="workflow-step">
                    <span className="step-icon">⚖️</span>
                    <span className="step-label">Decide</span>
                  </div>
                  <div className="workflow-connector" />
                  <div className="workflow-step">
                    <span className="step-icon">🚀</span>
                    <span className="step-label">Deliver</span>
                  </div>
                </div>

                {/* CTA in Preview */}
                <div className="preview-cta">
                  <span className="cta-text">Ready to build your strategy?</span>
                  {currentUser ? (
                    <Link href="/dashboard" className="preview-btn">
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link href="/signin" className="preview-btn">
                      Sign In to Start
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="features-content">
          <div className="feature-item">
            <span className="feature-icon">🧰</span>
            <span className="feature-text">50+ Strategy Tools</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span className="feature-text">Intelligent Insights</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Visual Frameworks</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👥</span>
            <span className="feature-text">Team Collaboration</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Strategy?</h2>
          <div className="cta-buttons">
            {currentUser ? (
              <Link href="/dashboard" className="cta-primary">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/signin" className="cta-primary">
                Get Started Free
              </Link>
            )}
            <Link href="/pricing" className="cta-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
        }

        .landing-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(20, 184, 166, 0.2), transparent),
            radial-gradient(ellipse 50% 30% at 10% 80%, rgba(168, 85, 247, 0.15), transparent);
          pointer-events: none;
        }

        .landing-page::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .orbs-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          animation: float 25s infinite ease-in-out;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%);
          top: -200px;
          right: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.35), transparent 70%);
          bottom: -100px;
          left: -100px;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%);
          top: 40%;
          left: 20%;
          animation-delay: -12s;
        }

        .orb-4 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%);
          bottom: 20%;
          right: 10%;
          animation-delay: -18s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -40px) scale(1.1); }
          50% { transform: translate(-30px, 30px) scale(0.95); }
          75% { transform: translate(-40px, -30px) scale(1.05); }
        }

        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(11, 11, 15, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-mark {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #14B8A6, #A855F7, #EC4899);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .logo-accent {
          background: linear-gradient(135deg, #14B8A6, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: white;
        }

        .signin-link {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
        }

        .signin-link:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 24px 60px;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
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
          padding: 8px 16px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          color: #C084FC;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #A855F7;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .title-line {
          display: block;
          color: white;
        }

        .title-gradient {
          display: block;
          background: linear-gradient(135deg, #14B8A6, #A855F7, #EC4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 72px;
        }

        .hero-description {
          font-size: 18px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
          max-width: 500px;
        }

        .auth-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          max-width: 420px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .auth-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
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
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .oauth-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .oauth-btn.google:hover {
          border-color: #4285F4;
        }

        .oauth-btn.microsoft:hover {
          border-color: #00A4EF;
        }

        .oauth-btn.github:hover {
          border-color: #fff;
        }

        .oauth-icon {
          width: 20px;
          height: 20px;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
        }

        .auth-divider span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .email-form {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .auth-hint {
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .auth-link {
          color: #14B8A6;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .logged-in-section {
          margin-bottom: 32px;
        }

        .welcome-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .welcome-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #14B8A6, #A855F7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: white;
        }

        .welcome-info {
          flex: 1;
        }

        .welcome-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 2px;
        }

        .welcome-plan {
          font-size: 13px;
          color: #14B8A6;
        }

        .logged-in-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboard-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 28px;
          background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dashboard-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.4);
        }

        .signout-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          cursor: pointer;
          padding: 8px;
          transition: color 0.2s ease;
        }

        .signout-btn:hover {
          color: #EC4899;
        }

        .signup-section {
          margin-bottom: 32px;
        }

        .magic-link-form {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
        }

        .email-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          font-size: 16px;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }

        .email-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .email-input:focus {
          border-color: #A855F7;
          background: rgba(255, 255, 255, 0.1);
        }

        .start-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px;
          background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .start-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.4);
        }

        .start-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .btn-loading .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .signup-hint {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .social-proof {
          margin-top: 8px;
        }

        .trust-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .trust-badge svg {
          color: #14B8A6;
        }

        .hero-right {
          position: relative;
          z-index: 10;
        }

        .dashboard-preview {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preview-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.red { background: #EF4444; }
        .dot.yellow { background: #F59E0B; }
        .dot.green { background: #22C55E; }

        .preview-title {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .preview-content {
          padding: 24px;
        }

        .metrics-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-slider {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .metric-icon {
          font-size: 18px;
        }

        .metric-label {
          flex: 1;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        .metric-value {
          font-size: 15px;
          font-weight: 700;
        }

        .metric-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.1s ease-out;
        }

        .workflow-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .workflow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }

        .workflow-step.active {
          opacity: 1;
        }

        .step-icon {
          font-size: 20px;
        }

        .step-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
        }

        .workflow-connector {
          width: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
        }

        .preview-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(20, 184, 166, 0.2));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
        }

        .cta-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .preview-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, #A855F7, #EC4899);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .preview-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .features-strip {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px 0;
        }

        .features-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-icon {
          font-size: 24px;
        }

        .feature-text {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .bottom-cta {
          padding: 80px 24px;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .cta-primary {
          padding: 16px 32px;
          background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.4);
        }

        .cta-secondary {
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-left {
            order: 1;
          }

          .hero-right {
            order: 2;
          }

          .hero-title {
            font-size: 42px;
          }

          .title-gradient {
            font-size: 52px;
          }

          .hero-description {
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
          }

          .magic-link-form {
            flex-direction: column;
          }

          .social-proof {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 32px;
          }

          .title-gradient {
            font-size: 40px;
          }

          .features-content {
            flex-direction: column;
            align-items: center;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-content h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
