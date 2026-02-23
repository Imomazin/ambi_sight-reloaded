'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';
import UserIndicator from './UserIndicator';
import ThemeSwitcher from './ThemeSwitcher';

const navLinks = [
  { href: '/workspace', label: 'Workspace' },
  { href: '/tools', label: 'Tools' },
  { href: '/diagnosis', label: 'Diagnosis' },
  { href: '/advisor', label: 'Advisor' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentScenario, setHelpOpen } = useAppState();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg)] backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
            <svg className="text-white" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">Lumina</span>
            <span className="text-[15px] font-semibold text-teal-500">S</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-500'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Active Scenario */}
        {currentScenario && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] rounded-md border border-[var(--border-color)]">
            <span className="text-[11px] text-[var(--text-muted)]">Scenario:</span>
            <span className="text-[12px] font-medium text-teal-500">{currentScenario.name}</span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeSwitcher />

          <button
            onClick={() => setHelpOpen(true)}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-md transition-colors"
            title="Help"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <UserIndicator />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-0.5 px-4 pb-2 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-teal-500/10 text-teal-500'
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
