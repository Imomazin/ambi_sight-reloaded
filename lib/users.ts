// User Profiles and Demo Users for AmbiSight

export type UserRole =
  | 'ChiefStrategyOfficer'
  | 'ChiefRiskOfficer'
  | 'ChiefTechnologyOfficer'
  | 'OperationsLead'
  | 'Administrator';

export type MaturityLevel = 'Startup' | 'ScaleUp' | 'Enterprise' | 'PublicSector';

export type Plan = 'Free' | 'Pro' | 'Enterprise';

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
  | 'Internal';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  company: string;
  industry: Industry;
  maturityLevel: MaturityLevel;
  region: string;
  plan: Plan;
  avatar: string;
  email: string;
  lastActive: string;
}

// Role display names
export const roleDisplayNames: Record<UserRole, string> = {
  ChiefStrategyOfficer: 'Chief Strategy Officer',
  ChiefRiskOfficer: 'Chief Risk Officer',
  ChiefTechnologyOfficer: 'Chief Technology Officer',
  OperationsLead: 'Operations Lead',
  Administrator: 'Platform Administrator',
};

// Role short names
export const roleShortNames: Record<UserRole, string> = {
  ChiefStrategyOfficer: 'CSO',
  ChiefRiskOfficer: 'CRO',
  ChiefTechnologyOfficer: 'CTO',
  OperationsLead: 'Ops Lead',
  Administrator: 'Admin',
};

// Plan colors for badges
export const planColors: Record<Plan, { bg: string; text: string; border: string }> = {
  Free: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  Pro: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
  Enterprise: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
};

// Role to Persona mapping (for backwards compatibility with existing persona system)
export const roleToPersona: Record<UserRole, 'strategy-leader' | 'risk-officer' | 'product-owner' | 'admin'> = {
  ChiefStrategyOfficer: 'strategy-leader',
  ChiefRiskOfficer: 'risk-officer',
  ChiefTechnologyOfficer: 'product-owner',
  OperationsLead: 'product-owner',
  Administrator: 'admin',
};

// Demo users with diverse profiles
export const demoUsers: UserProfile[] = [
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    role: 'ChiefStrategyOfficer',
    company: 'GlobalTech Industries',
    industry: 'Technology',
    maturityLevel: 'Enterprise',
    region: 'North America',
    plan: 'Pro',
    avatar: 'SC',
    email: 'sarah.chen@globaltech.com',
    lastActive: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-ibrahim',
    name: 'Ibrahim Malik',
    role: 'ChiefRiskOfficer',
    company: 'Pan African Bank',
    industry: 'Financial Services',
    maturityLevel: 'Enterprise',
    region: 'Africa',
    plan: 'Enterprise',
    avatar: 'IM',
    email: 'ibrahim.malik@pab.co.za',
    lastActive: '2024-01-15T09:15:00Z',
  },
  {
    id: 'user-lena',
    name: 'Lena Ortiz',
    role: 'ChiefTechnologyOfficer',
    company: 'MedTech Innovations',
    industry: 'Healthcare',
    maturityLevel: 'ScaleUp',
    region: 'Europe',
    plan: 'Free',
    avatar: 'LO',
    email: 'lena.ortiz@medtech.io',
    lastActive: '2024-01-14T16:45:00Z',
  },
  {
    id: 'user-amir',
    name: 'Amir Shah',
    role: 'OperationsLead',
    company: 'FastFreight Logistics',
    industry: 'Logistics',
    maturityLevel: 'ScaleUp',
    region: 'Middle East',
    plan: 'Pro',
    avatar: 'AS',
    email: 'amir.shah@fastfreight.ae',
    lastActive: '2024-01-15T08:00:00Z',
  },
  {
    id: 'user-admin',
    name: 'Platform Admin',
    role: 'Administrator',
    company: 'Ambidexters',
    industry: 'Internal',
    maturityLevel: 'Enterprise',
    region: 'Global',
    plan: 'Enterprise',
    avatar: 'AD',
    email: 'admin@ambidexters.com',
    lastActive: '2024-01-15T11:00:00Z',
  },
];

// Feature access control based on plan
export interface FeatureAccess {
  id: string;
  name: string;
  description: string;
  requiredPlan: Plan;
  category: 'dashboard' | 'tools' | 'advisor' | 'reports' | 'admin';
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
  { id: 'basic-advisor', name: 'Basic AI Advisor', description: 'Ask simple strategy questions', requiredPlan: 'Free', category: 'advisor' },
  { id: 'guided-diagnosis', name: 'Guided Diagnosis', description: 'Structured problem diagnosis', requiredPlan: 'Pro', category: 'advisor' },
  { id: 'tool-recommendations', name: 'Tool Recommendations', description: 'AI-powered tool suggestions', requiredPlan: 'Pro', category: 'advisor' },
  { id: 'consulting-connect', name: 'Consulting Connect', description: 'Direct access to Ambidexters consultants', requiredPlan: 'Enterprise', category: 'advisor' },

  // Admin features
  { id: 'user-management', name: 'User Management', description: 'Manage team members and roles', requiredPlan: 'Enterprise', category: 'admin' },
  { id: 'audit-logs', name: 'Audit Logs', description: 'Track all platform activity', requiredPlan: 'Enterprise', category: 'admin' },
];

// Helper function to check if a user has access to a feature
export function hasFeatureAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  const planHierarchy: Plan[] = ['Free', 'Pro', 'Enterprise'];
  return planHierarchy.indexOf(userPlan) >= planHierarchy.indexOf(requiredPlan);
}

// Helper function to get features available to a plan
export function getFeaturesForPlan(plan: Plan): FeatureAccess[] {
  return featureAccessList.filter(feature => hasFeatureAccess(plan, feature.requiredPlan));
}

// Helper function to get locked features for a plan
export function getLockedFeaturesForPlan(plan: Plan): FeatureAccess[] {
  return featureAccessList.filter(feature => !hasFeatureAccess(plan, feature.requiredPlan));
}
