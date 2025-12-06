'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import PageContainer from '@/components/PageContainer';
import { useAppState } from '@/state/useAppState';
import { personas, scenarios } from '@/lib/demoData';

export default function AdminPage() {
  const {
    riskMultiplier,
    setRiskMultiplier,
    noiseLevel,
    setNoiseLevel,
    currentPersona,
  } = useAppState();

  // Local toggle states (no backend)
  const [experimentsEnabled, setExperimentsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Redirect non-admin users
  if (currentPersona !== 'admin') {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Admin Access Required</h2>
            <p className="text-gray-400">Switch to the Admin persona to access this section.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const Toggle = ({ enabled, onChange, label, description }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between p-4 bg-navy-800 rounded-lg">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-teal-500' : 'bg-navy-600'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <AppShell>
      <PageContainer
        title="Admin"
        subtitle="Configure platform settings and preferences"
      >
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings Toggles */}
          <div className="bg-navy-700 rounded-xl border border-navy-600 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
            <div className="space-y-4">
              <Toggle
                enabled={experimentsEnabled}
                onChange={setExperimentsEnabled}
                label="Enable Experiments"
                description="Access experimental features (no backend)"
              />
              <Toggle
                enabled={darkMode}
                onChange={setDarkMode}
                label="Dark Mode"
                description="Toggle dark theme (default on)"
              />
              <Toggle
                enabled={notifications}
                onChange={setNotifications}
                label="Notifications"
                description="Enable in-app notifications"
              />
              <Toggle
                enabled={autoRefresh}
                onChange={setAutoRefresh}
                label="Auto Refresh"
                description="Automatically refresh data every 30s"
              />
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <p className="text-sm text-amber-400/80 mt-1">
                Settings are stored locally and don't persist between sessions.
              </p>
            </div>
          </div>

          {/* Data Controls */}
          <div className="bg-navy-700 rounded-xl border border-navy-600 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Data Controls</h2>
            <p className="text-sm text-gray-400 mb-6">
              Adjust these global multipliers to see real-time changes across the dashboard.
            </p>

            <div className="space-y-8">
              {/* Risk Multiplier */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white">Risk Multiplier</label>
                  <span className="text-sm text-teal-400 font-mono">{riskMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={riskMultiplier}
                  onChange={(e) => setRiskMultiplier(parseFloat(e.target.value))}
                  className="w-full h-2 bg-navy-600 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x (Low)</span>
                  <span>1.0x (Normal)</span>
                  <span>2.0x (High)</span>
                </div>
              </div>

              {/* Noise Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white">Data Noise Level</label>
                  <span className="text-sm text-teal-400 font-mono">{noiseLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-navy-600 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0% (Stable)</span>
                  <span>15%</span>
                  <span>30% (Volatile)</span>
                </div>
              </div>
            </div>

            {/* Effect Preview */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-navy-800 rounded-lg">
                <span className="text-xs text-gray-400">Risk KPIs</span>
                <div className="text-lg font-bold text-white mt-1">
                  {riskMultiplier > 1 ? '+' : ''}{Math.round((riskMultiplier - 1) * 100)}%
                </div>
              </div>
              <div className="p-3 bg-navy-800 rounded-lg">
                <span className="text-xs text-gray-400">Data Variance</span>
                <div className="text-lg font-bold text-white mt-1">±{noiseLevel}%</div>
              </div>
            </div>
          </div>

          {/* Personas Overview */}
          <div className="bg-navy-700 rounded-xl border border-navy-600 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Demo Personas</h2>
            <div className="grid grid-cols-2 gap-4">
              {personas.map((persona) => (
                <div key={persona.id} className="p-4 bg-navy-800 rounded-xl border border-navy-600">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                      {persona.avatar}
                    </div>
                    <div>
                      <span className="block text-sm text-white font-medium">{persona.name}</span>
                      <span className="text-xs text-gray-400">{persona.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenarios Overview */}
          <div className="bg-navy-700 rounded-xl border border-navy-600 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Loaded Scenarios</h2>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="p-4 bg-navy-800 rounded-lg border border-navy-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{scenario.name}</span>
                    <span className="text-xs text-green-400">Loaded</span>
                  </div>
                  <div className="flex gap-2">
                    {scenario.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-navy-700 text-gray-300 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
