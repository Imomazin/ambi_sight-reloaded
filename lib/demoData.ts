// Demo data for Lumina S

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

// World-class Strategic Management Case Studies
export interface CaseStudy {
  id: string;
  company: string;
  logo: string;
  title: string;
  industry: string;
  year: string;
  challenge: string;
  strategy: string;
  outcome: string;
  keyMetrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  strategicPillars: string[];
  accentColor: 'teal' | 'amber' | 'magenta' | 'lime' | 'purple';
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-apple',
    company: 'Apple',
    logo: '🍎',
    title: 'Ecosystem Lock-In Through Vertical Integration',
    industry: 'Technology',
    year: '2007-2023',
    challenge: 'Commoditization pressure in hardware markets with shrinking margins and intense competition from Android ecosystem.',
    strategy: 'Created an integrated hardware-software-services ecosystem that prioritizes user experience and cross-device synergy. Shifted revenue model from hardware-dependent to services-recurring.',
    outcome: 'Services revenue grew from $7.5B (2013) to $85B+ (2023), creating unprecedented customer loyalty with 90%+ retention rates.',
    keyMetrics: [
      { label: 'Services Revenue', value: '$85B+', improvement: '+1,033%' },
      { label: 'Customer Retention', value: '92%', improvement: '+15%' },
      { label: 'Market Cap', value: '$3T', improvement: 'First ever' },
    ],
    strategicPillars: ['Vertical Integration', 'Ecosystem Strategy', 'Premium Positioning', 'Services Pivot'],
    accentColor: 'teal',
  },
  {
    id: 'case-microsoft',
    company: 'Microsoft',
    logo: '⊞',
    title: 'Cloud-First Transformation Under Nadella',
    industry: 'Technology',
    year: '2014-2023',
    challenge: 'Declining PC market, failed mobile strategy, cultural stagnation, and perception as a legacy enterprise vendor.',
    strategy: 'Pivoted from "Windows-first" to "cloud-first, mobile-first" strategy. Embraced open source, acquired LinkedIn & GitHub, and positioned Azure as AWS alternative.',
    outcome: 'Market cap grew from $300B to $2.8T. Azure became #2 cloud platform with 23% market share. Culture transformed to growth mindset.',
    keyMetrics: [
      { label: 'Market Cap Growth', value: '833%', improvement: '$300B→$2.8T' },
      { label: 'Cloud Revenue', value: '$110B', improvement: 'From $0' },
      { label: 'Azure Market Share', value: '23%', improvement: '#2 Global' },
    ],
    strategicPillars: ['Cloud Transformation', 'Cultural Renewal', 'Strategic M&A', 'Open Source Embrace'],
    accentColor: 'purple',
  },
  {
    id: 'case-netflix',
    company: 'Netflix',
    logo: '🎬',
    title: 'From DVD Mailer to Streaming Giant',
    industry: 'Entertainment',
    year: '2007-2023',
    challenge: 'Core DVD rental business facing disruption from digital distribution. Blockbuster had 9,000 stores and dominant market position.',
    strategy: 'Cannibalized own DVD business to pivot to streaming. Invested heavily in original content ($17B/year) and international expansion. Built proprietary recommendation algorithms.',
    outcome: 'Grew to 238M subscribers globally. Disrupted entire entertainment industry. Original content wins Oscars and Emmys consistently.',
    keyMetrics: [
      { label: 'Global Subscribers', value: '238M', improvement: 'From 7.5M' },
      { label: 'Content Spend', value: '$17B/yr', improvement: 'Industry leading' },
      { label: 'Countries', value: '190+', improvement: 'Global reach' },
    ],
    strategicPillars: ['Self-Disruption', 'Content Investment', 'Global Expansion', 'Data-Driven Decisions'],
    accentColor: 'magenta',
  },
  {
    id: 'case-amazon',
    company: 'Amazon',
    logo: '📦',
    title: 'AWS: From Internal Tool to Cloud Dominance',
    industry: 'Technology / Retail',
    year: '2006-2023',
    challenge: 'E-commerce margins razor-thin. Infrastructure costs growing exponentially. Needed competitive advantage beyond retail.',
    strategy: 'Transformed internal infrastructure into external cloud platform. Applied "working backwards" methodology. Prioritized long-term market share over short-term profits.',
    outcome: "AWS generates $90B+ revenue with 30%+ operating margins. Powers 32% of global cloud infrastructure. Enabled Amazon's dominance across multiple sectors.",
    keyMetrics: [
      { label: 'AWS Revenue', value: '$90B+', improvement: 'From $0' },
      { label: 'Cloud Market Share', value: '32%', improvement: '#1 Global' },
      { label: 'Operating Margin', value: '30%+', improvement: 'vs. 2% retail' },
    ],
    strategicPillars: ['Platform Strategy', 'Long-term Thinking', 'Customer Obsession', 'Operational Excellence'],
    accentColor: 'amber',
  },
  {
    id: 'case-nvidia',
    company: 'NVIDIA',
    logo: '🎮',
    title: 'From Gaming GPUs to AI Infrastructure',
    industry: 'Semiconductors',
    year: '2016-2024',
    challenge: 'GPU market limited to gaming and graphics. Intel dominated data center. AMD competitive on price. Limited TAM.',
    strategy: 'Recognized parallel processing capability of GPUs for AI/ML workloads early. Built CUDA ecosystem creating developer lock-in. Pivoted to data center and AI training infrastructure.',
    outcome: 'Became the most valuable semiconductor company. Powers 80%+ of AI training workloads. Market cap grew 50x in 5 years.',
    keyMetrics: [
      { label: 'Market Cap', value: '$1.2T+', improvement: '50x in 5 years' },
      { label: 'AI Market Share', value: '80%+', improvement: 'Near monopoly' },
      { label: 'Data Center Revenue', value: '$47B', improvement: '+217% YoY' },
    ],
    strategicPillars: ['Technology Foresight', 'Ecosystem Moat', 'Platform Dominance', 'Strategic Pivoting'],
    accentColor: 'lime',
  },
  {
    id: 'case-tesla',
    company: 'Tesla',
    logo: '⚡',
    title: 'Vertical Integration in Automotive',
    industry: 'Automotive / Energy',
    year: '2012-2023',
    challenge: 'Electric vehicles seen as niche. Legacy automakers had century of manufacturing expertise. Battery costs prohibitive.',
    strategy: 'Built vertically integrated manufacturing from batteries to software. Direct-to-consumer sales model. Over-the-air updates created software-defined vehicle category. Gigafactory strategy for scale.',
    outcome: "Became world's most valuable automaker. Forced entire industry to pivot to EVs. Achieved manufacturing cost advantages through vertical integration.",
    keyMetrics: [
      { label: 'Vehicles Delivered', value: '1.8M/yr', improvement: 'From 0' },
      { label: 'Gross Margin', value: '25%+', improvement: 'vs. 10% industry' },
      { label: 'Market Cap', value: '$800B', improvement: '#1 Automaker' },
    ],
    strategicPillars: ['Vertical Integration', 'First Principles Thinking', 'Direct Sales Model', 'Software-Defined Products'],
    accentColor: 'teal',
  },
  {
    id: 'case-spotify',
    company: 'Spotify',
    logo: '🎵',
    title: 'Platform Play in Music Streaming',
    industry: 'Entertainment / Music',
    year: '2008-2023',
    challenge: 'Music industry devastated by piracy. Record labels hostile to streaming. Apple had dominant music ecosystem.',
    strategy: 'Created freemium model to compete with piracy. Built algorithmic recommendation moat. Expanded to podcasts for differentiation. Negotiated revolutionary licensing deals.',
    outcome: "Became world's largest music streaming platform with 574M users. Transformed how music is consumed globally. Expanded successfully into podcasts.",
    keyMetrics: [
      { label: 'Monthly Active Users', value: '574M', improvement: '#1 Platform' },
      { label: 'Premium Subscribers', value: '226M', improvement: '+14% YoY' },
      { label: 'Podcast Share', value: '#1', improvement: 'New market' },
    ],
    strategicPillars: ['Freemium Model', 'Algorithmic Moat', 'Platform Expansion', 'Strategic Licensing'],
    accentColor: 'lime',
  },
  {
    id: 'case-shopify',
    company: 'Shopify',
    logo: '🛒',
    title: 'Democratizing E-commerce',
    industry: 'E-commerce / SaaS',
    year: '2006-2023',
    challenge: 'E-commerce dominated by Amazon marketplace. SMBs lacked technical capability to build online stores. Enterprise solutions prohibitively expensive.',
    strategy: 'Built easy-to-use platform enabling anyone to sell online. Created ecosystem of apps and partners. Positioned as "anti-Amazon" for brand-direct commerce.',
    outcome: 'Powers 10%+ of US e-commerce. Millions of merchants globally. Created viable alternative to Amazon marketplace dependency.',
    keyMetrics: [
      { label: 'GMV', value: '$200B+', improvement: '#2 in US e-comm' },
      { label: 'Merchants', value: '2M+', improvement: 'Global reach' },
      { label: 'Revenue', value: '$7B+', improvement: '+25% CAGR' },
    ],
    strategicPillars: ['Platform Democratization', 'Ecosystem Building', 'Merchant Empowerment', 'Anti-Aggregator Position'],
    accentColor: 'purple',
  },
];

