// Demo data for Ambi-Sight Reloaded

export type Persona = 'strategy-leader' | 'risk-officer' | 'product-owner' | 'admin';

export interface PersonaInfo {
  id: Persona;
  name: string;
  role: string;
  avatar: string;
}

export const personas: PersonaInfo[] = [
  { id: 'strategy-leader', name: 'Sarah Chen', role: 'Chief Strategy Officer', avatar: 'SC' },
  { id: 'risk-officer', name: 'Michael Torres', role: 'Chief Risk Officer', avatar: 'MT' },
  { id: 'product-owner', name: 'Emily Park', role: 'VP Product', avatar: 'EP' },
  { id: 'admin', name: 'Admin User', role: 'Platform Administrator', avatar: 'AD' },
];

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: 'teal' | 'amber' | 'magenta' | 'lime' | 'purple';
  timeSeries: TimeSeriesPoint[];
}

// Generate time series data
const generateTimeSeries = (baseValue: number, volatility: number, months: number = 12): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  let value = baseValue;
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    value = Math.max(0, Math.min(100, value + (Math.random() - 0.5) * volatility));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: Math.round(value * 10) / 10,
    });
  }
  return data;
};

export const kpis: KPI[] = [
  {
    id: 'strategic-agility',
    name: 'Strategic Agility',
    value: 78,
    change: 5.2,
    trend: 'up',
    color: 'teal',
    timeSeries: generateTimeSeries(72, 8),
  },
  {
    id: 'risk-exposure',
    name: 'Risk Exposure',
    value: 34,
    change: -2.1,
    trend: 'down',
    color: 'amber',
    timeSeries: generateTimeSeries(38, 6),
  },
  {
    id: 'execution-readiness',
    name: 'Execution Readiness',
    value: 85,
    change: 3.8,
    trend: 'up',
    color: 'lime',
    timeSeries: generateTimeSeries(80, 5),
  },
  {
    id: 'market-volatility',
    name: 'Market Volatility',
    value: 42,
    change: 8.5,
    trend: 'up',
    color: 'magenta',
    timeSeries: generateTimeSeries(35, 12),
  },
  {
    id: 'portfolio-health',
    name: 'Portfolio Health',
    value: 72,
    change: 1.2,
    trend: 'stable',
    color: 'purple',
    timeSeries: generateTimeSeries(70, 4),
  },
  {
    id: 'innovation-index',
    name: 'Innovation Index',
    value: 68,
    change: 4.5,
    trend: 'up',
    color: 'teal',
    timeSeries: generateTimeSeries(62, 7),
  },
];

export interface Initiative {
  id: string;
  name: string;
  owner: string;
  portfolio: string;
  riskBand: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  spend: number;
  nextReview: string;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  growthScore: number;
  riskScore: number;
  strategicFit: number;
  capabilityStrain: number;
}

export const initiatives: Initiative[] = [
  {
    id: 'init-1',
    name: 'AI-Native Customer Platform',
    owner: 'Emily Park',
    portfolio: 'Digital Transformation',
    riskBand: 'Medium',
    confidence: 78,
    spend: 2400000,
    nextReview: '2024-02-15',
    status: 'On Track',
    growthScore: 85,
    riskScore: 45,
    strategicFit: 92,
    capabilityStrain: 60,
  },
  {
    id: 'init-2',
    name: 'MENA Market Expansion',
    owner: 'James Wilson',
    portfolio: 'Growth Markets',
    riskBand: 'High',
    confidence: 62,
    spend: 5800000,
    nextReview: '2024-01-30',
    status: 'At Risk',
    growthScore: 78,
    riskScore: 72,
    strategicFit: 75,
    capabilityStrain: 85,
  },
  {
    id: 'init-3',
    name: 'Zero-Trust Security Framework',
    owner: 'Michael Torres',
    portfolio: 'Infrastructure',
    riskBand: 'Low',
    confidence: 91,
    spend: 1200000,
    nextReview: '2024-03-01',
    status: 'On Track',
    growthScore: 40,
    riskScore: 25,
    strategicFit: 88,
    capabilityStrain: 35,
  },
  {
    id: 'init-4',
    name: 'Sustainable Supply Chain',
    owner: 'Lisa Chen',
    portfolio: 'Operations',
    riskBand: 'Medium',
    confidence: 74,
    spend: 3100000,
    nextReview: '2024-02-28',
    status: 'On Track',
    growthScore: 55,
    riskScore: 48,
    strategicFit: 82,
    capabilityStrain: 55,
  },
  {
    id: 'init-5',
    name: 'Next-Gen Analytics Engine',
    owner: 'David Kim',
    portfolio: 'Digital Transformation',
    riskBand: 'Medium',
    confidence: 83,
    spend: 1800000,
    nextReview: '2024-02-10',
    status: 'On Track',
    growthScore: 72,
    riskScore: 38,
    strategicFit: 95,
    capabilityStrain: 42,
  },
  {
    id: 'init-6',
    name: 'Workforce Automation Hub',
    owner: 'Sarah Chen',
    portfolio: 'Operations',
    riskBand: 'Critical',
    confidence: 55,
    spend: 4200000,
    nextReview: '2024-01-25',
    status: 'Delayed',
    growthScore: 68,
    riskScore: 82,
    strategicFit: 70,
    capabilityStrain: 90,
  },
];

