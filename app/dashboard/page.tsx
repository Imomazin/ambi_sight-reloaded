'use client';

import Link from 'next/link';
import AppShell from '@/components/AppShell';
import PageContainer from '@/components/PageContainer';
import MetricsGrid from '@/components/MetricsGrid';
import ActivityFeed from '@/components/ActivityFeed';
import { useRole, Role, roleData } from '@/context/RoleContext';
import { kpis, riskCategories } from '@/lib/demoData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

// Role-specific dashboard configurations
const roleConfigs: Record<Role, {
  metrics: { id: string; label: string; value: string; change: number; trend: 'up' | 'down' | 'stable'; color: 'teal' | 'amber' | 'purple' | 'lime' | 'magenta' }[];
  quickActions: { title: string; description: string; href: string; icon: string; color: string }[];
  focusAreas: string[];
}> = {
  CSO: {
    metrics: [
      { id: 'growth', label: 'Growth Rate', value: '24.5%', change: 3.2, trend: 'up', color: 'teal' },
      { id: 'market', label: 'Market Position', value: '#2', change: 1, trend: 'up', color: 'purple' },
      { id: 'alignment', label: 'Strategic Alignment', value: '92%', change: 1.8, trend: 'up', color: 'lime' },
      { id: 'pipeline', label: 'Opportunity Pipeline', value: '$42M', change: 12.5, trend: 'up', color: 'amber' },
    ],
    quickActions: [
      { title: 'New Scenario', description: 'Model strategic alternatives', href: '/scenarios', icon: '📊', color: 'purple' },
      { title: 'Growth Analysis', description: 'Review expansion opportunities', href: '/portfolio', icon: '📈', color: 'teal' },
      { title: 'AI Insights', description: 'Strategic recommendations', href: '/advisor', icon: '🎯', color: 'cyan' },
    ],
    focusAreas: ['Strategic Outcomes', 'Growth Metrics', 'Scenario Insights'],
  },
  CRO: {
    metrics: [
      { id: 'risk', label: 'Overall Risk Score', value: '34', change: -2.1, trend: 'down', color: 'amber' },
      { id: 'exposure', label: 'Downside Exposure', value: '$8.2M', change: -5.3, trend: 'down', color: 'magenta' },
      { id: 'mitigation', label: 'Mitigation Coverage', value: '87%', change: 4.2, trend: 'up', color: 'teal' },
      { id: 'incidents', label: 'Active Incidents', value: '3', change: -2, trend: 'down', color: 'purple' },
    ],
    quickActions: [
      { title: 'Risk Heat Map', description: 'View current risk distribution', href: '/portfolio', icon: '🔥', color: 'amber' },
      { title: 'Early Warnings', description: 'Review alert indicators', href: '/advisor', icon: '⚠️', color: 'magenta' },
      { title: 'Scenario Impact', description: 'Assess risk scenarios', href: '/scenarios', icon: '📉', color: 'purple' },
    ],
    focusAreas: ['Risk Heat Mapping', 'Downside Exposure', 'Early Warning Indicators'],
  },
  CTO: {
    metrics: [
      { id: 'tech-debt', label: 'Tech Debt Index', value: '23%', change: -3.5, trend: 'down', color: 'teal' },
      { id: 'capacity', label: 'Team Capacity', value: '78%', change: 2.1, trend: 'up', color: 'lime' },
      { id: 'digital', label: 'Digital Maturity', value: '3.8/5', change: 0.3, trend: 'up', color: 'purple' },
      { id: 'security', label: 'Security Score', value: '94', change: 2, trend: 'up', color: 'amber' },
    ],
    quickActions: [
      { title: 'Tech Roadmap', description: 'Review digital initiatives', href: '/workspace', icon: '🗺️', color: 'teal' },
      { title: 'Capacity Planning', description: 'Team resource allocation', href: '/portfolio', icon: '👥', color: 'lime' },
      { title: 'Innovation Ideas', description: 'AI-powered suggestions', href: '/advisor', icon: '💡', color: 'purple' },
    ],
    focusAreas: ['Technology Roadmap Risk', 'Capacity Planning', 'Digital Initiatives'],
  },
  OperationsLead: {
    metrics: [
      { id: 'throughput', label: 'Throughput', value: '94%', change: 2.8, trend: 'up', color: 'teal' },
      { id: 'bottlenecks', label: 'Active Bottlenecks', value: '2', change: -1, trend: 'down', color: 'amber' },
      { id: 'efficiency', label: 'Process Efficiency', value: '87%', change: 3.2, trend: 'up', color: 'lime' },
      { id: 'sla', label: 'SLA Compliance', value: '99.2%', change: 0.5, trend: 'up', color: 'purple' },
    ],
    quickActions: [
      { title: 'Process Health', description: 'Monitor execution status', href: '/workspace', icon: '⚙️', color: 'teal' },
      { title: 'Bottleneck Analysis', description: 'Identify constraints', href: '/advisor', icon: '🔍', color: 'amber' },
      { title: 'Transformation', description: 'Track change initiatives', href: '/portfolio', icon: '🔄', color: 'purple' },
    ],
    focusAreas: ['Execution Health', 'Throughput Metrics', 'Bottleneck Analysis'],
  },
  Admin: {
    metrics: [
      { id: 'users', label: 'Active Users', value: '127', change: 12, trend: 'up', color: 'teal' },
      { id: 'uptime', label: 'System Uptime', value: '99.9%', change: 0.1, trend: 'up', color: 'lime' },
      { id: 'features', label: 'Feature Flags', value: '8', change: 2, trend: 'up', color: 'purple' },
      { id: 'data', label: 'Data Quality', value: '96%', change: 1.5, trend: 'up', color: 'amber' },
    ],
    quickActions: [
      { title: 'Admin Console', description: 'System configuration', href: '/admin', icon: '🔧', color: 'teal' },
      { title: 'User Management', description: 'Manage team access', href: '/admin', icon: '👤', color: 'purple' },
      { title: 'Feature Toggles', description: 'Control experiments', href: '/admin', icon: '🎛️', color: 'amber' },
    ],
    focusAreas: ['System Configuration', 'User Management', 'Feature Toggles'],
  },
};