// ==========================================
// COMPETITIVE INTELLIGENCE DATA
// ==========================================

export interface Competitor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  marketCap: string;
  revenue: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  overlapScore: number;
  strengths: string[];
  weaknesses: string[];
  recentMoves: { date: string; action: string; impact: 'Positive' | 'Negative' | 'Neutral' }[];
  marketShare: number;
  growthRate: number;
}

export const competitors: Competitor[] = [
  {
    id: 'comp-1', name: 'Apex Dynamics', logo: 'AD', industry: 'Enterprise Software', marketCap: '$48.2B', revenue: '$12.4B', threatLevel: 'High', overlapScore: 78,
    strengths: ['Strong enterprise sales force', 'Global distribution', 'Deep R&D budget'],
    weaknesses: ['Legacy architecture', 'Slow innovation cycles', 'High customer churn'],
    recentMoves: [
      { date: '2024-01-15', action: 'Acquired AI startup DataMind for $2.1B', impact: 'Negative' },
      { date: '2024-01-02', action: 'Launched aggressive enterprise pricing', impact: 'Negative' },
      { date: '2023-12-15', action: 'Lost major government contract', impact: 'Positive' },
    ],
    marketShare: 28, growthRate: 12.5,
  },
  {
    id: 'comp-2', name: 'Stratosphere Inc.', logo: 'SI', industry: 'Strategy Consulting Tech', marketCap: '$22.8B', revenue: '$6.8B', threatLevel: 'Critical', overlapScore: 92,
    strengths: ['AI-first platform', 'Rapid product velocity', 'Top-tier talent'],
    weaknesses: ['Limited enterprise penetration', 'Cash burn rate', 'Single market focus'],
    recentMoves: [
      { date: '2024-01-20', action: 'Series F at $22.8B valuation', impact: 'Negative' },
      { date: '2024-01-10', action: 'Partnered with Deloitte for enterprise sales', impact: 'Negative' },
      { date: '2023-12-20', action: 'Launched in APAC region', impact: 'Negative' },
    ],
    marketShare: 15, growthRate: 45.2,
  },
  {
    id: 'comp-3', name: 'NovaBridge Analytics', logo: 'NA', industry: 'Business Intelligence', marketCap: '$31.5B', revenue: '$8.9B', threatLevel: 'Medium', overlapScore: 55,
    strengths: ['Strong analytics heritage', 'Data partnerships', 'Government contracts'],
    weaknesses: ['Dated UX', 'Weak mobile offering', 'Slow cloud migration'],
    recentMoves: [
      { date: '2024-01-08', action: 'CEO transition announced', impact: 'Positive' },
      { date: '2023-12-28', action: 'Launched cloud-native platform v1', impact: 'Negative' },
    ],
    marketShare: 22, growthRate: 8.3,
  },
  {
    id: 'comp-4', name: 'Quantum Decisions', logo: 'QD', industry: 'Decision Intelligence', marketCap: '$8.4B', revenue: '$2.1B', threatLevel: 'Medium', overlapScore: 68,
    strengths: ['Cutting-edge ML models', 'Academic partnerships', 'Patent portfolio'],
    weaknesses: ['Small sales team', 'Limited integrations', 'Niche positioning'],
    recentMoves: [
      { date: '2024-01-12', action: 'Published breakthrough decision model paper', impact: 'Negative' },
      { date: '2023-11-30', action: 'Reduced workforce by 15%', impact: 'Positive' },
    ],
    marketShare: 8, growthRate: 22.1,
  },
  {
    id: 'comp-5', name: 'Meridian Insights', logo: 'MI', industry: 'Management Consulting SaaS', marketCap: '$15.7B', revenue: '$4.3B', threatLevel: 'Low', overlapScore: 42,
    strengths: ['McKinsey partnership', 'Enterprise clients', 'Brand recognition'],
    weaknesses: ['High price point', 'Complex onboarding', 'Rigid platform'],
    recentMoves: [
      { date: '2024-01-05', action: 'Raised prices 20% across all tiers', impact: 'Positive' },
      { date: '2023-12-10', action: 'Lost CTO to competitor', impact: 'Positive' },
    ],
    marketShare: 12, growthRate: 5.8,
  },
];

