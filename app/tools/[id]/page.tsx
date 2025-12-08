'use client';

import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useAppState } from '@/state/useAppState';
import {
  getToolById,
  getRelatedTools,
  complexityColors,
  planColors,
} from '@/lib/strategyToolsLibrary';
import { hasFeatureAccess } from '@/lib/users';

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAppState();

  const tool = getToolById(params.id as string);
  const relatedTools = tool ? getRelatedTools(tool.id) : [];

  if (!tool) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
            <p className="text-[var(--text-muted)] mb-4">
              The requested strategy tool could not be found.
            </p>
            <button
              onClick={() => router.push('/tools')}
              className="btn-primary"
            >
              Back to Tools
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const userPlan = currentUser?.plan || 'Free';
  const hasAccess = hasFeatureAccess(userPlan, tool.requiredPlan);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/tools')}
          className="text-sm text-[var(--text-muted)] hover:text-teal-400 mb-6 flex items-center gap-1"
        >
          ← Back to Strategy Tools
        </button>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{tool.icon}</span>
              <div>
                <h1 className="text-2xl font-bold">{tool.name}</h1>
                <p className="text-[var(--text-muted)]">{tool.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${complexityColors[tool.complexity]}`}>
                {tool.complexity}
              </span>
              <span className={`text-xs px-2 py-1 rounded border ${planColors[tool.requiredPlan]}`}>
                {tool.requiredPlan}
              </span>
            </div>
          </div>

          <p className="text-lg text-[var(--text-secondary)] mb-4">
            {tool.description}
          </p>

          {/* Access Check */}
          {!hasAccess && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
              <p className="text-amber-400 text-sm">
                This tool requires a {tool.requiredPlan} plan. Upgrade to access.
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="mt-2 text-xs text-amber-400 underline"
              >
                View Pricing Plans
              </button>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--border-color)]">
            <div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Time</div>
              <div className="font-medium">{tool.estimatedTime}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Complexity</div>
              <div className="font-medium">{tool.complexity}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Plan</div>
              <div className="font-medium">{tool.requiredPlan}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Category</div>
              <div className="font-medium">{tool.category}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {tool.longDescription}
          </p>
        </div>

        {/* When to Use */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">When to Use</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider">
              Best For
            </h3>
            <div className="flex flex-wrap gap-2">
              {tool.bestFor.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider">
              Key Questions This Tool Answers
            </h3>
            <ul className="space-y-2">
              {tool.keyQuestions.map((question, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-[var(--text-secondary)]"
                >
                  <span className="text-teal-400 mt-1">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Inputs & Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Inputs Required</h2>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">→</span>
                Current strategic context and goals
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">→</span>
                Relevant data and metrics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">→</span>
                Stakeholder input and perspectives
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">→</span>
                Time commitment: {tool.estimatedTime}
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Expected Outputs</h2>
            <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
              <p className="text-lime-400 font-medium">Deliverable</p>
              <p className="text-[var(--text-secondary)] mt-1">
                {tool.deliverable}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Step-by-Step Usage Guide</h2>

          <div className="space-y-4">
            {[
              { step: 1, title: 'Gather Context', description: 'Collect relevant data, stakeholder input, and strategic context before starting.' },
              { step: 2, title: 'Define Scope', description: 'Clearly define what you want to achieve and set boundaries for the analysis.' },
              { step: 3, title: 'Apply Framework', description: 'Work through the tool methodology systematically, documenting key findings.' },
              { step: 4, title: 'Analyze Results', description: 'Review outputs, identify patterns, and draw strategic implications.' },
              { step: 5, title: 'Generate Recommendations', description: 'Convert insights into actionable recommendations with clear next steps.' },
              { step: 6, title: 'Communicate & Iterate', description: 'Share findings with stakeholders and refine based on feedback.' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Templates & Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-left hover:border-teal-500/30 transition-all disabled:opacity-50"
              disabled={!hasAccess}
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium">Excel Template</div>
              <div className="text-xs text-[var(--text-muted)]">Coming soon</div>
            </button>

            <button
              className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-left hover:border-teal-500/30 transition-all disabled:opacity-50"
              disabled={!hasAccess}
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">PowerPoint Template</div>
              <div className="text-xs text-[var(--text-muted)]">Coming soon</div>
            </button>

            <button
              className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-left hover:border-teal-500/30 transition-all disabled:opacity-50"
              disabled={!hasAccess}
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">Checklist PDF</div>
              <div className="text-xs text-[var(--text-muted)]">Coming soon</div>
            </button>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedTools.map((related) => (
                <button
                  key={related.id}
                  onClick={() => router.push(`/tools/${related.id}`)}
                  className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-left hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{related.icon}</span>
                    <span className="font-medium">{related.name}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {related.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="card p-6 bg-gradient-to-r from-teal-500/10 to-purple-500/10 border-teal-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Need Help Applying This Tool?</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Our consultants can guide you through implementation
              </p>
            </div>
            <button
              onClick={() => router.push('/pricing')}
              className="btn-primary px-6 py-2"
            >
              Talk to a Consultant
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
