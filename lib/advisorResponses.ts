// AI Advisor Response Generator
// Generates structured, strategy-focused responses based on user context

import type { UserProfile, UserRole, Industry, MaturityLevel, Plan } from './users';

export type ProblemCategory =
  | 'risk'
  | 'growth'
  | 'execution'
  | 'portfolio'
  | 'transformation'
  | 'governance';

export interface StrategyTool {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: 'Intro' | 'Intermediate' | 'Advanced';
  isProOnly: boolean;
}

export interface AdvisorResponse {
  diagnosis: string;
  suggestedTools: StrategyTool[];
  recommendedActions: {
    title: string;
    description: string;
    link?: string;
  }[];
  followUpQuestions: string[];
  consultingNote: string;
  confidence: number;
}

// Strategy Tools Library (subset for advisor recommendations)
export const strategyTools: StrategyTool[] = [
  // Diagnosis and Discovery
  { id: 'tool-1', name: 'Strategic Risk Radar', category: 'Diagnosis', description: 'Map and prioritize strategic risks across your organization', complexity: 'Intermediate', isProOnly: false },
  { id: 'tool-2', name: 'Signal Scanning Canvas', category: 'Diagnosis', description: 'Identify early warning signals and emerging trends', complexity: 'Intermediate', isProOnly: true },
  { id: 'tool-3', name: 'Strategic Health Check', category: 'Diagnosis', description: 'Assess organizational readiness for strategic initiatives', complexity: 'Intro', isProOnly: false },
  { id: 'tool-4', name: 'Stakeholder Mapping', category: 'Diagnosis', description: 'Understand influence and alignment of key stakeholders', complexity: 'Intro', isProOnly: false },

  // Growth and Innovation
  { id: 'tool-5', name: 'Growth Opportunity Matrix', category: 'Growth', description: 'Identify and prioritize growth opportunities', complexity: 'Intermediate', isProOnly: false },
  { id: 'tool-6', name: 'Innovation Pipeline Canvas', category: 'Growth', description: 'Structure and manage innovation initiatives', complexity: 'Advanced', isProOnly: true },
  { id: 'tool-7', name: 'Market Entry Framework', category: 'Growth', description: 'Evaluate new market opportunities', complexity: 'Intermediate', isProOnly: true },

  // Portfolio and Capital
  { id: 'tool-8', name: 'Portfolio Health Matrix', category: 'Portfolio', description: 'Visualize initiative health across dimensions', complexity: 'Intermediate', isProOnly: false },
  { id: 'tool-9', name: 'Resource Allocation Optimizer', category: 'Portfolio', description: 'Optimize resource distribution across initiatives', complexity: 'Advanced', isProOnly: true },
  { id: 'tool-10', name: 'Initiative Prioritization Grid', category: 'Portfolio', description: 'Score and rank initiatives by strategic value', complexity: 'Intro', isProOnly: false },

  // Scenario Planning
  { id: 'tool-11', name: 'Scenario Builder', category: 'Scenarios', description: 'Create and compare strategic scenarios', complexity: 'Intermediate', isProOnly: false },
  { id: 'tool-12', name: 'Stress Test Simulator', category: 'Scenarios', description: 'Test strategy resilience under various conditions', complexity: 'Advanced', isProOnly: true },
  { id: 'tool-13', name: 'Decision Tree Mapper', category: 'Scenarios', description: 'Map decision paths and outcomes', complexity: 'Intermediate', isProOnly: true },

  // Execution
  { id: 'tool-14', name: 'OKR Tracker', category: 'Execution', description: 'Track objectives and key results', complexity: 'Intro', isProOnly: false },
  { id: 'tool-15', name: 'Milestone Dashboard', category: 'Execution', description: 'Monitor progress against strategic milestones', complexity: 'Intro', isProOnly: false },
  { id: 'tool-16', name: 'Dependency Mapper', category: 'Execution', description: 'Identify and manage cross-initiative dependencies', complexity: 'Intermediate', isProOnly: true },

  // Risk and Resilience
  { id: 'tool-17', name: 'Risk Heatmap Generator', category: 'Risk', description: 'Visualize risk concentration areas', complexity: 'Intermediate', isProOnly: false },
  { id: 'tool-18', name: 'Monte Carlo Simulator', category: 'Risk', description: 'Run probabilistic risk simulations', complexity: 'Advanced', isProOnly: true },
  { id: 'tool-19', name: 'Business Continuity Planner', category: 'Risk', description: 'Plan for operational resilience', complexity: 'Intermediate', isProOnly: true },

  // Digital and Technology
  { id: 'tool-20', name: 'Digital Maturity Assessment', category: 'Digital', description: 'Evaluate digital capabilities and gaps', complexity: 'Intro', isProOnly: false },
  { id: 'tool-21', name: 'Technology Roadmap Builder', category: 'Digital', description: 'Plan technology investments over time', complexity: 'Intermediate', isProOnly: true },

  // Governance
  { id: 'tool-22', name: 'Board Reporting Template', category: 'Governance', description: 'Structure executive communications', complexity: 'Intro', isProOnly: false },
  { id: 'tool-23', name: 'ESG Scorecard', category: 'Governance', description: 'Track ESG metrics and progress', complexity: 'Intermediate', isProOnly: true },
];

