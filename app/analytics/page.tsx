'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import ScenarioBuilder from '@/components/ScenarioBuilder';
import RiskCorrelationMatrix from '@/components/RiskCorrelationMatrix';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import ExecutiveSummary from '@/components/ExecutiveSummary';
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
    icon: '🔮',
    description: 'AI-powered forecasts',
    badge: 'AI',
  },
  {
    id: 'executive',
    label: 'Executive Summary',
    icon: '📋',
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
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-400 rounded-full border border-teal-500/30">
                Premium
              </span>
            </div>
            <p className="text-gray-400 mt-1">
              Sophisticated tools for strategic decision intelligence
            </p>
          </div>

          <div className="flex items-center gap-4">
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
                  ? 'bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-white border border-teal-500/30 shadow-lg shadow-teal-500/10'
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
                        ? 'bg-teal-500/30 text-teal-300'
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
          { label: 'Models Running', value: '4', icon: '🤖', color: 'text-teal-400' },
          { label: 'Data Points Analyzed', value: '12.4K', icon: '📊', color: 'text-purple-400' },
          { label: 'Predictions Generated', value: '847', icon: '🔮', color: 'text-blue-400' },
          { label: 'Reports This Month', value: '23', icon: '📋', color: 'text-amber-400' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-navy-700/50 border border-navy-600 rounded-xl p-4 hover:border-teal-500/30 transition-colors"
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
