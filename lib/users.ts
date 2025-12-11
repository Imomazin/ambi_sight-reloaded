// User Profiles for Lumina S
// Simplified user system with three main roles

export type UserRole = 'KeyUser' | 'Admin' | 'User';

export type UserLevel = 1 | 2 | 3 | 4; // Level 1 = Free, Level 2 = Starter, Level 3 = Pro, Level 4 = Enterprise

export type Plan = 'Free' | 'Starter' | 'Pro' | 'Enterprise';

export type Industry =
  | 'Technology'
  | 'Financial Services'
  | 'Healthcare'
  | 'Retail'
  | 'Manufacturing'
  | 'Energy'
  | 'Logistics'
  | 'Public Sector'
  | 'Consulting'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: Plan;
  level: UserLevel; // User level 1-4
  company?: string;
  industry?: Industry;
  avatar: string;
  lastActive: string;
  registeredAt?: string; // When user signed up
  authProvider?: 'email' | 'google' | 'microsoft' | 'github'; // How they signed up
  consultancyRequested?: boolean;
  trialEndsAt?: string;
}

// Map plan to level
export const planToLevel: Record<Plan, UserLevel> = {
  Free: 1,
  Starter: 2,
  Pro: 3,
  Enterprise: 4,
};

// Level display names
export const levelDisplayNames: Record<UserLevel, string> = {
  1: 'Level 1 (Free)',
  2: 'Level 2 (Starter)',
  3: 'Level 3 (Pro)',
  4: 'Level 4 (Enterprise)',
};

// Role display names
export const roleDisplayNames: Record<UserRole, string> = {
  KeyUser: 'Key User',
  Admin: 'Administrator',
  User: 'User',
};

// Role descriptions
export const roleDescriptions: Record<UserRole, string> = {
  KeyUser: 'Full access to all platform features and capabilities',
  Admin: 'Platform administration with limited feature access',
  User: 'Access based on subscription plan (Free, Pro, Enterprise)',
};

// Short names for compact display
export const roleShortNames: Record<UserRole, string> = {
  KeyUser: 'Key User',
  Admin: 'Admin',
  User: 'User',
};

// Plan colors for badges
export const planColors: Record<Plan, { bg: string; text: string; border: string }> = {
  Free: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  Starter: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Pro: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
  Enterprise: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
};

// Role colors for badges
export const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
  KeyUser: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  Admin: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  User: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
};

// Demo users
export const demoUsers: UserProfile[] = [
  {
    id: 'key-user-demo',
    name: 'Demo Key User',
    email: 'keyuser@lumina-s.com',
    role: 'KeyUser',
    plan: 'Enterprise',
    level: 4,
    company: 'Lumina S Demo',
    industry: 'Technology',
    avatar: 'KU',
    lastActive: new Date().toISOString(),
    registeredAt: '2024-01-01T00:00:00.000Z',
    authProvider: 'email',
  },
  {
    id: 'admin-demo',
    name: 'Demo Admin',
    email: 'admin@lumina-s.com',
    role: 'Admin',
    plan: 'Enterprise',
    level: 4,
    company: 'Lumina S Demo',
    industry: 'Technology',
    avatar: 'AD',
    lastActive: new Date().toISOString(),
    registeredAt: '2024-01-01T00:00:00.000Z',
    authProvider: 'email',
  },
  {
    id: 'user-free-demo',
    name: 'Free User',
    email: 'free@example.com',
    role: 'User',
    plan: 'Free',
    level: 1,
    company: 'Startup Inc',
    industry: 'Technology',
    avatar: 'FU',
    lastActive: new Date().toISOString(),
    registeredAt: '2024-06-15T00:00:00.000Z',
    authProvider: 'google',
  },
  {
    id: 'user-starter-demo',
    name: 'Starter User',
    email: 'starter@example.com',
    role: 'User',
    plan: 'Starter',
    level: 2,
    company: 'Growing Business',
    industry: 'Retail',
    avatar: 'SU',
    lastActive: new Date().toISOString(),
    registeredAt: '2024-05-10T00:00:00.000Z',
    authProvider: 'microsoft',
  },
  {
    id: 'user-pro-demo',
    name: 'Pro User',
    email: 'pro@example.com',
    role: 'User',
    plan: 'Pro',
    level: 3,
    company: 'Growth Corp',
    industry: 'Financial Services',
    avatar: 'PU',
    lastActive: new Date().toISOString(),
    registeredAt: '2024-04-20T00:00:00.000Z',
    authProvider: 'email',
    consultancyRequested: true,
  },
  {
    id: 'user-enterprise-demo',
    name: 'Enterprise User',
    email: 'enterprise@example.com',
    role: 'User',
    plan: 'Enterprise',
    level: 4,
    company: 'Global Enterprises',
    industry: 'Manufacturing',
    avatar: 'EU',
    lastActive: new Date().toISOString(),
    registeredAt: '2024-03-01T00:00:00.000Z',
    authProvider: 'github',
  },
];

// Feature access control
export interface FeatureAccess {
  id: string;
  name: string;
  description: string;
  requiredPlan: Plan;
  category: 'dashboard' | 'tools' | 'advisor' | 'reports' | 'admin';
  keyUserOnly?: boolean; // Some features might be Key User only
}