// Pre-made strategy prompts
export interface StrategyPrompt {
  id: string;
  label: string;
  description: string;
  prompt: string;
  category: ProblemCategory;
  icon: string;
}

export const strategyPrompts: StrategyPrompt[] = [
  {
    id: 'prompt-risks',
    label: 'Identify Top Risks',
    description: 'Find my top 3 strategic risks',
    prompt: 'Identify my top 3 strategic risks and provide actionable recommendations to mitigate them.',
    category: 'risk',
    icon: '⚠️',
  },
  {
    id: 'prompt-growth',
    label: 'Design Growth Scenarios',
    description: '3 growth scenarios for next 18 months',
    prompt: 'Design 3 growth scenarios for the next 18 months, considering our current strategic position and market conditions.',
    category: 'growth',
    icon: '📈',
  },
  {
    id: 'prompt-tools',
    label: 'Strategy Tools Recommendation',
    description: 'Best tools for portfolio review',
    prompt: 'Choose the right strategy tools for a comprehensive portfolio review and help me understand how to apply them.',
    category: 'portfolio',
    icon: '🧰',
  },
  {
    id: 'prompt-board',
    label: 'Board-Ready Summary',
    description: 'Turn inputs into executive summary',
    prompt: 'Turn my current strategic inputs into a board-ready executive summary with key insights and recommendations.',
    category: 'governance',
    icon: '📋',
  },
  {
    id: 'prompt-execution',
    label: 'Execution Roadblocks',
    description: 'Identify what is slowing us down',
    prompt: 'Analyze our current initiatives and identify the main execution roadblocks that are slowing down our strategic progress.',
    category: 'execution',
    icon: '🚧',
  },
  {
    id: 'prompt-transformation',
    label: 'Digital Transformation',
    description: 'Assess our digital readiness',
    prompt: 'Assess our digital transformation readiness and recommend a prioritized approach to building digital capabilities.',
    category: 'transformation',
    icon: '🔄',
  },
];

// Map problem categories to relevant tools
function getToolsForCategory(category: ProblemCategory, userPlan: Plan): StrategyTool[] {
  const categoryMapping: Record<ProblemCategory, string[]> = {
    risk: ['Diagnosis', 'Risk', 'Scenarios'],
    growth: ['Growth', 'Portfolio', 'Scenarios'],
    execution: ['Execution', 'Portfolio', 'Diagnosis'],
    portfolio: ['Portfolio', 'Execution', 'Diagnosis'],
    transformation: ['Digital', 'Execution', 'Growth'],
    governance: ['Governance', 'Risk', 'Diagnosis'],
  };

  const relevantCategories = categoryMapping[category];
  let tools = strategyTools.filter(t => relevantCategories.includes(t.category));

  // If user is on Free plan, prioritize free tools but include some Pro tools
  if (userPlan === 'Free') {
    const freeTools = tools.filter(t => !t.isProOnly);
    const proTools = tools.filter(t => t.isProOnly).slice(0, 2);
    tools = [...freeTools.slice(0, 3), ...proTools];
  }

  return tools.slice(0, 5);
}

