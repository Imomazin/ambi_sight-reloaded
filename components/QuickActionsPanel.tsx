'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  color: string;
  badge?: string;
}

export default function QuickActionsPanel() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'scenario',
      label: 'Run Scenario',
      description: 'Model what-if analysis',
      icon: '🎛️',
      href: '/analytics',
      color: 'from-teal-500 to-cyan-500',
      badge: 'Popular',
    },
    {
      id: 'risk',
      label: 'Risk Assessment',
      description: 'Analyze portfolio risks',
      icon: '🛡️',
      href: '/analytics',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'advisor',
      label: 'Ask AI Advisor',
      description: 'Get strategic insights',
      icon: '🤖',
      href: '/advisor',
      color: 'from-purple-500 to-pink-500',
      badge: 'AI',
    },
    {
      id: 'report',
      label: 'Generate Report',
      description: 'Create executive summary',
      icon: '📋',
      href: '/analytics',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'portfolio',
      label: 'View Portfolio',
      description: 'Initiative heatmap',
      icon: '📊',
      href: '/portfolio',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      id: 'diagnose',
      label: 'Run Diagnostics',
      description: 'Strategy health check',
      icon: '🔍',
      href: '/diagnosis',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <p className="text-xs text-gray-400">Jump to common tasks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const ActionWrapper = action.href ? Link : 'button';
          const wrapperProps = action.href ? { href: action.href } : { onClick: action.onClick };

          return (
            <ActionWrapper
              key={action.id}
              {...(wrapperProps as any)}
              className="group relative overflow-hidden rounded-xl bg-navy-700/50 border border-navy-600/50 p-4 hover:border-transparent transition-all duration-300"
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Glow effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </span>
                  {action.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full bg-gradient-to-r ${action.color} text-white`}>
                      {action.badge}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors mb-1">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  {action.description}
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-navy-600/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </ActionWrapper>
          );
        })}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-4 pt-4 border-t border-navy-600/50 flex items-center justify-between text-xs text-gray-500">
        <span>Press <kbd className="px-1.5 py-0.5 bg-navy-700 rounded text-gray-400">⌘K</kbd> for command palette</span>
        <span className="text-teal-400 hover:text-teal-300 cursor-pointer">View all actions →</span>
      </div>
    </div>
  );
}