export interface Scenario {
  id: string;
  name: string;
  description: string;
  tags: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: string;
  linkedInitiatives: string[];
  multipliers: {
    risk: number;
    growth: number;
    volatility: number;
  };
}

export const scenarios: Scenario[] = [
  {
    id: 'scenario-1',
    name: 'Aggressive Expansion in MENA',
    description: 'Pursue rapid market entry across Middle East and North Africa with significant capital deployment and partnership strategy.',
    tags: ['Growth', 'International', 'High Investment'],
    riskLevel: 'High',
    timeHorizon: '18-24 months',
    linkedInitiatives: ['init-2', 'init-4'],
    multipliers: { risk: 1.4, growth: 1.6, volatility: 1.3 },
  },
  {
    id: 'scenario-2',
    name: 'Efficiency & Cost Discipline',
    description: 'Focus on operational excellence, margin improvement, and selective investment in core capabilities.',
    tags: ['Cost Optimization', 'Margins', 'Low Risk'],
    riskLevel: 'Low',
    timeHorizon: '12-18 months',
    linkedInitiatives: ['init-3', 'init-4'],
    multipliers: { risk: 0.7, growth: 0.9, volatility: 0.8 },
  },
  {
    id: 'scenario-3',
    name: 'Platform Bet on AI-Native Services',
    description: 'Transform product portfolio around AI-first architecture and generative capabilities.',
    tags: ['AI', 'Innovation', 'Technology'],
    riskLevel: 'Medium',
    timeHorizon: '24-36 months',
    linkedInitiatives: ['init-1', 'init-5'],
    multipliers: { risk: 1.2, growth: 1.5, volatility: 1.4 },
  },
  {
    id: 'scenario-4',
    name: 'Defensive Consolidation',
    description: 'Protect market share, reduce exposure, and build resilience against economic headwinds.',
    tags: ['Defense', 'Risk Mitigation', 'Stability'],
    riskLevel: 'Low',
    timeHorizon: '6-12 months',
    linkedInitiatives: ['init-3'],
    multipliers: { risk: 0.6, growth: 0.8, volatility: 0.7 },
  },
];

export interface RiskCategory {
  id: string;
  name: string;
  score: number;
  trend: 'improving' | 'worsening' | 'stable';
}

export const riskCategories: RiskCategory[] = [
  { id: 'market', name: 'Market Risk', score: 45, trend: 'stable' },
  { id: 'operational', name: 'Operational Risk', score: 38, trend: 'improving' },
  { id: 'technology', name: 'Technology Risk', score: 52, trend: 'worsening' },
  { id: 'regulatory', name: 'Regulatory Risk', score: 28, trend: 'stable' },
  { id: 'talent', name: 'Talent Risk', score: 42, trend: 'improving' },
  { id: 'financial', name: 'Financial Risk', score: 35, trend: 'stable' },
];

export interface Insight {
  id: string;
  text: string;
  type: 'warning' | 'opportunity' | 'info' | 'success';
  persona: Persona[];
}

export const insights: Insight[] = [
  {
    id: 'insight-1',
    text: 'Strategic Agility improved 5.2% this quarter, driven by faster decision cycles in Portfolio Alpha.',
    type: 'success',
    persona: ['strategy-leader', 'product-owner'],
  },
  {
    id: 'insight-2',
    text: 'MENA Expansion initiative shows elevated risk signals. Consider phased rollout approach.',
    type: 'warning',
    persona: ['strategy-leader', 'risk-officer'],
  },
  {
    id: 'insight-3',
    text: 'Technology risk trending upward. Legacy system dependencies identified in 3 critical initiatives.',
    type: 'warning',
    persona: ['risk-officer', 'admin'],
  },
  {
    id: 'insight-4',
    text: 'AI-Native Platform confidence at 78% - ahead of schedule for Q2 milestone.',
    type: 'success',
    persona: ['product-owner', 'strategy-leader'],
  },
  {
    id: 'insight-5',
    text: 'Workforce Automation Hub requires executive attention - capability strain at critical levels.',
    type: 'warning',
    persona: ['strategy-leader', 'risk-officer', 'admin'],
  },
  {
    id: 'insight-6',
    text: 'Market volatility up 8.5% - scenario modeling recommends diversification in Growth Markets portfolio.',
    type: 'info',
    persona: ['strategy-leader', 'risk-officer'],
  },
];

