'use client';

import { useRouter } from 'next/navigation';
import { Role, roleData, useRole } from '@/context/RoleContext';

interface RoleSelectorProps {
  compact?: boolean;
}

const roleColors: Record<Role, { gradient: string; bgLight: string }> = {
  CSO: { gradient: 'from-blue-500 to-indigo-500', bgLight: 'bg-blue-500/10' },
  CRO: { gradient: 'from-orange-500 to-red-500', bgLight: 'bg-orange-500/10' },
  CTO: { gradient: 'from-purple-500 to-pink-500', bgLight: 'bg-purple-500/10' },
  OperationsLead: { gradient: 'from-green-500 to-emerald-500', bgLight: 'bg-green-500/10' },
  Admin: { gradient: 'from-gray-500 to-slate-500', bgLight: 'bg-gray-500/10' },
};

export default function RoleSelector({ compact = false }: RoleSelectorProps) {
  const router = useRouter();
  const { activeRole, setActiveRole } = useRole();

  const handleRoleSelect = (role: Role) => {
    setActiveRole(role);
    router.push('/dashboard');
  };

  const roles: Role[] = ['CSO', 'CRO', 'CTO', 'OperationsLead'];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const info = roleData[role];
          const colors = roleColors[role];
          return (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeRole === role
                  ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <span className="mr-2">{info.icon}</span>
              {info.shortTitle}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {roles.map((role) => {
        const info = roleData[role];
        const colors = roleColors[role];
        const isActive = activeRole === role;
        return (
          <div
            key={role}
            className={`role-card group ${isActive ? 'selected' : ''}`}
            onClick={() => handleRoleSelect(role)}
          >
            {/* Colorful icon container */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              {info.icon}
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {info.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {info.description}
            </p>
            <button
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
              }`}
            >
              {isActive ? `Viewing as ${info.shortTitle}` : `Enter as ${info.shortTitle}`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
