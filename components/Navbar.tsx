'use client';

import Link from 'next/link';
import { useAppState } from '@/state/useAppState';
import { personas, scenarios } from '@/lib/demoData';
import PersonaSwitcher from './PersonaSwitcher';

export default function Navbar() {
  const { currentScenario, setHelpOpen } = useAppState();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-800/95 backdrop-blur-sm border-b border-navy-600">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-purple-500 to-magenta-400 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-semibold text-white">Ambi-Sight</span>
            <span className="text-xs text-gray-400 block">Reloaded</span>
          </div>
        </Link>

        {/* Current Scenario Indicator */}
        {currentScenario && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-navy-700 rounded-lg border border-navy-600">
            <span className="text-xs text-gray-400">Active Scenario:</span>
            <span className="text-sm font-medium text-teal-400">{currentScenario.name}</span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Help Button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"
            title="Help"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-magenta-400 rounded-full"></span>
          </button>

          {/* Persona Switcher */}
          <PersonaSwitcher />
        </div>
      </div>
    </nav>
  );
}
