// AI Advisor Response Generator
// Generates structured, strategy-focused responses based on user context

import type { UserProfile, UserRole, Industry, Plan } from './users';

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
  const industry = user?.industry || 'Technology';
  const plan = user?.plan || 'Enterprise';
  const company = user?.company || 'your organization';
  const roleLabel = user?.role === 'KeyUser' ? 'strategic leader' : user?.role === 'Admin' ? 'administrator' : 'team member';

  const diagnosisTemplates: Record<ProblemCategory, string[]> = {
    risk: [
      `Based on typical ${industry} sector patterns and ${plan}-tier organizational profiles, I've identified key risk clusters that warrant attention.`,
      `For ${company}, the strategic risk landscape shows elevated concentration in operational and market-facing dimensions.`,
      `As a ${roleLabel}, your visibility into cross-functional risks is critical.`,
    ],
    growth: [
      `Analyzing growth potential for ${plan}-tier organizations in ${industry}, several strategic pathways emerge.`,
      `${company}'s current position suggests opportunities in both organic expansion and strategic partnerships.`,
      `Growth scenarios should balance ambition with execution capacity, particularly given your current stage.`,
    ],
    execution: [
      `Execution velocity for ${plan}-tier organizations typically correlates with decision-making clarity and resource alignment.`,
      `Common bottlenecks in ${industry} include cross-functional coordination and technology dependencies.`,
      `For ${company}, I recommend focusing on the initiatives with highest strategic impact-to-effort ratios.`,
    ],
    portfolio: [
      `Portfolio health assessment for ${company} reveals opportunities for rebalancing and prioritization.`,
      `${industry} best practices suggest maintaining a mix of core, adjacent, and transformational initiatives.`,
      `At the ${plan} tier, your portfolio should reflect both stability and growth ambitions.`,
    ],
    transformation: [
      `Digital maturity in ${industry} varies significantly; ${plan}-tier organizations typically have established foundations but gaps in advanced capabilities.`,
      `Transformation success requires alignment between technology investments and business model evolution.`,
      `For ${company}, a phased approach will reduce execution risk while building momentum.`,
    ],
    governance: [
      `Effective governance for ${plan}-tier organizations balances oversight with agility.`,
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

// Advanced keyword analysis with weighted scoring
interface CategoryScore {
  category: ProblemCategory;
  score: number;
  matchedKeywords: string[];
}

// Comprehensive keyword mappings with weights
const categoryKeywords: Record<ProblemCategory, { keyword: string; weight: number }[]> = {
  risk: [
    { keyword: 'risk', weight: 10 },
    { keyword: 'threat', weight: 9 },
    { keyword: 'vulnerability', weight: 9 },
    { keyword: 'exposure', weight: 8 },
    { keyword: 'danger', weight: 8 },
    { keyword: 'uncertainty', weight: 7 },
    { keyword: 'mitiga', weight: 8 },
    { keyword: 'contingency', weight: 7 },
    { keyword: 'resilience', weight: 6 },
    { keyword: 'crisis', weight: 9 },
    { keyword: 'disruption', weight: 7 },
    { keyword: 'compliance', weight: 6 },
    { keyword: 'audit', weight: 5 },
    { keyword: 'liability', weight: 7 },
    { keyword: 'hedge', weight: 6 },
    { keyword: 'insurance', weight: 5 },
    { keyword: 'safety', weight: 5 },
    { keyword: 'security', weight: 6 },
    { keyword: 'breach', weight: 8 },
    { keyword: 'failure', weight: 6 },
    { keyword: 'downside', weight: 7 },
    { keyword: 'worst case', weight: 8 },
  ],
  growth: [
    { keyword: 'growth', weight: 10 },
    { keyword: 'expand', weight: 9 },
    { keyword: 'scale', weight: 9 },
    { keyword: 'revenue', weight: 8 },
    { keyword: 'market share', weight: 9 },
    { keyword: 'acquisition', weight: 8 },
    { keyword: 'merger', weight: 8 },
    { keyword: 'partnership', weight: 7 },
    { keyword: 'new market', weight: 9 },
    { keyword: 'innovation', weight: 7 },
    { keyword: 'opportunity', weight: 6 },
    { keyword: 'customer', weight: 5 },
    { keyword: 'sales', weight: 6 },
    { keyword: 'competitive', weight: 6 },
    { keyword: 'differentiat', weight: 7 },
    { keyword: 'pricing', weight: 5 },
    { keyword: 'product', weight: 5 },
    { keyword: 'launch', weight: 7 },
    { keyword: 'international', weight: 7 },
    { keyword: 'global', weight: 6 },
    { keyword: 'invest', weight: 6 },
    { keyword: 'profit', weight: 7 },
    { keyword: 'margin', weight: 6 },
    { keyword: 'valuation', weight: 7 },
  ],
  execution: [
    { keyword: 'execute', weight: 10 },
    { keyword: 'deliver', weight: 9 },
    { keyword: 'implement', weight: 9 },
    { keyword: 'milestone', weight: 8 },
    { keyword: 'deadline', weight: 8 },
    { keyword: 'progress', weight: 7 },
    { keyword: 'slow', weight: 6 },
    { keyword: 'behind', weight: 7 },
    { keyword: 'delay', weight: 8 },
    { keyword: 'bottleneck', weight: 9 },
    { keyword: 'roadblock', weight: 9 },
    { keyword: 'blocker', weight: 9 },
    { keyword: 'timeline', weight: 7 },
    { keyword: 'schedule', weight: 6 },
    { keyword: 'velocity', weight: 7 },
    { keyword: 'capacity', weight: 6 },
    { keyword: 'team', weight: 4 },
    { keyword: 'hire', weight: 5 },
    { keyword: 'talent', weight: 5 },
    { keyword: 'okr', weight: 8 },
    { keyword: 'kpi', weight: 7 },
    { keyword: 'metric', weight: 5 },
    { keyword: 'tracking', weight: 6 },
    { keyword: 'accountability', weight: 7 },
    { keyword: 'project', weight: 4 },
    { keyword: 'agile', weight: 6 },
    { keyword: 'sprint', weight: 6 },
  ],
  portfolio: [
    { keyword: 'portfolio', weight: 10 },
    { keyword: 'priorit', weight: 9 },
    { keyword: 'initiative', weight: 8 },
    { keyword: 'resource', weight: 7 },
    { keyword: 'allocat', weight: 8 },
    { keyword: 'budget', weight: 7 },
    { keyword: 'funding', weight: 7 },
    { keyword: 'balance', weight: 6 },
    { keyword: 'trade-off', weight: 8 },
    { keyword: 'tradeoff', weight: 8 },
    { keyword: 'program', weight: 5 },
    { keyword: 'optimize', weight: 7 },
    { keyword: 'rationalize', weight: 8 },
    { keyword: 'sunset', weight: 8 },
    { keyword: 'retire', weight: 6 },
    { keyword: 'consolidate', weight: 7 },
    { keyword: 'synergy', weight: 6 },
    { keyword: 'overlap', weight: 6 },
    { keyword: 'duplicate', weight: 6 },
    { keyword: 'roi', weight: 7 },
    { keyword: 'return', weight: 5 },
    { keyword: 'value', weight: 4 },
    { keyword: 'impact', weight: 5 },
  ],
  transformation: [
    { keyword: 'digital', weight: 10 },
    { keyword: 'transform', weight: 10 },
    { keyword: 'technology', weight: 8 },
    { keyword: 'modern', weight: 7 },
    { keyword: 'automat', weight: 8 },
    { keyword: 'ai', weight: 9 },
    { keyword: 'machine learning', weight: 9 },
    { keyword: 'cloud', weight: 7 },
    { keyword: 'data', weight: 5 },
    { keyword: 'analytics', weight: 6 },
    { keyword: 'legacy', weight: 7 },
    { keyword: 'tech debt', weight: 8 },
    { keyword: 'platform', weight: 6 },
    { keyword: 'architecture', weight: 6 },
    { keyword: 'infrastructure', weight: 6 },
    { keyword: 'devops', weight: 7 },
    { keyword: 'agile', weight: 5 },
    { keyword: 'software', weight: 5 },
    { keyword: 'system', weight: 4 },
    { keyword: 'integration', weight: 6 },
    { keyword: 'api', weight: 6 },
    { keyword: 'cybersecurity', weight: 7 },
    { keyword: 'digitiz', weight: 9 },
    { keyword: 'digitalis', weight: 9 },
  ],
  governance: [
    { keyword: 'board', weight: 10 },
    { keyword: 'govern', weight: 10 },
    { keyword: 'esg', weight: 9 },
    { keyword: 'report', weight: 6 },
    { keyword: 'stakeholder', weight: 8 },
    { keyword: 'shareholder', weight: 8 },
    { keyword: 'investor', weight: 7 },
    { keyword: 'compliance', weight: 7 },
    { keyword: 'regulat', weight: 8 },
    { keyword: 'sustainab', weight: 8 },
    { keyword: 'transparent', weight: 6 },
    { keyword: 'accountab', weight: 7 },
    { keyword: 'oversight', weight: 8 },
    { keyword: 'committee', weight: 6 },
    { keyword: 'audit', weight: 7 },
    { keyword: 'disclosure', weight: 7 },
    { keyword: 'executive', weight: 5 },
    { keyword: 'leadership', weight: 5 },
    { keyword: 'communication', weight: 4 },
    { keyword: 'quarterly', weight: 5 },
    { keyword: 'annual', weight: 4 },
    { keyword: 'ethics', weight: 7 },
    { keyword: 'policy', weight: 5 },
    { keyword: 'framework', weight: 4 },
  ],
};

// Detect problem category using weighted scoring
function detectCategory(query: string): ProblemCategory {
  const lowerQuery = query.toLowerCase();
  const scores: CategoryScore[] = [];

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    const matchedKeywords: string[] = [];

    for (const { keyword, weight } of keywords) {
      if (lowerQuery.includes(keyword)) {
        score += weight;
        matchedKeywords.push(keyword);
      }
    }

    scores.push({
      category: category as ProblemCategory,
      score,
      matchedKeywords,
    });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Return highest scoring category, or 'portfolio' as default
  return scores[0].score > 0 ? scores[0].category : 'portfolio';
}

// Extract key entities and topics from query
function extractQueryInsights(query: string): {
  hasTimeframe: boolean;
  hasNumbers: boolean;
  isQuestion: boolean;
  urgencyLevel: 'low' | 'medium' | 'high';
  specificity: 'vague' | 'moderate' | 'specific';
  mentionedConcepts: string[];
} {
  const lowerQuery = query.toLowerCase();

  const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'crisis', 'now', 'today', 'emergency'];
  const moderateUrgency = ['soon', 'quickly', 'this week', 'priority', 'important'];

  const timeframes = ['quarter', 'month', 'year', 'week', 'q1', 'q2', 'q3', 'q4', '2024', '2025', 'next', 'this'];
  const numbers = query.match(/\d+/g);

  const strategicConcepts = [
    'swot', 'porter', 'bcg', 'pestle', 'pest', 'five forces', 'blue ocean',
    'competitive advantage', 'value chain', 'core competency', 'disruption',
    'first mover', 'differentiation', 'cost leadership', 'market leader'
  ];

  const mentionedConcepts = strategicConcepts.filter(c => lowerQuery.includes(c));

  let urgencyLevel: 'low' | 'medium' | 'high' = 'low';
  if (urgentKeywords.some(k => lowerQuery.includes(k))) {
    urgencyLevel = 'high';
  } else if (moderateUrgency.some(k => lowerQuery.includes(k))) {
    urgencyLevel = 'medium';
  }

  let specificity: 'vague' | 'moderate' | 'specific' = 'vague';
  if (query.length > 100 || mentionedConcepts.length > 0 || (numbers && numbers.length > 1)) {
    specificity = 'specific';
  } else if (query.length > 40 || numbers) {
    specificity = 'moderate';
  }

  return {
    hasTimeframe: timeframes.some(t => lowerQuery.includes(t)),
    hasNumbers: !!numbers && numbers.length > 0,
    isQuestion: query.includes('?') || lowerQuery.startsWith('how') || lowerQuery.startsWith('what') || lowerQuery.startsWith('why') || lowerQuery.startsWith('should'),
    urgencyLevel,
    specificity,
    mentionedConcepts,
  };
}

// Industry-specific insights
const industryInsights: Record<string, {
  trends: string[];
  challenges: string[];
  opportunities: string[];
}> = {
  Technology: {
    trends: ['AI/ML adoption accelerating', 'Platform consolidation', 'Security-first architecture', 'Developer experience focus'],
    challenges: ['Talent competition', 'Technical debt', 'Rapid obsolescence', 'Regulatory complexity'],
    opportunities: ['Adjacent market expansion', 'Enterprise upsell', 'API monetization', 'Vertical integration'],
  },
  Healthcare: {
    trends: ['Telehealth normalization', 'AI diagnostics', 'Value-based care', 'Patient experience digitization'],
    challenges: ['Regulatory compliance', 'Data privacy', 'Legacy system integration', 'Workforce burnout'],
    opportunities: ['Digital therapeutics', 'Population health', 'Care coordination platforms', 'Home health expansion'],
  },
  Finance: {
    trends: ['Embedded finance', 'Real-time payments', 'ESG integration', 'Open banking expansion'],
    challenges: ['Fintech disruption', 'Regulatory burden', 'Cybersecurity threats', 'Legacy modernization'],
    opportunities: ['Wealth tech', 'SMB banking', 'Cross-border payments', 'Alternative data'],
  },
  Retail: {
    trends: ['Unified commerce', 'Sustainability focus', 'Social commerce', 'Quick commerce'],
    challenges: ['Supply chain volatility', 'Margin pressure', 'Customer acquisition costs', 'Labor shortages'],
    opportunities: ['Private label expansion', 'Retail media', 'Subscription models', 'Experience retail'],
  },
  Manufacturing: {
    trends: ['Industry 4.0', 'Reshoring', 'Circular economy', 'Predictive maintenance'],
    challenges: ['Supply chain resilience', 'Skilled labor gap', 'Sustainability mandates', 'Capex constraints'],
    opportunities: ['Smart factory', 'Servitization', 'Direct-to-consumer', 'Custom manufacturing'],
  },
  default: {
    trends: ['Digital acceleration', 'Sustainability imperative', 'Workforce transformation', 'Platform business models'],
    challenges: ['Market uncertainty', 'Competitive pressure', 'Talent acquisition', 'Technology debt'],
    opportunities: ['Digital channels', 'New revenue streams', 'Operational efficiency', 'Strategic partnerships'],
  },
};

// Generate enhanced diagnosis with query context
function generateEnhancedDiagnosis(
  query: string,
  user: UserProfile | null,
  category: ProblemCategory,
  insights: ReturnType<typeof extractQueryInsights>
): string {
  const industry = user?.industry || 'Technology';
  const plan = user?.plan || 'Enterprise';
  const company = user?.company || 'your organization';
  const roleLabel = user?.role === 'KeyUser' ? 'strategic leader' : user?.role === 'Admin' ? 'administrator' : 'team member';

  const industryData = industryInsights[industry] || industryInsights.default;

  let diagnosis = generateDiagnosis(query, user, category);

  // Add urgency-aware opening
  if (insights.urgencyLevel === 'high') {
    diagnosis = `I understand the urgency. Let me provide an accelerated assessment. ` + diagnosis;
  }

  // Add industry-specific context
  const relevantTrend = industryData.trends[Math.floor(Math.random() * industryData.trends.length)];
  const relevantChallenge = industryData.challenges[Math.floor(Math.random() * industryData.challenges.length)];

  diagnosis += ` Looking at ${industry} sector dynamics, "${relevantTrend}" is reshaping competitive landscapes, while "${relevantChallenge}" remains a common strategic friction point.`;

  // Add concept-specific depth if strategic frameworks mentioned
  if (insights.mentionedConcepts.length > 0) {
    const concept = insights.mentionedConcepts[0];
    const conceptInsights: Record<string, string> = {
      'swot': 'Your mention of SWOT analysis suggests you\'re looking for a holistic view. I\'ll ensure we balance internal capabilities with external factors.',
      'porter': 'Referencing Porter\'s framework indicates competitive positioning is key. Let\'s examine the five forces affecting your strategic options.',
      'bcg': 'The BCG matrix reference suggests portfolio optimization is a priority. I\'ll help you categorize initiatives by market growth and relative share.',
      'blue ocean': 'Blue Ocean thinking points to value innovation. Let\'s explore how to make competition irrelevant by creating new market space.',
      'five forces': 'Competitive force analysis is crucial here. I\'ll help you map supplier power, buyer power, competitive rivalry, and substitution threats.',
    };
    diagnosis += ` ${conceptInsights[concept] || 'I\'ll incorporate the strategic frameworks you\'ve mentioned into my analysis.'}`;
  }

  // Add timeframe acknowledgment
  if (insights.hasTimeframe) {
    diagnosis += ` I\'ll calibrate recommendations to align with your planning horizon.`;
  }

  return diagnosis;
}

// Generate contextual follow-ups based on query
function generateContextualFollowUps(
  category: ProblemCategory,
  insights: ReturnType<typeof extractQueryInsights>,
  user: UserProfile | null
): string[] {
  const baseFollowUps = generateFollowUps(category);
  const contextualFollowUps: string[] = [];

  const industry = user?.industry || 'Technology';
  const industryData = industryInsights[industry] || industryInsights.default;

  // Add specificity-based follow-ups
  if (insights.specificity === 'vague') {
    contextualFollowUps.push('Could you share more details about your specific strategic context?');
    contextualFollowUps.push('What\'s the primary outcome you\'re hoping to achieve?');
  }

  // Add industry-specific follow-ups
  const opportunity = industryData.opportunities[Math.floor(Math.random() * industryData.opportunities.length)];
  contextualFollowUps.push(`Would you like me to explore how "${opportunity}" might apply to your situation?`);

  // Add timeframe-based follow-ups
  if (!insights.hasTimeframe) {
    contextualFollowUps.push('What\'s your target timeline for this strategic initiative?');
  }

  // Combine and limit
  return [...contextualFollowUps.slice(0, 2), ...baseFollowUps.slice(0, 2)];
}

// Main response generator
export function generateAdvisorResponse(
  query: string,
  user: UserProfile | null
): AdvisorResponse {
  const category = detectCategory(query);
  const userPlan = user?.plan || 'Free';
  const insights = extractQueryInsights(query);

  const diagnosis = generateEnhancedDiagnosis(query, user, category, insights);
  const tools = getToolsForCategory(category, userPlan);
  const actions = generateActions(category);
  const followUps = generateContextualFollowUps(category, insights, user);

  // Enhanced confidence scoring
  let confidence = 70;

  // User context bonuses
  if (user) {
    confidence += 8;
    if (user.industry) confidence += 4;
    if (user.company) confidence += 3;
  }

  // Query quality bonuses
  if (insights.specificity === 'specific') confidence += 10;
  else if (insights.specificity === 'moderate') confidence += 5;

  if (insights.isQuestion) confidence += 3;
  if (insights.mentionedConcepts.length > 0) confidence += 5;
  if (insights.hasTimeframe) confidence += 3;

  // Cap confidence
  confidence = Math.min(confidence, 96);

  // Urgency affects confidence display
  if (insights.urgencyLevel === 'high') {
    confidence = Math.max(confidence - 5, 65); // Slightly lower for urgent queries to show we're being careful
  }

  const consultingNotes: string[] = [
    'For a deeper review with customized frameworks and hands-on facilitation, you can request a consulting sprint from Ambidexters.',
    'Want to go deeper? Our strategy consultants can run a comprehensive workshop tailored to your specific challenges.',
    'This analysis scratches the surface. Consider a strategic deep-dive session for actionable playbooks.',
    'Ready for implementation support? Our consulting team can help translate these insights into execution plans.',
  ];

  return {
    diagnosis,
    suggestedTools: tools,
    recommendedActions: actions,
    followUpQuestions: followUps,
    consultingNote: consultingNotes[Math.floor(Math.random() * consultingNotes.length)],
    confidence,
  };
}
