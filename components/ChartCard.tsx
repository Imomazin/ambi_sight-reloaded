'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar';
  data: any[];
  dataKeys: { key: string; color: string; name: string }[];
  stacked?: boolean;
}

export default function ChartCard({ title, type, data, dataKeys, stacked = false }: ChartCardProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-700 border border-navy-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252535" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip content={customTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
              {dataKeys.map((dk) => (
                <Line
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  name={dk.name}
                  stroke={dk.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: dk.color }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252535" />
              <XAxis
                dataKey="portfolio"
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip content={customTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
              {dataKeys.map((dk) => (
                <Bar
                  key={dk.key}
                  dataKey={dk.key}
                  name={dk.name}
                  fill={dk.color}
                  stackId={stacked ? 'stack' : undefined}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
