// Role-Based Permission System for AmbiSight
// Defines what each role can access and do

import type { Plan } from './users';
import type { AppRole, ToolCategory } from './database.types';

// ============================================
// ROLE DEFINITIONS
// ============================================

export interface RolePermissions {
  // Dashboard access
  canViewWorkspace: boolean;
  canViewDiagnostics: boolean;
  canViewPortfolio: boolean;
  canViewScenarios: boolean;
  canViewAdmin: boolean;

  // Tool access by category
  toolCategoriesAllowed: ToolCategory[];

  // Action permissions
  canCreateDiagnostic: boolean;
  canEditDiagnostic: boolean;
  canDeleteDiagnostic: boolean;
  canExportData: boolean;
  canInviteUsers: boolean;
  canManageOrganization: boolean;

  // Feature limits
  maxDiagnostics: number; // -1 = unlimited
  maxSimulations: number;
  maxOrganizations: number;
}

export const rolePermissions: Record<AppRole, RolePermissions> = {
  strategy_lead: {
    canViewWorkspace: true,
    canViewDiagnostics: true,
    canViewPortfolio: true,
    canViewScenarios: true,
    canViewAdmin: false,
    toolCategoriesAllowed: ['growth', 'renewal', 'risk', 'innovation', 'execution', 'capability', 'digital', 'marketing', 'finance', 'stakeholders'],
    canCreateDiagnostic: true,
    canEditDiagnostic: true,
    canDeleteDiagnostic: true,
    canExportData: true,
    canInviteUsers: true,
    canManageOrganization: true,
    maxDiagnostics: -1,
    maxSimulations: -1,
    maxOrganizations: -1,
  },
  ops_lead: {
    canViewWorkspace: true,
    canViewDiagnostics: true,
    canViewPortfolio: true,
    canViewScenarios: true,
    canViewAdmin: false,
    toolCategoriesAllowed: ['execution', 'risk', 'capability', 'digital'],
    canCreateDiagnostic: true,
    canEditDiagnostic: true,
    canDeleteDiagnostic: false,
    canExportData: true,
    canInviteUsers: false,
    canManageOrganization: false,
    maxDiagnostics: 10,
    maxSimulations: 20,
    maxOrganizations: 1,
  },
  finance_lead: {
    canViewWorkspace: true,
    canViewDiagnostics: true,
    canViewPortfolio: true,
    canViewScenarios: true,
    canViewAdmin: false,
    toolCategoriesAllowed: ['finance', 'risk', 'execution', 'growth'],
    canCreateDiagnostic: true,
    canEditDiagnostic: true,
    canDeleteDiagnostic: false,
    canExportData: true,
    canInviteUsers: false,
    canManageOrganization: false,
    maxDiagnostics: 10,
    maxSimulations: 20,
    maxOrganizations: 1,
  },
  marketing_lead: {
    canViewWorkspace: true,
    canViewDiagnostics: true,
    canViewPortfolio: false,
    canViewScenarios: true,
    canViewAdmin: false,
    toolCategoriesAllowed: ['marketing', 'growth', 'innovation', 'stakeholders'],
    canCreateDiagnostic: true,
    canEditDiagnostic: true,
    canDeleteDiagnostic: false,
    canExportData: false,
    canInviteUsers: false,
    canManageOrganization: false,
    maxDiagnostics: 5,
    maxSimulations: 10,
    maxOrganizations: 1,
  },
  guest: {
    canViewWorkspace: true,
    canViewDiagnostics: false,
    canViewPortfolio: false,
    canViewScenarios: false,
    canViewAdmin: false,
    toolCategoriesAllowed: [],
    canCreateDiagnostic: false,
    canEditDiagnostic: false,
    canDeleteDiagnostic: false,
    canExportData: false,
    canInviteUsers: false,
    canManageOrganization: false,
    maxDiagnostics: 0,
    maxSimulations: 0,
    maxOrganizations: 0,
  },
};

// ============================================
// PLAN-BASED FEATURE LIMITS
// ============================================

export interface PlanFeatures {
  // Core limits
  maxDiagnosticsPerMonth: number;
  maxOrganizations: number;
  maxTeamMembers: number;
  maxSimulationsPerDiagnostic: number;

  // Feature flags
  hasFullToolAccess: boolean;
  hasTrendData: boolean;
  hasExport: boolean;
  hasAIAdvisor: boolean;
  hasAdvancedAnalytics: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasCustomBranding: boolean;

  // Tool limits
  toolsAccessible: number; // Out of 50+
  aiQueriesPerMonth: number;
}

export const planFeatures: Record<Plan, PlanFeatures> = {
  Free: {
    maxDiagnosticsPerMonth: 1,
    maxOrganizations: 1,
    maxTeamMembers: 1,
    maxSimulationsPerDiagnostic: 3,
    hasFullToolAccess: false,
    hasTrendData: false,
    hasExport: false,
    hasAIAdvisor: false,
    hasAdvancedAnalytics: false,
    hasApiAccess: false,
    hasPrioritySupport: false,
    hasCustomBranding: false,
    toolsAccessible: 15,
    aiQueriesPerMonth: 5,
  },
  Pro: {
    maxDiagnosticsPerMonth: 10,
    maxOrganizations: 5,
    maxTeamMembers: 5,
    maxSimulationsPerDiagnostic: 20,
    hasFullToolAccess: false,
    hasTrendData: true,
    hasExport: true,
    hasAIAdvisor: true,
    hasAdvancedAnalytics: true,
    hasApiAccess: false,
    hasPrioritySupport: false,
    hasCustomBranding: false,
    toolsAccessible: 40,
    aiQueriesPerMonth: 100,
  },
  Enterprise: {
    maxDiagnosticsPerMonth: -1, // Unlimited
    maxOrganizations: -1,
    maxTeamMembers: -1,
    maxSimulationsPerDiagnostic: -1,
    hasFullToolAccess: true,
    hasTrendData: true,
    hasExport: true,
    hasAIAdvisor: true,
    hasAdvancedAnalytics: true,
    hasApiAccess: true,
    hasPrioritySupport: true,
    hasCustomBranding: true,
    toolsAccessible: 50,
    aiQueriesPerMonth: -1, // Unlimited
  },
};

