'use client';

import { useState } from 'react';
import { useAppState } from '@/state/useAppState';
import DataChart from './DataChart';
import ProgressIndicator from './ProgressIndicator';

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { analysisHistory, aiQueriesUsed, currentUser } = useAppState();

  // Generate demo analytics data
  const engagementData = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 62 },
    { label: 'Wed', value: 78 },
    { label: 'Thu', value: 55 },
    { label: 'Fri', value: 89 },
    { label: 'Sat', value: 34 },
    { label: 'Sun', value: 28 }
  ];

  const toolUsageData = [
    { label: 'SWOT Analysis', value: 35, color: '#14B8A6' },
    { label: "Porter's 5 Forces", value: 28, color: '#A855F7' },
    { label: 'PESTEL', value: 22, color: '#F59E0B' },
    { label: 'Scenario Planning', value: 15, color: '#EF4444' }
  ];

  const insightCategories = [
    { label: 'Market Opportunities', value: 42 },
    { label: 'Risk Factors', value: 35 },
    { label: 'Growth Strategies', value: 28 },
    { label: 'Cost Optimization', value: 18 }
  ];

  const kpis = [
    {
      label: 'Total Analyses',
      value: analysisHistory.length,
      change: '+12%',
      trend: 'up',
      icon: '📊'
    },
    {
      label: 'Advisor Queries',
      value: aiQueriesUsed,
      change: '+24%',
      trend: 'up',
      icon: '💬'
    },
    {
      label: 'Insights Generated',
      value: 156,
      change: '+8%',
      trend: 'up',
      icon: '💡'
    },
    {
      label: 'Actions Taken',
      value: 23,
      change: '+15%',
      trend: 'up',
      icon: '🎯'
    }
  ];

  const recentActivity = [
    { action: 'Completed SWOT Analysis', time: '2 hours ago', icon: '📋' },
    { action: 'Generated market insights', time: '5 hours ago', icon: '💡' },
    { action: 'Exported report to PDF', time: '1 day ago', icon: '📄' },
    { action: 'Started scenario planning', time: '2 days ago', icon: '🎯' },
    { action: 'Uploaded financial data', time: '3 days ago', icon: '📤' }
  ];

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Analytics Dashboard</h2>
          <p>Track your strategic intelligence performance</p>
        </div>
        <div className="time-selector">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map(range => (
            <button
              key={range}
              className={`time-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <span className="kpi-icon">{kpi.icon}</span>
            <div className="kpi-content">
              <span className="kpi-value">{kpi.value.toLocaleString()}</span>
              <span className="kpi-label">{kpi.label}</span>
            </div>
            <span className={`kpi-change ${kpi.trend}`}>{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <DataChart
            data={engagementData}
            type="line"
            title="Weekly Engagement"
            height={180}
            showLegend={false}
          />
        </div>
        <div className="chart-card">
          <DataChart
            data={toolUsageData}
            type="donut"
            title="Tool Usage Distribution"
            height={180}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Insights by Category */}
        <div className="insights-card">
          <h3>Insights by Category</h3>
          <div className="insight-bars">
            {insightCategories.map((cat, index) => (
              <div key={index} className="insight-item">
                <div className="insight-header">
                  <span className="insight-label">{cat.label}</span>
                  <span className="insight-value">{cat.value}</span>
                </div>
                <ProgressIndicator
                  progress={(cat.value / 50) * 100}
                  color={index === 0 ? 'teal' : index === 1 ? 'red' : index === 2 ? 'purple' : 'amber'}
                  showLabel={false}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-content">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Usage Insights */}
      <div className="ai-insights">
        <h3>AI Assistant Insights</h3>
        <div className="ai-stats">
          <div className="ai-stat">
            <ProgressIndicator
              progress={75}
              variant="circular"
              size="lg"
              color="teal"
              label="75%"
            />
            <span>Query Success Rate</span>
          </div>
          <div className="ai-stat">
            <ProgressIndicator
              progress={88}
              variant="circular"
              size="lg"
              color="purple"
              label="88%"
            />
            <span>Insight Accuracy</span>
          </div>
          <div className="ai-stat">
            <ProgressIndicator
              progress={62}
              variant="circular"
              size="lg"
              color="amber"
              label="62%"
            />
            <span>Action Conversion</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-dashboard {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .dashboard-header h2 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .dashboard-header p {
          margin: 0;
          color: var(--text-muted);
        }

        .time-selector {
          display: flex;
          gap: 8px;
        }

        .time-btn {
          padding: 8px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .time-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .kpi-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .kpi-icon {
          font-size: 28px;
        }

        .kpi-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .kpi-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .kpi-change {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .kpi-change.up {
          background: rgba(34, 197, 94, 0.2);
          color: #22C55E;
        }

        .kpi-change.down {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }

        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .chart-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }

        .bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .insights-card,
        .activity-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }

        .insights-card h3,
        .activity-card h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .insight-bars {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .insight-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
        }

        .insight-label {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .insight-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .activity-icon {
          font-size: 20px;
        }

        .activity-content {
          display: flex;
          flex-direction: column;
        }

        .activity-action {
          font-size: 13px;
          color: var(--text-primary);
        }

        .activity-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .ai-insights {
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
        }

        .ai-insights h3 {
          margin: 0 0 20px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ai-stats {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 24px;
        }

        .ai-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .ai-stat span {
          font-size: 13px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 16px;
          }

          .time-selector {
            width: 100%;
            overflow-x: auto;
          }

          .charts-row,
          .bottom-row {
            grid-template-columns: 1fr;
          }

          .ai-stats {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
