// Diagnostic Wizard - Problem-to-Tools Mapping Engine
// Guides users through structured diagnosis to recommend appropriate strategy tools

import type { Plan } from './users';
import { strategyToolsLibrary, type StrategyToolFull, type ToolCategory } from './strategyToolsLibrary';

// Step 1: Primary Challenge Categories
export interface ChallengeCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
  relatedCategories: ToolCategory[];
}

export const challengeCategories: ChallengeCategory[] = [
  {
    id: 'growth-stagnation',
    title: 'Growth & Market Position',
    description: 'Revenue growth has slowed, market share is declining, or new opportunities are unclear',
    icon: '📈',
    examples: [
      'Revenue growth has plateaued',
      'Competitors are gaining market share',
      'Unclear which markets to enter',
      'Product-market fit concerns',
    ],
    relatedCategories: ['Growth', 'Diagnosis', 'Scenarios'],
  },
  {
    id: 'execution-bottlenecks',
    title: 'Execution & Delivery',
    description: 'Strategic initiatives are delayed, resources are misaligned, or results are below expectations',
    icon: '⚡',
    examples: [
      'Projects consistently miss deadlines',
      'Resources spread too thin',
      'Lack of accountability',
      'Poor cross-functional coordination',
    ],
    relatedCategories: ['Execution', 'Portfolio', 'Governance'],
  },
  {
    id: 'risk-uncertainty',
    title: 'Risk & Uncertainty',
    description: 'Facing significant threats, regulatory changes, or need to build resilience',
    icon: '🛡️',
    examples: [
      'Emerging competitive threats',
      'Regulatory changes ahead',
      'Supply chain vulnerabilities',
      'Cybersecurity concerns',
    ],
    relatedCategories: ['Risk', 'Scenarios', 'Governance'],
  },
  {
    id: 'digital-transformation',
    title: 'Digital & Technology',
    description: 'Need to modernize technology, adopt AI, or accelerate digital capabilities',
    icon: '💻',
    examples: [
      'Legacy systems holding us back',
      'Competitors have better digital experience',
      'AI adoption questions',
      'Technical debt accumulating',
    ],
    relatedCategories: ['Digital', 'Innovation', 'Execution'],
  },
  {
    id: 'portfolio-optimization',
    title: 'Portfolio & Resource Allocation',
    description: 'Too many initiatives, unclear priorities, or suboptimal resource distribution',
    icon: '📊',
    examples: [
      'Too many competing priorities',
      'Unclear which initiatives to fund',
      'Resources misallocated',
      'Need to sunset underperformers',
    ],
    relatedCategories: ['Portfolio', 'Finance', 'Execution'],
  },
  {
    id: 'innovation-pipeline',
    title: 'Innovation & Future Readiness',
    description: 'Innovation pipeline is weak, R&D investments not paying off, or future direction unclear',
    icon: '💡',
    examples: [
      'Innovation pipeline is empty',
      'R&D spend not generating returns',
      'Being disrupted by startups',
      'Unclear 5-year vision',
    ],
    relatedCategories: ['Innovation', 'Growth', 'Scenarios'],
  },
  {
    id: 'governance-stakeholders',
    title: 'Governance & Stakeholders',
    description: 'Board communication challenges, ESG pressures, or stakeholder alignment issues',
    icon: '🏛️',
    examples: [
      'Board asking tough questions',
      'ESG reporting requirements',
      'Investor relations challenges',
      'Stakeholder misalignment',
    ],
    relatedCategories: ['Governance', 'Risk', 'Finance'],
  },
  {
    id: 'financial-performance',
    title: 'Financial Strategy',
    description: 'Profitability pressures, capital allocation decisions, or valuation concerns',
    icon: '💰',
    examples: [
      'Margins under pressure',
      'Capital allocation unclear',
      'Valuation multiple declining',
      'Cost structure issues',
    ],
    relatedCategories: ['Finance', 'Portfolio', 'Execution'],
  },
];

// Step 2: Urgency Level
export interface UrgencyLevel {
  id: string;
  title: string;
  description: string;
  icon: string;
  multiplier: number; // Affects tool recommendations
}

