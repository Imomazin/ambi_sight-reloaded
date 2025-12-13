'use client';

import { useAppState } from '../state/useAppState';
import { getToolById, complexityColors, planColors, type StrategyToolFull } from '../lib/strategyToolsLibrary';
import Link from 'next/link';

interface ToolViewProps {
  toolId: string;
  onClose: () => void;
}

export default function ToolView({ toolId, onClose }: ToolViewProps) {
  const { currentUser } = useAppState();
  const tool = getToolById(toolId);
  const userPlan = currentUser?.plan || 'Free';

  if (!tool) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Tool Not Found</h2>
        <p className="text-[var(--text-muted)] mb-4">The requested tool could not be found.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${complexityColors[tool.complexity]}`}>
              {tool.complexity}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${planColors[tool.requiredPlan]}`}>
              {tool.requiredPlan}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
            {tool.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">{tool.name}</h1>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-3 md:mb-4">{tool.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{tool.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{tool.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Best For */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="text-teal-400">👥</span> Best For
            </h2>
            <ul className="space-y-3">
              {tool.bestFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span className="text-[var(--text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Questions */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="text-purple-400">❓</span> Key Questions to Answer
            </h2>
            <div className="space-y-4">
              {tool.keyQuestions.map((question, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">
                    {idx + 1}
                  </div>
                  <span className="text-[var(--text-secondary)] pt-1">{question}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Tool Area */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="text-amber-400">⚡</span> Tool Workspace
            </h2>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-8 border-2 border-dashed border-[var(--border-color)] text-center">
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Interactive {tool.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                This interactive workspace allows you to apply the {tool.name} framework to your specific situation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button className="w-full sm:w-auto px-5 py-3 bg-teal-500 hover:bg-teal-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Start Analysis
                </button>
                <button className="w-full sm:w-auto px-5 py-3 bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-medium rounded-lg border border-[var(--border-color)] hover:border-[var(--border-hover)] transition-colors flex items-center justify-center gap-2 touch-manipulation">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Deliverable */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="text-green-400">📊</span> Deliverable
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">{tool.deliverable}</p>
          </div>

          {/* Related Tools */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="text-blue-400">🔗</span> Related Tools
            </h2>
            <div className="space-y-2">
              {tool.relatedTools.slice(0, 3).map((toolId, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
                >
                  {toolId}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-teal-500/30 hover:text-teal-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Template
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-teal-500/30 hover:text-teal-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export to PDF
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-teal-500/30 hover:text-teal-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save to Favorites
              </button>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-teal-500/20 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Need Expert Help?</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Our strategy consultants can guide you through this framework.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 font-medium"
            >
              Book Consultation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
