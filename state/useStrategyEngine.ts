'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// =============================================
// CANONICAL STRATEGIC OBJECT MODEL
// =============================================

// PHASE 1: Enterprise Object
export interface EnterpriseObject {
  enterprise_id: string;
  organisation_name: string;
  organisation_type: 'startup' | 'sme' | 'corporate' | 'public_sector';
  industry_code: string;
  industry_label: string;
  geographic_footprint: string[];
  market_type: 'emerging' | 'growth' | 'mature' | 'declining';
  horizon: 'short' | 'medium' | 'long';
  horizon_years: string;
  completed: boolean;
}

// PHASE 2: Objective Object
export interface ObjectiveNode {
  id: string;
  level: 1 | 2 | 3; // Enterprise / BU / Operational
  parent_id: string | null;
  label: string;
  metric: string;
  baseline: number;
  target: number;
  deadline: string;
  priority_weight: 1 | 2 | 3 | 4 | 5;
}

export interface ObjectiveObject {
  vision: string;
  strategic_intent: 'growth' | 'dominance' | 'resilience' | 'innovation' | 'turnaround';
  objectives: ObjectiveNode[];
  completed: boolean;
}

// PHASE 3: Constraint Object
export interface ConstraintObject {
  available_capital: number;
  debt_capacity: number;
  talent_capacity: string;
  technology_maturity: number; // 1-5
  risk_tolerance: number; // 1-10
  regulatory_constraints: string[];
  // Computed
  resource_envelope: Record<string, number>;
  capital_ceiling: number;
  risk_tolerance_coefficient: number;
  completed: boolean;
}

// PHASE 4: Market / Competitive Intelligence Object
export interface CompetitorEntry {
  name: string;
  market_share: number;
}

export interface MarketObject {
  competitors: CompetitorEntry[];
  entry_barriers: number; // 1-10
  buyer_power: number; // 1-10
  supplier_power: number; // 1-10
  threat_substitution: number; // 1-10
  competitive_rivalry: number; // 1-10
  // Computed
  competitive_intensity_index: number;
  five_forces_score: number;
  market_attractiveness_score: number;
  hhi_index: number;
  completed: boolean;
}

// PHASE 5: Capability Object
export interface CapabilityObject {
  core_competencies: string[];
  differentiating_capabilities: string[];
  operational_efficiency: number; // 1-10
  brand_strength: number; // 1-10
  innovation_capacity: number; // 1-10
  digital_maturity: number; // 1-10
  // Computed
  capability_scores: Record<string, number>;
  strategic_readiness_score: number;
  capability_gaps: string[];
  execution_risk_flagged: boolean;
  completed: boolean;
}

// PHASE 6: Strategic Option Object
export interface StrategicOptionObject {
  id: string;
  name: string;
  type: 'market_penetration' | 'product_diversification' | 'geographic_expansion' |
        'vertical_integration' | 'cost_leadership' | 'premium_differentiation' |
        'platform_strategy' | 'custom';
  description: string;
  required_capital: number;
  expected_revenue_uplift: number; // percentage
  margin_impact: number; // percentage points
  risk_exposure: number; // 1-10
  capability_strain_index: number; // 0-100
  time_to_impact_months: number;
  selected: boolean;
}

// PHASE 7: Simulation Result
export interface SimulationResult {
  option_id: string;
  // Financial
  revenue_forecast: number[];
  cost_forecast: number[];
  capital_investment: number;
  cash_flow_trajectory: number[];
  // Competitive reaction
  competitor_response: string;
  game_theory_outcome: string;
  // Real options
  option_to_expand_value: number;
  option_to_abandon_value: number;
  option_to_delay_value: number;
  // Metrics
  expected_value: number;
  risk_adjusted_npv: number;
  probability_of_target: number;
  volatility_score: number;
  // Sensitivity
  sensitivity_results: { variable: string; low: number; base: number; high: number }[];
}

