// Pricing Plans and Freemium Model Configuration
// Defines plan tiers, features, and upsell triggers

import type { Plan } from './users';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  includedIn: Plan[];
  limit?: { Free?: number | string; Starter?: number | string; Pro?: number | string; Enterprise?: number | string };
}

export interface PricingPlan {
  id: Plan;
  name: string;
  tagline: string;
  price: { monthly: number; annual: number };
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'gradient';
}

export interface ConsultingPackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  includes: string[];
  bestFor: string;
  icon: string;
}

// Plan Features Matrix
export const planFeatures: PlanFeature[] = [
  {
    id: 'strategy-tools',
    name: 'Strategy Tools',
    description: 'Access to strategy frameworks and tools',
    includedIn: ['Free', 'Starter', 'Pro', 'Enterprise'],
    limit: { Free: '15 tools', Starter: '25 tools', Pro: '40 tools', Enterprise: '50+ tools' },
  },
  {
    id: 'ai-advisor',
    name: 'AI Strategy Advisor',
    description: 'AI-powered strategic recommendations',
    includedIn: ['Free', 'Starter', 'Pro', 'Enterprise'],
    limit: { Free: '5 queries/month', Starter: '25 queries/month', Pro: '100 queries/month', Enterprise: 'Unlimited' },
  },
  {
    id: 'diagnostic-wizard',
    name: 'Diagnostic Wizard',
    description: 'Guided problem-to-tools mapping',
    includedIn: ['Free', 'Starter', 'Pro', 'Enterprise'],
  },
  {
    id: 'case-studies',
    name: 'Case Study Library',
    description: 'Real-world strategic management examples',
    includedIn: ['Free', 'Starter', 'Pro', 'Enterprise'],
    limit: { Free: '5 cases', Starter: '10 cases', Pro: '25 cases', Enterprise: 'Full library' },
  },
  {
    id: 'scenario-planning',
    name: 'Scenario Planning',
    description: 'Build and compare strategic scenarios',
    includedIn: ['Starter', 'Pro', 'Enterprise'],
  },
  {
    id: 'portfolio-management',
    name: 'Portfolio Management',
    description: 'Track and optimize initiative portfolio',
    includedIn: ['Pro', 'Enterprise'],
  },
  {
    id: 'monte-carlo',
    name: 'Monte Carlo Simulations',
    description: 'Probabilistic risk modeling',
    includedIn: ['Enterprise'],
  },
  {
    id: 'custom-frameworks',
    name: 'Custom Frameworks',
    description: 'Build and save custom strategy frameworks',
    includedIn: ['Enterprise'],
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Share and collaborate with team members',
    includedIn: ['Pro', 'Enterprise'],
    limit: { Pro: '5 users', Enterprise: 'Unlimited' },
  },
  {
    id: 'export-reports',
    name: 'Export & Reports',
    description: 'Export to PDF, PowerPoint, Excel',
    includedIn: ['Starter', 'Pro', 'Enterprise'],
  },
  {
    id: 'api-access',
    name: 'API Access',
    description: 'Integrate with your existing tools',
    includedIn: ['Enterprise'],
  },
  {
    id: 'sso',
    name: 'SSO & Security',
    description: 'Single sign-on and enterprise security',
    includedIn: ['Enterprise'],
  },
  {
    id: 'dedicated-support',
    name: 'Dedicated Support',
    description: 'Priority support with dedicated CSM',
    includedIn: ['Enterprise'],
  },
  {
    id: 'onboarding',
    name: 'Guided Onboarding',
    description: 'Personalized onboarding session',
    includedIn: ['Pro', 'Enterprise'],
  },
];

// Pricing Plans
export const pricingPlans: PricingPlan[] = [
  {
    id: 'Free',
    name: 'Free',
    tagline: 'Get started with strategic tools',
    price: { monthly: 0, annual: 0 },
    features: [
      '15 strategy tools',
      '5 AI advisor queries/month',
      'Diagnostic wizard',
      '5 case studies',
      'Basic workspace',
      'Community support',
    ],
    ctaText: 'Get Started Free',
    ctaVariant: 'secondary',
  },
  {
    id: 'Starter',
    name: 'Starter',
    tagline: 'For growing businesses',
    price: { monthly: 19.99, annual: 15.99 },
    features: [
      '25 strategy tools',
      '25 AI advisor queries/month',
      'Scenario planning',
      '10 case studies',
      'Export to PDF/PPT/Excel',
      'Email support',
    ],
    ctaText: 'Start Starter Trial',
    ctaVariant: 'secondary',
  },
  {
    id: 'Pro',
    name: 'Pro',
    tagline: 'For strategy professionals',
    price: { monthly: 99, annual: 79 },
    features: [
      '40 strategy tools',
      '100 AI advisor queries/month',
      'Scenario planning',
      'Portfolio management',
      '25 case studies',
      'Team collaboration (5 users)',
      'Export to PDF/PPT/Excel',
      'Guided onboarding',
      'Email support',
    ],
    highlighted: true,
    ctaText: 'Start Pro Trial',
    ctaVariant: 'gradient',
  },
  {
    id: 'Enterprise',
    name: 'Enterprise',
    tagline: 'For organizations at scale',
    price: { monthly: 299, annual: 249 },
    features: [
      'All 50+ strategy tools',
      'Unlimited AI queries',
      'Monte Carlo simulations',
      'Custom frameworks',
      'Full case study library',
      'Unlimited team members',
      'API access',
      'SSO & enterprise security',
      'Dedicated CSM',
      'Custom integrations',
    ],
    ctaText: 'Contact Sales',
    ctaVariant: 'primary',
  },
];

