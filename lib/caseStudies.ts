// Case Studies Data for Landing Page
// Real-world strategic management success stories

export type RoleFocus = 'CSO' | 'CRO' | 'CTO' | 'Ops';

export interface LandingCaseStudy {
  id: string;
  title: string;
  roleFocus: RoleFocus;
  industry: string;
  headlineMetric: string;
  summary: string;
  region: string;
  company: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  timeframe: string;
  accentColor: 'teal' | 'amber' | 'purple' | 'lime' | 'magenta';
}

export const roleFocusLabels: Record<RoleFocus, string> = {
  CSO: 'Chief Strategy Officer',
  CRO: 'Chief Risk Officer',
  CTO: 'Chief Technology Officer',
  Ops: 'Operations Lead',
};

export const roleFocusColors: Record<RoleFocus, { bg: string; text: string; border: string }> = {
  CSO: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
  CRO: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  CTO: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Ops: { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/30' },
};

export const landingCaseStudies: LandingCaseStudy[] = [
  {
    id: 'case-1',
    title: 'Portfolio Rebalancing Drives 23% Risk Reduction',
    roleFocus: 'CRO',
    industry: 'Financial Services',
    headlineMetric: '-23% downside risk',
    summary: 'Pan-African bank used scenario modeling to identify concentration risks and rebalance their lending portfolio across 12 markets.',
    region: 'Africa',
    company: 'Continental Bank Group',
    challenge: 'High concentration risk in commodity-dependent economies with volatile currency exposure across multiple African markets.',
    solution: 'Deployed Ambi-Sight risk radar to map correlations between markets and identify diversification opportunities using Monte Carlo simulations.',
    outcomes: [
      '23% reduction in portfolio Value-at-Risk',
      'Identified 3 new low-correlation markets for expansion',
      'Reduced currency hedging costs by $4.2M annually',
    ],
    timeframe: '6 months',
    accentColor: 'amber',
  },
  {
    id: 'case-2',
    title: 'Digital Transformation Accelerates Revenue Growth',
    roleFocus: 'CSO',
    industry: 'Retail',
    headlineMetric: '+18% margin lift',
    summary: 'European fashion retailer used strategic scenario planning to prioritize digital investments and optimize their omnichannel strategy.',
    region: 'Europe',
    company: 'Nordic Style Group',
    challenge: 'Legacy retail operations with declining foot traffic and fragmented digital presence across 8 European markets.',
    solution: 'Used Ambi-Sight strategy workspace to model 5 transformation scenarios and build consensus across regional leadership teams.',
    outcomes: [
      '18% improvement in gross margins',
      'Online revenue grew from 12% to 34% of total',
      'Reduced time-to-market for new collections by 40%',
    ],
    timeframe: '18 months',
    accentColor: 'teal',
  },
  {
    id: 'case-3',
    title: 'Supply Chain Resilience Through Predictive Analytics',
    roleFocus: 'Ops',
    industry: 'Manufacturing',
    headlineMetric: '-45% disruption impact',
    summary: 'Automotive parts manufacturer built early warning system to predict and mitigate supply chain disruptions before they impact production.',
    region: 'Asia Pacific',
    company: 'Precision Auto Components',
    challenge: 'Frequent production stoppages due to supplier failures and logistics disruptions, costing $12M annually in expediting fees.',
    solution: 'Implemented Ambi-Sight signal scanning canvas to monitor 200+ suppliers and create automated response playbooks.',
    outcomes: [
      '45% reduction in disruption-related costs',
      'Supplier visibility improved from 60% to 95%',
      'Average response time reduced from 5 days to 8 hours',
    ],
    timeframe: '9 months',
    accentColor: 'lime',
  },
  {
    id: 'case-4',
    title: 'Cloud Migration Roadmap Cuts IT Costs',
    roleFocus: 'CTO',
    industry: 'Healthcare',
    headlineMetric: '-32% IT spend',
    summary: 'Regional hospital network used technology strategy tools to plan their cloud migration and optimize infrastructure investments.',
    region: 'North America',
    company: 'MedCare Health Systems',
    challenge: 'Aging on-premise infrastructure with high maintenance costs and compliance gaps across 15 facilities.',
    solution: 'Used Ambi-Sight portfolio health radar to assess 120+ applications and prioritize migration based on risk and value.',
    outcomes: [
      '32% reduction in annual IT infrastructure costs',
      'Achieved HIPAA compliance across all systems',
      'Reduced system downtime by 78%',
    ],
    timeframe: '24 months',
    accentColor: 'purple',
  },
  {
    id: 'case-5',
    title: 'M&A Due Diligence Prevents Value Destruction',
    roleFocus: 'CRO',
    industry: 'Private Equity',
    headlineMetric: '$180M saved',
    summary: 'PE firm used risk assessment frameworks to identify hidden liabilities in target company, renegotiating deal terms before close.',
    region: 'North America',
    company: 'Summit Capital Partners',
    challenge: 'Traditional due diligence missed operational and technology risks in a $600M manufacturing acquisition target.',
    solution: 'Deployed Ambi-Sight strategic risk radar to conduct deep-dive analysis across 8 risk dimensions with scenario modeling.',
    outcomes: [
      'Identified $180M in hidden liabilities and remediation costs',
      'Renegotiated purchase price by 15%',
      'Developed 100-day integration risk mitigation plan',
    ],
    timeframe: '3 months',
    accentColor: 'amber',
  },
  {
    id: 'case-6',
    title: 'Innovation Portfolio Doubles R&D ROI',
    roleFocus: 'CSO',
    industry: 'Pharmaceuticals',
    headlineMetric: '+95% R&D ROI',
    summary: 'Global pharma company restructured innovation portfolio using strategic prioritization tools to focus on highest-probability programs.',
    region: 'Global',
    company: 'BioGenesis Therapeutics',
    challenge: 'Scattered R&D investments across 40+ programs with low success rates and insufficient resources for breakthrough candidates.',
    solution: 'Used Ambi-Sight portfolio allocation tools to score programs on strategic fit, probability of success, and market potential.',
    outcomes: [
      '95% improvement in R&D return on investment',
      'Reduced active programs from 40 to 18 high-potential candidates',
      '3 programs advanced to Phase 3 trials within 2 years',
    ],
    timeframe: '12 months',
    accentColor: 'teal',
  },
  {
    id: 'case-7',
    title: 'Operational Excellence Transforms Logistics Network',
    roleFocus: 'Ops',
    industry: 'Logistics',
    headlineMetric: '+28% efficiency',
    summary: 'Regional logistics provider optimized route planning and warehouse operations using execution tracking and real-time analytics.',
    region: 'Middle East',
    company: 'Gulf Express Logistics',
    challenge: 'Inefficient route planning and warehouse utilization leading to high fuel costs and delayed deliveries across 6 countries.',
    solution: 'Implemented Ambi-Sight execution and OKR tools to track 50+ operational metrics and identify optimization opportunities.',
    outcomes: [
      '28% improvement in fleet efficiency',
      'On-time delivery rate increased from 82% to 96%',
      'Fuel costs reduced by $3.5M annually',
    ],
    timeframe: '8 months',
    accentColor: 'lime',
  },
  {
    id: 'case-8',
    title: 'API Platform Strategy Unlocks New Revenue',
    roleFocus: 'CTO',
    industry: 'Financial Services',
    headlineMetric: '+$45M new revenue',
    summary: 'Regional bank created developer ecosystem through API-first strategy, monetizing data and services to fintech partners.',
    region: 'Southeast Asia',
    company: 'Digital Commerce Bank',
    challenge: 'Legacy core banking systems limiting ability to partner with fintechs and participate in open banking ecosystem.',
    solution: 'Used Ambi-Sight digital strategy tools to map API opportunities and build technology roadmap with phased investments.',
    outcomes: [
      '$45M in new API-driven revenue within 2 years',
      'Onboarded 120+ fintech partners to platform',
      'Reduced time-to-market for new products by 65%',
    ],
    timeframe: '18 months',
    accentColor: 'purple',
  },
  {
    id: 'case-9',
    title: 'ESG Transformation Attracts Sustainable Investment',
    roleFocus: 'CSO',
    industry: 'Energy',
    headlineMetric: '+$2.1B green bonds',
    summary: 'Traditional energy company used ESG strategy frameworks to plan transition and attract sustainable finance for renewable projects.',
    region: 'Europe',
    company: 'Nordic Energy Transition',
    challenge: 'Pressure from investors and regulators to decarbonize while maintaining profitability during multi-decade transition.',
    solution: 'Deployed Ambi-Sight governance and ESG tools to develop credible transition roadmap with measurable milestones.',
    outcomes: [
      'Raised $2.1B in green bonds at favorable rates',
      'ESG rating improved from BB to A-',
      'Renewable capacity increased to 40% of portfolio',
    ],
    timeframe: '24 months',
    accentColor: 'teal',
  },
  {
    id: 'case-10',
    title: 'Cybersecurity Posture Strengthened Across Enterprise',
    roleFocus: 'CRO',
    industry: 'Technology',
    headlineMetric: '-67% incident rate',
    summary: 'SaaS company used risk and resilience frameworks to identify vulnerabilities and build comprehensive security program.',
    region: 'North America',
    company: 'CloudSecure Solutions',
    challenge: 'Rapid growth led to fragmented security practices and increasing cyber incidents threatening customer trust.',
    solution: 'Used Ambi-Sight risk and resilience tools to assess 200+ security controls and prioritize investments.',
    outcomes: [
      '67% reduction in security incidents',
      'Achieved SOC 2 Type II certification',
      'Customer trust scores improved by 25 points',
    ],
    timeframe: '12 months',
    accentColor: 'amber',
  },
  {
    id: 'case-11',
    title: 'Warehouse Automation Drives Productivity Gains',
    roleFocus: 'Ops',
    industry: 'E-commerce',
    headlineMetric: '+156% throughput',
    summary: 'Online retailer used operations strategy tools to plan phased automation investments and optimize fulfillment centers.',
    region: 'North America',
    company: 'FastShip Commerce',
    challenge: 'Manual fulfillment processes unable to scale with 200% YoY growth, leading to delays and customer complaints.',
    solution: 'Used Ambi-Sight operations and supply chain tools to model automation scenarios and build business case.',
    outcomes: [
      '156% improvement in order throughput',
      'Labor costs reduced by 40% per unit shipped',
      'Same-day shipping capability expanded to 80% of orders',
    ],
    timeframe: '15 months',
    accentColor: 'lime',
  },
  {
    id: 'case-12',
    title: 'Platform Modernization Enables AI Capabilities',
    roleFocus: 'CTO',
    industry: 'Insurance',
    headlineMetric: '+40% automation',
    summary: 'Insurance carrier modernized legacy systems to enable AI-powered underwriting and claims processing automation.',
    region: 'Europe',
    company: 'Continental Insurance Group',
    challenge: 'Decades-old mainframe systems preventing adoption of AI/ML capabilities and slowing product innovation.',
    solution: 'Used Ambi-Sight digital and technology strategy tools to plan strangler fig migration pattern with AI readiness assessment.',
    outcomes: [
      '40% of underwriting decisions now automated',
      'Claims processing time reduced from 14 days to 3 days',
      'Technical debt reduced by 60%',
    ],
    timeframe: '30 months',
    accentColor: 'purple',
  },
];

// Helper to filter case studies by role
export function filterCaseStudiesByRole(role: RoleFocus | 'All'): LandingCaseStudy[] {
  if (role === 'All') return landingCaseStudies;
  return landingCaseStudies.filter(cs => cs.roleFocus === role);
}
