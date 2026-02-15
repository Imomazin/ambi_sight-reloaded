'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppState } from '@/state/useAppState';
import { planColors, roleShortNames } from '@/lib/users';
import UserSwitcherModal from './UserSwitcherModal';

export default function UserIndicator() {
  const { currentUser, logout, setUserSwitcherOpen, isUserSwitcherOpen } = useAppState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleSwitchUser = () => {
    setIsDropdownOpen(false);
    setUserSwitcherOpen(true);
  };

  if (!currentUser) {
    return (
      <Link
        href="/signin"
        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-[13px] font-medium"
      >
        Sign In
      </Link>
    );
  }

  const colors = planColors[currentUser.plan];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
            {currentUser.avatar}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-[13px] font-medium text-[var(--text-primary)] block leading-tight">{currentUser.name}</span>
            <span className="text-[11px] text-[var(--text-muted)] block leading-tight">{roleShortNames[currentUser.role]}</span>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-56 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[var(--text-primary)] truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">{currentUser.email}</div>
                </div>
              </div>
              <div className="mt-2">
                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${colors.bg} ${colors.text}`}>
                  {currentUser.plan}
                </span>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={handleSwitchUser}
                className="w-full px-4 py-2 text-left text-[13px] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                Switch User
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-[13px] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-red-400 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <UserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setUserSwitcherOpen(false)}
        navigateOnSelect={false}
      />
    </>
  );
}
