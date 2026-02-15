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

type TabId = 'scenario' | 'risk' | 'predictive' | 'executive';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
  badge?: string;
}

const tabIcons: Record<TabId, React.ReactNode> = {
  scenario: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  risk: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"/></svg>,
  predictive: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>,
  executive: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>,
};

const tabs: Tab[] = [
  {
    id: 'scenario',
    label: 'Scenario Builder',
    icon: 'scenario',
    description: 'Interactive what-if analysis',
    badge: 'New',
  },
  {
    id: 'risk',
    label: 'Risk Matrix',
    icon: 'risk',
    description: 'Correlation analysis',
  },
  {
    id: 'predictive',
    label: 'Predictive Analytics',
    icon: 'predictive',
    description: 'Data-driven forecasts',
    badge: 'Pro',
  },
  {
    id: 'executive',
    label: 'Executive Summary',
    icon: 'executive',
    description: 'Board-ready reports',
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
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Advanced Analytics Hub</h1>
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
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
                  ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                  : 'bg-navy-700/50 text-gray-400 border border-navy-600 hover:bg-navy-600/50 hover:text-white'
              }`}
            >
              <span className="text-lg">{tabIcons[tab.id]}</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                      activeTab === tab.id
                        ? 'bg-purple-500/30 text-purple-300'
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
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Models Running', value: '4', color: 'text-purple-400', iconPath: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
          { label: 'Data Points Analyzed', value: '12.4K', color: 'text-purple-400', iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
          { label: 'Forecasts Generated', value: '847', color: 'text-purple-400', iconPath: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' },
          { label: 'Reports This Month', value: '23', color: 'text-amber-400', iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-navy-700/50 border border-navy-600 rounded-xl p-4 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={stat.color}><path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath}/></svg>
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
