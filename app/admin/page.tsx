'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import UserManagement from '@/components/UserManagement';
import { useAppState } from '@/state/useAppState';
import { personas, scenarios } from '@/lib/demoData';

const onboardingSteps = [
  { id: 'personas', label: 'Configure Personas', description: 'Set up demo user profiles' },
  { id: 'scenarios', label: 'Load Scenarios', description: 'Import scenario data packs' },
  { id: 'kpis', label: 'Calibrate KPIs', description: 'Adjust baseline metrics' },
  { id: 'advisor', label: 'Train AI Advisor', description: 'Configure response patterns' },
  { id: 'branding', label: 'Apply Branding', description: 'Customize look and feel' },
];

export default function AdminPage() {
  const {
    riskMultiplier,
    setRiskMultiplier,
    noiseLevel,
    setNoiseLevel,
    onboardingCompleted,
    completeOnboardingStep,
    resetOnboarding,
    currentPersona,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'personas' | 'scenarios' | 'data' | 'onboarding' | 'users'>(
    'onboarding'
  );

  // Redirect non-admin users
  if (currentPersona !== 'admin') {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Admin Access Required</h2>
            <p className="text-gray-400">
              Switch to the Admin persona to access this section.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Studio</h1>
        <p className="text-gray-400 mt-1">
          Configure demo settings, manage personas, and control platform behavior
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'onboarding', label: 'Onboarding', icon: '📋' },
          { id: 'users', label: 'Users', icon: '👥' },
          { id: 'personas', label: 'Personas', icon: '🎭' },
          { id: 'scenarios', label: 'Scenarios', icon: '📊' },
          { id: 'data', label: 'Data Controls', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-navy-700 text-gray-400 border border-navy-600 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {activeTab === 'onboarding' && (
          <>
            {/* Onboarding Checklist */}
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Setup Checklist</h2>
                <span className="text-sm text-gray-400">
                  {onboardingCompleted.length} of {onboardingSteps.length} complete
                </span>
              </div>

              <div className="space-y-3">
                {onboardingSteps.map((step) => {
                  const isCompleted = onboardingCompleted.includes(step.id);
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        isCompleted
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-navy-800 border-navy-600 hover:border-navy-500'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCompleted ? 'bg-green-500/20' : 'bg-navy-600'
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-5 h-5 text-green-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm text-gray-400">
                              {onboardingSteps.indexOf(step) + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              isCompleted ? 'text-green-400' : 'text-white'
                            }`}
                          >
                            {step.label}
                          </span>
                          <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => completeOnboardingStep(step.id)}
                        disabled={isCompleted}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          isCompleted
                            ? 'bg-green-500/10 text-green-400 cursor-default'
                            : 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30'
                        }`}
                      >
                        {isCompleted ? 'Done' : 'Mark Complete'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={resetOnboarding}
                className="mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Reset all progress
              </button>
            </div>

            {/* Progress Summary */}
            <div className="card h-fit">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Setup Progress</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#252535"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#2DD4BF"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${
                      (onboardingCompleted.length / onboardingSteps.length) * 352
                    } 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                  {Math.round((onboardingCompleted.length / onboardingSteps.length) * 100)}%
                </span>
              </div>
              <p className="text-center text-sm text-gray-400">
                {onboardingCompleted.length === onboardingSteps.length
                  ? 'All set! Your demo is ready.'
                  : `${onboardingSteps.length - onboardingCompleted.length} steps remaining`}
              </p>
            </div>
          </>
        )}

        {activeTab === 'personas' && (
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-6">Demo Personas</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {personas.map((persona) => (
                  <div
                    key={persona.id}
                    className="p-4 bg-navy-800 rounded-xl border border-navy-600"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-medium">
                        {persona.avatar}
                      </div>
                      <div>
                        <span className="block text-white font-medium">{persona.name}</span>
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
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-6">Scenario Packs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="p-4 bg-navy-800 rounded-xl border border-navy-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{scenario.name}</span>
                      <span className="text-xs text-green-400">Loaded</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{scenario.description}</p>
                    <div className="flex gap-2 mt-3">
                      {scenario.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-navy-700 text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <>
            <div className="lg:col-span-2 card">
              <h2 className="text-lg font-semibold text-white mb-6">Data Sliders</h2>
              <p className="text-sm text-gray-400 mb-6">
                Adjust these global multipliers to see real-time changes across the dashboard.
                Changes persist during your session.
              </p>

              <div className="space-y-8">
                {/* Risk Multiplier */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-white">Risk Multiplier</label>
                    <span className="text-sm text-teal-400 font-mono">
                      {riskMultiplier.toFixed(1)}x
                    </span>
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
            </div>

            <div className="card h-fit">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Effect Preview</h3>
              <div className="space-y-4">
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-400">Risk KPIs</span>
                  <div className="text-lg font-bold text-white mt-1">
                    {riskMultiplier > 1 ? '+' : ''}
                    {Math.round((riskMultiplier - 1) * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-navy-800 rounded-lg">
                  <span className="text-xs text-gray-400">Data Variance</span>
                  <div className="text-lg font-bold text-white mt-1">±{noiseLevel}%</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Visit the Workspace to see these changes reflected in live KPIs.
              </p>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="lg:col-span-3">
            <UserManagement />
          </div>
        )}
      </div>
    </AppShell>
  );
}