// ==========================================
// MARKET INTELLIGENCE DATA
// ==========================================

export interface MarketTrend {
  id: string;
  name: string;
  category: 'Technology' | 'Regulatory' | 'Economic' | 'Social' | 'Environmental';
  impact: 'Transformative' | 'Significant' | 'Moderate' | 'Low';
  timeframe: string;
  confidence: number;
  description: string;
  relevance: number;
  velocity: 'Accelerating' | 'Steady' | 'Decelerating';
}

export const marketTrends: MarketTrend[] = [
  { id: 'trend-1', name: 'Generative AI Enterprise Adoption', category: 'Technology', impact: 'Transformative', timeframe: '0-12 months', confidence: 94, description: 'Large enterprises accelerating GenAI integration across strategy, operations, and CX.', relevance: 98, velocity: 'Accelerating' },
  { id: 'trend-2', name: 'ESG-Linked Executive Compensation', category: 'Regulatory', impact: 'Significant', timeframe: '12-24 months', confidence: 78, description: 'Regulatory bodies mandating ESG metrics in C-suite performance evaluation.', relevance: 72, velocity: 'Accelerating' },
  { id: 'trend-3', name: 'Autonomous Decision Systems', category: 'Technology', impact: 'Transformative', timeframe: '24-48 months', confidence: 65, description: 'AI systems capable of making strategic decisions with minimal human oversight.', relevance: 88, velocity: 'Steady' },
  { id: 'trend-4', name: 'Global Supply Chain Restructuring', category: 'Economic', impact: 'Significant', timeframe: '12-36 months', confidence: 82, description: 'Major reshoring and nearshoring initiatives reshaping global supply networks.', relevance: 75, velocity: 'Steady' },
  { id: 'trend-5', name: 'Workforce Hybridization', category: 'Social', impact: 'Moderate', timeframe: '0-12 months', confidence: 88, description: 'Permanent shift to human-AI hybrid teams across knowledge work.', relevance: 82, velocity: 'Accelerating' },
  { id: 'trend-6', name: 'Carbon Border Adjustments', category: 'Environmental', impact: 'Significant', timeframe: '12-24 months', confidence: 71, description: 'Carbon pricing at borders impacting international trade economics.', relevance: 55, velocity: 'Steady' },
  { id: 'trend-7', name: 'Quantum Computing Readiness', category: 'Technology', impact: 'Transformative', timeframe: '48-72 months', confidence: 45, description: 'Quantum advantage reaching practical applications in optimization.', relevance: 62, velocity: 'Decelerating' },
  { id: 'trend-8', name: 'Digital Sovereignty Regulations', category: 'Regulatory', impact: 'Moderate', timeframe: '6-18 months', confidence: 76, description: 'Nations implementing data sovereignty and AI governance frameworks.', relevance: 68, velocity: 'Accelerating' },
];

