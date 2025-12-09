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
