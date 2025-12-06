'use client';

import { useRouter } from 'next/navigation';
import { Role, roleData, useRole } from '@/context/RoleContext';

interface RoleSelectorProps {
  compact?: boolean;
}

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
          return (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeRole === role
                  ? 'bg-[var(--accent-primary)] text-white'
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
        return (
          <div
            key={role}
            className={`role-card ${activeRole === role ? 'selected' : ''}`}
            onClick={() => handleRoleSelect(role)}
          >
            <div className="text-4xl mb-4">{info.icon}</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {info.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {info.description}
            </p>
            <button className="w-full btn-secondary text-sm">
              View as {info.shortTitle}
            </button>
          </div>
        );
      })}
    </div>
  );
}
