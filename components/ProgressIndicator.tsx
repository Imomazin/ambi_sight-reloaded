'use client';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'teal' | 'amber' | 'purple' | 'red' | 'green';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  variant?: 'linear' | 'circular';
}

export default function ProgressIndicator({
  progress,
  size = 'md',
  color = 'teal',
  showLabel = true,
  label,
  animated = true,
  variant = 'linear'
}: ProgressIndicatorProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colors = {
    teal: { primary: '#14B8A6', secondary: '#2DD4BF', bg: 'rgba(20, 184, 166, 0.2)' },
    amber: { primary: '#F59E0B', secondary: '#FBBF24', bg: 'rgba(245, 158, 11, 0.2)' },
    purple: { primary: '#A855F7', secondary: '#C084FC', bg: 'rgba(168, 85, 247, 0.2)' },
    red: { primary: '#EF4444', secondary: '#F87171', bg: 'rgba(239, 68, 68, 0.2)' },
    green: { primary: '#22C55E', secondary: '#4ADE80', bg: 'rgba(34, 197, 94, 0.2)' }
  };

  const sizes = {
    sm: { height: 4, fontSize: 10, circleSize: 40, strokeWidth: 4 },
    md: { height: 8, fontSize: 12, circleSize: 60, strokeWidth: 6 },
    lg: { height: 12, fontSize: 14, circleSize: 80, strokeWidth: 8 }
  };

  const currentColor = colors[color];
  const currentSize = sizes[size];

  if (variant === 'circular') {
    const radius = (currentSize.circleSize - currentSize.strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (clampedProgress / 100) * circumference;

    return (
      <div className="circular-progress">
        <svg
          width={currentSize.circleSize}
          height={currentSize.circleSize}
          viewBox={`0 0 ${currentSize.circleSize} ${currentSize.circleSize}`}
        >
          {/* Background circle */}
          <circle
            cx={currentSize.circleSize / 2}
            cy={currentSize.circleSize / 2}
            r={radius}
            fill="none"
            stroke={currentColor.bg}
            strokeWidth={currentSize.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={currentSize.circleSize / 2}
            cy={currentSize.circleSize / 2}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${color})`}
            strokeWidth={currentSize.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={animated ? 'animated' : ''}
            transform={`rotate(-90 ${currentSize.circleSize / 2} ${currentSize.circleSize / 2})`}
          />
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentColor.primary} />
              <stop offset="100%" stopColor={currentColor.secondary} />
            </linearGradient>
          </defs>
        </svg>
        {showLabel && (
          <span
            className="circular-label"
            style={{ fontSize: currentSize.fontSize }}
          >
            {label || `${Math.round(clampedProgress)}%`}
          </span>
        )}

        <style jsx>{`
          .circular-progress {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .circular-progress svg circle.animated {
            transition: stroke-dashoffset 0.5s ease-in-out;
          }

          .circular-label {
            position: absolute;
            font-weight: 600;
            color: var(--text-primary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="linear-progress">
      {(showLabel || label) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showLabel && <span className="progress-value">{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div
        className="progress-track"
        style={{
          height: currentSize.height,
          background: currentColor.bg
        }}
      >
        <div
          className={`progress-fill ${animated ? 'animated' : ''}`}
          style={{
            width: `${clampedProgress}%`,
            background: `linear-gradient(90deg, ${currentColor.primary}, ${currentColor.secondary})`
          }}
        />
        {animated && clampedProgress > 0 && clampedProgress < 100 && (
          <div
            className="progress-shimmer"
            style={{
              width: `${clampedProgress}%`
            }}
          />
        )}
      </div>

      <style jsx>{`
        .linear-progress {
          width: 100%;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-size: ${currentSize.fontSize}px;
        }

        .progress-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .progress-value {
          color: var(--text-muted);
          font-weight: 600;
        }

        .progress-track {
          position: relative;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          position: relative;
        }

        .progress-fill.animated {
          transition: width 0.5s ease-in-out;
        }

        .progress-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
          border-radius: 999px;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