export default function DashboardPage() {
  const { activeRole, roleInfo } = useRole();
  const config = roleConfigs[activeRole];

  const radarData = riskCategories.map((cat) => ({
    subject: cat.name.replace(' Risk', ''),
    score: cat.score,
    fullMark: 100,
  }));

  return (
    <AppShell>
      <PageContainer
        title={roleInfo.dashboardTitle}
        subtitle={roleInfo.dashboardSubtitle}
      >
        {/* Role Focus Banner */}
        <div className="mb-6 p-4 card border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{roleInfo.icon}</span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Viewing as {roleInfo.title}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Focus: {config.focusAreas.join(' • ')}
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Snapshot */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            {activeRole === 'CRO' ? 'Risk Overview' : activeRole === 'CTO' ? 'Technology Health' : activeRole === 'OperationsLead' ? 'Operational Metrics' : activeRole === 'Admin' ? 'System Status' : 'Strategic Snapshot'}
          </h2>
          <MetricsGrid metrics={config.metrics} columns={4} />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed maxItems={6} />
          </div>

          {/* Middle Column: Quick Actions + Org Health */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {config.quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-muted)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{action.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Org Health Radar */}
            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {activeRole === 'CRO' ? 'Risk Categories' : 'Org Health Radar'}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border-subtle)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="var(--accent-primary)"
                      fill="var(--accent-primary)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: KPI Summary */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Key Metrics</h3>
                <Link href="/workspace" className="text-sm text-[var(--accent-primary)] hover:opacity-80 transition-colors">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {kpis.slice(0, 5).map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 bg-[var(--bg-muted)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full bg-[var(--accent-primary)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{kpi.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'} {Math.abs(kpi.change)}%
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-[var(--text-primary)]">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
