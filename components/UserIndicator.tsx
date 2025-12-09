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

  // Close dropdown when clicking outside
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

  // If no user is logged in, show login button
  if (!currentUser) {
    return (
      <Link
        href="/signin"
        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span className="text-sm font-medium">Sign In</span>
      </Link>
    );
  }

  const colors = planColors[currentUser.plan];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-600 transition-colors"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
            {currentUser.avatar}
          </div>

          {/* Name and role */}
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{currentUser.name}</span>
              <span
                className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${colors.bg} ${colors.text}`}
              >
                {currentUser.plan}
              </span>
            </div>
            <span className="text-xs text-gray-400">{roleShortNames[currentUser.role]}</span>
          </div>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-navy-700 rounded-xl border border-navy-600 shadow-xl overflow-hidden z-50">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-navy-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center text-white font-semibold">
                  {currentUser.avatar}
                </div>
                <div>
                  <div className="text-white font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-400">{currentUser.email}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded ${colors.bg} ${colors.text}`}>
                  {currentUser.plan} Plan
                </span>
                <span className="text-xs text-gray-500">{currentUser.company}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="py-1">
              <button
                onClick={handleSwitchUser}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-navy-600 hover:text-white flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Switch User
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-navy-600 hover:text-white flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Switcher Modal */}
      <UserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setUserSwitcherOpen(false)}
        navigateOnSelect={false}
      />
    </>
  );
}
