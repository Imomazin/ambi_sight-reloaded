'use client';

import { useAppState } from '@/state/useAppState';
import { demoUsers, planColors, roleDisplayNames, roleShortNames, type UserProfile } from '@/lib/users';
import { useRouter } from 'next/navigation';

interface UserCardProps {
  user: UserProfile;
  isSelected: boolean;
  onSelect: () => void;
}

function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  const colors = planColors[user.plan];

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
        isSelected
          ? 'bg-teal-500/10 border-teal-500/50 ring-2 ring-teal-500/30'
          : 'bg-navy-700/50 border-navy-600 hover:border-teal-500/30 hover:bg-navy-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
            isSelected ? 'bg-teal-500' : 'bg-navy-500'
          }`}
        >
          {user.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium truncate">{user.name}</h3>
            <span
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
            >
              {user.plan}
            </span>
          </div>
          <p className="text-sm text-teal-400 mb-1">{roleDisplayNames[user.role]}</p>
          <p className="text-xs text-gray-400 truncate">{user.company}</p>
          {user.industry && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{user.industry}</span>
            </div>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigateOnSelect?: boolean;
}

export default function UserSwitcherModal({ isOpen, onClose, navigateOnSelect = true }: UserSwitcherModalProps) {
  const { currentUser, setCurrentUser } = useAppState();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    onClose();
    if (navigateOnSelect) {
      router.push('/workspace');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-600 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Select Demo User</h2>
            <p className="text-sm text-gray-400 mt-1">
              Choose a persona to explore the platform with different roles and plans
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Users Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-3">
            {demoUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={currentUser?.id === user.id}
                onSelect={() => handleSelectUser(user)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-600 bg-navy-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                <span>Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Starter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span>Pro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Enterprise</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
