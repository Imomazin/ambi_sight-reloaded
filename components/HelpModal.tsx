'use client';

import { useAppState } from '@/state/useAppState';

export default function HelpModal() {
  const { isHelpOpen, setHelpOpen } = useAppState();

  if (!isHelpOpen) return null;

  const demoSuggestions = [
    'Switch personas to see different insights and views',
    'Load a scenario from the Scenario Library to see KPIs change',
    'Ask the AI Advisor about risk clusters or early warning signals',
    'Explore the Portfolio Heatmap to identify critical initiatives',
    'Use Admin Studio to adjust the risk multiplier and see live changes',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setHelpOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-navy-600">
          <div>
            <h2 className="text-xl font-semibold text-white">Welcome to AmbiSight</h2>
            <p className="text-sm text-gray-400">Strategic Decision Intelligence Platform</p>
          </div>
          <button
            onClick={() => setHelpOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Product Story */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                🎯
              </span>
              The 60-Second Story
            </h3>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">AmbiSight Reloaded</strong> is an AI-powered strategic
              decision intelligence platform that helps organizations navigate complexity with
              confidence. It synthesizes strategic signals, identifies risk clusters, simulates
              scenarios, and provides real-time portfolio health insights—all through an intuitive,
              human-centered interface designed for executives and strategy teams.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                ✨
              </span>
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'AI Risk Advisor', desc: 'Natural language risk intelligence' },
                { name: 'Scenario Simulator', desc: 'What-if analysis for strategic bets' },
                { name: 'Portfolio Heatmap', desc: 'Visual initiative health tracking' },
                { name: 'Persona Views', desc: 'Role-specific dashboards and insights' },
              ].map((feature) => (
                <div
                  key={feature.name}
                  className="p-3 bg-navy-700 rounded-xl border border-navy-600"
                >
                  <span className="text-white font-medium">{feature.name}</span>
                  <span className="block text-xs text-gray-400 mt-1">{feature.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Suggestions */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                💡
              </span>
              Try This in Your Demo
            </h3>
            <ul className="space-y-2">
              {demoSuggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-navy-600 flex items-center justify-center text-xs text-gray-400 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-navy-600 bg-navy-800/50">
          <button
            onClick={() => setHelpOpen(false)}
            className="w-full btn-primary"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
