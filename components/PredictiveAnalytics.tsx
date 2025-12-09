'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from 'recharts';

interface DataPoint {
  date: string;
  actual?: number;
  predicted?: number;
  upperBound?: number;
  lowerBound?: number;
}

interface ForecastMetric {
  id: string;
  name: string;
  icon: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  timeHorizon: string;
}

// Generate sample historical data
function generateHistoricalData(months: number = 12): DataPoint[] {
  const data: DataPoint[] = [];
  let value = 65;
  const now = new Date();

  for (let i = months; i > 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    value = value + (Math.random() - 0.45) * 8; // Slight upward bias
    value = Math.max(30, Math.min(95, value));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      actual: Math.round(value * 10) / 10,
    });
  }

  return data;
}

// Generate forecast data
function generateForecast(historical: DataPoint[], horizonMonths: number = 6): DataPoint[] {
  const data: DataPoint[] = [...historical];
  const lastActual = historical[historical.length - 1].actual ?? 65;

  // Simple trend calculation
  const recentValues = historical.slice(-6).map(d => d.actual ?? 65);
  const avgChange = (recentValues[recentValues.length - 1] - recentValues[0]) / recentValues.length;

  let value = lastActual;
  const now = new Date();

  for (let i = 1; i <= horizonMonths; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    value = value + avgChange + (Math.random() - 0.5) * 2;
    value = Math.max(30, Math.min(95, value));

    // Increasing uncertainty
    const uncertainty = 5 + i * 2;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      predicted: Math.round(value * 10) / 10,
      upperBound: Math.round((value + uncertainty) * 10) / 10,
      lowerBound: Math.round((value - uncertainty) * 10) / 10,
    });
  }

  return data;
}

const forecastMetrics: ForecastMetric[] = [
  {
    id: 'agility',
    name: 'Strategic Agility',
    icon: '⚡',
    currentValue: 72,
    predictedValue: 78,
    confidence: 85,
    trend: 'up',
    changePercent: 8.3,
    timeHorizon: '90 days',
  },
  {
    id: 'risk',
    name: 'Risk Exposure',
    icon: '⚠️',
    currentValue: 45,
    predictedValue: 42,
    confidence: 78,
    trend: 'down',
    changePercent: -6.7,
    timeHorizon: '90 days',
  },
  {
    id: 'efficiency',
    name: 'Portfolio Efficiency',
    icon: '🎯',
    currentValue: 68,
    predictedValue: 72,
    confidence: 82,
    trend: 'up',
    changePercent: 5.9,
    timeHorizon: '90 days',
  },
  {
    id: 'readiness',
    name: 'Execution Readiness',
    icon: '🚀',
    currentValue: 65,
    predictedValue: 71,
    confidence: 75,
    trend: 'up',
    changePercent: 9.2,
    timeHorizon: '90 days',
  },
];

interface AnomalyAlert {
  id: string;
  metric: string;
  type: 'spike' | 'drop' | 'trend_change' | 'threshold_breach';
  severity: 'low' | 'medium' | 'high';
  message: string;
  probability: number;
  timeframe: string;
}

const predictedAnomalies: AnomalyAlert[] = [
  {
    id: 'a1',
    metric: 'Risk Exposure',
    type: 'spike',
    severity: 'high',
    message: 'Potential risk spike detected due to Q2 market volatility patterns',
    probability: 72,
    timeframe: 'Next 45 days',
  },
  {
    id: 'a2',
    metric: 'Portfolio Efficiency',
    type: 'drop',
    severity: 'medium',
    message: 'Efficiency may decline during resource reallocation phase',
    probability: 58,
    timeframe: 'Next 30 days',
  },
  {
    id: 'a3',
    metric: 'Strategic Agility',
    type: 'trend_change',
    severity: 'low',
    message: 'Growth trajectory may slow after digital transformation milestones',
    probability: 45,
    timeframe: 'Next 60 days',
  },
];

