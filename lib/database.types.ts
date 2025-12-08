// Database Types for AmbiSight
// These types define the schema for Supabase tables and local storage structures

import type { Plan, Industry, MaturityLevel, UserRole } from './users';

// ============================================
// ORGANIZATION & USER TYPES
// ============================================

export interface Organization {
  id: string;
  name: string;
  industry: Industry;
  size: OrganizationSize;
  region: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export type OrganizationSize =
  | 'startup' // 1-50 employees
  | 'small' // 51-200 employees
  | 'medium' // 201-1000 employees
  | 'large' // 1001-5000 employees
  | 'enterprise'; // 5000+ employees

export interface UserProfileExtended {
  id: string;
  auth_id?: string; // Supabase auth user id
  name: string;
  email: string;
  role: AppRole;
  company_role?: UserRole; // Their role within their company
  organization_id?: string;
  plan: Plan;
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  onboarding_completed: boolean;
  preferences: UserPreferences;
}

// App-level roles for access control
export type AppRole =
  | 'strategy_lead'
  | 'ops_lead'
  | 'finance_lead'
  | 'marketing_lead'
  | 'guest';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  email_notifications: boolean;
  dashboard_layout: 'compact' | 'expanded';
}

// ============================================
// DIAGNOSTIC INTAKE TYPES
// ============================================

export interface DiagnosticIntake {
  id: string;
  user_id: string;
  organization_id?: string;
  organization_name: string;
  created_at: string;
  updated_at: string;
  completed: boolean;

  // Section 1: Company Profile
  company_profile: CompanyProfile;

  // Section 2: Performance KPIs
  performance_kpis: PerformanceKPIs;

  // Section 3: Risk Signals
  risk_signals: RiskSignals;

  // Section 4: Strategic Priorities
  strategic_priorities: StrategicPriority[];

  // Section 5: Constraints
  constraints: Constraints;
}

export interface CompanyProfile {
  industry: Industry;
  size: OrganizationSize;
  region: string;
  maturity: MaturityLevel;
  years_in_operation: number;
  annual_revenue_range: RevenueRange;
  employee_count_range: EmployeeRange;
  primary_market: string;
  business_model: BusinessModel;
}

export type RevenueRange =
  | 'under_1m'
  | '1m_10m'
  | '10m_50m'
  | '50m_100m'
  | '100m_500m'
  | '500m_1b'
  | 'over_1b';

export type EmployeeRange =
  | '1_10'
  | '11_50'
  | '51_200'
  | '201_500'
  | '501_1000'
  | '1001_5000'
  | 'over_5000';

export type BusinessModel =
  | 'b2b_saas'
  | 'b2c_saas'
  | 'marketplace'
  | 'e_commerce'
  | 'professional_services'
  | 'manufacturing'
  | 'financial_services'
  | 'healthcare'
  | 'retail'
  | 'other';

export interface PerformanceKPIs {
  revenue_growth: KPIValue;
  gross_margin: KPIValue;
  operating_margin: KPIValue;
  market_share: KPIValue;
  customer_acquisition_cost: KPIValue;
  customer_lifetime_value: KPIValue;
  employee_productivity: KPIValue;
  customer_satisfaction: KPIValue;
  innovation_rate: KPIValue;
  operational_efficiency: KPIValue;
}

export interface KPIValue {
  value: number;
  unit: 'percentage' | 'currency' | 'ratio' | 'score' | 'count';
  trend: 'improving' | 'stable' | 'declining';
  benchmark_comparison: 'above' | 'at' | 'below';
}

export interface RiskSignals {
  regulatory_risk: RiskScore;
  supply_chain_risk: RiskScore;
  technology_disruption: RiskScore;
  talent_risk: RiskScore;
  market_risk: RiskScore;
  financial_risk: RiskScore;
  competitive_risk: RiskScore;
  cybersecurity_risk: RiskScore;
  reputation_risk: RiskScore;
  operational_risk: RiskScore;
}

export interface RiskScore {
  score: 1 | 2 | 3 | 4 | 5; // 1 = Low, 5 = Critical
  trend: 'improving' | 'stable' | 'worsening';
  notes?: string;
}

export type StrategicPriority =
  | 'growth_acceleration'
  | 'market_expansion'
  | 'digital_transformation'
  | 'operational_excellence'
  | 'cost_optimization'
  | 'innovation_leadership'
  | 'customer_experience'
  | 'talent_development'
  | 'sustainability'
  | 'risk_mitigation'
  | 'ma_integration'
  | 'brand_building';

export interface Constraints {
  budget_constraint: BudgetConstraint;
  time_constraint: TimeConstraint;
  capability_constraints: CapabilityConstraint[];
  resource_constraints: string[];
  regulatory_constraints: string[];
}

export type BudgetConstraint =
  | 'very_limited' // <$100K
  | 'limited' // $100K-$500K
  | 'moderate' // $500K-$2M
  | 'significant' // $2M-$10M
  | 'extensive'; // $10M+

export type TimeConstraint =
  | 'urgent' // 0-3 months
  | 'short_term' // 3-6 months
  | 'medium_term' // 6-12 months
  | 'long_term'; // 12+ months

export type CapabilityConstraint =
  | 'technical_expertise'
  | 'leadership_capacity'
  | 'change_management'
  | 'data_analytics'
  | 'digital_skills'
  | 'industry_knowledge'
  | 'project_management';

// ============================================
// DIAGNOSTIC RESULTS TYPES
// ============================================

export interface DiagnosticResult {
  id: string;
  intake_id: string;
  user_id: string;
  created_at: string;