// PHASE 8: Scenario Object
export interface ScenarioObject {
  id: string;
  name: 'base' | 'upside' | 'downside' | 'extreme_disruption';
  label: string;
  revenue_trajectory: number[];
  market_share_shift: number;
  margin_shift: number;
  capital_stress: number;
  liquidity_stress: number;
  breakeven_months: number;
  constraint_breach_probability: number;
}

// PHASE 9: Portfolio Object
export interface PortfolioObject {
  selected_options: string[]; // option IDs
  optimal_allocation: Record<string, number>; // option_id -> capital %
  total_capital_deployed: number;
  portfolio_expected_return: number;
  portfolio_risk: number;
  efficient_frontier: { risk: number; return_: number }[];
  objective_score: number;
}

// Governance / Audit
export interface AuditEntry {
  id: string;
  timestamp: string;
  phase: string;
  action: string;
  field: string;
  old_value: string;
  new_value: string;
  user: string;
}

// Active interrogation phase
export type InterrogationPhase =
  | 'context'       // Phase 1
  | 'objectives'    // Phase 2
  | 'constraints'   // Phase 3
  | 'competitive'   // Phase 4
  | 'capability'    // Phase 5
  | 'options'       // Phase 6
  | 'simulation'    // Phase 7
  | 'scenarios'     // Phase 8
  | 'portfolio'     // Phase 9
  | 'governance';   // Audit view

export const PHASE_LABELS: Record<InterrogationPhase, string> = {
  context: 'Enterprise Context',
  objectives: 'Objective Hierarchy',
  constraints: 'Constraints & Capital',
  competitive: 'Competitive Intelligence',
  capability: 'Capability Mapping',
  options: 'Strategic Options',
  simulation: 'Strategic Simulation',
  scenarios: 'Scenario Architecture',
  portfolio: 'Portfolio Optimisation',
  governance: 'Governance & Audit',
};

export const PHASE_ORDER: InterrogationPhase[] = [
  'context', 'objectives', 'constraints', 'competitive', 'capability',
  'options', 'simulation', 'scenarios', 'portfolio', 'governance',
];

// =============================================
// COMPUTATION FUNCTIONS
// =============================================

export function computeCompetitiveMetrics(market: Partial<MarketObject>): {
  competitive_intensity_index: number;
  five_forces_score: number;
  market_attractiveness_score: number;
  hhi_index: number;
} {
  const forces = [
    market.competitive_rivalry || 0,
    market.supplier_power || 0,
    market.buyer_power || 0,
    market.threat_substitution || 0,
    market.entry_barriers || 0,
  ];
  const five_forces_score = forces.reduce((a, b) => a + b, 0) / 5;
  const competitive_intensity_index = Math.round(
    (five_forces_score / 10) * 100
  );
  // Market attractiveness is inverse of competitive intensity
  const market_attractiveness_score = Math.round(100 - competitive_intensity_index);

  // HHI from market shares
  const shares = (market.competitors || []).map(c => c.market_share);
  const hhi_index = shares.reduce((sum, s) => sum + s * s, 0);

  return { competitive_intensity_index, five_forces_score, market_attractiveness_score, hhi_index };
}

export function computeCapabilityMetrics(cap: Partial<CapabilityObject>): {
  strategic_readiness_score: number;
  capability_gaps: string[];
  execution_risk_flagged: boolean;
} {
  const scores: Record<string, number> = {
    operational_efficiency: cap.operational_efficiency || 0,
    brand_strength: cap.brand_strength || 0,
    innovation_capacity: cap.innovation_capacity || 0,
    digital_maturity: cap.digital_maturity || 0,
  };

  const values = Object.values(scores);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const strategic_readiness_score = Math.round(avg * 10); // 0-100

  const capability_gaps: string[] = [];
  Object.entries(scores).forEach(([key, val]) => {
    if (val <= 4) {
      capability_gaps.push(key.replace(/_/g, ' '));
    }
  });

  const execution_risk_flagged = capability_gaps.length >= 2 || strategic_readiness_score < 40;

  return { strategic_readiness_score, capability_gaps, execution_risk_flagged };
}

