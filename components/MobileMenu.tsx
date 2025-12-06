'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Workspace', href: '/workspace' },
  { name: 'AI Advisor', href: '/advisor' },
  { name: 'Scenarios', href: '/scenarios' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Admin', href: '/admin', adminOnly: true },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { currentPersona } = useAppState();

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || currentPersona === 'admin'
  );

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-navy-800 border-l border-navy-600 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-semibold text-white">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-400'
                      : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-xs text-gray-500">
              <p>Ambi-Sight Reloaded</p>
              <p>v1.0.0 Demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