  // Computed Scores (0-100)
  scores: DiagnosticScores;

  // Traffic Light Status
  status_indicators: StatusIndicators;

  // Generated Insights
  insights: GeneratedInsight[];

  // Recommended Tools
  recommended_tools: ToolRecommendation[];

  // Strategic Summary
  summary: StrategicSummary;
}

export interface DiagnosticScores {
  performance_score: number; // Based on KPIs
  threat_score: number; // Based on risks
  alignment_score: number; // Priorities vs capabilities
  readiness_score: number; // Overall execution readiness
  overall_health: number; // Weighted composite
}

export interface StatusIndicators {
  performance: TrafficLight;
  risk: TrafficLight;
  alignment: TrafficLight;
  readiness: TrafficLight;
  overall: TrafficLight;
}

export type TrafficLight = 'green' | 'amber' | 'red';

export interface GeneratedInsight {
  id: string;
  type: 'concern' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  related_area: string;
}

export interface ToolRecommendation {
  tool_id: string;
  tool_name: string;
  category: ToolCategory;
  relevance_score: number;
  reason: string;
  priority: 'primary' | 'secondary' | 'supporting';
}

export type ToolCategory =
  | 'growth'
  | 'renewal'
  | 'risk'
  | 'innovation'
  | 'execution'
  | 'capability'
  | 'digital'
  | 'marketing'
  | 'finance'
  | 'stakeholders';

export interface StrategicSummary {
  executive_summary: string;
  top_concerns: string[];
  top_opportunities: string[];
  immediate_actions: string[];
}

// ============================================
// SCENARIO SIMULATION TYPES
// ============================================

export interface SimulationScenario {
  id: string;
  diagnostic_id: string;
  name: string;
  created_at: string;

  // Adjustment values (-50 to +50)
  adjustments: ScenarioAdjustments;

  // Computed results
  projected_scores: DiagnosticScores;
  delta_from_baseline: DiagnosticScores;
}

export interface ScenarioAdjustments {
  revenue_growth_delta: number;
  margin_delta: number;
  market_share_delta: number;
  risk_level_delta: number;
  capability_delta: number;
  time_horizon_months: number;
}

// ============================================
// TOOL LIBRARY TYPES
// ============================================

export interface StrategyTool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  when_to_use: string;
  inputs_required: string[];
  usage_steps: string[];
  expected_outcomes: string[];
  template_url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_required: string;
  related_tools: string[];
  tags: string[];
}

// ============================================
// DATABASE SCHEMA (for Supabase)
// ============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfileExtended;
        Insert: Omit<UserProfileExtended, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfileExtended, 'id'>>;
      };
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Organization, 'id'>>;
      };
      diagnostic_intakes: {
        Row: DiagnosticIntake;
        Insert: Omit<DiagnosticIntake, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DiagnosticIntake, 'id'>>;
      };
      diagnostic_results: {
        Row: DiagnosticResult;
        Insert: Omit<DiagnosticResult, 'id' | 'created_at'>;
        Update: Partial<Omit<DiagnosticResult, 'id'>>;
      };
      simulation_scenarios: {
        Row: SimulationScenario;
        Insert: Omit<SimulationScenario, 'id' | 'created_at'>;
        Update: Partial<Omit<SimulationScenario, 'id'>>;
      };
    };
  };
}

// ============================================
// DEFAULT VALUES
// ============================================

export const defaultKPIValue: KPIValue = {
  value: 0,
  unit: 'percentage',
  trend: 'stable',
  benchmark_comparison: 'at',
};

export const defaultRiskScore: RiskScore = {
  score: 3,
  trend: 'stable',
};

export const defaultCompanyProfile: CompanyProfile = {
  industry: 'Technology',
  size: 'medium',
  region: 'North America',
  maturity: 'ScaleUp',
  years_in_operation: 5,
  annual_revenue_range: '10m_50m',
  employee_count_range: '51_200',
  primary_market: 'B2B',
  business_model: 'b2b_saas',
};

export const defaultPerformanceKPIs: PerformanceKPIs = {
  revenue_growth: { ...defaultKPIValue, value: 15 },
  gross_margin: { ...defaultKPIValue, value: 60 },
  operating_margin: { ...defaultKPIValue, value: 15 },
  market_share: { ...defaultKPIValue, value: 5 },
  customer_acquisition_cost: { ...defaultKPIValue, value: 500, unit: 'currency' },
  customer_lifetime_value: { ...defaultKPIValue, value: 5000, unit: 'currency' },
  employee_productivity: { ...defaultKPIValue, value: 70, unit: 'score' },
  customer_satisfaction: { ...defaultKPIValue, value: 75, unit: 'score' },
  innovation_rate: { ...defaultKPIValue, value: 20 },
  operational_efficiency: { ...defaultKPIValue, value: 70, unit: 'score' },
};

export const defaultRiskSignals: RiskSignals = {
  regulatory_risk: { ...defaultRiskScore },
  supply_chain_risk: { ...defaultRiskScore },
  technology_disruption: { ...defaultRiskScore },
  talent_risk: { ...defaultRiskScore },
  market_risk: { ...defaultRiskScore },
  financial_risk: { ...defaultRiskScore },
  competitive_risk: { ...defaultRiskScore },
  cybersecurity_risk: { ...defaultRiskScore },
  reputation_risk: { ...defaultRiskScore },
  operational_risk: { ...defaultRiskScore },
};

export const defaultConstraints: Constraints = {
  budget_constraint: 'moderate',
  time_constraint: 'medium_term',
  capability_constraints: [],
  resource_constraints: [],
  regulatory_constraints: [],
};