// Consulting Packages
export const consultingPackages: ConsultingPackage[] = [
  {
    id: 'strategy-sprint',
    name: 'Strategy Sprint',
    description: 'Intensive 2-week engagement to solve a specific strategic challenge',
    duration: '2 weeks',
    price: 'From $15,000',
    includes: [
      'Discovery workshop',
      'Stakeholder interviews',
      'Analysis and recommendations',
      'Executive presentation',
      'Implementation roadmap',
    ],
    bestFor: 'Urgent strategic decisions or specific problem solving',
    icon: '⚡',
  },
  {
    id: 'transformation-program',
    name: 'Transformation Program',
    description: 'Comprehensive strategic transformation with hands-on support',
    duration: '3-6 months',
    price: 'From $75,000',
    includes: [
      'Full strategic assessment',
      'Target operating model design',
      'Change management support',
      'Capability building workshops',
      'Monthly progress reviews',
      'Executive coaching',
    ],
    bestFor: 'Major strategic initiatives or organizational transformation',
    icon: '🚀',
  },
  {
    id: 'advisory-retainer',
    name: 'Advisory Retainer',
    description: 'Ongoing strategic advisory with senior consultant access',
    duration: 'Monthly',
    price: 'From $5,000/month',
    includes: [
      '8 hours/month consulting',
      'On-demand strategic advice',
      'Board meeting preparation',
      'Quarterly strategy reviews',
      'Priority tool customization',
    ],
    bestFor: 'Continuous strategic support and thought partnership',
    icon: '🎯',
  },
  {
    id: 'workshop',
    name: 'Strategy Workshop',
    description: 'Facilitated workshop for leadership team alignment',
    duration: '1-2 days',
    price: 'From $8,000',
    includes: [
      'Pre-workshop preparation',
      'Facilitated session',
      'Custom materials and templates',
      'Summary and action items',
      'Follow-up support call',
    ],
    bestFor: 'Team alignment, planning sessions, or capability building',
    icon: '👥',
  },
];

// Upsell Triggers - Conditions that trigger upgrade prompts
export interface UpsellTrigger {
  id: string;
  condition: string;
  targetPlan: Plan;
  message: string;
  ctaText: string;
}

export const upsellTriggers: UpsellTrigger[] = [
  {
    id: 'tool-limit',
    condition: 'User tries to access Pro/Enterprise tool',
    targetPlan: 'Pro',
    message: 'Unlock advanced strategy tools with Pro',
    ctaText: 'Upgrade to Pro',
  },
  {
    id: 'query-limit',
    condition: 'User reaches AI query limit',
    targetPlan: 'Pro',
    message: 'Get more AI advisor queries with Pro',
    ctaText: 'Upgrade for More',
  },
  {
    id: 'export-attempt',
    condition: 'Free user tries to export',
    targetPlan: 'Pro',
    message: 'Export your work to PDF, PowerPoint, and Excel',
    ctaText: 'Unlock Exports',
  },
  {
    id: 'collaboration',
    condition: 'User tries to share or invite',
    targetPlan: 'Pro',
    message: 'Collaborate with your team on Pro',
    ctaText: 'Add Team Members',
  },
  {
    id: 'advanced-features',
    condition: 'User views Enterprise feature',
    targetPlan: 'Enterprise',
    message: 'Get enterprise-grade features for your organization',
    ctaText: 'Contact Sales',
  },
];

// Helper functions
export function getPlanFeatures(plan: Plan): PlanFeature[] {
  return planFeatures.filter(f => f.includedIn.includes(plan));
}

export function canAccessFeature(featureId: string, userPlan: Plan): boolean {
  const feature = planFeatures.find(f => f.id === featureId);
  return feature ? feature.includedIn.includes(userPlan) : false;
}

export function getUpgradePath(currentPlan: Plan): Plan | null {
  if (currentPlan === 'Free') return 'Starter';
  if (currentPlan === 'Starter') return 'Pro';
  if (currentPlan === 'Pro') return 'Enterprise';
  return null;
}

export function getFeatureLimit(featureId: string, plan: Plan): string | number | undefined {
  const feature = planFeatures.find(f => f.id === featureId);
  return feature?.limit?.[plan];
}
