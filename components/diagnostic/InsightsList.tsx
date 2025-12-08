'use client';

import type { GeneratedInsight } from '@/lib/database.types';

interface InsightsListProps {
  insights: GeneratedInsight[];
}

export default function InsightsList({ insights }: InsightsListProps) {
  const getTypeStyles = (type: GeneratedInsight['type']) => {
    switch (type) {
      case 'concern':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: '⚠️',
          label: 'Concern',
        };
      case 'opportunity':
        return {
          bg: 'bg-lime-500/10',
          border: 'border-lime-500/30',
          text: 'text-lime-400',
          icon: '💡',
          label: 'Opportunity',
        };
      case 'recommendation':
        return {
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          text: 'text-teal-400',
          icon: '🎯',
          label: 'Recommendation',
        };
      default:
        return {
          bg: 'bg-[var(--bg-secondary)]',
          border: 'border-[var(--border-color)]',
          text: 'text-[var(--text-muted)]',
          icon: 'ℹ️',
          label: 'Info',
        };
    }
  };

  const getPriorityStyles = (priority: GeneratedInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const concerns = insights.filter((i) => i.type === 'concern');
  const opportunities = insights.filter((i) => i.type === 'opportunity');
  const recommendations = insights.filter((i) => i.type === 'recommendation');

  const renderInsight = (insight: GeneratedInsight) => {
    const styles = getTypeStyles(insight.type);

    return (
      <div
        key={insight.id}
        className={`${styles.bg} border ${styles.border} rounded-lg p-4`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span>{styles.icon}</span>
            <span className={`text-sm font-medium ${styles.text}`}>
              {styles.label}
            </span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded border ${getPriorityStyles(insight.priority)}`}
          >
            {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
          </span>
        </div>

        <h4 className="font-semibold mb-2">{insight.title}</h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {insight.description}
        </p>

        <div className="mt-3 text-xs text-[var(--text-muted)]">
          Related: {insight.related_area}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{concerns.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Concerns</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-lime-400">{opportunities.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Opportunities</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-teal-400">{recommendations.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Recommendations</div>
        </div>
      </div>

      {/* Concerns */}
      {concerns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Strategic Concerns ({concerns.length})
          </h3>
          <div className="space-y-4">
            {concerns
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map(renderInsight)}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-lime-500" />
            Strategic Opportunities ({opportunities.length})
          </h3>
          <div className="space-y-4">
            {opportunities
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map(renderInsight)}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-500" />
            Recommendations ({recommendations.length})
          </h3>
          <div className="space-y-4">
            {recommendations
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map(renderInsight)}
          </div>
        </div>
      )}

      {insights.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-[var(--text-muted)]">No insights generated for this diagnostic.</p>
        </div>
      )}
    </div>
  );
}