export interface DisruptionSignal {
  id: string;
  signal: string;
  source: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  date: string;
  description: string;
}

export const disruptionSignals: DisruptionSignal[] = [
  { id: 'ds-1', signal: 'AI Agent Autonomy Breakthrough', source: 'MIT Tech Review', severity: 'Critical', category: 'Technology', date: '2024-01-22', description: 'New architectures enabling fully autonomous business process agents.' },
  { id: 'ds-2', signal: 'EU AI Act Phase 2', source: 'European Commission', severity: 'High', category: 'Regulatory', date: '2024-01-18', description: 'Mandatory compliance for high-risk AI systems in enterprise.' },
  { id: 'ds-3', signal: 'Chinese LLM Cost Parity', source: 'Bloomberg Intelligence', severity: 'High', category: 'Competition', date: '2024-01-15', description: 'Chinese AI labs achieving parity at 10x lower cost.' },
  { id: 'ds-4', signal: 'PE Strategy Tech Roll-up', source: 'PitchBook', severity: 'Medium', category: 'Market', date: '2024-01-12', description: 'Major PE firms consolidating strategy software vendors.' },
  { id: 'ds-5', signal: 'Real-time Strategy Platforms', source: 'Gartner', severity: 'High', category: 'Technology', date: '2024-01-10', description: 'New category bridging strategy formulation and execution.' },
  { id: 'ds-6', signal: 'Board AI Literacy Mandate', source: 'SEC Guidance', severity: 'Medium', category: 'Governance', date: '2024-01-08', description: 'Regulatory push for AI competency at board level.' },
];

