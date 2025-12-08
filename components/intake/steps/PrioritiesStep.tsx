'use client';

import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import type { StrategicPriority } from '@/lib/database.types';

const PRIORITIES: { value: StrategicPriority; label: string; description: string; icon: string }[] = [
  {
    value: 'growth_acceleration',
    label: 'Growth Acceleration',
    description: 'Aggressive revenue and customer growth',
    icon: '📈',
  },
  {
    value: 'market_expansion',
    label: 'Market Expansion',
    description: 'Enter new markets or geographies',
    icon: '🌍',
  },
  {
    value: 'digital_transformation',
    label: 'Digital Transformation',
    description: 'Modernize technology and processes',
    icon: '💻',
  },
  {
    value: 'operational_excellence',
    label: 'Operational Excellence',
    description: 'Improve efficiency and quality',
    icon: '⚙️',
  },
  {
    value: 'cost_optimization',
    label: 'Cost Optimization',
    description: 'Reduce costs and improve margins',
    icon: '💰',
  },
  {
    value: 'innovation_leadership',
    label: 'Innovation Leadership',
    description: 'Lead market with new products/services',
    icon: '💡',
  },
  {
    value: 'customer_experience',
    label: 'Customer Experience',
    description: 'Enhance customer satisfaction and loyalty',
    icon: '⭐',
  },
  {
    value: 'talent_development',
    label: 'Talent Development',
    description: 'Build organizational capabilities',
    icon: '👥',
  },
  {
    value: 'sustainability',
    label: 'Sustainability',
    description: 'ESG and environmental initiatives',
    icon: '🌱',
  },
  {
    value: 'risk_mitigation',
    label: 'Risk Mitigation',
    description: 'Reduce strategic and operational risks',
    icon: '🛡️',
  },
  {
    value: 'ma_integration',
    label: 'M&A Integration',
    description: 'Acquire or integrate businesses',
    icon: '🤝',
  },
  {
    value: 'brand_building',
    label: 'Brand Building',
    description: 'Strengthen market positioning',
    icon: '🎯',
  },
];

export default function PrioritiesStep() {
  const { currentIntake, updateStrategicPriorities } = useDiagnosticStore();
  const selected = currentIntake?.strategic_priorities || [];

  const togglePriority = (priority: StrategicPriority) => {
    if (selected.includes(priority)) {
      updateStrategicPriorities(selected.filter((p) => p !== priority));
    } else if (selected.length < 5) {
      updateStrategicPriorities([...selected, priority]);
    }
  };

  const getPriorityRank = (priority: StrategicPriority): number | null => {
    const index = selected.indexOf(priority);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--text-muted)] mb-2">
          Select your top 3-5 strategic priorities in order of importance. Click to select, click again to deselect.
        </p>
        <p className="text-xs text-teal-400">
          Selected: {selected.length}/5 priorities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRIORITIES.map((priority) => {
          const rank = getPriorityRank(priority.value);
          const isSelected = rank !== null;
          const isDisabled = !isSelected && selected.length >= 5;

          return (
            <button
              key={priority.value}
              onClick={() => !isDisabled && togglePriority(priority.value)}
              disabled={isDisabled}
              className={`relative text-left p-4 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-teal-500/20 border-teal-500/50 text-[var(--text-primary)]'
                  : isDisabled
                  ? 'bg-[var(--bg-secondary)] border-[var(--border-color)] opacity-50 cursor-not-allowed'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-teal-500/30'
              }`}
            >
              {rank && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-500 text-navy-900 text-xs font-bold flex items-center justify-center">
                  {rank}
                </span>
              )}

              <div className="flex items-start gap-3">
                <span className="text-2xl">{priority.icon}</span>
                <div>
                  <h4 className="font-medium">{priority.label}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {priority.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Priority Order</h4>
          <div className="space-y-2">
            {selected.map((priority, index) => {
              const priorityInfo = PRIORITIES.find((p) => p.value === priority);
              return (
                <div
                  key={priority}
                  className="flex items-center gap-3 bg-[var(--bg-primary)] p-3 rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-lg">{priorityInfo?.icon}</span>
                  <span className="font-medium">{priorityInfo?.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <p className="text-sm text-purple-400">
          Your selected priorities will influence tool recommendations and strategic insights tailored to your goals.
        </p>
      </div>
    </div>
  );
}
