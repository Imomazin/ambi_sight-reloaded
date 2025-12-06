'use client';

interface Metric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  color?: 'teal' | 'amber' | 'magenta' | 'lime' | 'purple';
  icon?: React.ReactNode;
}

interface MetricsGridProps {
  metrics: Metric[];
  columns?: 2 | 3 | 4;
}

export default function MetricsGrid({ metrics, columns = 4 }: MetricsGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const colorClasses = {
    teal: 'border-l-teal-400 bg-teal-500/5',
    amber: 'border-l-amber-400 bg-amber-500/5',
    magenta: 'border-l-magenta-400 bg-magenta-500/5',
    lime: 'border-l-lime-400 bg-lime-500/5',
    purple: 'border-l-purple-400 bg-purple-500/5',
  };

  const iconColorClasses = {
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    magenta: 'text-magenta-400',
    lime: 'text-lime-400',
    purple: 'text-purple-400',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4`}>
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className={`
            p-5 rounded-xl border border-navy-600 border-l-4
            ${colorClasses[metric.color || 'teal']}
            transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">{metric.label}</span>
            {metric.icon && (
              <span className={iconColorClasses[metric.color || 'teal']}>
                {metric.icon}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white">{metric.value}</span>
            {metric.change !== undefined && (
              <div className="flex items-center gap-1">
                {metric.trend === 'up' && (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {metric.trend === 'down' && (
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