// Generate diagnosis based on user context
function generateDiagnosis(
  query: string,
  user: UserProfile | null,
  category: ProblemCategory
): string {
  const role = user?.role || 'ChiefStrategyOfficer';
  const industry = user?.industry || 'Technology';
  const maturity = user?.maturityLevel || 'Enterprise';
  const company = user?.company || 'your organization';

  const diagnosisTemplates: Record<ProblemCategory, string[]> = {
    risk: [
      `Based on typical ${industry} sector patterns and ${maturity} organizational profiles, I've identified key risk clusters that warrant attention.`,
      `For ${company}, the strategic risk landscape shows elevated concentration in operational and market-facing dimensions.`,
      `As a ${role.replace(/([A-Z])/g, ' $1').trim()}, your visibility into cross-functional risks is critical.`,
    ],
    growth: [
      `Analyzing growth potential for ${maturity} organizations in ${industry}, several strategic pathways emerge.`,
      `${company}'s current position suggests opportunities in both organic expansion and strategic partnerships.`,
      `Growth scenarios should balance ambition with execution capacity, particularly given your ${maturity} stage.`,
    ],
    execution: [
      `Execution velocity for ${maturity} organizations typically correlates with decision-making clarity and resource alignment.`,
      `Common bottlenecks in ${industry} include cross-functional coordination and technology dependencies.`,
      `For ${company}, I recommend focusing on the initiatives with highest strategic impact-to-effort ratios.`,
    ],
    portfolio: [
      `Portfolio health assessment for ${company} reveals opportunities for rebalancing and prioritization.`,
      `${industry} best practices suggest maintaining a mix of core, adjacent, and transformational initiatives.`,
      `As a ${maturity} organization, your portfolio should reflect both stability and growth ambitions.`,
    ],
    transformation: [
      `Digital maturity in ${industry} varies significantly; ${maturity} organizations typically have established foundations but gaps in advanced capabilities.`,
      `Transformation success requires alignment between technology investments and business model evolution.`,
      `For ${company}, a phased approach will reduce execution risk while building momentum.`,
    ],
    governance: [
      `Effective governance for ${maturity} organizations balances oversight with agility.`,
      `${industry} regulatory landscape requires proactive stakeholder communication and transparent reporting.`,
      `Board-ready materials should emphasize strategic optionality and risk-adjusted scenarios.`,
    ],
  };

  return diagnosisTemplates[category].join(' ');
}

// Generate recommended actions
function generateActions(category: ProblemCategory): AdvisorResponse['recommendedActions'] {
  const actionsMap: Record<ProblemCategory, AdvisorResponse['recommendedActions']> = {
    risk: [
      { title: 'Open Risk Heatmap in Workspace', description: 'Visualize risk concentration across your portfolio', link: '/workspace' },
      { title: 'Run Scenario Stress Test', description: 'Test resilience against high-impact scenarios', link: '/scenarios' },
      { title: 'Review Initiative Dependencies', description: 'Identify cascading risk factors', link: '/portfolio' },
    ],
    growth: [
      { title: 'Launch Growth Scenario Builder', description: 'Model 3-5 growth pathways with KPI projections', link: '/scenarios' },
      { title: 'Assess Market Entry Options', description: 'Evaluate expansion opportunities', link: '/workspace' },
      { title: 'Review Portfolio Allocation', description: 'Ensure growth initiatives are properly resourced', link: '/portfolio' },
    ],
    execution: [
      { title: 'Open Milestone Dashboard', description: 'Track progress on key strategic milestones', link: '/workspace' },
      { title: 'Identify Resource Conflicts', description: 'Find bottlenecks in resource allocation', link: '/portfolio' },
      { title: 'Set Up OKR Tracking', description: 'Align team objectives with strategic goals', link: '/workspace' },
    ],
    portfolio: [
      { title: 'View Portfolio Health Matrix', description: 'See initiative health across all dimensions', link: '/portfolio' },
      { title: 'Run Prioritization Analysis', description: 'Rank initiatives by strategic value', link: '/workspace' },
      { title: 'Simulate Resource Reallocation', description: 'Model impact of portfolio changes', link: '/scenarios' },
    ],
    transformation: [
      { title: 'Complete Digital Maturity Assessment', description: 'Benchmark your digital capabilities', link: '/workspace' },
      { title: 'Build Technology Roadmap', description: 'Plan phased technology investments', link: '/workspace' },
      { title: 'Identify Quick Wins', description: 'Find high-impact, low-effort digital improvements', link: '/portfolio' },
    ],
    governance: [
      { title: 'Generate Board Report Draft', description: 'Create executive summary from current data', link: '/workspace' },
      { title: 'Review ESG Metrics', description: 'Track sustainability and governance KPIs', link: '/portfolio' },
      { title: 'Prepare Stakeholder Update', description: 'Draft communication for key stakeholders', link: '/workspace' },
    ],
  };

  return actionsMap[category];
}

