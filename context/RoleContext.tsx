'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Role = 'CSO' | 'CRO' | 'CTO' | 'OperationsLead' | 'Admin';

export interface RoleInfo {
  id: Role;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
}

export const roleData: Record<Role, RoleInfo> = {
  CSO: {
    id: 'CSO',
    title: 'Chief Strategy Officer',
    shortTitle: 'CSO',
    description: 'Drive strategic outcomes with AI-powered portfolio insights and growth scenario modeling.',
    icon: '🎯',
    dashboardTitle: 'Strategy Command Center',
    dashboardSubtitle: 'Strategic outcomes, growth metrics, and high-level scenario insights',
  },
  CRO: {
    id: 'CRO',
    title: 'Chief Risk Officer',
    shortTitle: 'CRO',
    description: 'Monitor risk exposure across the portfolio with early warning signals and downside analytics.',
    icon: '🛡️',
    dashboardTitle: 'Risk Intelligence Hub',
    dashboardSubtitle: 'Risk heat mapping, downside exposure, and early warning indicators',
  },
  CTO: {
    id: 'CTO',
    title: 'Chief Technology Officer',
    shortTitle: 'CTO',
    description: 'Align technology investments with strategic priorities and track digital transformation health.',
    icon: '💻',
    dashboardTitle: 'Technology Portfolio View',
    dashboardSubtitle: 'Technology roadmap risk, capacity planning, and digital initiatives',
  },
  OperationsLead: {
    id: 'OperationsLead',
    title: 'Operations & Transformation Lead',
    shortTitle: 'Ops Lead',
    description: 'Track execution velocity, identify bottlenecks, and ensure operational excellence.',
    icon: '⚙️',
    dashboardTitle: 'Operations Dashboard',
    dashboardSubtitle: 'Execution health, throughput metrics, and bottleneck analysis',
  },
  Admin: {
    id: 'Admin',
    title: 'Administrator',
    shortTitle: 'Admin',
    description: 'Manage platform settings, user access, and system configuration.',
    icon: '🔧',
    dashboardTitle: 'Administrator Console',
    dashboardSubtitle: 'System configuration, user management, and feature toggles',
  },
};

interface RoleContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  roleInfo: RoleInfo;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export function RoleProvider({ children }: RoleProviderProps) {
  const [activeRole, setActiveRoleState] = useState<Role>('CSO');

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ambi-sight-role', role);
    }
  }, []);

  // Load from localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('ambi-sight-role') as Role | null;
      if (savedRole && roleData[savedRole]) {
        setActiveRoleState(savedRole);
      }
    }
  });

  const roleInfo = roleData[activeRole];

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, roleInfo }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
