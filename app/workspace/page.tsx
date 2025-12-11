'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedKPICard from '@/components/EnhancedKPICard';
import PortfolioHealthWidget from '@/components/PortfolioHealthWidget';
import QuickActionsPanel from '@/components/QuickActionsPanel';
import ActivityTimeline from '@/components/ActivityTimeline';
import ChartCard from '@/components/ChartCard';
import CaseStudyCarousel from '@/components/CaseStudyCarousel';
import LockedFeature, { PlanBadge } from '@/components/LockedFeature';
import { UpgradeBanner } from '@/components/UpgradeModal';
import { ConsultingCTA } from '@/components/ConsultingCTA';
import ToolView from '@/components/ToolView';
import DataUploadButton from '@/components/DataUploadButton';
import { useAppState } from '@/state/useAppState';
import { useRealTimeKPIs } from '@/hooks/useRealTimeData';
import { kpis, initiatives, resourceAllocationData, caseStudies } from '@/lib/demoData';
import { hasFeatureAccess, roleDisplayNames } from '@/lib/users';

// Generate sparkline data for KPIs
function generateSparklineData(baseValue: number, volatility: number = 5): number[] {
  const data: number[] = [];
  let value = baseValue - volatility * 3;
  for (let i = 0; i < 12; i++) {
    value += (Math.random() - 0.4) * volatility;
    value = Math.max(0, Math.min(100, value));
    data.push(value);
  }
  // Ensure the last value trends toward the base value
  data.push(baseValue);
  return data;
}