// ==========================================
// M&A ANALYSIS DATA
// ==========================================

export interface MATarget {
  id: string;
  company: string;
  logo: string;
  industry: string;
  revenue: string;
  employees: string;
  valuation: string;
  evToRevenue: number;
  synergies: string;
  strategicFit: number;
  riskScore: number;
  stage: 'Identified' | 'Screening' | 'Due Diligence' | 'Negotiation' | 'Closed';
  rationale: string;
  keyMetrics: { label: string; value: string }[];
}

export const maTargets: MATarget[] = [
  { id: 'ma-1', company: 'DataForge AI', logo: 'DF', industry: 'AI/ML Platform', revenue: '$180M', employees: '850', valuation: '$2.4B', evToRevenue: 13.3, synergies: '$120M/yr', strategicFit: 94, riskScore: 32, stage: 'Due Diligence', rationale: 'Accelerates AI capability by 18mo. Fills ML ops gap.', keyMetrics: [{ label: 'ARR Growth', value: '67%' }, { label: 'NRR', value: '145%' }, { label: 'Rule of 40', value: '72' }] },
  { id: 'ma-2', company: 'StratVision', logo: 'SV', industry: 'Strategy Analytics', revenue: '$95M', employees: '420', valuation: '$780M', evToRevenue: 8.2, synergies: '$65M/yr', strategicFit: 88, riskScore: 25, stage: 'Negotiation', rationale: 'Best-in-class scenario modeling. Expands mid-market TAM.', keyMetrics: [{ label: 'ARR Growth', value: '42%' }, { label: 'NRR', value: '128%' }, { label: 'Rule of 40', value: '58' }] },
  { id: 'ma-3', company: 'Nexus Dynamics', logo: 'ND', industry: 'Risk Analytics', revenue: '$240M', employees: '1,200', valuation: '$1.9B', evToRevenue: 7.9, synergies: '$85M/yr', strategicFit: 76, riskScore: 48, stage: 'Screening', rationale: 'Enterprise risk platform with gov contracts. Revenue diversification.', keyMetrics: [{ label: 'ARR Growth', value: '28%' }, { label: 'NRR', value: '118%' }, { label: 'Rule of 40', value: '45' }] },
  { id: 'ma-4', company: 'PulseBoard', logo: 'PB', industry: 'Executive Dashboards', revenue: '$55M', employees: '280', valuation: '$440M', evToRevenue: 8.0, synergies: '$35M/yr', strategicFit: 82, riskScore: 18, stage: 'Identified', rationale: 'Real-time executive dashboards. Design talent acquisition.', keyMetrics: [{ label: 'ARR Growth', value: '55%' }, { label: 'NRR', value: '135%' }, { label: 'Rule of 40', value: '65' }] },
  { id: 'ma-5', company: 'OrgMetrics', logo: 'OM', industry: 'People Analytics', revenue: '$125M', employees: '580', valuation: '$1.1B', evToRevenue: 8.8, synergies: '$50M/yr', strategicFit: 71, riskScore: 35, stage: 'Screening', rationale: 'Leading workforce analytics. Synergy with execution tracking.', keyMetrics: [{ label: 'ARR Growth', value: '38%' }, { label: 'NRR', value: '122%' }, { label: 'Rule of 40', value: '52' }] },
];

