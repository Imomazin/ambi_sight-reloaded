'use client';

import AppShell from '@/components/AppShell';
import KpiCard from '@/components/KpiCard';
import ChartCard from '@/components/ChartCard';
import InsightFeed from '@/components/InsightFeed';
import CaseStudyCarousel from '@/components/CaseStudyCarousel';
import { useAppState } from '@/state/useAppState';
import { kpis, initiatives, resourceAllocationData, caseStudies } from '@/lib/demoData';

export default function WorkspacePage() {
  const { currentScenario, currentPersona } = useAppState();

  // Prepare chart data
  const agilityData = kpis[0].timeSeries.map((point, i) => ({
    date: point.date,
    agility: point.value,
    readiness: kpis[2].timeSeries[i]?.value || 0,
  }));

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Strategy Workspace</h1>
            <p className="text-gray-400 mt-1">
              {currentScenario
                ? `Viewing: ${currentScenario.name}`
                : 'Real-time strategic intelligence dashboard'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Range Selector */}
            <select className="bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-teal-400">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 12 months</option>
              <option>Year to date</option>
            </select>

            {currentScenario && (
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-lg border border-teal-500/30">
                Scenario Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Strategic Agility & Execution Readiness"
          type="line"
          data={agilityData}
          dataKeys={[
            { key: 'agility', color: '#2DD4BF', name: 'Strategic Agility' },
            { key: 'readiness', color: '#A3E635', name: 'Execution Readiness' },
          ]}
        />
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

      {/* Case Studies Carousel */}
      <div className="mb-8">
        <CaseStudyCarousel caseStudies={caseStudies} />
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Insight Feed */}
        <div className="lg:col-span-1">
          <InsightFeed />
        </div>

        {/* Initiatives Table */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Key Initiatives</h3>
            <button className="text-sm text-teal-400 hover:text-teal-300">View All →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-600">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Initiative
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Owner
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Risk Band
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Confidence
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map((init) => (
                  <tr
                    key={init.id}
                    className="border-b border-navy-600/50 hover:bg-navy-600/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm text-white font-medium">{init.name}</span>
                      <span className="block text-xs text-gray-400">{init.portfolio}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{init.owner}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          init.riskBand === 'Low'
                            ? 'bg-green-500/20 text-green-400'
                            : init.riskBand === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : init.riskBand === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-red-600/30 text-red-300'
                        }`}
                      >
                        {init.riskBand}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-navy-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              init.confidence >= 80
                                ? 'bg-green-400'
                                : init.confidence >= 60
                                ? 'bg-teal-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${init.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">{init.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