function ConfidenceBand({ confidence }: { confidence: number }) {
  const getColor = (c: number) => {
    if (c >= 80) return 'bg-green-500';
    if (c >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-navy-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor(confidence)} transition-all`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className={`text-xs ${
        confidence >= 80 ? 'text-green-400' :
        confidence >= 60 ? 'text-amber-400' : 'text-red-400'
      }`}>
        {confidence}%
      </span>
    </div>
  );
}

function MetricForecastCard({ metric }: { metric: ForecastMetric }) {
  const trendColor = metric.trend === 'up' ? 'text-green-400' :
    metric.trend === 'down' ? 'text-red-400' : 'text-gray-400';

  const isPositiveTrend = (metric.id === 'risk' && metric.trend === 'down') ||
    (metric.id !== 'risk' && metric.trend === 'up');

  return (
    <div className="bg-navy-700/50 border border-navy-600 rounded-xl p-4 hover:border-teal-500/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{metric.icon}</span>
          <span className="text-sm font-medium text-white">{metric.name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isPositiveTrend ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
          {Math.abs(metric.changePercent).toFixed(1)}%
        </span>
      </div>

      <div className="flex items-end gap-4 mb-3">
        <div>
          <span className="text-xs text-gray-500">Current</span>
          <div className="text-2xl font-bold text-white">{metric.currentValue}</div>
        </div>
        <div className="text-gray-600">→</div>
        <div>
          <span className="text-xs text-gray-500">Predicted ({metric.timeHorizon})</span>
          <div className={`text-2xl font-bold ${isPositiveTrend ? 'text-green-400' : 'text-amber-400'}`}>
            {metric.predictedValue}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Confidence</span>
        <ConfidenceBand confidence={metric.confidence} />
      </div>
    </div>
  );
}

function AnomalyCard({ anomaly }: { anomaly: AnomalyAlert }) {
  const severityStyles = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '🚨' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: '⚠️' },
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'ℹ️' },
  };

  const style = severityStyles[anomaly.severity];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <span className="text-sm">{style.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${style.text}`}>
              {anomaly.metric} - {anomaly.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-500">{anomaly.timeframe}</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{anomaly.message}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Probability:</span>
            <div className="flex-1 h-1.5 bg-navy-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  anomaly.probability >= 70 ? 'bg-red-500' :
                  anomaly.probability >= 50 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${anomaly.probability}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{anomaly.probability}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PredictiveAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState('agility');
  const [forecastHorizon, setForecastHorizon] = useState(6);
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const historical = generateHistoricalData(12);
    const withForecast = generateForecast(historical, forecastHorizon);
    setChartData(withForecast);
  }, [forecastHorizon]);

  const selectedMetricData = forecastMetrics.find(m => m.id === selectedMetric);

  // Find the index where forecast begins
  const forecastStartIndex = chartData.findIndex(d => d.predicted !== undefined);

  return (
    <div className="bg-navy-800/50 border border-navy-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-navy-600 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔮</span>
              Predictive Analytics
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              AI-powered forecasts with confidence intervals
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(parseInt(e.target.value))}
              className="px-3 py-2 text-sm bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            >
              <option value={3}>3 Month Forecast</option>
              <option value={6}>6 Month Forecast</option>
              <option value={12}>12 Month Forecast</option>
            </select>
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="flex gap-2 mt-4">
          {forecastMetrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                selectedMetric === metric.id
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-700 border border-transparent'
              }`}
            >
              <span>{metric.icon}</span>
              {metric.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Chart */}
        <div className="lg:col-span-2 p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickLine={{ stroke: '#374151' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis
                  domain={[20, 100]}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickLine={{ stroke: '#374151' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />

                {/* Confidence Band */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="url(#confidenceBand)"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="#0B0B0F"
                />

                {/* Forecast Start Line */}
                {forecastStartIndex > 0 && (
                  <ReferenceLine
                    x={chartData[forecastStartIndex - 1]?.date}
                    stroke="#6B7280"
                    strokeDasharray="5 5"
                    label={{
                      value: 'Forecast →',
                      position: 'top',
                      fill: '#6B7280',
                      fontSize: 10,
                    }}
                  />
                )}

                {/* Actual Line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  dot={{ fill: '#2DD4BF', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#2DD4BF' }}
                />

                {/* Predicted Line */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3B82F6', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#3B82F6' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-teal-400" />
              <span className="text-xs text-gray-400">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3B82F6, #3B82F6 4px, transparent 4px, transparent 8px)' }} />
              <span className="text-xs text-gray-400">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500/30 rounded" />
              <span className="text-xs text-gray-400">Confidence Band</span>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="p-6 bg-navy-900/30 border-l border-navy-600">
          {/* Metric Forecasts */}
          <h3 className="text-sm font-semibold text-gray-400 mb-3">90-Day Forecasts</h3>
          <div className="space-y-3 mb-6">
            {forecastMetrics.slice(0, 2).map(metric => (
              <MetricForecastCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Anomaly Detection */}
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <span>🔍</span> Anomaly Detection
          </h3>
          <div className="space-y-2">
            {predictedAnomalies.map(anomaly => (
              <AnomalyCard key={anomaly.id} anomaly={anomaly} />
            ))}
          </div>

          {/* Model Info */}
          <div className="mt-6 p-3 rounded-lg bg-navy-700/30 border border-navy-600">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">⚙️</span>
              <span className="text-xs font-medium text-gray-400">Model Information</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Algorithm</span>
                <p className="text-white">ARIMA + ML Ensemble</p>
              </div>
              <div>
                <span className="text-gray-500">Last Updated</span>
                <p className="text-white">2 hours ago</p>
              </div>
              <div>
                <span className="text-gray-500">Training Data</span>
                <p className="text-white">24 months</p>
              </div>
              <div>
                <span className="text-gray-500">Accuracy (MAE)</span>
                <p className="text-white">±3.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