export const featureAccessList: FeatureAccess[] = [
  // Dashboard features
  { id: 'basic-kpis', name: 'Basic KPIs', description: 'View core strategic metrics', requiredPlan: 'Free', category: 'dashboard' },
  { id: 'initiative-tracking', name: 'Initiative Tracking', description: 'Track key initiatives', requiredPlan: 'Free', category: 'dashboard' },
  { id: 'advanced-analytics', name: 'Advanced Analytics', description: 'Deep-dive analytics and trends', requiredPlan: 'Pro', category: 'dashboard' },
  { id: 'executive-report', name: 'Executive Report', description: 'Board-ready executive summaries', requiredPlan: 'Enterprise', category: 'reports' },
  { id: 'custom-dashboards', name: 'Custom Dashboards', description: 'Build personalized dashboard views', requiredPlan: 'Enterprise', category: 'dashboard' },

  // Tools features
  { id: 'basic-scenarios', name: 'Basic Scenarios', description: 'Create simple what-if scenarios', requiredPlan: 'Free', category: 'tools' },
  { id: 'scenario-comparison', name: 'Scenario Comparison', description: 'Compare multiple scenarios side-by-side', requiredPlan: 'Pro', category: 'tools' },
  { id: 'portfolio-heatmap', name: 'Portfolio Heatmap', description: 'Visual portfolio health matrix', requiredPlan: 'Pro', category: 'tools' },
  { id: 'risk-simulation', name: 'Risk Simulation', description: 'Monte Carlo risk simulations', requiredPlan: 'Enterprise', category: 'tools' },

  // Advisor features
  { id: 'basic-advisor', name: 'Strategic Advisor', description: 'Ask strategy questions', requiredPlan: 'Free', category: 'advisor' },
  { id: 'guided-diagnosis', name: 'Guided Diagnosis', description: 'Structured problem diagnosis', requiredPlan: 'Pro', category: 'advisor' },
  { id: 'tool-recommendations', name: 'Tool Recommendations', description: 'Personalized tool suggestions', requiredPlan: 'Pro', category: 'advisor' },
  { id: 'consulting-connect', name: 'Consulting Connect', description: 'Direct access to strategy consultants', requiredPlan: 'Enterprise', category: 'advisor' },

  // Admin features (Admin and KeyUser only)
  { id: 'user-management', name: 'User Management', description: 'Manage team members and roles', requiredPlan: 'Enterprise', category: 'admin' },
  { id: 'audit-logs', name: 'Audit Logs', description: 'Track all platform activity', requiredPlan: 'Enterprise', category: 'admin' },
  { id: 'system-config', name: 'System Configuration', description: 'Configure platform settings', requiredPlan: 'Enterprise', category: 'admin', keyUserOnly: true },
];

// Helper function to check if a user has access to a feature
export function hasFeatureAccess(user: UserProfile | null, featureId: string): boolean {
  if (!user) return false;

  const feature = featureAccessList.find(f => f.id === featureId);
  if (!feature) return false;

  // Key Users have access to EVERYTHING
  if (user.role === 'KeyUser') return true;

  // Key User only features
  if (feature.keyUserOnly) return false;

  // Admin can access admin features
  if (feature.category === 'admin' && user.role === 'Admin') return true;

  // Check plan-based access for regular users
  const planHierarchy: Plan[] = ['Free', 'Starter', 'Pro', 'Enterprise'];
  return planHierarchy.indexOf(user.plan) >= planHierarchy.indexOf(feature.requiredPlan);
}

// Helper to check plan hierarchy only (for backwards compatibility)
export function hasPlanAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  const planHierarchy: Plan[] = ['Free', 'Starter', 'Pro', 'Enterprise'];
  return planHierarchy.indexOf(userPlan) >= planHierarchy.indexOf(requiredPlan);
}

// Helper function to get features available to a user
export function getFeaturesForUser(user: UserProfile | null): FeatureAccess[] {
  if (!user) return [];
  return featureAccessList.filter(feature => hasFeatureAccess(user, feature.id));
}

// Helper function to get locked features for a user
export function getLockedFeaturesForUser(user: UserProfile | null): FeatureAccess[] {
  if (!user) return featureAccessList;
  return featureAccessList.filter(feature => !hasFeatureAccess(user, feature.id));
}

// Check if user can access admin features
export function isAdmin(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.role === 'KeyUser' || user.role === 'Admin';
}

// Get effective access level description
export function getAccessLevelDescription(user: UserProfile | null): string {
  if (!user) return 'No access - Please sign in';

  switch (user.role) {
    case 'KeyUser':
      return 'Full Access - All features unlocked';
    case 'Admin':
      return 'Admin Access - Platform administration';
    case 'User':
      const planDescriptions: Record<Plan, string> = {
        Free: 'Basic',
        Starter: 'Core',
        Pro: 'Most',
        Enterprise: 'All',
      };
      return `${user.plan} Plan - ${planDescriptions[user.plan]} features`;
    default:
      return 'Limited access';
  }
}
