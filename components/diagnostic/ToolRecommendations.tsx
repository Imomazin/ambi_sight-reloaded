'use client';

import { useRouter } from 'next/navigation';
import type { ToolRecommendation, ToolCategory } from '@/lib/database.types';

interface ToolRecommendationsProps {
  recommendations: ToolRecommendation[];
}

const categoryColors: Record<ToolCategory, { bg: string; text: string; border: string }> = {
  growth: { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30' },
  renewal: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  risk: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  innovation: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  execution: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  capability: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  digital: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  marketing: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  finance: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  stakeholders: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
};

const categoryIcons: Record<ToolCategory, string> = {
  growth: '📈',
  renewal: '🔄',
  risk: '🛡️',
  innovation: '💡',
  execution: '⚙️',
  capability: '💪',
  digital: '💻',
  marketing: '📣',
  finance: '💰',
  stakeholders: '👥',
};

export default function ToolRecommendations({ recommendations }: ToolRecommendationsProps) {
  const router = useRouter();

  const primaryTools = recommendations.filter((t) => t.priority === 'primary');
  const secondaryTools = recommendations.filter((t) => t.priority === 'secondary');
  const supportingTools = recommendations.filter((t) => t.priority === 'supporting');

  const renderTool = (tool: ToolRecommendation, index: number) => {
    const colors = categoryColors[tool.category];
    const icon = categoryIcons[tool.category];

    return (
      <div
        key={tool.tool_id}
        className={`card p-5 ${colors.bg} border ${colors.border} hover:scale-[1.02] transition-all cursor-pointer`}
        onClick={() => router.push(`/tools/${tool.tool_id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h4 className="font-semibold">{tool.tool_name}</h4>
              <span className={`text-xs ${colors.text} uppercase tracking-wider`}>
                {tool.category}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-lg font-bold ${colors.text}`}>
              {tool.relevance_score}%
            </div>
            <div className="text-xs text-[var(--text-muted)]">Match</div>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
          {tool.reason}
        </p>

        {/* Relevance Bar */}
        <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.text.replace('text', 'bg')} transition-all duration-500`}
            style={{ width: `${tool.relevance_score}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">
            Recommended #{index + 1}
          </span>
          <span className={colors.text}>
            View Tool →
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">
              {recommendations.length} Tools Recommended
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Based on your diagnostic results and strategic priorities
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">{primaryTools.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Primary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{secondaryTools.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Secondary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{supportingTools.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Supporting</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tools */}
      {primaryTools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-500" />
            Primary Recommendations
            <span className="text-sm font-normal text-[var(--text-muted)]">
              — Start here for maximum impact
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryTools.map((tool, index) => renderTool(tool, index))}
          </div>
        </div>
      )}

      {/* Secondary Tools */}
      {secondaryTools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Secondary Recommendations
            <span className="text-sm font-normal text-[var(--text-muted)]">
              — Consider after primary tools
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryTools.map((tool, index) => renderTool(tool, primaryTools.length + index))}
          </div>
        </div>
      )}

      {/* Supporting Tools */}
      {supportingTools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500" />
            Supporting Tools
            <span className="text-sm font-normal text-[var(--text-muted)]">
              — Helpful for comprehensive strategy work
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportingTools.map((tool, index) =>
              renderTool(tool, primaryTools.length + secondaryTools.length + index)
            )}
          </div>
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-[var(--text-muted)]">No tool recommendations available.</p>
        </div>
      )}

      {/* CTA */}
      <div className="card p-6 bg-gradient-to-r from-teal-500/10 to-purple-500/10 border-teal-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-1">Explore All Strategy Tools</h4>
            <p className="text-sm text-[var(--text-muted)]">
              Browse our complete library of 50+ strategy frameworks and tools
            </p>
          </div>
          <button
            onClick={() => router.push('/tools')}
            className="btn-primary px-6 py-2"
          >
            View All Tools
          </button>
        </div>
      </div>
    </div>
  );
}