export const urgencyLevels: UrgencyLevel[] = [
  {
    id: 'crisis',
    title: 'Crisis Mode',
    description: 'Immediate action required - existential threat or major opportunity window closing',
    icon: '🚨',
    multiplier: 1.5,
  },
  {
    id: 'urgent',
    title: 'Urgent',
    description: 'Need results within 3 months - significant business impact if delayed',
    icon: '⚠️',
    multiplier: 1.2,
  },
  {
    id: 'important',
    title: 'Important',
    description: 'Strategic priority for the next 6-12 months - proactive planning',
    icon: '📌',
    multiplier: 1.0,
  },
  {
    id: 'exploratory',
    title: 'Exploratory',
    description: 'Building capabilities for the future - no immediate pressure',
    icon: '🔭',
    multiplier: 0.8,
  },
];

// Step 3: Scope/Scale
export interface ScopeLevel {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const scopeLevels: ScopeLevel[] = [
  {
    id: 'enterprise',
    title: 'Enterprise-Wide',
    description: 'Affects the entire organization across all business units',
    icon: '🏢',
  },
  {
    id: 'business-unit',
    title: 'Business Unit',
    description: 'Focused on a specific division or major product line',
    icon: '📦',
  },
  {
    id: 'function',
    title: 'Functional Area',
    description: 'Limited to a specific function (e.g., Sales, Operations, IT)',
    icon: '⚙️',
  },
  {
    id: 'initiative',
    title: 'Single Initiative',
    description: 'Focused on one specific project or initiative',
    icon: '🎯',
  },
];

// Step 4: Current Capabilities
export interface CapabilityQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; score: number }[];
}

export const capabilityQuestions: CapabilityQuestion[] = [
  {
    id: 'data-maturity',
    question: 'How would you describe your data and analytics capabilities?',
    options: [
      { id: 'basic', label: 'Basic - Spreadsheets and manual reporting', score: 1 },
      { id: 'developing', label: 'Developing - Some dashboards and KPI tracking', score: 2 },
      { id: 'advanced', label: 'Advanced - Integrated analytics and insights', score: 3 },
      { id: 'leading', label: 'Leading - Predictive analytics and AI-driven', score: 4 },
    ],
  },
  {
    id: 'strategy-process',
    question: 'How mature is your strategic planning process?',
    options: [
      { id: 'ad-hoc', label: 'Ad-hoc - Reactive, no formal process', score: 1 },
      { id: 'annual', label: 'Annual - Yearly planning cycle', score: 2 },
      { id: 'continuous', label: 'Continuous - Regular reviews and adaptation', score: 3 },
      { id: 'dynamic', label: 'Dynamic - Real-time strategy with scenario planning', score: 4 },
    ],
  },
  {
    id: 'change-capacity',
    question: 'What is your organization\'s capacity for change?',
    options: [
      { id: 'limited', label: 'Limited - Change fatigue, resistance common', score: 1 },
      { id: 'moderate', label: 'Moderate - Can handle 1-2 major changes', score: 2 },
      { id: 'good', label: 'Good - Agile culture, embraces change', score: 3 },
      { id: 'excellent', label: 'Excellent - Change is a core competency', score: 4 },
    ],
  },
];

// Diagnosis Result
export interface DiagnosisResult {
  primaryChallenge: ChallengeCategory;
  urgency: UrgencyLevel;
  scope: ScopeLevel;
  capabilityScores: Record<string, number>;
  overallMaturity: number;
  recommendedTools: StrategyToolFull[];
  quickWins: StrategyToolFull[];
  advancedTools: StrategyToolFull[];
  suggestedApproach: string;
  estimatedTimeframe: string;
  nextSteps: string[];
}

