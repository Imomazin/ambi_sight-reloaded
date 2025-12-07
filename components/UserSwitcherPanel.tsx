'use client';

import { useAppState } from '@/state/useAppState';
import { demoUsers, planColors, roleDisplayNames, type UserProfile } from '@/lib/users';
import { useRouter } from 'next/navigation';

interface UserCardProps {
  user: UserProfile;
  onSelect: () => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
  const colors = planColors[user.plan];

  return (
    <button
      onClick={onSelect}
      className="w-full p-4 rounded-xl border bg-navy-700/50 border-navy-600 hover:border-teal-500/30 hover:bg-navy-700 transition-all duration-200 text-left group"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-navy-500 flex items-center justify-center text-white font-semibold group-hover:bg-teal-500 transition-colors">
          {user.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium truncate group-hover:text-teal-400 transition-colors">
              {user.name}
            </h3>
            <span
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
            >
              {user.plan}
            </span>
          </div>
          <p className="text-sm text-teal-400">{roleDisplayNames[user.role]}</p>
          <p className="text-xs text-gray-400 truncate mt-1">{user.company}</p>
        </div>

        {/* Arrow */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function UserSwitcherPanel() {
  const { setCurrentUser } = useAppState();
  const router = useRouter();

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    router.push('/workspace');
  };

  return (
    <section className="py-16 px-6 border-t border-navy-700">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            Quick Start with Demo Users
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Experience Ambi-Sight from different perspectives. Select a user profile to explore
            the platform with role-specific views and plan-based features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {demoUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onSelect={() => handleSelectUser(user)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-navy-700/50 border border-navy-600">
            <span className="text-sm text-gray-400">Plan access levels:</span>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                <span className="text-gray-400">Free - Basic features</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="text-gray-400">Pro - Advanced analytics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="text-gray-400">Enterprise - Full access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