export function computeResourceEnvelope(constraint: Partial<ConstraintObject>): {
  resource_envelope: Record<string, number>;
  capital_ceiling: number;
  risk_tolerance_coefficient: number;
} {
  const capital = constraint.available_capital || 0;
  const debt = constraint.debt_capacity || 0;
  const capital_ceiling = capital + debt;
  const risk_tolerance_coefficient = (constraint.risk_tolerance || 5) / 10;

  return {
    resource_envelope: {
      equity: capital,
      debt: debt,
      total: capital_ceiling,
    },
    capital_ceiling,
    risk_tolerance_coefficient,
  };
}

export function simulateOption(
  option: StrategicOptionObject,
  constraint: ConstraintObject,
  market: MarketObject,
  capability: CapabilityObject
): SimulationResult {
  const years = 5;
  const baseRevenue = option.expected_revenue_uplift;
  const risk = option.risk_exposure / 10;
  const capStrain = option.capability_strain_index / 100;

  // Financial projections
  const revenue_forecast: number[] = [];
  const cost_forecast: number[] = [];
  const cash_flow_trajectory: number[] = [];

  for (let y = 0; y < years; y++) {
    const growthFactor = 1 + (baseRevenue / 100) * (1 - risk * 0.3);
    const rev = option.required_capital * growthFactor * (y + 1) * 0.4;
    const cost = rev * (0.6 - option.margin_impact / 200);
    revenue_forecast.push(Math.round(rev));
    cost_forecast.push(Math.round(cost));
    cash_flow_trajectory.push(Math.round(rev - cost - (y === 0 ? option.required_capital : 0)));
  }

  // NPV calculation (10% discount rate)
  const discount = 0.10;
  const npv = cash_flow_trajectory.reduce(
    (sum, cf, i) => sum + cf / Math.pow(1 + discount, i + 1), 0
  );
  const risk_adjusted_npv = Math.round(npv * (1 - risk * 0.5));

  // Competitive reaction (simplified game theory)
  const intensity = market.competitive_intensity_index;
  let competitor_response = 'Likely minimal response';
  let game_theory_outcome = 'First-mover advantage holds';
  if (intensity > 70) {
    competitor_response = 'Aggressive competitive retaliation expected';
    game_theory_outcome = 'Price war risk — consider differentiation shield';
  } else if (intensity > 40) {
    competitor_response = 'Moderate competitive adjustment expected';
    game_theory_outcome = 'Sustainable advantage if execution is fast';
  }

  // Real options
  const optionBase = Math.abs(risk_adjusted_npv) * 0.15;
  const option_to_expand_value = Math.round(optionBase * (1 + baseRevenue / 200));
  const option_to_abandon_value = Math.round(option.required_capital * 0.3);
  const option_to_delay_value = Math.round(optionBase * risk);

  // Probability of target achievement
  const readiness = capability.strategic_readiness_score / 100;
  const probability_of_target = Math.round(
    Math.min(95, Math.max(5, readiness * 100 * (1 - risk * 0.4) * (1 - capStrain * 0.3)))
  );

  // Volatility
  const volatility_score = Math.round(risk * 50 + (intensity / 100) * 30 + capStrain * 20);

  // Sensitivity
  const sensitivity_results = [
    { variable: 'Revenue Growth', low: risk_adjusted_npv * 0.8, base: risk_adjusted_npv, high: risk_adjusted_npv * 1.2 },
    { variable: 'Cost Structure', low: risk_adjusted_npv * 1.1, base: risk_adjusted_npv, high: risk_adjusted_npv * 0.85 },
    { variable: 'Market Share', low: risk_adjusted_npv * 0.75, base: risk_adjusted_npv, high: risk_adjusted_npv * 1.25 },
    { variable: 'Discount Rate', low: risk_adjusted_npv * 1.15, base: risk_adjusted_npv, high: risk_adjusted_npv * 0.88 },
  ].map(s => ({
    variable: s.variable,
    low: Math.round(s.low),
    base: Math.round(s.base),
    high: Math.round(s.high),
  }));

  return {
    option_id: option.id,
    revenue_forecast,
    cost_forecast,
    capital_investment: option.required_capital,
    cash_flow_trajectory,
    competitor_response,
    game_theory_outcome,
    option_to_expand_value,
    option_to_abandon_value,
    option_to_delay_value,
    expected_value: Math.round(npv),
    risk_adjusted_npv,
    probability_of_target,
    volatility_score,
    sensitivity_results,
  };
}

