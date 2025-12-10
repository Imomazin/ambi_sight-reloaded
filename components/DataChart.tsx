'use client';

import { useState, useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface DataChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie' | 'donut';
  title?: string;
  height?: number;
  showLegend?: boolean;
  animated?: boolean;
}

const defaultColors = [
  '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#22C55E',
  '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4', '#F97316'
];

export default function DataChart({
  data,
  type = 'bar',
  title,
  height = 200,
  showLegend = true,
  animated = true
}: DataChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const coloredData = data.map((d, i) => ({
    ...d,
    color: d.color || defaultColors[i % defaultColors.length]
  }));

  const renderBarChart = () => (
    <div className="bar-chart">
      {coloredData.map((item, index) => (
        <div
          key={index}
          className={`bar-item ${hoveredIndex === index ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="bar-label">{item.label}</div>
          <div className="bar-track">
            <div
              className={`bar-fill ${animated ? 'animated' : ''}`}
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
                animationDelay: `${index * 0.1}s`
              }}
            />
          </div>
          <div className="bar-value">{item.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const width = 400;
    const chartHeight = height - 40;
    const padding = 40;
    const chartWidth = width - padding * 2;

    const points = coloredData.map((item, index) => ({
      x: padding + (index / (coloredData.length - 1 || 1)) * chartWidth,
      y: chartHeight - (item.value / maxValue) * (chartHeight - 20) + 10,
      ...item
    }));

    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return (
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(percent => (
          <line
            key={percent}
            x1={padding}
            y1={chartHeight - (percent / 100) * (chartHeight - 20) + 10}
            x2={width - padding}
            y2={chartHeight - (percent / 100) * (chartHeight - 20) + 10}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* Area fill */}
        <path
          d={`${pathD} L ${points[points.length - 1]?.x || 0} ${chartHeight} L ${padding} ${chartHeight} Z`}
          fill="url(#lineGradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#14B8A6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? 'line-animated' : ''}
        />

        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 8 : 5}
              fill={point.color}
              stroke="var(--bg-secondary)"
              strokeWidth="2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
            />
            {hoveredIndex === index && (
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="12"
                fontWeight="600"
              >
                {point.value.toLocaleString()}
              </text>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={`label-${index}`}
            x={point.x}
            y={height - 5}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="10"
          >
            {point.label.length > 8 ? point.label.slice(0, 8) + '..' : point.label}
          </text>
        ))}

        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const renderPieChart = () => {
    const size = Math.min(height, 200);
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    let currentAngle = -90;

    return (
      <div className="pie-container">
        <svg className="pie-chart" viewBox={`0 0 ${size} ${size}`}>
          {coloredData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const largeArc = angle > 180 ? 1 : 0;
            const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            const pathD = type === 'donut'
              ? `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`
              : `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;

            return (
              <path
                key={index}
                d={pathD}
                fill={item.color}
                stroke="var(--bg-secondary)"
                strokeWidth="2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  cursor: 'pointer',
                  transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'transform 0.2s ease'
                }}
              />
            );
          })}

          {type === 'donut' && (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.6}
              fill="var(--bg-secondary)"
            />
          )}

          {type === 'donut' && hoveredIndex !== null && (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-primary)"
              fontSize="14"
              fontWeight="600"
            >
              {((coloredData[hoveredIndex].value / total) * 100).toFixed(1)}%
            </text>
          )}
        </svg>
      </div>
    );
  };

  const renderLegend = () => (
    <div className="chart-legend">
      {coloredData.map((item, index) => (
        <div
          key={index}
          className={`legend-item ${hoveredIndex === index ? 'active' : ''}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <span className="legend-color" style={{ backgroundColor: item.color }} />
          <span className="legend-label">{item.label}</span>
          <span className="legend-value">{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="data-chart">
      {title && <h4 className="chart-title">{title}</h4>}

      <div className="chart-body" style={{ minHeight: height }}>
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {(type === 'pie' || type === 'donut') && renderPieChart()}
      </div>

      {showLegend && (type === 'pie' || type === 'donut') && renderLegend()}

      <style jsx>{`
        .data-chart {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }

        .chart-title {
          margin: 0 0 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .chart-body {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Bar chart styles */
        .bar-chart {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bar-item {
          display: grid;
          grid-template-columns: 80px 1fr 60px;
          align-items: center;
          gap: 12px;
        }

        .bar-item.hovered .bar-fill {
          filter: brightness(1.2);
        }

        .bar-label {
          font-size: 12px;
          color: var(--text-secondary);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .bar-track {
          height: 24px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: filter 0.2s ease;
        }

        .bar-fill.animated {
          animation: bar-grow 0.5s ease-out forwards;
          width: 0 !important;
        }

        @keyframes bar-grow {
          to {
            width: var(--target-width) !important;
          }
        }

        .bar-value {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          text-align: right;
        }

        /* Line chart styles */
        .line-chart {
          width: 100%;
          max-width: 400px;
        }

        .line-animated {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: line-draw 1.5s ease-out forwards;
        }

        @keyframes line-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Pie chart styles */
        .pie-container {
          display: flex;
          justify-content: center;
        }

        .pie-chart {
          max-width: 200px;
        }

        /* Legend styles */
        .chart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .legend-item:hover,
        .legend-item.active {
          background: var(--bg-tertiary);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-label {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .legend-value {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
