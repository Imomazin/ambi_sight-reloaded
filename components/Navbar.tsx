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
];

export default function Navbar() {
  const pathname = usePathname();
  const { setHelpOpen } = useAppState();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg)] backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#nav-lg)" strokeWidth="2"/>
            <path d="M10 22V10h4v8h4V10h4v12" stroke="url(#nav-lg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="nav-lg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#A855F7"/><stop offset="1" stopColor="#EC4899"/></linearGradient></defs>
          </svg>
          <span className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">Lumina S</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <ThemeSwitcher />
          <button
            onClick={() => setHelpOpen(true)}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
            title="Help"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </button>
          <UserIndicator />
        </div>
      </div>
    </nav>
  );
}
