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
  const { currentUser } = useAppState();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

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
            <Link href="/signin" className="nav-link signin-link">Sign In</Link>
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

            {/* Magic Link Sign Up */}
            <div className="signup-section">
              <form onSubmit={handleMagicLink} className="magic-link-form">
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to start"
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
                      Start Free
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
              <p className="signup-hint">No credit card required. Get started in seconds.</p>
            </div>

            {/* Social Proof */}
            <div className="social-proof">
              <div className="user-avatars">
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #14B8A6, #2DD4BF)' }}>J</div>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}>M</div>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>S</div>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>A</div>
              </div>
              <span className="proof-text">Join 2,500+ strategists already using Lumina S</span>
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
                  <Link href="/signin" className="preview-btn">
                    Sign In to Start
                  </Link>
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
            <span className="feature-icon">🤖</span>
            <span className="feature-text">AI-Powered Insights</span>
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
            <Link href="/signin" className="cta-primary">
              Get Started Free
            </Link>
            <Link href="/pricing" className="cta-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0B0B0F 0%, #1a1a2e 50%, #0B0B0F 100%);
          position: relative;
          overflow: hidden;
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
          filter: blur(80px);
          opacity: 0.4;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #A855F7, transparent);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #14B8A6, transparent);
          bottom: -50px;
          left: -50px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, #EC4899, transparent);
          top: 50%;
          left: 30%;
          animation-delay: -10s;
        }

        .orb-4 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #3B82F6, transparent);
          bottom: 30%;
          right: 20%;
          animation-delay: -15s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(-30px, -20px) scale(1.05); }
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
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatars {
          display: flex;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: white;
          border: 2px solid #0B0B0F;
          margin-left: -8px;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .proof-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
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