export interface AdvisorResponse {
  keywords: string[];
  response: string;
  confidence: number;
  relatedMetrics: string[];
}

export const advisorResponses: AdvisorResponse[] = [
  {
    keywords: ['risk', 'cluster', 'top'],
    response: `Based on current analysis, your top 3 risk clusters are:

1. **Technology Dependency Risk** (Score: 52/100)
   - Legacy system integration challenges in Digital Transformation portfolio
   - 3 initiatives with critical tech debt exposure

2. **Execution Capacity Risk** (Score: 48/100)
   - Workforce Automation Hub showing 90% capability strain
   - Resource conflicts between MENA expansion and core operations

3. **Market Timing Risk** (Score: 45/100)
   - MENA market entry timing concerns amid regional volatility
   - Competitor activity in AI-Native services accelerating

Recommended actions: Consider resource reallocation and phased initiative sequencing.`,
    confidence: 87,
    relatedMetrics: ['Risk Exposure', 'Execution Readiness'],
  },
  {
    keywords: ['initiative', 'downside', 'disproportionate'],
    response: `Analysis of initiative risk-reward profiles reveals:

**High Downside Exposure Initiatives:**

1. **Workforce Automation Hub** - Critical Risk
   - $4.2M spend with only 55% confidence
   - Capability strain at 90% - team burnout signals detected
   - Potential impact: 2.3x budget overrun if delayed further

2. **MENA Market Expansion** - High Risk
   - $5.8M committed with 62% confidence
   - Regulatory uncertainty in 2 target markets
   - Downside scenario: 40% revenue shortfall vs. projections

Recommendation: Initiate steering committee review for both initiatives within 2 weeks.`,
    confidence: 82,
    relatedMetrics: ['Portfolio Health', 'Risk Exposure'],
  },
  {
    keywords: ['warning', 'signal', 'early', 'portfolio'],
    response: `Early Warning Signals Detected in Portfolio Beta:

⚠️ **Velocity Decline**
- Sprint completion rate dropped 15% over last 3 weeks
- Root cause: Key dependency on external API integration

⚠️ **Stakeholder Sentiment**
- Executive sponsor engagement down 40%
- Last steering committee meeting postponed twice

⚠️ **Budget Burn Rate**
- Currently at 115% of planned rate
- Projected shortfall: $340K by Q2 end

✅ **Positive Signals**
- Team morale metrics stable
- Customer validation feedback strong

Suggested response: Schedule portfolio health review with sponsors.`,
    confidence: 79,
    relatedMetrics: ['Strategic Agility', 'Execution Readiness'],
  },
  {
    keywords: ['agility', 'improve', 'how'],
    response: `Strategic Agility Enhancement Recommendations:

Your current Strategic Agility score is **78/100** (+5.2% this quarter).

**Quick Wins (0-30 days):**
1. Reduce decision escalation levels from 4 to 2 for initiatives <$500K
2. Implement weekly cross-portfolio sync (currently monthly)
3. Enable real-time KPI dashboards for all initiative leads

**Medium-term (30-90 days):**
1. Deploy scenario simulation for top 5 initiatives
2. Create rapid response protocols for market signals
3. Establish innovation sprint capacity (10% of resources)

**Long-term (90+ days):**
1. Build predictive analytics for initiative health
2. Develop talent mobility program across portfolios
3. Create strategic optionality reserves

Projected impact: +12-15 points in Strategic Agility within 6 months.`,
    confidence: 85,
    relatedMetrics: ['Strategic Agility', 'Innovation Index'],
  },
];

export const resourceAllocationData = [
  { portfolio: 'Digital Transformation', allocated: 4200, utilized: 3800, planned: 4500 },
  { portfolio: 'Growth Markets', allocated: 5800, utilized: 5200, planned: 6200 },
  { portfolio: 'Infrastructure', allocated: 1200, utilized: 1100, planned: 1400 },
  { portfolio: 'Operations', allocated: 7300, utilized: 6900, planned: 7800 },
];

export const portfolios = ['Digital Transformation', 'Growth Markets', 'Infrastructure', 'Operations'];
export const owners = ['Emily Park', 'James Wilson', 'Michael Torres', 'Lisa Chen', 'David Kim', 'Sarah Chen'];
export const horizons = ['0-6 months', '6-12 months', '12-18 months', '18-24 months', '24+ months'];