// ==========================================
// EXECUTIVE BRIEFINGS
// ==========================================

export interface ExecutiveBriefing {
  id: string;
  title: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  category: string;
  summary: string;
  impact: string;
  recommendation: string;
  date: string;
  source: string;
}

export const executiveBriefings: ExecutiveBriefing[] = [
  { id: 'brief-1', title: 'Competitive Threat: Stratosphere-Deloitte Partnership', priority: 'Urgent', category: 'Competitive', summary: 'Stratosphere Inc. announced strategic partnership with Deloitte to co-sell to Fortune 500.', impact: 'Could accelerate their enterprise penetration by 3x. Direct threat to pipeline.', recommendation: 'Accelerate partnership strategy. Schedule emergency GTM review.', date: '2024-01-20', source: 'Competitive Intelligence' },
  { id: 'brief-2', title: 'Board Readiness: Q1 Strategic Review', priority: 'High', category: 'Governance', summary: 'Q1 board meeting in 3 weeks. Need updated positioning and projections.', impact: 'Board confidence directly affects next funding round parameters.', recommendation: 'Compile board pack with updated TAM, positioning, and 3-year model.', date: '2024-01-18', source: 'Office of the CEO' },
  { id: 'brief-3', title: 'Market Signal: AI Strategy TAM Upgrade to $14B', priority: 'High', category: 'Market', summary: 'Gartner upgraded AI strategy tools TAM from $8B to $14B by 2027.', impact: 'Validates market thesis. Strengthens investor and customer position.', recommendation: 'Update all investor materials. Leverage in upcoming fundraise.', date: '2024-01-15', source: 'Market Research' },
  { id: 'brief-4', title: 'Risk Alert: Enterprise Customer Churn Signal', priority: 'Urgent', category: 'Customer', summary: 'Three enterprise customers (combined ARR $2.4M) showing reduced engagement.', impact: 'Potential $2.4M ARR at risk. Could signal broader retention issue.', recommendation: 'Trigger executive sponsor engagement. Deploy CS strike team.', date: '2024-01-14', source: 'Customer Intelligence' },
  { id: 'brief-5', title: 'Opportunity: DoD $45M Strategy Platform RFP', priority: 'Medium', category: 'Sales', summary: 'Department of Defense RFP for strategy and decision intelligence. $45M over 5 years.', impact: 'Anchor government customer. Revenue diversification and credibility.', recommendation: 'Assemble response team. Engage gov advisors. Deadline: Feb 28.', date: '2024-01-12', source: 'Government Relations' },
  { id: 'brief-6', title: 'Talent: VP Engineering Shortlist Ready', priority: 'Medium', category: 'People', summary: 'Search firm shortlist: 4 VP Eng candidates. Two FAANG, one unicorn, one consulting tech.', impact: 'Critical hire for scaling engineering. Blocking next product cycle.', recommendation: 'Schedule panels next week. Fast-track top 2 candidates.', date: '2024-01-10', source: 'Talent Acquisition' },
];

// ==========================================
// STRATEGIC HEALTH & BOARD METRICS
// ==========================================

export interface StrategicHealthData {
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
  dimensions: { name: string; score: number; benchmark: number; trend: 'up' | 'down' | 'stable'; weight: number }[];
}