export function generateScenarios(
  options: StrategicOptionObject[],
  simulations: SimulationResult[],
  constraint: ConstraintObject,
  market: MarketObject
): ScenarioObject[] {
  const selectedSims = simulations.filter(s =>
    options.find(o => o.id === s.option_id && o.selected)
  );

  const totalNPV = selectedSims.reduce((s, sim) => s + sim.risk_adjusted_npv, 0);
  const avgVolatility = selectedSims.length > 0
    ? selectedSims.reduce((s, sim) => s + sim.volatility_score, 0) / selectedSims.length
    : 50;

  const multipliers = {
    base: 1.0,
    upside: 1.3,
    downside: 0.65,
    extreme_disruption: 0.3,
  };

  return (['base', 'upside', 'downside', 'extreme_disruption'] as const).map((name, i) => {
    const m = multipliers[name];
    const years = 5;
    const revenue_trajectory = Array.from({ length: years }, (_, y) =>
      Math.round(totalNPV * m * (y + 1) / years)
    );

    return {
      id: `scenario-${name}`,
      name,
      label: name === 'extreme_disruption' ? 'Extreme Disruption' :
             name.charAt(0).toUpperCase() + name.slice(1) + ' Case',
      revenue_trajectory,
      market_share_shift: Math.round((m - 1) * 15 * 10) / 10,
      margin_shift: Math.round((m - 1) * 8 * 10) / 10,
      capital_stress: Math.round(Math.max(0, (1 - m) * 100)),
      liquidity_stress: Math.round(Math.max(0, (1 - m) * avgVolatility)),
      breakeven_months: Math.round(Math.max(6, 24 / m)),
      constraint_breach_probability: Math.round(
        Math.max(0, Math.min(100, (1 - m) * 100 * (avgVolatility / 100)))
      ),
    };
  });
}

export function optimisePortfolio(
  options: StrategicOptionObject[],
  simulations: SimulationResult[],
  constraint: ConstraintObject
): PortfolioObject {
  const selected = options.filter(o => o.selected);
  const totalRequired = selected.reduce((s, o) => s + o.required_capital, 0);
  const budget = constraint.capital_ceiling;

  // Simple constrained allocation: proportional to risk-adjusted NPV
  const simMap = new Map(simulations.map(s => [s.option_id, s]));
  const totalNPV = selected.reduce((s, o) => {
    const sim = simMap.get(o.id);
    return s + Math.max(0, sim?.risk_adjusted_npv || 0);
  }, 0);

  const optimal_allocation: Record<string, number> = {};
  let total_deployed = 0;

  selected.forEach(o => {
    const sim = simMap.get(o.id);
    const npv = Math.max(0, sim?.risk_adjusted_npv || 0);
    const weight = totalNPV > 0 ? npv / totalNPV : 1 / selected.length;
    const allocated = Math.min(o.required_capital, budget * weight);
    optimal_allocation[o.id] = Math.round(allocated);
    total_deployed += allocated;
  });

  // Efficient frontier (simplified 10-point curve)
  const efficient_frontier = Array.from({ length: 10 }, (_, i) => {
    const riskLevel = (i + 1) * 10;
    const expectedReturn = Math.round(
      riskLevel * 0.8 + Math.random() * 10 - 5
    );
    return { risk: riskLevel, return_: Math.max(0, expectedReturn) };
  }).sort((a, b) => a.risk - b.risk);

  const portfolio_expected_return = selected.reduce((s, o) => {
    const sim = simMap.get(o.id);
    return s + (sim?.risk_adjusted_npv || 0);
  }, 0);

  const portfolio_risk = selected.reduce((s, o) => {
    const sim = simMap.get(o.id);
    return s + (sim?.volatility_score || 0);
  }, 0) / Math.max(1, selected.length);

  const objective_score = Math.round(
    Math.min(100, (portfolio_expected_return / Math.max(1, budget)) * 50 + 50)
  );

  return {
    selected_options: selected.map(o => o.id),
    optimal_allocation,
    total_capital_deployed: Math.round(total_deployed),
    portfolio_expected_return: Math.round(portfolio_expected_return),
    portfolio_risk: Math.round(portfolio_risk),
    efficient_frontier,
    objective_score,
  };
}

