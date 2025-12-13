'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '../state/useAppState';

// Animated 3D Cube Component (Resend-style) with lightning effects
function AnimatedCube() {
  return (
    <div className="cube-container">
      <div className="cube">
        <div className="cube-face front">
          <div className="lightning lightning-1"></div>
          <div className="lightning lightning-2"></div>
        </div>
        <div className="cube-face back">
          <div className="lightning lightning-3"></div>
        </div>
        <div className="cube-face right">
          <div className="lightning lightning-4"></div>
          <div className="lightning lightning-5"></div>
        </div>
        <div className="cube-face left">
          <div className="lightning lightning-6"></div>
        </div>
        <div className="cube-face top">
          <div className="lightning lightning-7"></div>
          <div className="lightning lightning-8"></div>
        </div>
        <div className="cube-face bottom">
          <div className="lightning lightning-9"></div>
        </div>
      </div>
      <div className="cube-glow"></div>
      <style jsx>{`
        .cube-container {
          width: 280px;
          height: 280px;
          perspective: 1000px;
          position: relative;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 20s infinite linear;
        }
        .cube-face {
          position: absolute;
          width: 280px;
          height: 280px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }
        .front  { transform: rotateY(0deg) translateZ(140px); }
        .back   { transform: rotateY(180deg) translateZ(140px); }
        .right  { transform: rotateY(90deg) translateZ(140px); }
        .left   { transform: rotateY(-90deg) translateZ(140px); }
        .top    { transform: rotateX(90deg) translateZ(140px); }
        .bottom { transform: rotateX(-90deg) translateZ(140px); }

        /* Lightning flash effects */
        .lightning {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          opacity: 0;
          pointer-events: none;
        }

        .lightning-1 {
          width: 100%;
          height: 2px;
          top: 30%;
          left: 0;
          animation: flash1 4s infinite 0.5s;
        }

        .lightning-2 {
          width: 2px;
          height: 100%;
          top: 0;
          left: 70%;
          background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          animation: flash2 5s infinite 1.2s;
        }

        .lightning-3 {
          width: 120%;
          height: 3px;
          top: 60%;
          left: -10%;
          transform: rotate(-15deg);
          animation: flash3 6s infinite 2s;
        }

        .lightning-4 {
          width: 2px;
          height: 80%;
          top: 10%;
          left: 40%;
          background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.9), transparent);
          animation: flash4 4.5s infinite 0.8s;
        }

        .lightning-5 {
          width: 100%;
          height: 2px;
          top: 80%;
          left: 0;
          animation: flash5 5.5s infinite 3s;
        }

        .lightning-6 {
          width: 80%;
          height: 2px;
          top: 50%;
          left: 10%;
          transform: rotate(10deg);
          animation: flash6 7s infinite 1.5s;
        }

        .lightning-7 {
          width: 2px;
          height: 100%;
          top: 0;
          left: 25%;
          background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          animation: flash7 4s infinite 2.5s;
        }

        .lightning-8 {
          width: 100%;
          height: 2px;
          top: 45%;
          left: 0;
          animation: flash8 5s infinite 0.3s;
        }

        .lightning-9 {
          width: 60%;
          height: 3px;
          top: 70%;
          left: 20%;
          transform: rotate(-8deg);
          animation: flash9 6s infinite 4s;
        }

        @keyframes flash1 {
          0%, 94%, 100% { opacity: 0; }
          95%, 97% { opacity: 1; }
          96% { opacity: 0.3; }
        }

        @keyframes flash2 {
          0%, 88%, 100% { opacity: 0; }
          89%, 91%, 93% { opacity: 0.9; }
          90%, 92% { opacity: 0.2; }
        }

        @keyframes flash3 {
          0%, 82%, 100% { opacity: 0; }
          83%, 85% { opacity: 0.8; }
          84% { opacity: 0.4; }
        }

        @keyframes flash4 {
          0%, 90%, 100% { opacity: 0; }
          91%, 93% { opacity: 1; }
          92% { opacity: 0.3; }
        }

        @keyframes flash5 {
          0%, 85%, 100% { opacity: 0; }
          86%, 88% { opacity: 0.7; }
          87% { opacity: 0.2; }
        }

        @keyframes flash6 {
          0%, 92%, 100% { opacity: 0; }
          93%, 95% { opacity: 0.8; }
          94% { opacity: 0.4; }
        }

        @keyframes flash7 {
          0%, 88%, 100% { opacity: 0; }
          89%, 91% { opacity: 0.9; }
          90% { opacity: 0.3; }
        }

        @keyframes flash8 {
          0%, 96%, 100% { opacity: 0; }
          97%, 99% { opacity: 1; }
          98% { opacity: 0.5; }
        }

        @keyframes flash9 {
          0%, 84%, 100% { opacity: 0; }
          85%, 87% { opacity: 0.6; }
          86% { opacity: 0.2; }
        }

        /* Ambient glow effect that pulses with lightning */
        .cube-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 320px;
          height: 320px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
          animation: glowPulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes rotateCube {
          0% { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}

// Typing animation for headline
function TypedText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className="typed-text">
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { currentUser } = useAppState();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = () => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/signin?email=${encodeURIComponent(email)}`);
    }, 300);
  };

  const features = [
    {
      title: 'Strategic Frameworks',
      description: 'Access 50+ proven strategy tools including SWOT, Porter\'s Five Forces, Blue Ocean, and more.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and analysis powered by advanced AI models.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time. Share insights, assign tasks, track progress.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Portfolio Analytics',
      description: 'Visualize your entire strategic portfolio with heatmaps, risk matrices, and KPI dashboards.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      ),
    },
    {
      title: 'Scenario Planning',
      description: 'Model different futures. Test assumptions. Make decisions with confidence.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      title: 'Executive Reports',
      description: 'Generate board-ready reports instantly. Export to PDF, PowerPoint, or share live.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      quote: "Lumina S transformed how we approach strategic planning. The AI insights are genuinely useful.",
      author: "Sarah Chen",
      role: "Chief Strategy Officer",
      company: "TechVentures Inc"
    },
    {
      quote: "Finally, a strategy tool that developers and executives can both love. Clean API, beautiful UI.",
      author: "Marcus Johnson",
      role: "VP of Product",
      company: "ScaleUp Labs"
    },
    {
      quote: "The 5D workflow is brilliant. It brings structure without being restrictive.",
      author: "Elena Rodriguez",
      role: "Managing Director",
      company: "Global Consulting Group"
    }
  ];

  const companies = ['Acme Corp', 'TechGiant', 'Innovate Inc', 'FutureLabs', 'ScaleUp', 'Enterprise Co'];

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="logo-text">Lumina S</span>
          </Link>

          <div className="nav-links">
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/tools" className="nav-link">Tools</Link>
            <Link href="/docs" className="nav-link">Docs</Link>
            {currentUser ? (
              <Link href="/dashboard" className="nav-cta">Dashboard</Link>
            ) : (
              <Link href="/signin" className="nav-cta">Sign in</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">Strategy for leaders</p>
            <h1 className="hero-title">
              Build winning strategies<br />
              with <span className="highlight">intelligence</span>
            </h1>
            <p className="hero-description">
              The strategic intelligence platform for modern enterprises.
              Discover insights, diagnose challenges, design solutions,
              decide with confidence, and deliver results.
            </p>

            <form onSubmit={handleEmailSubmit} className="hero-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="hero-input"
              />
              <button type="submit" className="hero-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Starting...' : 'Get Started'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className="hero-note">Free to start. No credit card required.</p>
          </div>

          <div className="hero-visual">
            <AnimatedCube />
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="trusted">
        <p className="trusted-label">Trusted by forward-thinking teams</p>
        <div className="trusted-logos">
          {companies.map((company) => (
            <span key={company} className="trusted-logo">{company}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features" id="features">
        <div className="features-header">
          <p className="section-eyebrow">Capabilities</p>
          <h2 className="section-title">Everything you need to win</h2>
          <p className="section-description">
            A complete toolkit for strategic excellence. From discovery to delivery.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code/Product Preview Section */}
      <section className="preview">
        <div className="preview-content">
          <div className="preview-text">
            <p className="section-eyebrow">The 5D Workflow</p>
            <h2 className="section-title">Strategy, systematized</h2>
            <p className="section-description">
              Our proven 5-step methodology guides you from insight to impact.
              No more scattered spreadsheets or endless meetings.
            </p>

            <div className="workflow-steps">
              {[
                { step: 'Discover', desc: 'Uncover market signals and opportunities' },
                { step: 'Diagnose', desc: 'Analyze challenges and root causes' },
                { step: 'Design', desc: 'Craft strategic options and solutions' },
                { step: 'Decide', desc: 'Prioritize with data-driven confidence' },
                { step: 'Deliver', desc: 'Execute and track progress' },
              ].map((item, i) => (
                <div key={i} className="workflow-step">
                  <span className="step-number">{i + 1}</span>
                  <div className="step-content">
                    <span className="step-name">{item.step}</span>
                    <span className="step-desc">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-visual">
            <div className="code-window">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <span className="code-title">strategy.config.ts</span>
              </div>
              <pre className="code-content">
{`import { Lumina } from '@lumina/sdk';

const strategy = new Lumina({
  workspace: 'acme-corp',
  apiKey: process.env.LUMINA_API_KEY,
});

// Create a new strategic initiative
await strategy.initiatives.create({
  name: 'Market Expansion 2024',
  portfolio: 'Growth',
  owner: 'strategy-team',
  frameworks: ['swot', 'porter-five'],
  confidenceTarget: 85,
});

// Get AI-powered insights
const insights = await strategy.ai.analyze({
  scope: 'market-trends',
  timeframe: 'Q1-Q4',
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonials-header">
          <p className="section-eyebrow">Testimonials</p>
          <h2 className="section-title">Loved by strategists</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="author-info">
                  <span className="author-name">{testimonial.author}</span>
                  <span className="author-role">{testimonial.role}, {testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Start building better strategies today</h2>
          <p className="cta-description">
            Join thousands of teams using Lumina S to transform their strategic planning.
          </p>
          <div className="cta-buttons">
            <button onClick={handleGetStarted} className="cta-primary">
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <Link href="/pricing" className="cta-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span className="logo-text">Lumina S</span>
            </div>
            <p className="footer-tagline">Strategic intelligence for modern enterprises.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/tools">Tools</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <Link href="/docs">Documentation</Link>
              <Link href="/docs#api">API Reference</Link>
              <Link href="/docs#changelog">Changelog</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lumina S. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        /* Base */
        .landing {
          min-height: 100vh;
          background: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-inner {
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
          gap: 10px;
          text-decoration: none;
          color: #fff;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #fff;
        }

        .nav-cta {
          padding: 8px 16px;
          background: #fff;
          color: #000;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-cta:hover {
          background: #e4e4e7;
        }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 24px 80px;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .hero-eyebrow {
          font-size: 14px;
          font-weight: 500;
          color: #a855f7;
          margin-bottom: 16px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 64px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .highlight {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 18px;
          line-height: 1.7;
          color: #a1a1aa;
          margin-bottom: 40px;
          max-width: 500px;
        }

        .hero-form {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .hero-input {
          flex: 1;
          max-width: 300px;
          padding: 14px 18px;
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }

        .hero-input:focus {
          border-color: #a855f7;
        }

        .hero-input::placeholder {
          color: #52525b;
        }

        .hero-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hero-btn:hover:not(:disabled) {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        .hero-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .hero-note {
          font-size: 13px;
          color: #52525b;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Trusted By */
        .trusted {
          padding: 60px 24px;
          border-top: 1px solid #18181b;
          border-bottom: 1px solid #18181b;
        }

        .trusted-label {
          text-align: center;
          font-size: 13px;
          color: #52525b;
          margin-bottom: 32px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .trusted-logos {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 48px;
        }

        .trusted-logo {
          font-size: 18px;
          font-weight: 600;
          color: #3f3f46;
          letter-spacing: -0.02em;
        }

        /* Features */
        .features {
          padding: 120px 24px;
        }

        .features-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 80px;
        }

        .section-eyebrow {
          font-size: 14px;
          font-weight: 500;
          color: #a855f7;
          margin-bottom: 16px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .section-title {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .section-description {
          font-size: 18px;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 32px;
          background: #0a0a0a;
          border: 1px solid #18181b;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          border-color: #a855f7;
          transform: translateY(-4px);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #a855f7;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .feature-description {
          font-size: 14px;
          color: #71717a;
          line-height: 1.6;
        }

        /* Preview Section */
        .preview {
          padding: 120px 24px;
          background: #0a0a0a;
        }

        .preview-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .workflow-steps {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .workflow-step {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #18181b;
          border-radius: 8px;
          border: 1px solid #27272a;
          transition: all 0.2s;
        }

        .workflow-step:hover {
          border-color: #a855f7;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #a855f7, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-content {
          display: flex;
          flex-direction: column;
        }

        .step-name {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .step-desc {
          font-size: 13px;
          color: #71717a;
        }

        .code-window {
          background: #0a0a0a;
          border: 1px solid #27272a;
          border-radius: 12px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #18181b;
          border-bottom: 1px solid #27272a;
        }

        .code-dots {
          display: flex;
          gap: 6px;
        }

        .code-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3f3f46;
        }

        .code-dots .dot:first-child { background: #ef4444; }
        .code-dots .dot:nth-child(2) { background: #eab308; }
        .code-dots .dot:nth-child(3) { background: #22c55e; }

        .code-title {
          font-size: 12px;
          color: #71717a;
        }

        .code-content {
          padding: 24px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.7;
          color: #a1a1aa;
          overflow-x: auto;
          margin: 0;
        }

        /* Testimonials */
        .testimonials {
          padding: 120px 24px;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .testimonials-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .testimonial-card {
          padding: 32px;
          background: #0a0a0a;
          border: 1px solid #18181b;
          border-radius: 12px;
        }

        .testimonial-quote {
          font-size: 16px;
          line-height: 1.7;
          color: #d4d4d8;
          margin-bottom: 24px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #a855f7, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-size: 14px;
          font-weight: 600;
        }

        .author-role {
          font-size: 12px;
          color: #71717a;
        }

        /* CTA */
        .cta {
          padding: 120px 24px;
          text-align: center;
          background: linear-gradient(180deg, #0a0a0a 0%, #000 100%);
          position: relative;
        }

        .cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(168, 85, 247, 0.15), transparent);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .cta-description {
          font-size: 18px;
          color: #a1a1aa;
          margin-bottom: 40px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .cta-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-primary:hover {
          background: #e4e4e7;
          transform: translateY(-2px);
        }

        .cta-secondary {
          padding: 16px 32px;
          background: transparent;
          color: #fff;
          border: 1px solid #27272a;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cta-secondary:hover {
          border-color: #a855f7;
          color: #a855f7;
        }

        /* Footer */
        .footer {
          padding: 80px 24px 40px;
          border-top: 1px solid #18181b;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .footer-tagline {
          font-size: 14px;
          color: #52525b;
          margin-top: 16px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .footer-col h4 {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-col a {
          display: block;
          font-size: 14px;
          color: #71717a;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: #fff;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 40px;
          border-top: 1px solid #18181b;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 13px;
          color: #52525b;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-title {
            font-size: 48px;
          }

          .hero-description {
            max-width: 100%;
            margin: 0 auto 40px;
          }

          .hero-form {
            justify-content: center;
          }

          .hero-visual {
            order: -1;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .preview-content {
            grid-template-columns: 1fr;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .footer-content {
            grid-template-columns: 1fr;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .nav-links {
            display: none;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-form {
            flex-direction: column;
          }

          .hero-input {
            max-width: 100%;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 32px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .footer-links {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Cursor animation */
        .typed-text .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
