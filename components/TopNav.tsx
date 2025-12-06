'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';
import { personas } from '@/lib/demoData';
import { useRole } from '@/context/RoleContext';
import ThemeToggle from './ThemeToggle';

const mobileNavItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Workspace', href: '/workspace' },
  { name: 'Scenarios', href: '/scenarios' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Advisor', href: '/advisor' },
  { name: 'Administrator', href: '/admin' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { currentPersona, setPersona, setHelpOpen, currentScenario } = useAppState();
  const { roleInfo } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentPersonaData = personas.find((p) => p.id === currentPersona);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-[var(--text-primary)]">Ambi-Sight</span>
                <span className="text-xs text-[var(--text-muted)] block">Strategic Intelligence</span>
              </div>
            </Link>
          </div>

          {/* Center: Active Scenario or Role Badge */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[var(--bg-muted)] rounded-lg border border-[var(--border-subtle)]">
            {currentScenario ? (
              <>
                <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="text-xs text-[var(--text-muted)]">Active:</span>
                <span className="text-sm font-medium text-[var(--accent-primary)]">{currentScenario.name}</span>
              </>
            ) : (
              <>
                <span className="text-lg">{roleInfo.icon}</span>
                <span className="text-sm font-medium text-[var(--text-secondary)]">{roleInfo.shortTitle}</span>
              </>
            )}
          </div>

          {/* Right: Actions + Theme Toggle + Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Help Button */}
            <button
              onClick={() => setHelpOpen(true)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
              title="Help"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-magenta-400 rounded-full" />
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--bg-muted)] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {currentPersonaData?.avatar || 'U'}
                </div>
                <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
                    {/* Current User */}
                    <div className="p-4 border-b border-[var(--border-subtle)]">
                      <p className="font-medium text-[var(--text-primary)]">{currentPersonaData?.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">{currentPersonaData?.role}</p>
                    </div>

                    {/* Switch Persona */}
                    <div className="p-2">
                      <p className="px-2 py-1 text-xs font-medium text-[var(--text-muted)] uppercase">Switch Persona</p>
                      {personas.map((persona) => (
                        <button
                          key={persona.id}
                          onClick={() => {
                            setPersona(persona.id);
                            setProfileOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            currentPersona === persona.id
                              ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentPersona === persona.id
                              ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                              : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]'
                          }`}>
                            {persona.avatar}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">{persona.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{persona.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="p-2 border-t border-[var(--border-subtle)]">
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-in */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 bottom-0 w-64 bg-[var(--bg-primary)] border-r border-[var(--border-subtle)] z-50 md:hidden animate-slide-in">
            <nav className="p-4 space-y-2">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200
                      ${isActive
                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-l-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
