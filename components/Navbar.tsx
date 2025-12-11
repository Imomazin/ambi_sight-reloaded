'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';
import UserIndicator from './UserIndicator';
import ThemeSwitcher from './ThemeSwitcher';

const navLinks = [
  { href: '/workspace', label: 'Workspace', icon: '📊' },
  { href: '/tools', label: 'Tools', icon: '⚙️' },
  { href: '/diagnosis', label: 'Diagnosis', icon: '🔍' },
  { href: '/advisor', label: 'Advisor', icon: '💬' },
  { href: '/pricing', label: 'Pricing', icon: '💳' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentScenario, setHelpOpen } = useAppState();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg)] backdrop-blur-sm border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-purple-500 to-magenta-400 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-semibold text-[var(--text-primary)]">Lumina S</span>
            <span className="text-xs text-[var(--text-muted)] block">Strategic Intelligence</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Current Scenario Indicator */}
        {currentScenario && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-muted)]">Active Scenario:</span>
            <span className="text-sm font-medium text-teal-400">{currentScenario.name}</span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Help Button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
            title="Help"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* User Indicator */}
          <UserIndicator />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card)]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