// =============================================
// STRATEGY ENGINE STORE
// =============================================

interface StrategyEngineState {
  // Active session
  session_id: string | null;
  current_phase: InterrogationPhase;
  entry_pathway: 'architect' | 'workspace' | null;

  // Canonical Objects
  enterprise: EnterpriseObject | null;
  objectives: ObjectiveObject | null;
  constraints: ConstraintObject | null;
  market: MarketObject | null;
  capability: CapabilityObject | null;
  strategic_options: StrategicOptionObject[];
  simulations: SimulationResult[];
  scenarios: ScenarioObject[];
  portfolio: PortfolioObject | null;

  // Audit
  audit_log: AuditEntry[];

  // Phase gate validation
  canAdvanceTo: (phase: InterrogationPhase) => boolean;
  getPhaseStatus: (phase: InterrogationPhase) => 'locked' | 'active' | 'completed';

  // Session management
  startSession: (pathway: 'architect' | 'workspace') => void;
  resetSession: () => void;

  // Phase navigation
  setPhase: (phase: InterrogationPhase) => void;

  // Phase 1: Enterprise
  updateEnterprise: (data: Partial<EnterpriseObject>) => void;
  completeEnterprise: () => void;

  // Phase 2: Objectives
  updateObjectives: (data: Partial<ObjectiveObject>) => void;
  addObjective: (node: ObjectiveNode) => void;
  removeObjective: (id: string) => void;
  completeObjectives: () => void;

  // Phase 3: Constraints
  updateConstraints: (data: Partial<ConstraintObject>) => void;
  completeConstraints: () => void;

  // Phase 4: Market
  updateMarket: (data: Partial<MarketObject>) => void;
  addCompetitor: (c: CompetitorEntry) => void;
  removeCompetitor: (name: string) => void;
  completeMarket: () => void;

  // Phase 5: Capability
  updateCapability: (data: Partial<CapabilityObject>) => void;
  completeCapability: () => void;

  // Phase 6: Options
  addOption: (option: Omit<StrategicOptionObject, 'id' | 'selected'>) => void;
  removeOption: (id: string) => void;
  toggleOptionSelected: (id: string) => void;
  updateOption: (id: string, data: Partial<StrategicOptionObject>) => void;

  // Phase 7: Simulation
  runSimulations: () => void;

  // Phase 8: Scenarios
  generateAllScenarios: () => void;

  // Phase 9: Portfolio
  runPortfolioOptimisation: () => void;

  // Audit
  logAudit: (phase: string, action: string, field: string, oldVal: string, newVal: string) => void;
}

const createEmptyEnterprise = (): EnterpriseObject => ({
  enterprise_id: '',
  organisation_name: '',
  organisation_type: 'corporate',
  industry_code: '',
  industry_label: '',
  geographic_footprint: [],
  market_type: 'growth',
  horizon: 'medium',
  horizon_years: '3-5 years',
  completed: false,
});

const createEmptyObjectives = (): ObjectiveObject => ({
  vision: '',
  strategic_intent: 'growth',
  objectives: [],
  completed: false,
});

