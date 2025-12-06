'use client';

import Link from 'next/link';
import AppShell from '@/components/AppShell';
import PageContainer from '@/components/PageContainer';
import MetricsGrid from '@/components/MetricsGrid';
import ActivityFeed from '@/components/ActivityFeed';
import { kpis, riskCategories } from '@/lib/demoData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const strategicMetrics = [
  { id: 'roi', label: 'ROI', value: '24.5%', change: 3.2, trend: 'up' as const, color: 'teal' as const },
  { id: 'risk', label: 'Risk Score', value: '34', change: -2.1, trend: 'down' as const, color: 'amber' as const },
  { id: 'momentum', label: 'Momentum', value: '78', change: 5.4, trend: 'up' as const, color: 'purple' as const },
  { id: 'alignment', label: 'Alignment', value: '92%', change: 1.8, trend: 'up' as const, color: 'lime' as const },
];

export default function DashboardPage() {
  const radarData = riskCategories.map((cat) => ({
    subject: cat.name.replace(' Risk', ''),
    score: cat.score,
    fullMark: 100,
  }));

  return (
    <AppShell>
      <PageContainer
        title="Dashboard"
        subtitle="Welcome back! Here's your strategic overview."
      >
        {/* Strategic Snapshot */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Strategic Snapshot</h2>
          <MetricsGrid metrics={strategicMetrics} columns={4} />
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
            <div className="bg-navy-700 rounded-xl border border-navy-600 p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/scenarios"
                  className="flex items-center gap-3 p-3 bg-navy-800 hover:bg-navy-600 border border-navy-600 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">New Scenario</p>
                    <p className="text-xs text-gray-400">Create a strategic simulation</p>
                  </div>
                </Link>

                <Link
                  href="/advisor"
                  className="flex items-center gap-3 p-3 bg-navy-800 hover:bg-navy-600 border border-navy-600 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">View Insights</p>
                    <p className="text-xs text-gray-400">Ask the AI Advisor</p>
                  </div>
                </Link>

                <Link
                  href="/portfolio"
                  className="flex items-center gap-3 p-3 bg-navy-800 hover:bg-navy-600 border border-navy-600 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Add Portfolio Item</p>
                    <p className="text-xs text-gray-400">Track new initiatives</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Org Health Radar */}
            <div className="bg-navy-700 rounded-xl border border-navy-600 p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Org Health Radar</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#353545" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#2DD4BF"
                      fill="#2DD4BF"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: KPI Summary */}
          <div className="lg:col-span-1">
            <div className="bg-navy-700 rounded-xl border border-navy-600 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Key Metrics</h3>
                <Link href="/workspace" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {kpis.slice(0, 5).map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 bg-navy-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-10 rounded-full bg-${kpi.color}-400`} />
                      <div>
                        <p className="text-sm font-medium text-white">{kpi.name}</p>
                        <p className="text-xs text-gray-400">
                          {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'} {Math.abs(kpi.change)}%
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-white">{kpi.value}</span>
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