// Generate follow-up questions
function generateFollowUps(category: ProblemCategory): string[] {
  const followUpsMap: Record<ProblemCategory, string[]> = {
    risk: [
      'Would you like me to drill down into any specific risk category?',
      'Should I model the impact of mitigating the top risk cluster?',
      'Do you want to see how these risks compare to industry benchmarks?',
    ],
    growth: [
      'Should I stress-test any of these scenarios against market volatility?',
      'Would you like to see resource requirements for each growth pathway?',
      'Do you want me to identify potential acquisition targets for inorganic growth?',
    ],
    execution: [
      'Should I identify which initiatives to accelerate vs. pause?',
      'Would you like to see team capacity analysis across initiatives?',
      'Do you want me to map critical dependencies between projects?',
    ],
    portfolio: [
      'Should I simulate the impact of reallocating resources from low-performers?',
      'Would you like to see the portfolio balanced against strategic themes?',
      'Do you want me to identify initiatives ready for sunset?',
    ],
    transformation: [
      'Should I prioritize capabilities by business impact?',
      'Would you like to see a phased implementation timeline?',
      'Do you want me to identify change management requirements?',
    ],
    governance: [
      'Should I include scenario analysis in the board materials?',
      'Would you like to see a risk-adjusted forecast?',
      'Do you want me to draft talking points for specific board members?',
    ],
  };

  return followUpsMap[category];
}

// Detect problem category from query
function detectCategory(query: string): ProblemCategory {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('risk') || lowerQuery.includes('threat') || lowerQuery.includes('danger') || lowerQuery.includes('exposure')) {
    return 'risk';
  }
  if (lowerQuery.includes('growth') || lowerQuery.includes('expand') || lowerQuery.includes('revenue') || lowerQuery.includes('market')) {
    return 'growth';
  }
  if (lowerQuery.includes('execute') || lowerQuery.includes('deliver') || lowerQuery.includes('milestone') || lowerQuery.includes('progress') || lowerQuery.includes('slow')) {
    return 'execution';
  }
  if (lowerQuery.includes('portfolio') || lowerQuery.includes('priorit') || lowerQuery.includes('initiative') || lowerQuery.includes('resource')) {
    return 'portfolio';
  }
  if (lowerQuery.includes('digital') || lowerQuery.includes('transform') || lowerQuery.includes('technology') || lowerQuery.includes('modern')) {
    return 'transformation';
  }
  if (lowerQuery.includes('board') || lowerQuery.includes('govern') || lowerQuery.includes('esg') || lowerQuery.includes('report') || lowerQuery.includes('stakeholder')) {
    return 'governance';
  }

  // Default to portfolio for general strategic queries
  return 'portfolio';
}

// Main response generator
export function generateAdvisorResponse(
  query: string,
  user: UserProfile | null
): AdvisorResponse {
  const category = detectCategory(query);
  const userPlan = user?.plan || 'Free';

  const diagnosis = generateDiagnosis(query, user, category);
  const tools = getToolsForCategory(category, userPlan);
  const actions = generateActions(category);
  const followUps = generateFollowUps(category);

  // Confidence based on query specificity and user context
  let confidence = 75;
  if (user) confidence += 10;
  if (query.length > 50) confidence += 5;
  if (query.includes('?')) confidence += 3;
  confidence = Math.min(confidence, 95);

  return {
    diagnosis,
    suggestedTools: tools,
    recommendedActions: actions,
    followUpQuestions: followUps,
    consultingNote: 'For a deeper review with customized frameworks and hands-on facilitation, you can request a consulting sprint from Ambidexters.',
    confidence,
  };
}
