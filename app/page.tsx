'use client';

import Link from 'next/link';
import { useAppState } from '@/state/useAppState';
import HelpModal from '@/components/HelpModal';
import UserSwitcherPanel from '@/components/UserSwitcherPanel';
import UserIndicator from '@/components/UserIndicator';
import LandingCaseStudies from '@/components/LandingCaseStudies';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import DynamicBackground from '@/components/DynamicBackground';
import { ConsultingPackagesShowcase, ConsultingCTA } from '@/components/ConsultingCTA';

const features = [
  {
    title: 'AI Risk Advisor',
    description:
      'Natural language interface to query risk intelligence, identify clusters, and get actionable recommendations.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    color: 'teal',
    href: '/advisor',
  },
  {
    title: 'Scenario Simulator',
    description:
      'Model strategic alternatives and see real-time impact on KPIs, risk exposure, and portfolio health.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    color: 'purple',
    href: '/scenarios',
  },
  {
    title: 'Portfolio Health Radar',
    description:
      'Visual heatmaps and matrices to quickly identify initiatives at risk and optimize resource allocation.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    color: 'amber',
    href: '/portfolio',
  },
];

const newFeatures = [
  {
    title: 'Strategy Tools Library',
    description: '50+ world-class strategy frameworks and tools for diagnosis, growth, risk, and execution.',
    href: '/tools',
    icon: '🧰',
    badge: 'New',
  },
  {
    title: 'Diagnostic Wizard',
    description: 'Guided problem-to-tools mapping. Answer questions and get personalized tool recommendations.',
    href: '/diagnosis',
    icon: '🔍',
    badge: 'New',
  },
  {
    title: 'Pricing & Plans',
    description: 'Flexible pricing for individuals and teams. Free tier available with premium upgrades.',
    href: '/pricing',
    icon: '💎',
    badge: null,
  },
];

export default function Home() {
  const { setHelpOpen } = useAppState();

  return (
    <DynamicBackground>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg)] backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-purple-500 to-magenta-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">AmbiSight</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-gray-400 hover:text-white transition-colors text-sm">
              Tools
            </Link>
            <Link href="/diagnosis" className="text-gray-400 hover:text-white transition-colors text-sm">
              Diagnosis
            </Link>
            <Link href="/advisor" className="text-gray-400 hover:text-white transition-colors text-sm">
              AI Advisor
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button
              onClick={() => setHelpOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Help
            </button>
            <UserIndicator />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative circles */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-64 h-64 rounded-full border-2 border-teal-400 animate-pulse"></div>
              <div className="absolute w-48 h-48 rounded-full border-2 border-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-32 h-32 rounded-full border-2 border-magenta-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Logo mark */}
            <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 via-purple-500 to-magenta-400 flex items-center justify-center shadow-2xl glow-purple">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">AmbiSight</span>
            <span className="text-white"> Reloaded</span>
          </h1>

          <p className="text-xl text-gray-300 mb-4">
            A fresh new build for the future of
          </p>
          <p className="text-2xl font-medium text-teal-400 mb-8">
            AI-Driven Strategic Decision Intelligence
          </p>

          <p className="text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Navigate organizational complexity with confidence. Synthesize strategic signals,
            identify risk clusters, simulate scenarios, and gain real-time portfolio insights—all
            through an intuitive, human-centered platform designed for modern strategy teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workspace" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Open Strategy Workspace
            </Link>
            <Link href="/diagnosis" className="btn-secondary inline-flex items-center gap-2">
              <span>🔍</span>
              Start Diagnostic Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-12 px-6 bg-gradient-to-b from-transparent to-navy-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {newFeatures.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="relative p-5 rounded-xl bg-navy-700/50 border border-navy-600 hover:border-teal-500/50 hover:bg-navy-700 transition-all group"
              >
                {feature.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30">
                    {feature.badge}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-navy-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Intelligence at Your Fingertips
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Three powerful capabilities working together to transform how you approach strategic
            decision-making.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="card card-hover group"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center text-${feature.color}-400 mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-teal-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <LandingCaseStudies />

      {/* Consulting Section */}
      <section className="py-20 px-6 bg-navy-800/50 border-t border-navy-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need More Than Software?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our strategy consultants can help you implement frameworks, facilitate workshops, and drive transformation. Choose the engagement that fits your needs.
            </p>
          </div>
          <ConsultingPackagesShowcase />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50+', label: 'Strategy Tools' },
            { value: '12', label: 'Case Studies' },
            { value: '3', label: 'Pricing Tiers' },
            { value: 'Real-time', label: 'AI Insights' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ConsultingCTA variant="banner" context="Ready to transform your strategic decision-making?" />
        </div>
      </section>

      {/* User Switcher Panel */}
      <UserSwitcherPanel />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-navy-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/workspace" className="text-gray-400 hover:text-white">Workspace</Link></li>
                <li><Link href="/tools" className="text-gray-400 hover:text-white">Tools Library</Link></li>
                <li><Link href="/diagnosis" className="text-gray-400 hover:text-white">Diagnostic Wizard</Link></li>
                <li><Link href="/advisor" className="text-gray-400 hover:text-white">AI Advisor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/scenarios" className="text-gray-400 hover:text-white">Scenario Planning</Link></li>
                <li><Link href="/portfolio" className="text-gray-400 hover:text-white">Portfolio Management</Link></li>
                <li><Link href="/tools" className="text-gray-400 hover:text-white">Risk Management</Link></li>
                <li><Link href="/tools" className="text-gray-400 hover:text-white">Digital Strategy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><span className="text-gray-500">Documentation</span></li>
                <li><span className="text-gray-500">API Reference</span></li>
                <li><span className="text-gray-500">Blog</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-gray-500">About Us</span></li>
                <li><span className="text-gray-500">Contact</span></li>
                <li><span className="text-gray-500">Careers</span></li>
                <li><span className="text-gray-500">Privacy Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-navy-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>AmbiSight Reloaded</span>
              <span>•</span>
              <span>Demo Platform v1.0</span>
            </div>
            <div className="text-gray-500 text-sm">
              Built for strategic decision intelligence
            </div>
          </div>
        </div>
      </footer>

      <HelpModal />
    </DynamicBackground>
  );
}
