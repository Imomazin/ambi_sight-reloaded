'use client';

import type { TrafficLight } from '@/lib/database.types';

interface ScoreCardProps {
  label: string;
  score: number;
  status: TrafficLight;
  isMain?: boolean;
  isInverse?: boolean;
}

export default function ScoreCard({ label, score, status, isMain, isInverse }: ScoreCardProps) {
  const getStatusColor = () => {
    if (isInverse) {
      // For risk scores, lower is better
      switch (status) {
        case 'green':
          return 'text-lime-400 bg-lime-500/10 border-lime-500/30';
        case 'amber':
          return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        case 'red':
          return 'text-red-400 bg-red-500/10 border-red-500/30';
      }
    }
    switch (status) {
      case 'green':
        return 'text-lime-400 bg-lime-500/10 border-lime-500/30';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'red':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'green':
        return 'bg-lime-500';
      case 'amber':
        return 'bg-amber-500';
      case 'red':
        return 'bg-red-500';
    }
  };

  const displayScore = isInverse ? 100 - score : score;

  return (
    <div className={`card p-4 ${isMain ? 'md:col-span-1' : ''} ${getStatusColor()}`}>
      <div className="text-sm text-[var(--text-muted)] mb-1">{label}</div>
      <div className={`font-bold ${isMain ? 'text-4xl' : 'text-2xl'}`}>
        {score}
        <span className="text-lg text-[var(--text-muted)]">/100</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      {isInverse && (
        <div className="text-xs text-[var(--text-muted)] mt-2">
          Lower is better
        </div>
      )}
    </div>
  );
}