export const strategicHealth: StrategicHealthData = {
  overallScore: 76,
  trend: 'improving',
  lastUpdated: '2024-01-22',
  dimensions: [
    { name: 'Market Position', score: 82, benchmark: 70, trend: 'up', weight: 0.2 },
    { name: 'Innovation Pipeline', score: 74, benchmark: 65, trend: 'up', weight: 0.15 },
    { name: 'Financial Health', score: 88, benchmark: 75, trend: 'stable', weight: 0.2 },
    { name: 'Operational Excellence', score: 71, benchmark: 72, trend: 'up', weight: 0.15 },
    { name: 'Talent & Culture', score: 68, benchmark: 70, trend: 'down', weight: 0.1 },
    { name: 'Customer Success', score: 79, benchmark: 73, trend: 'stable', weight: 0.1 },
    { name: 'Risk Resilience', score: 65, benchmark: 60, trend: 'up', weight: 0.1 },
  ],
};

export interface BoardMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  target: string;
  status: 'Exceeding' | 'On Target' | 'At Risk' | 'Below Target';
  category: 'Financial' | 'Growth' | 'Operational' | 'Strategic';
  sparkline: number[];
}

export const boardMetrics: BoardMetric[] = [
  { id: 'bm-1', name: 'Annual Recurring Revenue', value: '$48.2M', change: 32, target: '$50M', status: 'On Target', category: 'Financial', sparkline: [28, 31, 33, 36, 38, 40, 42, 44, 45, 47, 48, 48.2] },
  { id: 'bm-2', name: 'Net Revenue Retention', value: '128%', change: 5, target: '125%', status: 'Exceeding', category: 'Growth', sparkline: [115, 118, 120, 122, 124, 123, 125, 126, 127, 126, 128, 128] },
  { id: 'bm-3', name: 'Gross Margin', value: '78.5%', change: 2.3, target: '80%', status: 'On Target', category: 'Financial', sparkline: [72, 73, 74, 75, 75, 76, 76, 77, 77, 78, 78, 78.5] },
  { id: 'bm-4', name: 'Customer Acquisition Cost', value: '$18.2K', change: -8, target: '$20K', status: 'Exceeding', category: 'Growth', sparkline: [25, 24, 23, 22, 21, 20, 19.5, 19, 18.8, 18.5, 18.3, 18.2] },
  { id: 'bm-5', name: 'LTV:CAC Ratio', value: '4.8x', change: 15, target: '4.0x', status: 'Exceeding', category: 'Growth', sparkline: [3.2, 3.4, 3.6, 3.8, 4.0, 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8] },
  { id: 'bm-6', name: 'Burn Multiple', value: '1.2x', change: -18, target: '1.5x', status: 'Exceeding', category: 'Financial', sparkline: [2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.35, 1.3, 1.25, 1.2] },
  { id: 'bm-7', name: 'Enterprise Customers', value: '142', change: 28, target: '150', status: 'On Target', category: 'Growth', sparkline: [85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 136, 142] },
  { id: 'bm-8', name: 'Employee NPS', value: '72', change: -3, target: '75', status: 'At Risk', category: 'Operational', sparkline: [78, 77, 76, 75, 74, 74, 73, 73, 72, 72, 72, 72] },
  { id: 'bm-9', name: 'Platform Uptime', value: '99.97%', change: 0.02, target: '99.95%', status: 'Exceeding', category: 'Operational', sparkline: [99.9, 99.91, 99.92, 99.93, 99.94, 99.95, 99.95, 99.96, 99.96, 99.97, 99.97, 99.97] },
  { id: 'bm-10', name: 'Market Share', value: '15.2%', change: 2.8, target: '18%', status: 'On Target', category: 'Strategic', sparkline: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.2] },
];

// ==========================================
// INDUSTRY BENCHMARKS
// ==========================================

export interface IndustryBenchmark {
  metric: string;
  ourValue: number;
  industryAvg: number;
  topQuartile: number;
  unit: string;
  category: string;
}