// Tool Recommendation Engine
export function generateDiagnosisResult(
  challengeId: string,
  urgencyId: string,
  scopeId: string,
  capabilityAnswers: Record<string, string>,
  userPlan: Plan
): DiagnosisResult {
  const challenge = challengeCategories.find(c => c.id === challengeId)!;
  const urgency = urgencyLevels.find(u => u.id === urgencyId)!;
  const scope = scopeLevels.find(s => s.id === scopeId)!;

  // Calculate capability scores
  const capabilityScores: Record<string, number> = {};
  let totalScore = 0;
  capabilityQuestions.forEach(q => {
    const answer = capabilityAnswers[q.id];
    const option = q.options.find(o => o.id === answer);
    const score = option?.score || 2;
    capabilityScores[q.id] = score;
    totalScore += score;
  });
  const overallMaturity = totalScore / capabilityQuestions.length;

  // Get tools from related categories
  const relatedTools = strategyToolsLibrary.filter(t =>
    challenge.relatedCategories.includes(t.category)
  );

  // Filter by plan access
  const planHierarchy: Record<Plan, number> = { 'Free': 0, 'Pro': 1, 'Enterprise': 2 };
  const accessibleTools = relatedTools.filter(t =>
    planHierarchy[userPlan] >= planHierarchy[t.requiredPlan]
  );

  // Score and sort tools
  const scoredTools = accessibleTools.map(tool => {
    let score = 0;

    // Complexity matching based on maturity
    if (overallMaturity <= 2 && tool.complexity === 'Intro') score += 3;
    if (overallMaturity > 2 && overallMaturity <= 3 && tool.complexity === 'Intermediate') score += 3;
    if (overallMaturity > 3 && tool.complexity === 'Advanced') score += 3;

    // Urgency matching
    if (urgency.id === 'crisis' && tool.complexity === 'Intro') score += 2;
    if (urgency.id === 'exploratory' && tool.complexity === 'Advanced') score += 2;

    // Category relevance (first category gets higher score)
    const categoryIndex = challenge.relatedCategories.indexOf(tool.category);
    score += (3 - categoryIndex);

    return { tool, score };
  });

  scoredTools.sort((a, b) => b.score - a.score);

  // Split into recommended, quick wins, and advanced
  const recommendedTools = scoredTools.slice(0, 5).map(s => s.tool);
  const quickWins = accessibleTools
    .filter(t => t.complexity === 'Intro')
    .slice(0, 3);
  const advancedTools = relatedTools
    .filter(t => t.complexity === 'Advanced' || t.requiredPlan !== 'Free')
    .slice(0, 3);

  // Generate suggested approach
  const approachMap: Record<string, string> = {
    'crisis': 'Focus on rapid assessment and immediate action. Start with the simplest diagnostic tools to quickly understand the situation, then move to targeted interventions.',
    'urgent': 'Prioritize tools that can deliver insights within weeks, not months. Consider parallel workstreams to accelerate progress.',
    'important': 'Take a structured approach starting with comprehensive diagnosis, then building a phased action plan with clear milestones.',
    'exploratory': 'Use this as an opportunity to build strategic capabilities. Experiment with advanced tools and invest in developing internal expertise.',
  };

  // Generate timeframe
  const timeframeMap: Record<string, string> = {
    'crisis': '2-4 weeks for initial actions',
    'urgent': '1-3 months for meaningful progress',
    'important': '3-6 months for full implementation',
    'exploratory': '6-12 months for capability building',
  };

  // Generate next steps
  const nextSteps = [
    `Start with ${recommendedTools[0]?.name || 'Strategic Health Check'} to establish baseline`,
    `Schedule kickoff session with key stakeholders`,
    `Define success metrics and review cadence`,
    urgency.id === 'crisis'
      ? 'Set up daily stand-ups to track progress'
      : 'Establish weekly progress reviews',
    'Consider engaging Ambidexters consulting for accelerated results',
  ];

  return {
    primaryChallenge: challenge,
    urgency,
    scope,
    capabilityScores,
    overallMaturity,
    recommendedTools,
    quickWins,
    advancedTools,
    suggestedApproach: approachMap[urgency.id],
    estimatedTimeframe: timeframeMap[urgency.id],
    nextSteps,
  };
}

// Wizard Step Definition
export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export const wizardSteps: WizardStep[] = [
  {
    id: 'challenge',
    title: 'Primary Challenge',
    description: 'What strategic challenge are you facing?',
  },
  {
    id: 'urgency',
    title: 'Urgency Level',
    description: 'How urgent is this challenge?',
  },
  {
    id: 'scope',
    title: 'Scope',
    description: 'What is the scope of this challenge?',
  },
  {
    id: 'capabilities',
    title: 'Current Capabilities',
    description: 'Help us understand your current state',
  },
  {
    id: 'results',
    title: 'Recommendations',
    description: 'Your personalized tool recommendations',
  },
];
