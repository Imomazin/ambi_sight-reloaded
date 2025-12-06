'use client';

import { useAppState } from '@/state/useAppState';
import { insights, type Insight } from '@/lib/demoData';

export default function InsightFeed() {
  const { currentPersona } = useAppState();

  const filteredInsights = insights.filter((insight) =>
    insight.persona.includes(currentPersona)
  );

  const getTypeStyles = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          icon: '⚠️',
          color: 'text-amber-400',
        };
      case 'opportunity':
        return {
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          icon: '💡',
          color: 'text-teal-400',
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: '✓',
          color: 'text-green-400',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'ℹ',
          color: 'text-blue-400',
        };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Insight Feed</h3>
        <span className="text-xs text-gray-400 bg-navy-600 px-2 py-1 rounded-full">
          Live Updates
        </span>
      </div>
      <div className="space-y-3">
        {filteredInsights.slice(0, 5).map((insight) => {
          const styles = getTypeStyles(insight.type);
          return (
            <div
              key={insight.id}
              className={`p-3 rounded-xl ${styles.bg} border ${styles.border} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{styles.icon}</span>
                <p className="text-sm text-gray-300 leading-relaxed">{insight.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-teal-400 hover:text-teal-300 transition-colors">
        View All Insights →
      </button>
    </div>
  );
}