export const industryBenchmarks: IndustryBenchmark[] = [
  { metric: 'Revenue Growth', ourValue: 32, industryAvg: 22, topQuartile: 45, unit: '%', category: 'Financial' },
  { metric: 'Gross Margin', ourValue: 78.5, industryAvg: 72, topQuartile: 82, unit: '%', category: 'Financial' },
  { metric: 'R&D Spend', ourValue: 28, industryAvg: 22, topQuartile: 30, unit: '% rev', category: 'Innovation' },
  { metric: 'Sales Efficiency', ourValue: 0.85, industryAvg: 0.65, topQuartile: 0.95, unit: 'x', category: 'Growth' },
  { metric: 'Magic Number', ourValue: 1.2, industryAvg: 0.8, topQuartile: 1.5, unit: 'x', category: 'Growth' },
  { metric: 'NPS', ourValue: 62, industryAvg: 45, topQuartile: 70, unit: '', category: 'Customer' },
  { metric: 'Time to Value', ourValue: 14, industryAvg: 28, topQuartile: 10, unit: 'days', category: 'Customer' },
  { metric: 'Retention', ourValue: 88, industryAvg: 82, topQuartile: 92, unit: '%', category: 'People' },
];

// ==========================================
// STRATEGY FRAMEWORKS
// ==========================================

export interface FrameworkItem {
  id: string;
  framework: string;
  category: string;
  items: { dimension: string; score: number; notes: string }[];
}

export const strategyFrameworks: FrameworkItem[] = [
  {
    id: 'fw-porters', framework: "Porter's Five Forces", category: 'Industry Analysis',
    items: [
      { dimension: 'New Entrants', score: 65, notes: 'Low barriers via cloud, high AI talent barrier' },
      { dimension: 'Supplier Power', score: 35, notes: 'Multiple cloud providers, open source options' },
      { dimension: 'Buyer Power', score: 55, notes: 'Enterprise leverage, but switching costs high' },
      { dimension: 'Substitutes', score: 70, notes: 'Consulting firms, in-house tools, spreadsheets' },
      { dimension: 'Rivalry', score: 75, notes: 'Intensifying as category matures' },
    ],
  },
  {
    id: 'fw-swot', framework: 'SWOT Analysis', category: 'Strategic Position',
    items: [
      { dimension: 'Strengths', score: 82, notes: 'AI-first architecture, strong PMF, talent density' },
      { dimension: 'Weaknesses', score: 45, notes: 'Limited brand, small sales team, cash runway' },
      { dimension: 'Opportunities', score: 88, notes: 'TAM expansion, AI tailwinds, enterprise wave' },
      { dimension: 'Threats', score: 58, notes: 'Big tech entry, downturn risk, talent war' },
    ],
  },
  {
    id: 'fw-mckinsey7s', framework: 'McKinsey 7S', category: 'Organizational',
    items: [
      { dimension: 'Strategy', score: 85, notes: 'Clear AI-first platform strategy' },
      { dimension: 'Structure', score: 72, notes: 'Scaling startup to growth-stage' },
      { dimension: 'Systems', score: 68, notes: 'Building enterprise-grade internals' },
      { dimension: 'Shared Values', score: 78, notes: 'Mission-driven culture' },
      { dimension: 'Style', score: 75, notes: 'Data-driven leadership' },
      { dimension: 'Staff', score: 70, notes: 'Top eng, growing sales & CS' },
      { dimension: 'Skills', score: 82, notes: 'Deep AI/ML expertise' },
    ],
  },
];

// ==========================================
// MARKET PULSE INDICATORS
// ==========================================

export interface MarketPulseIndicator {
  id: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  status: 'bullish' | 'bearish' | 'neutral';
}

export const marketPulse: MarketPulseIndicator[] = [
  { id: 'mp-1', name: 'Tech Sentiment', value: 72, change: 3.2, unit: '/100', status: 'bullish' },
  { id: 'mp-2', name: 'VC Deal Flow', value: 58, change: -5.1, unit: '/100', status: 'bearish' },
  { id: 'mp-3', name: 'AI Adoption', value: 89, change: 12.4, unit: '/100', status: 'bullish' },
  { id: 'mp-4', name: 'Macro Confidence', value: 45, change: -2.8, unit: '/100', status: 'bearish' },
  { id: 'mp-5', name: 'Talent Heat', value: 67, change: 1.5, unit: '/100', status: 'neutral' },
  { id: 'mp-6', name: 'Reg. Pressure', value: 54, change: 8.2, unit: '/100', status: 'bearish' },
];
