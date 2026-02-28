'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import ScenarioBuilder from '@/components/ScenarioBuilder';
import RiskCorrelationMatrix from '@/components/RiskCorrelationMatrix';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import DataUploadButton from '@/components/DataUploadButton';
import { NotificationPanel, NotificationToast } from '@/components/NotificationPanel';
import { useAlertSystem, RealTimeAlert } from '@/hooks/useRealTimeData';
import { useAppState } from '@/state/useAppState';
import { strategyFrameworks, industryBenchmarks } from '@/lib/demoData';
import JourneyBanner from '@/components/JourneyBanner';

type TabId = 'scenario' | 'risk' | 'predictive' | 'executive' | 'frameworks' | 'benchmarks';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
  badge?: string;
}

const tabs: Tab[] = [
  {
    id: 'scenario',
    label: 'Scenario Builder',
    icon: '🎛️',
    description: 'Interactive what-if analysis',
    badge: 'New',
  },
  {
    id: 'risk',
    label: 'Risk Matrix',
    icon: '🔗',
    description: 'Correlation analysis',
  },
  {
    id: 'predictive',
    label: 'Predictive Analytics',
    icon: '📈',
    description: 'Data-driven forecasts',
    badge: 'Pro',
  },
  {
    id: 'executive',
    label: 'Executive Summary',
    icon: '📋',
    description: 'Board-ready reports',
  },
  {
    id: 'frameworks',
    label: 'Strategy Frameworks',
    icon: '🏗️',
    description: "Porter's, SWOT, 7S",
    badge: 'New',
  },
  {
    id: 'benchmarks',
    label: 'Industry Benchmarks',
    icon: '🎯',
    description: 'Competitive positioning',
  },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('scenario');
  const { currentUser } = useAppState();
  const {
    alerts,
    unreadCount,
    addAlert,
    acknowledgeAlert,
    acknowledgeAll,
    clearAlert,
    clearAll,
  } = useAlertSystem();

  const [toastAlert, setToastAlert] = useState<RealTimeAlert | null>(null);

  // Simulate periodic alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alertTypes = [
          {
            type: 'info' as const,
            title: 'Market Update',
            message: 'Q4 market projections have been updated with latest data',
          },
          {
            type: 'warning' as const,
            title: 'Risk Alert',
            message: 'Supply chain risk score increased by 5 points',
            metric: 'Supply Chain',
            threshold: 60,
            currentValue: 65,
          },
          {
            type: 'success' as const,
            title: 'Milestone Reached',
            message: 'Digital transformation initiative hit 80% completion',
          },
          {
            type: 'info' as const,
            title: 'AI Insight',
            message: 'New pattern detected in portfolio performance data',
          },
        ];
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert = addAlert(randomAlert);
        setToastAlert(newAlert);
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [addAlert]);

  const dismissToast = useCallback(() => {
    setToastAlert(null);
  }, []);

  return (
    <AppShell>
      <JourneyBanner
        currentModule="Analytics Hub"
        moduleHref="/analytics"
        phase={2}
        phaseName="Diagnose"
        phaseColor="#3b82f6"
        nextPhase={{ number: 3, name: 'Design', firstModule: 'Strategy Workflow', firstModuleHref: '/strategy' }}
      />
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Advanced Analytics Hub</h1>
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-teal-500/10 to-purple-500/20 text-teal-500 rounded-full border border-teal-500/15">
                Premium
              </span>
            </div>
            <p className="text-gray-400 mt-1">
              Sophisticated tools for strategic decision intelligence
            </p>
          </div>

          <div className="flex items-center gap-4">
            <DataUploadButton label="Upload Data" variant="compact" />

            {/* Live Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Live Data</span>
            </div>

            {/* Notifications */}
            <NotificationPanel
              alerts={alerts}
              unreadCount={unreadCount}
              onAcknowledge={acknowledgeAlert}
              onAcknowledgeAll={acknowledgeAll}
              onClear={clearAlert}
              onClearAll={clearAll}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500/10 to-purple-500/20 text-white border border-teal-500/15 shadow-lg shadow-teal-500/10'
                  : 'bg-navy-700/50 text-gray-400 border border-navy-600 hover:bg-navy-600/50 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                      activeTab === tab.id
                        ? 'bg-teal-500/15 text-teal-300'
                        : 'bg-navy-600 text-gray-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{tab.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'scenario' && <ScenarioBuilder />}
        {activeTab === 'risk' && <RiskCorrelationMatrix />}
        {activeTab === 'predictive' && <PredictiveAnalytics />}
        {activeTab === 'executive' && <ExecutiveSummary />}

        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            {strategyFrameworks.map(fw => (
              <div key={fw.id} className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-white">{fw.framework}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">{fw.category}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {fw.items.map(item => (
                    <div key={item.dimension} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">{item.dimension}</span>
                        <span className={`text-sm font-semibold ${item.score >= 75 ? 'text-teal-400' : item.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{item.score}/100</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-navy-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${item.score >= 75 ? 'bg-gradient-to-r from-teal-600 to-teal-400' : item.score >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-36 text-right hidden md:block group-hover:text-gray-300 transition-colors">{item.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div className="bg-[#0f1629]/80 backdrop-blur-sm border border-[#1e293b]/60 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Industry Benchmark Analysis</h3>
            <p className="text-sm text-gray-500 mb-6">How we compare against industry averages and top quartile performers</p>
            <div className="space-y-4">
              {industryBenchmarks.map(bm => {
                const maxVal = Math.max(bm.ourValue, bm.industryAvg, bm.topQuartile);
                const isTimeToValue = bm.metric === 'Time to Value';
                const weAreBetter = isTimeToValue ? bm.ourValue < bm.industryAvg : bm.ourValue > bm.industryAvg;
                return (
                  <div key={bm.metric} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 font-medium">{bm.metric}</span>
                        <span className="text-[10px] text-gray-600 px-1.5 py-0.5 bg-navy-700/50 rounded">{bm.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-500">Ind. Avg: <span className="text-gray-400">{bm.industryAvg}{bm.unit}</span></span>
                        <span className="text-gray-500">Top 25%: <span className="text-purple-400">{bm.topQuartile}{bm.unit}</span></span>
                      </div>
                    </div>
                    <div className="relative h-6 bg-navy-700/30 rounded-full overflow-hidden">
                      {/* Industry Avg marker */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-gray-500/50 z-10" style={{ left: `${(bm.industryAvg / (maxVal * 1.2)) * 100}%` }} />
                      {/* Top Quartile marker */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-purple-500/40 z-10" style={{ left: `${(bm.topQuartile / (maxVal * 1.2)) * 100}%` }} />
                      {/* Our bar */}
                      <div
                        className={`absolute top-0.5 bottom-0.5 rounded-full transition-all duration-700 ${weAreBetter ? 'bg-gradient-to-r from-teal-600 to-teal-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`}
                        style={{ width: `${(bm.ourValue / (maxVal * 1.2)) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center pl-3">
                        <span className={`text-xs font-bold ${weAreBetter ? 'text-white' : 'text-white'}`}>{bm.ourValue}{bm.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-[#1e293b]/60 flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500" /> Above Industry Average</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /> Below Industry Average</div>
              <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-gray-500" /> Industry Average</div>
              <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-purple-500" /> Top Quartile</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Models Running', value: '12', icon: '⚙️', color: 'text-teal-500' },
          { label: 'Data Points Analyzed', value: '1.24M', icon: '📊', color: 'text-purple-500' },
          { label: 'Forecasts Generated', value: '2,847', icon: '📈', color: 'text-blue-400' },
          { label: 'Frameworks Active', value: '3', icon: '🏗️', color: 'text-amber-400' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-navy-700/50 border border-navy-600 rounded-xl p-4 hover:border-teal-500/15 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toastAlert && (
        <NotificationToast alert={toastAlert} onDismiss={dismissToast} />
      )}
    </AppShell>
  );
}
