'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import RoleSelector from '@/components/RoleSelector';
import ModuleEntryGrid from '@/components/ModuleEntryGrid';
import { useRole, Role } from '@/context/RoleContext';

export default function LandingPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();

  const handleRoleEntry = (role: Role) => {
    setActiveRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Colorful logo matching reference */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-[var(--text-primary)]">Ambi-Sight</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/admin"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Administrator Console
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 landing-hero-gradient relative overflow-hidden">
        {/* Colorful orb decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 orb-blue rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 right-20 w-64 h-64 orb-purple rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 left-1/3 w-48 h-48 orb-orange rounded-full blur-3xl opacity-30" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 animate-fade-in">
            Ambi-Sight <span className="text-gradient">Reloaded</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            AI-driven strategic decision intelligence that empowers leaders to navigate uncertainty, model scenarios, and make confident decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => handleRoleEntry('CSO')}
              className="btn-primary px-8 py-4 text-lg"
            >
              Enter Strategic Workspace
            </button>
            <Link
              href="/scenarios"
              className="btn-secondary px-8 py-4 text-lg"
            >
              View Demo Scenarios
            </Link>
          </div>
        </div>
      </section>

      {/* Mini Tour Timeline */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] text-center mb-12">
            How Ambi-Sight Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Capture Signals',
                description: 'Aggregate strategic data from across your organization into a unified intelligence layer.',
                color: 'icon-container-blue',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Model Scenarios',
                description: 'Build and simulate strategic alternatives with AI-powered what-if analysis.',
                color: 'icon-container-purple',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Decide with Confidence',
                description: 'Make data-driven decisions backed by comprehensive risk and opportunity insights.',
                color: 'icon-container-green',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${item.color} flex items-center justify-center shadow-lg animate-float`} style={{ animationDelay: `${index * 0.3}s` }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Tiles */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--text-primary)] text-center mb-4">
            Built for Strategic Leaders
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto">
            Ambi-Sight adapts to your role, surfacing the insights that matter most to you.
          </p>
          <RoleSelector />
        </div>
      </section>

      {/* Module Entry Points */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] text-center mb-4">
            Explore Core Modules
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-12">
            Jump directly into any capability area
          </p>
          <ModuleEntryGrid />
        </div>
      </section>

      {/* Entry Point Buttons */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Colorful background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 orb-green rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-80 h-80 orb-blue rounded-full blur-3xl opacity-30" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">
            Ready to Get Started?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => handleRoleEntry('CSO')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Sign in as Strategic User
            </button>
            <Link
              href="/admin"
              className="w-full sm:w-auto px-8 py-4 bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl font-medium text-lg hover:bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)] transition-all"
            >
              Administrator Console
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Ambi-Sight Reloaded v2.0</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Strategic Decision Intelligence Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