export default function WorkspacePage() {
  const { currentScenario, currentPersona, currentUser, activeToolId, setActiveToolId } = useAppState();
  const { kpis: realTimeKpis } = useRealTimeKPIs();
  const userPlan = currentUser?.plan || 'Free';

  // Handle closing the tool view
  const handleCloseTool = () => {
    setActiveToolId(null);
  };

  // If there's an active tool, show the ToolView instead of dashboard
  if (activeToolId) {
    return (
      <AppShell>
        <ToolView toolId={activeToolId} onClose={handleCloseTool} />
      </AppShell>
    );
  }

  // Enhanced KPI data with sparklines
  const enhancedKpis = useMemo(() => [
    {
      title: 'Portfolio Health',
      value: realTimeKpis.portfolioHealth,
      change: realTimeKpis.portfolioHealth - 80,
      trend: realTimeKpis.portfolioHealth >= 80 ? 'up' as const : 'down' as const,
      sparklineData: generateSparklineData(realTimeKpis.portfolioHealth, 3),
      icon: '💼',
      color: 'teal' as const,
      subtitle: '12 active initiatives',
      target: 85,
      format: 'percentage' as const,
    },
    {
      title: 'Strategic Agility',
      value: realTimeKpis.strategicAgility,
      change: realTimeKpis.strategicAgility - 72,
      trend: realTimeKpis.strategicAgility >= 72 ? 'up' as const : 'down' as const,
      sparklineData: generateSparklineData(realTimeKpis.strategicAgility, 4),
      icon: '⚡',
      color: 'purple' as const,
      subtitle: 'Response capability',
      target: 80,
      format: 'percentage' as const,
    },
    {
      title: 'Risk Exposure',
      value: realTimeKpis.riskExposure,
      change: 45 - realTimeKpis.riskExposure,
      trend: realTimeKpis.riskExposure <= 45 ? 'up' as const : 'down' as const,
      sparklineData: generateSparklineData(realTimeKpis.riskExposure, 5),
      icon: '🛡️',
      color: realTimeKpis.riskExposure > 50 ? 'red' as const : 'amber' as const,
      subtitle: 'Composite score',
      target: 40,
      format: 'percentage' as const,
    },
    {
      title: 'ROI Trajectory',
      value: realTimeKpis.roiTrajectory,
      change: realTimeKpis.roiTrajectory - 18,
      trend: realTimeKpis.roiTrajectory >= 18 ? 'up' as const : 'down' as const,
      sparklineData: generateSparklineData(realTimeKpis.roiTrajectory, 2),
      icon: '📈',
      color: 'green' as const,
      subtitle: 'Projected return',
      target: 20,
      format: 'percentage' as const,
    },
  ], [realTimeKpis]);

  // Prepare chart data
  const agilityData = kpis[0].timeSeries.map((point, i) => ({
    date: point.date,
    agility: point.value,
    readiness: kpis[2].timeSeries[i]?.value || 0,
  }));

  return (
    <AppShell>
      {/* Dashboard Header with Hero Metrics */}
      <DashboardHeader />

      {/* Enhanced KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {enhancedKpis.map((kpi, index) => (
          <div key={kpi.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <EnhancedKPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions - Left */}
        <div className="lg:col-span-2">
          <QuickActionsPanel />
        </div>

        {/* Activity Timeline - Right */}
        <div className="lg:col-span-1">
          <ActivityTimeline />
        </div>
      </div>

      {/* Portfolio & Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Health Widget */}
        <div className="lg:col-span-1">
          <PortfolioHealthWidget />
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 grid gap-6">
          <ChartCard
            title="Strategic Agility & Execution Readiness"
            type="line"
            data={agilityData}
            dataKeys={[
              { key: 'agility', color: '#2DD4BF', name: 'Strategic Agility' },
              { key: 'readiness', color: '#A3E635', name: 'Execution Readiness' },
            ]}
          />
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="mb-8">
        <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Key Initiatives</h3>
                <p className="text-xs text-gray-400">{initiatives.length} active projects</p>
              </div>
            </div>
            <Link href="/portfolio" className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors">
              View Portfolio
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-600">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Initiative
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Risk Band
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {initiatives.slice(0, 5).map((init, index) => (
                  <tr
                    key={init.id}
                    className="group border-b border-navy-600/50 hover:bg-navy-700/30 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          init.status === 'On Track' ? 'bg-green-400' :
                          init.status === 'At Risk' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <span className="text-sm text-white font-medium group-hover:text-teal-400 transition-colors">{init.name}</span>
                          <span className="block text-xs text-gray-500">{init.portfolio}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-medium">
                          {init.owner.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-300">{init.owner}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                          init.riskBand === 'Low'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : init.riskBand === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : init.riskBand === 'High'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-red-600/30 text-red-300 border-red-500/30'
                        }`}
                      >
                        {init.riskBand}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-navy-600/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              init.confidence >= 80
                                ? 'bg-gradient-to-r from-green-500 to-green-400'
                                : init.confidence >= 60
                                ? 'bg-gradient-to-r from-teal-500 to-teal-400'
                                : 'bg-gradient-to-r from-amber-500 to-amber-400'
                            }`}
                            style={{ width: `${init.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300 w-8">{init.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-medium ${
                          init.status === 'On Track'
                            ? 'text-green-400'
                            : init.status === 'At Risk'
                            ? 'text-amber-400'
                            : init.status === 'Delayed'
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {init.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-navy-600/50 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show more button */}
          <div className="mt-4 pt-4 border-t border-navy-600/50 flex justify-center">
            <Link
              href="/portfolio"
              className="flex items-center gap-2 px-4 py-2 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg transition-colors"
            >
              View All {initiatives.length} Initiatives
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Case Studies Carousel */}
      <div className="mb-8">
        <CaseStudyCarousel caseStudies={caseStudies} />
      </div>

      {/* Resource Allocation Chart */}
      <div className="mb-8">
        <ChartCard
          title="Resource Allocation by Portfolio"
          type="bar"
          data={resourceAllocationData}
          dataKeys={[
            { key: 'allocated', color: '#2DD4BF', name: 'Allocated ($K)' },
            { key: 'utilized', color: '#A855F7', name: 'Utilized ($K)' },
          ]}
        />
      </div>

      {/* Plan-based Features Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Advanced Analytics - Pro Feature */}
        <LockedFeature
          requiredPlan="Pro"
          currentPlan={userPlan}
          featureName="Advanced Analytics"
        >
          <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6 h-48">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Advanced Analytics</h3>
            </div>
            <p className="text-sm text-gray-400">Deep-dive analytics with trend analysis, predictive indicators, and customizable dashboards.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 text-xs bg-navy-600/50 rounded-lg text-gray-400">Trend Analysis</span>
              <span className="px-2 py-1 text-xs bg-navy-600/50 rounded-lg text-gray-400">Predictive</span>
            </div>
          </div>
        </LockedFeature>

        {/* Scenario Comparison - Pro Feature */}
        <LockedFeature
          requiredPlan="Pro"
          currentPlan={userPlan}
          featureName="Scenario Comparison"
        >
          <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6 h-48">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Scenario Comparison</h3>
            </div>
            <p className="text-sm text-gray-400">Compare multiple scenarios side-by-side with impact analysis and recommendation engine.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 text-xs bg-navy-600/50 rounded-lg text-gray-400">Side-by-Side</span>
              <span className="px-2 py-1 text-xs bg-navy-600/50 rounded-lg text-gray-400">Impact Matrix</span>
            </div>
          </div>
        </LockedFeature>

        {/* Executive Report - Enterprise Feature */}
        <LockedFeature
          requiredPlan="Enterprise"
          currentPlan={userPlan}
          featureName="Executive Report"
        >
          <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6 h-48">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Executive Report</h3>
            </div>
            <p className="text-sm text-gray-400">Board-ready executive summaries with automated insights and strategic recommendations.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 text-xs bg-navy-600/50 rounded-lg text-gray-400">Board Pack</span>
              <span className="px-2 py-1 text-xs bg-navy-600/50 rounded-lg text-gray-400">Auto-Generate</span>
            </div>
          </div>
        </LockedFeature>
      </div>

      {/* Upgrade Banner for Free users */}
      {userPlan === 'Free' && (
        <div className="mb-8">
          <UpgradeBanner
            currentPlan={userPlan}
            feature="unlimited strategy tools, scenario planning, and team collaboration"
          />
        </div>
      )}

      {/* Consulting CTA */}
      <ConsultingCTA
        variant="banner"
        context="Need help implementing your strategy?"
      />
    </AppShell>
  );
}