const createEmptyConstraints = (): ConstraintObject => ({
  available_capital: 0,
  debt_capacity: 0,
  talent_capacity: '',
  technology_maturity: 3,
  risk_tolerance: 5,
  regulatory_constraints: [],
  resource_envelope: {},
  capital_ceiling: 0,
  risk_tolerance_coefficient: 0.5,
  completed: false,
});

const createEmptyMarket = (): MarketObject => ({
  competitors: [],
  entry_barriers: 5,
  buyer_power: 5,
  supplier_power: 5,
  threat_substitution: 5,
  competitive_rivalry: 5,
  competitive_intensity_index: 0,
  five_forces_score: 0,
  market_attractiveness_score: 0,
  hhi_index: 0,
  completed: false,
});

const createEmptyCapability = (): CapabilityObject => ({
  core_competencies: [],
  differentiating_capabilities: [],
  operational_efficiency: 5,
  brand_strength: 5,
  innovation_capacity: 5,
  digital_maturity: 5,
  capability_scores: {},
  strategic_readiness_score: 0,
  capability_gaps: [],
  execution_risk_flagged: false,
  completed: false,
});

export const useStrategyEngine = create<StrategyEngineState>()(
  persist(
    (set, get) => ({
      session_id: null,
      current_phase: 'context',
      entry_pathway: null,

      enterprise: null,
      objectives: null,
      constraints: null,
      market: null,
      capability: null,
      strategic_options: [],
      simulations: [],
      scenarios: [],
      portfolio: null,
      audit_log: [],

      canAdvanceTo: (phase: InterrogationPhase) => {
        const state = get();
        const idx = PHASE_ORDER.indexOf(phase);
        if (idx === 0) return true;

        // Enforce strict gating
        if (idx >= 1 && !state.enterprise?.completed) return false;
        if (idx >= 2 && !state.objectives?.completed) return false;
        if (idx >= 3 && !state.constraints?.completed) return false;
        if (idx >= 4 && !state.market?.completed) return false;
        if (idx >= 5 && !state.capability?.completed) return false;
        if (idx >= 6 && state.strategic_options.length === 0) return false;
        if (idx >= 7 && state.simulations.length === 0) return false;
        if (idx >= 8 && state.scenarios.length === 0) return false;
        return true;
      },

      getPhaseStatus: (phase: InterrogationPhase) => {
        const state = get();
        const idx = PHASE_ORDER.indexOf(phase);
        const currentIdx = PHASE_ORDER.indexOf(state.current_phase);

        // Check completion
        switch (phase) {
          case 'context': return state.enterprise?.completed ? 'completed' : (idx === currentIdx ? 'active' : 'locked');
          case 'objectives': return state.objectives?.completed ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'completed') : 'locked');
          case 'constraints': return state.constraints?.completed ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'completed') : 'locked');
          case 'competitive': return state.market?.completed ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'completed') : 'locked');
          case 'capability': return state.capability?.completed ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'completed') : 'locked');
          case 'options': return state.strategic_options.some(o => o.selected) ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'locked') : 'locked');
          case 'simulation': return state.simulations.length > 0 ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'locked') : 'locked');
          case 'scenarios': return state.scenarios.length > 0 ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'locked') : 'locked');
          case 'portfolio': return state.portfolio ? 'completed' : (state.canAdvanceTo(phase) ? (idx === currentIdx ? 'active' : 'locked') : 'locked');
          case 'governance': return state.canAdvanceTo(phase) ? 'active' : 'locked';
          default: return 'locked';
        }
      },

      startSession: (pathway) => {
        const id = `session-${Date.now()}`;
        set({
          session_id: id,
          entry_pathway: pathway,
          current_phase: 'context',
          enterprise: createEmptyEnterprise(),
          objectives: createEmptyObjectives(),
          constraints: createEmptyConstraints(),
          market: createEmptyMarket(),
          capability: createEmptyCapability(),
          strategic_options: [],
          simulations: [],
          scenarios: [],
          portfolio: null,
          audit_log: [{
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            phase: 'session',
            action: 'started',
            field: 'pathway',
            old_value: '',
            new_value: pathway,
            user: 'current',
          }],
        });
      },

      resetSession: () => {
        set({
          session_id: null,
          entry_pathway: null,
          current_phase: 'context',
          enterprise: null,
          objectives: null,
          constraints: null,
          market: null,
          capability: null,
          strategic_options: [],
          simulations: [],
          scenarios: [],
          portfolio: null,
          audit_log: [],
        });
      },

      setPhase: (phase) => {
        const state = get();
        if (state.canAdvanceTo(phase)) {
          set({ current_phase: phase });
        }
      },

      // Phase 1
      updateEnterprise: (data) => {
        set((state) => ({
          enterprise: { ...(state.enterprise || createEmptyEnterprise()), ...data },
        }));
      },
      completeEnterprise: () => {
        const state = get();
        const e = state.enterprise;
        if (!e || !e.organisation_name || !e.industry_code) return;
        set((state) => ({
          enterprise: { ...(state.enterprise || createEmptyEnterprise()), completed: true, enterprise_id: `ent-${Date.now()}` },
          current_phase: 'objectives',
        }));
        get().logAudit('context', 'completed', 'enterprise', '', 'Phase 1 completed');
      },

      // Phase 2
      updateObjectives: (data) => {
        set((state) => ({
          objectives: { ...(state.objectives || createEmptyObjectives()), ...data },
        }));
      },
      addObjective: (node) => {
        set((state) => ({
          objectives: {
            ...(state.objectives || createEmptyObjectives()),
            objectives: [...(state.objectives?.objectives || []), node],
          },
        }));
      },
      removeObjective: (id) => {
        set((state) => ({
          objectives: {
            ...(state.objectives || createEmptyObjectives()),
            objectives: (state.objectives?.objectives || []).filter(o => o.id !== id),
          },
        }));
      },
      completeObjectives: () => {
        const state = get();
        const o = state.objectives;
        if (!o || o.objectives.length === 0 || !o.objectives.some(obj => obj.target > 0)) return;
        set((state) => ({
          objectives: { ...(state.objectives || createEmptyObjectives()), completed: true },
          current_phase: 'constraints',
        }));
        get().logAudit('objectives', 'completed', 'hierarchy', '', `${o.objectives.length} objectives defined`);
      },

      // Phase 3
      updateConstraints: (data) => {
        set((state) => ({
          constraints: { ...(state.constraints || createEmptyConstraints()), ...data },
        }));
      },
      completeConstraints: () => {
        const state = get();
        const c = state.constraints;
        if (!c || c.available_capital <= 0) return;
        const computed = computeResourceEnvelope(c);
        set((state) => ({
          constraints: {
            ...(state.constraints || createEmptyConstraints()),
            ...computed,
            completed: true,
          },
          current_phase: 'competitive',
        }));
        get().logAudit('constraints', 'completed', 'capital', '', `Ceiling: ${computed.capital_ceiling}`);
      },

      // Phase 4
      updateMarket: (data) => {
        set((state) => ({
          market: { ...(state.market || createEmptyMarket()), ...data },
        }));
      },
      addCompetitor: (c) => {
        set((state) => ({
          market: {
            ...(state.market || createEmptyMarket()),
            competitors: [...(state.market?.competitors || []), c],
          },
        }));
      },
      removeCompetitor: (name) => {
        set((state) => ({
          market: {
            ...(state.market || createEmptyMarket()),
            competitors: (state.market?.competitors || []).filter(c => c.name !== name),
          },
        }));
      },
      completeMarket: () => {
        const state = get();
        const m = state.market;
        if (!m) return;
        const computed = computeCompetitiveMetrics(m);
        set((state) => ({
          market: {
            ...(state.market || createEmptyMarket()),
            ...computed,
            completed: true,
          },
          current_phase: 'capability',
        }));
        get().logAudit('competitive', 'completed', 'five_forces', '', `Score: ${computed.five_forces_score.toFixed(1)}`);
      },

      // Phase 5
      updateCapability: (data) => {
        set((state) => ({
          capability: { ...(state.capability || createEmptyCapability()), ...data },
        }));
      },
      completeCapability: () => {
        const state = get();
        const cap = state.capability;
        if (!cap) return;
        const computed = computeCapabilityMetrics(cap);
        set((state) => ({
          capability: {
            ...(state.capability || createEmptyCapability()),
            ...computed,
            capability_scores: {
              operational_efficiency: cap.operational_efficiency,
              brand_strength: cap.brand_strength,
              innovation_capacity: cap.innovation_capacity,
              digital_maturity: cap.digital_maturity,
            },
            completed: true,
          },
          current_phase: 'options',
        }));
        if (computed.execution_risk_flagged) {
          get().logAudit('capability', 'warning', 'execution_risk', '', 'Capability gaps exceed threshold');
        }
        get().logAudit('capability', 'completed', 'readiness', '', `Score: ${computed.strategic_readiness_score}`);
      },

      // Phase 6
      addOption: (option) => {
        const id = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          strategic_options: [...state.strategic_options, { ...option, id, selected: false }],
        }));
        get().logAudit('options', 'added', 'option', '', option.name);
      },
      removeOption: (id) => {
        set((state) => ({
          strategic_options: state.strategic_options.filter(o => o.id !== id),
        }));
      },
      toggleOptionSelected: (id) => {
        set((state) => ({
          strategic_options: state.strategic_options.map(o =>
            o.id === id ? { ...o, selected: !o.selected } : o
          ),
        }));
      },
      updateOption: (id, data) => {
        set((state) => ({
          strategic_options: state.strategic_options.map(o =>
            o.id === id ? { ...o, ...data } : o
          ),
        }));
      },

      // Phase 7
      runSimulations: () => {
        const state = get();
        if (!state.constraints || !state.market || !state.capability) return;

        const selected = state.strategic_options.filter(o => o.selected);
        const results = selected.map(option =>
          simulateOption(option, state.constraints!, state.market!, state.capability!)
        );
        set({ simulations: results, current_phase: 'scenarios' });
        get().logAudit('simulation', 'completed', 'options', '', `${results.length} options simulated`);
      },

      // Phase 8
      generateAllScenarios: () => {
        const state = get();
        if (!state.constraints || !state.market) return;
        const scenarios = generateScenarios(
          state.strategic_options, state.simulations, state.constraints, state.market
        );
        set({ scenarios, current_phase: 'portfolio' });
        get().logAudit('scenarios', 'generated', 'all', '', '4 scenarios created');
      },

      // Phase 9
      runPortfolioOptimisation: () => {
        const state = get();
        if (!state.constraints) return;
        const portfolio = optimisePortfolio(
          state.strategic_options, state.simulations, state.constraints
        );
        set({ portfolio });
        get().logAudit('portfolio', 'optimised', 'allocation', '', `Score: ${portfolio.objective_score}`);
      },

      // Audit
      logAudit: (phase, action, field, oldVal, newVal) => {
        set((state) => ({
          audit_log: [...state.audit_log, {
            id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toISOString(),
            phase,
            action,
            field,
            old_value: oldVal,
            new_value: newVal,
            user: 'current',
          }],
        }));
      },
    }),
    {
      name: 'lumina-s-strategy-engine',
      partialize: (state) => ({
        session_id: state.session_id,
        current_phase: state.current_phase,
        entry_pathway: state.entry_pathway,
        enterprise: state.enterprise,
        objectives: state.objectives,
        constraints: state.constraints,
        market: state.market,
        capability: state.capability,
        strategic_options: state.strategic_options,
        simulations: state.simulations,
        scenarios: state.scenarios,
        portfolio: state.portfolio,
        audit_log: state.audit_log,
      }),
    }
  )
);