// ============================================
// FEATURE FLAGS FOR UI
// ============================================

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  requiredPlan: Plan;
  category: 'diagnostic' | 'tools' | 'export' | 'collaboration' | 'advanced';
}

export const featureFlags: FeatureFlag[] = [
  // Diagnostic features
  {
    id: 'multiple_diagnostics',
    name: 'Multiple Diagnostics',
    description: 'Create and compare multiple diagnostic assessments',
    requiredPlan: 'Pro',
    category: 'diagnostic',
  },
  {
    id: 'trend_analysis',
    name: 'Trend Analysis',
    description: 'View historical trends across diagnostics',
    requiredPlan: 'Pro',
    category: 'diagnostic',
  },
  {
    id: 'advanced_simulations',
    name: 'Advanced Simulations',
    description: 'Unlimited scenario simulations with Monte Carlo',
    requiredPlan: 'Enterprise',
    category: 'diagnostic',
  },

  // Tool features
  {
    id: 'full_tool_library',
    name: 'Full Tool Library',
    description: 'Access to all 50+ strategy tools',
    requiredPlan: 'Enterprise',
    category: 'tools',
  },
  {
    id: 'tool_templates',
    name: 'Tool Templates',
    description: 'Download Excel, PPT, and PDF templates',
    requiredPlan: 'Pro',
    category: 'tools',
  },

  // Export features
  {
    id: 'pdf_export',
    name: 'PDF Export',
    description: 'Export diagnostic reports as PDF',
    requiredPlan: 'Pro',
    category: 'export',
  },
  {
    id: 'csv_export',
    name: 'CSV Export',
    description: 'Export data in CSV format',
    requiredPlan: 'Pro',
    category: 'export',
  },
  {
    id: 'ppt_export',
    name: 'PowerPoint Export',
    description: 'Export board-ready presentations',
    requiredPlan: 'Enterprise',
    category: 'export',
  },

  // Collaboration features
  {
    id: 'team_collaboration',
    name: 'Team Collaboration',
    description: 'Invite team members to collaborate',
    requiredPlan: 'Pro',
    category: 'collaboration',
  },
  {
    id: 'sso',
    name: 'Single Sign-On',
    description: 'Enterprise SSO integration',
    requiredPlan: 'Enterprise',
    category: 'collaboration',
  },

  // Advanced features
  {
    id: 'ai_advisor',
    name: 'AI Strategy Advisor',
    description: 'AI-powered strategic recommendations',
    requiredPlan: 'Pro',
    category: 'advanced',
  },
  {
    id: 'api_access',
    name: 'API Access',
    description: 'Integrate with your systems via API',
    requiredPlan: 'Enterprise',
    category: 'advanced',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRolePermissions(role: AppRole): RolePermissions {
  return rolePermissions[role];
}

export function getPlanFeatures(plan: Plan): PlanFeatures {
  return planFeatures[plan];
}

export function hasFeature(plan: Plan, featureId: string): boolean {
  const feature = featureFlags.find((f) => f.id === featureId);
  if (!feature) return false;

  const planHierarchy: Plan[] = ['Free', 'Pro', 'Enterprise'];
  const userPlanIndex = planHierarchy.indexOf(plan);
  const requiredPlanIndex = planHierarchy.indexOf(feature.requiredPlan);

  return userPlanIndex >= requiredPlanIndex;
}

export function getAccessibleTools(plan: Plan): number {
  return planFeatures[plan].toolsAccessible;
}

export function canPerformAction(
  role: AppRole,
  plan: Plan,
  action: keyof RolePermissions
): boolean {
  const rolePerms = rolePermissions[role];

  // Check role permission
  const roleValue = rolePerms[action];
  if (typeof roleValue === 'boolean') {
    return roleValue;
  }

  return true;
}

export function isLimitReached(
  plan: Plan,
  limitType: keyof PlanFeatures,
  currentCount: number
): boolean {
  const limit = planFeatures[plan][limitType];
  if (typeof limit !== 'number') return false;
  if (limit === -1) return false; // Unlimited

  return currentCount >= limit;
}

// ============================================
// LOCKED FEATURE MESSAGES
// ============================================

export const lockedFeatureMessages: Record<Plan, string> = {
  Free: 'Upgrade to Pro to unlock this feature',
  Pro: 'Upgrade to Enterprise for unlimited access',
  Enterprise: '', // All features unlocked
};

export function getUpgradeMessage(currentPlan: Plan, requiredPlan: Plan): string {
  if (currentPlan === 'Free' && requiredPlan === 'Pro') {
    return 'This feature requires Pro. Upgrade to unlock.';
  }
  if (currentPlan === 'Free' && requiredPlan === 'Enterprise') {
    return 'This feature requires Enterprise. Contact sales.';
  }
  if (currentPlan === 'Pro' && requiredPlan === 'Enterprise') {
    return 'This feature requires Enterprise. Contact sales.';
  }
  return '';
}
