'use client';

import Link from 'next/link';

export default function DocsPage() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: [
        {
          heading: 'Welcome to Lumina S',
          text: 'Lumina S is a strategic intelligence platform designed for modern enterprises. Our platform helps you discover insights, diagnose challenges, design solutions, decide with confidence, and deliver results.'
        },
        {
          heading: 'Quick Start',
          text: 'To get started, sign up for a free account and create your first workspace. From there, you can explore our suite of strategic tools and AI-powered insights.'
        },
        {
          heading: 'Core Concepts',
          text: 'Lumina S is built around the 5D Workflow: Discover, Diagnose, Design, Decide, and Deliver. Each phase has dedicated tools and AI assistance to guide you through strategic planning.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      content: [
        {
          heading: 'Strategic Frameworks',
          text: 'Access 50+ proven strategy frameworks including SWOT Analysis, Porter\'s Five Forces, Blue Ocean Strategy, BCG Matrix, and more. Each framework comes with AI-guided prompts and automated analysis.'
        },
        {
          heading: 'AI-Powered Insights',
          text: 'Our AI advisor (powered by advanced language models) helps you analyze market trends, identify opportunities, stress-test assumptions, and generate strategic recommendations.'
        },
        {
          heading: 'Portfolio Analytics',
          text: 'Visualize your entire strategic portfolio with interactive heatmaps, risk matrices, and KPI dashboards. Track initiative health, resource allocation, and progress toward goals.'
        },
        {
          heading: 'Scenario Planning',
          text: 'Model different futures with our scenario planning tools. Create what-if analyses, test assumptions, and make decisions with confidence based on multiple outcome projections.'
        },
        {
          heading: 'Real-time Collaboration',
          text: 'Work together with your team in real-time. Share insights, assign tasks, leave comments, and track progress across all strategic initiatives.'
        },
        {
          heading: 'Executive Reports',
          text: 'Generate board-ready reports instantly. Export to PDF, PowerPoint, or share live dashboards with stakeholders.'
        }
      ]
    },
    {
      id: 'workflow',
      title: 'The 5D Workflow',
      content: [
        {
          heading: '1. Discover',
          text: 'Uncover market signals, competitive intelligence, and emerging opportunities. Use our data connectors and AI scanning to stay ahead of trends.'
        },
        {
          heading: '2. Diagnose',
          text: 'Analyze challenges and identify root causes. Apply strategic frameworks to understand your competitive position and internal capabilities.'
        },
        {
          heading: '3. Design',
          text: 'Craft strategic options and innovative solutions. Use our ideation tools and AI brainstorming to explore possibilities.'
        },
        {
          heading: '4. Decide',
          text: 'Prioritize with data-driven confidence. Score options against criteria, run simulations, and select the best path forward.'
        },
        {
          heading: '5. Deliver',
          text: 'Execute and track progress. Set milestones, assign owners, monitor KPIs, and adjust course as needed.'
        }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      content: [
        {
          heading: 'Authentication',
          text: 'All API requests require authentication via API key. Include your key in the Authorization header: `Authorization: Bearer YOUR_API_KEY`'
        },
        {
          heading: 'Endpoints',
          text: 'Base URL: https://api.luminas.io/v1\n\n• GET /workspaces - List all workspaces\n• POST /initiatives - Create a new initiative\n• GET /initiatives/:id - Get initiative details\n• PUT /initiatives/:id - Update an initiative\n• POST /ai/analyze - Run AI analysis\n• GET /reports - Generate reports'
        },
        {
          heading: 'Rate Limits',
          text: 'Free tier: 100 requests/hour\nPro tier: 1,000 requests/hour\nEnterprise: Unlimited'
        },
        {
          heading: 'SDK Installation',
          text: 'npm install @lumina/sdk\n\nOr with yarn:\nyarn add @lumina/sdk'
        }
      ]
    },
    {
      id: 'ai-advisor',
      title: 'AI Advisor Guide',
      content: [
        {
          heading: 'What is the AI Advisor?',
          text: 'The AI Advisor is your intelligent strategic partner. It can answer questions about your business context, suggest frameworks, stress-test ideas, and provide research-backed recommendations.'
        },
        {
          heading: 'Best Practices',
          text: 'For best results:\n• Provide context about your industry and goals\n• Ask specific, focused questions\n• Use it to challenge assumptions\n• Combine AI insights with human judgment'
        },
        {
          heading: 'Example Prompts',
          text: '• "Analyze the competitive landscape in [industry]"\n• "What are the key risks in our expansion strategy?"\n• "Suggest frameworks for evaluating this acquisition"\n• "Help me stress-test our market assumptions"'
        }
      ]
    },
    {
      id: 'changelog',
      title: 'Changelog',
      content: [
        {
          heading: 'v2.5.0 - December 2024',
          text: '• New: Enhanced AI Advisor with deeper strategic insights\n• New: Dark mode landing page with animated cube\n• Improved: Portfolio analytics performance\n• Fixed: Real-time collaboration sync issues'
        },
        {
          heading: 'v2.4.0 - November 2024',
          text: '• New: Scenario comparison views\n• New: Executive report templates\n• Improved: Framework library expanded to 50+ tools\n• Fixed: Export formatting issues'
        },
        {
          heading: 'v2.3.0 - October 2024',
          text: '• New: API v1 release\n• New: SDK for JavaScript/TypeScript\n• Improved: AI response quality\n• Fixed: Dashboard loading times'
        }
      ]
    }
  ];

  return (
    <div className="docs-page">
      {/* Navigation */}
      <nav className="docs-nav">
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
            <Link href="/docs" className="nav-link active">Docs</Link>
            <Link href="/signin" className="nav-cta">Sign in</Link>
          </div>
        </div>
      </nav>

      <div className="docs-layout">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="sidebar-content">
            <h3>Documentation</h3>
            <ul className="sidebar-nav">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="sidebar-link">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="docs-content">
          <header className="docs-header">
            <h1>Lumina S Documentation</h1>
            <p>Everything you need to master strategic intelligence.</p>
          </header>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="docs-section">
              <h2>{section.title}</h2>
              {section.content.map((item, index) => (
                <div key={index} className="docs-block">
                  <h3>{item.heading}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        .docs-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Navigation */
        .docs-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-inner {
          max-width: 1400px;
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

        .nav-link:hover,
        .nav-link.active {
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
        }

        /* Layout */
        .docs-layout {
          display: flex;
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 80px;
        }

        /* Sidebar */
        .docs-sidebar {
          width: 260px;
          flex-shrink: 0;
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
          border-right: 1px solid #18181b;
          padding: 32px 24px;
        }

        .sidebar-content h3 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #71717a;
          margin-bottom: 16px;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          margin-bottom: 8px;
        }

        .sidebar-link {
          display: block;
          padding: 8px 12px;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 14px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .sidebar-link:hover {
          color: #fff;
          background: #18181b;
        }

        /* Main Content */
        .docs-content {
          flex: 1;
          padding: 40px 60px;
          max-width: 900px;
        }

        .docs-header {
          margin-bottom: 48px;
          padding-bottom: 32px;
          border-bottom: 1px solid #18181b;
        }

        .docs-header h1 {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .docs-header p {
          font-size: 18px;
          color: #71717a;
        }

        .docs-section {
          margin-bottom: 64px;
          scroll-margin-top: 100px;
        }

        .docs-section h2 {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #27272a;
          color: #a855f7;
        }

        .docs-block {
          margin-bottom: 32px;
        }

        .docs-block h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #e4e4e7;
        }

        .docs-block p {
          font-size: 15px;
          line-height: 1.7;
          color: #a1a1aa;
          white-space: pre-line;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .docs-sidebar {
            display: none;
          }

          .docs-content {
            padding: 32px 24px;
          }
        }

        @media (max-width: 640px) {
          .nav-links {
            display: none;
          }

          .docs-header h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
