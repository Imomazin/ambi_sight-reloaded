'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  DiagnosticIntake,
  DiagnosticResult,
  CompanyProfile,
  PerformanceKPIs,
  RiskSignals,
  StrategicPriority,
  Constraints,
  DiagnosticScores,
  StatusIndicators,
  TrafficLight,
  GeneratedInsight,
  ToolRecommendation,
  StrategicSummary,
  SimulationScenario,
  ScenarioAdjustments,
} from '@/lib/database.types';
import {
  defaultCompanyProfile,
  defaultPerformanceKPIs,
  defaultRiskSignals,
  defaultConstraints,
} from '@/lib/database.types';

// ============================================
// STORE INTERFACE
// ============================================

interface DiagnosticStore {
  // Current intake in progress
  currentIntake: Partial<DiagnosticIntake> | null;
  currentStep: number;

  // Saved intakes and results
  savedIntakes: DiagnosticIntake[];
  savedResults: DiagnosticResult[];

  // Simulation scenarios
  simulations: SimulationScenario[];

  // Actions for intake flow
  startNewIntake: (userId: string, organizationName: string) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  updatePerformanceKPIs: (kpis: Partial<PerformanceKPIs>) => void;
  updateRiskSignals: (risks: Partial<RiskSignals>) => void;
  updateStrategicPriorities: (priorities: StrategicPriority[]) => void;
  updateConstraints: (constraints: Partial<Constraints>) => void;

  // Navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Save and complete
  saveIntakeDraft: () => void;
  completeIntake: () => DiagnosticResult | null;
  deleteIntake: (intakeId: string) => void;

  // Load existing
  loadIntake: (intakeId: string) => void;
  loadResult: (resultId: string) => DiagnosticResult | null;

  // Simulations
  createSimulation: (diagnosticId: string, name: string, adjustments: ScenarioAdjustments) => SimulationScenario;
  deleteSimulation: (simulationId: string) => void;

  // Reset
  resetCurrentIntake: () => void;
  clearAllData: () => void;
}

// ============================================
// SCORING ENGINE
// ============================================

function calculatePerformanceScore(kpis: PerformanceKPIs): number {
  const weights = {
    revenue_growth: 0.15,
    gross_margin: 0.12,
    operating_margin: 0.12,
    market_share: 0.1,
    customer_acquisition_cost: 0.08,
    customer_lifetime_value: 0.1,
    employee_productivity: 0.1,
    customer_satisfaction: 0.1,
    innovation_rate: 0.08,
    operational_efficiency: 0.05,
  };

  let score = 0;

  // Revenue growth: normalize to 0-100 (assuming -20% to +50% range)
  const rgNorm = Math.min(100, Math.max(0, ((kpis.revenue_growth.value + 20) / 70) * 100));
  score += rgNorm * weights.revenue_growth;

  // Gross margin: normalize (0-80% range)
  score += Math.min(100, (kpis.gross_margin.value / 80) * 100) * weights.gross_margin;

  // Operating margin: normalize (-10% to 40% range)
  const omNorm = Math.min(100, Math.max(0, ((kpis.operating_margin.value + 10) / 50) * 100));
  score += omNorm * weights.operating_margin;

  // Market share: normalize (0-50% range)
  score += Math.min(100, (kpis.market_share.value / 50) * 100) * weights.market_share;

  // CAC: inverse normalize (lower is better, $0-$2000 range)
  const cacNorm = Math.max(0, 100 - (kpis.customer_acquisition_cost.value / 2000) * 100);
  score += cacNorm * weights.customer_acquisition_cost;

  // LTV: normalize ($0-$20000 range)
  score += Math.min(100, (kpis.customer_lifetime_value.value / 20000) * 100) * weights.customer_lifetime_value;

  // Productivity, Satisfaction, Efficiency: already 0-100 scale
  score += kpis.employee_productivity.value * weights.employee_productivity;
  score += kpis.customer_satisfaction.value * weights.customer_satisfaction;
  score += kpis.operational_efficiency.value * weights.operational_efficiency;

  // Innovation rate: normalize (0-50% range)
  score += Math.min(100, (kpis.innovation_rate.value / 50) * 100) * weights.innovation_rate;

  // Apply trend modifiers
  const trendMultiplier = {
    improving: 1.05,
    stable: 1.0,
    declining: 0.95,
  };

  // Average trend effect
  const trends = [
    kpis.revenue_growth.trend,
    kpis.gross_margin.trend,
    kpis.customer_satisfaction.trend,
  ];
  const avgTrendMult = trends.reduce((acc, t) => acc * trendMultiplier[t], 1) ** (1 / 3);

  return Math.round(Math.min(100, Math.max(0, score * avgTrendMult)));
}

function calculateThreatScore(risks: RiskSignals): number {
  const weights = {
    regulatory_risk: 0.12,
    supply_chain_risk: 0.1,
    technology_disruption: 0.12,
    talent_risk: 0.1,
    market_risk: 0.12,
    financial_risk: 0.12,
    competitive_risk: 0.1,
    cybersecurity_risk: 0.1,
    reputation_risk: 0.06,
    operational_risk: 0.06,
  };

  let score = 0;

  // Convert 1-5 scale to 0-100 (5 = 100% threat)
  Object.entries(risks).forEach(([key, value]) => {
    const riskKey = key as keyof typeof weights;
    const normalizedRisk = ((value.score - 1) / 4) * 100;

    // Apply trend modifier
    const trendMod = value.trend === 'worsening' ? 1.1 : value.trend === 'improving' ? 0.9 : 1.0;

    score += normalizedRisk * trendMod * weights[riskKey];
  });

  return Math.round(Math.min(100, Math.max(0, score)));
}

function calculateAlignmentScore(
  priorities: StrategicPriority[],
  constraints: Constraints,
  kpis: PerformanceKPIs
): number {
  // Base alignment from having clear priorities
  let score = priorities.length >= 3 ? 70 : priorities.length * 20;

  // Capability gaps reduce alignment
  const capabilityPenalty = constraints.capability_constraints.length * 5;
  score -= capabilityPenalty;

  // Budget constraint affects alignment
  const budgetModifier = {
    very_limited: 0.7,
    limited: 0.8,
    moderate: 0.9,
    significant: 1.0,
    extensive: 1.05,
  };
  score *= budgetModifier[constraints.budget_constraint];

  // Time constraint affects alignment
  const timeModifier = {
    urgent: 0.85,
    short_term: 0.9,
    medium_term: 1.0,
    long_term: 1.05,
  };
  score *= timeModifier[constraints.time_constraint];

  // KPI alignment bonus
  if (priorities.includes('growth_acceleration') && kpis.revenue_growth.value > 20) {
    score += 5;
  }
  if (priorities.includes('cost_optimization') && kpis.operating_margin.value > 15) {
    score += 5;
  }
  if (priorities.includes('customer_experience') && kpis.customer_satisfaction.value > 80) {
    score += 5;
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

function calculateReadinessScore(
  performanceScore: number,
  threatScore: number,
  alignmentScore: number,
  constraints: Constraints
): number {
  // Base readiness is average of other scores
  let score = (performanceScore + (100 - threatScore) + alignmentScore) / 3;

  // Capability constraints reduce readiness
  const capabilityPenalty = constraints.capability_constraints.length * 3;
  score -= capabilityPenalty;

  // Resource constraints reduce readiness
  const resourcePenalty = constraints.resource_constraints.length * 2;
  score -= resourcePenalty;

  return Math.round(Math.min(100, Math.max(0, score)));
}

function getTrafficLight(score: number, isRisk: boolean = false): TrafficLight {
  if (isRisk) {
    // For risks, higher = worse
    if (score >= 70) return 'red';
    if (score >= 40) return 'amber';
    return 'green';
  } else {
    // For performance, higher = better
    if (score >= 70) return 'green';
    if (score >= 40) return 'amber';
    return 'red';
  }
}

function generateInsights(
  intake: DiagnosticIntake,
  scores: DiagnosticScores
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];

  // Performance-based insights
  if (scores.performance_score < 50) {
    insights.push({
      id: uuidv4(),
      type: 'concern',
      title: 'Performance Below Target',
      description: 'Your overall performance metrics indicate significant room for improvement. Focus on core operational KPIs before pursuing aggressive growth.',
      priority: 'high',
      related_area: 'performance',
    });
  }

  // Risk-based insights
  if (scores.threat_score >= 60) {
    insights.push({
      id: uuidv4(),
      type: 'concern',
      title: 'Elevated Risk Profile',
      description: 'Multiple risk signals are at concerning levels. Consider implementing a comprehensive risk mitigation program before expanding operations.',
      priority: 'high',
      related_area: 'risk',
    });
  }

  // Specific risk insights
  if (intake.risk_signals.technology_disruption.score >= 4) {
    insights.push({
      id: uuidv4(),
      type: 'concern',
      title: 'Technology Disruption Threat',
      description: 'High technology disruption risk detected. Evaluate your digital capabilities and consider accelerating innovation initiatives.',
      priority: 'high',
      related_area: 'technology',
    });
  }

  if (intake.risk_signals.talent_risk.score >= 4) {
    insights.push({
      id: uuidv4(),
      type: 'concern',
      title: 'Talent Retention Risk',
      description: 'Talent risk is elevated. Review compensation, culture, and growth opportunities to prevent key person dependencies.',
      priority: 'medium',
      related_area: 'talent',
    });
  }

  // Opportunity insights
  if (intake.performance_kpis.customer_satisfaction.value >= 80) {
    insights.push({
      id: uuidv4(),
      type: 'opportunity',
      title: 'Customer Loyalty Advantage',
      description: 'Strong customer satisfaction scores create opportunities for upselling, referral programs, and premium positioning.',
      priority: 'medium',
      related_area: 'customers',
    });
  }

  if (intake.performance_kpis.innovation_rate.value >= 25) {
    insights.push({
      id: uuidv4(),
      type: 'opportunity',
      title: 'Innovation Leadership Potential',
      description: 'Above-average innovation metrics position you well for first-mover advantages in emerging market segments.',
      priority: 'medium',
      related_area: 'innovation',
    });
  }

  // Alignment insights
  if (scores.alignment_score < 50) {
    insights.push({
      id: uuidv4(),
      type: 'concern',
      title: 'Strategy-Capability Misalignment',
      description: 'Your strategic priorities may not be well-matched to current capabilities. Consider capability building or priority adjustment.',
      priority: 'high',
      related_area: 'alignment',
    });
  }

  // Constraint-based insights
  if (intake.constraints.budget_constraint === 'very_limited' || intake.constraints.budget_constraint === 'limited') {
    insights.push({
      id: uuidv4(),
      type: 'recommendation',
      title: 'Resource Optimization Required',
      description: 'Budget constraints suggest focusing on high-impact, low-cost initiatives. Prioritize operational efficiency and organic growth.',
      priority: 'medium',
      related_area: 'resources',
    });
  }

  if (intake.constraints.time_constraint === 'urgent') {
    insights.push({
      id: uuidv4(),
      type: 'recommendation',
      title: 'Fast-Track Execution Needed',
      description: 'Tight timeline requires rapid decision-making frameworks and agile implementation approaches.',
      priority: 'high',
      related_area: 'execution',
    });
  }

  return insights.slice(0, 8); // Limit to 8 insights
}

function generateToolRecommendations(
  intake: DiagnosticIntake,
  scores: DiagnosticScores
): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = [];

  // Low performance + high risk → strategic renewal tools
  if (scores.performance_score < 50 && scores.threat_score >= 50) {
    recommendations.push({
      tool_id: 'swot-analysis',
      tool_name: 'SWOT Analysis',
      category: 'renewal',
      relevance_score: 95,
      reason: 'Critical assessment needed when facing both performance challenges and elevated risks.',
      priority: 'primary',
    });
    recommendations.push({
      tool_id: 'turnaround-playbook',
      tool_name: 'Turnaround Strategy Playbook',
      category: 'renewal',
      relevance_score: 90,
      reason: 'Structured approach for organizations needing fundamental strategic reset.',
      priority: 'primary',
    });
  }

  // High performance + low alignment → scaling tools
  if (scores.performance_score >= 70 && scores.alignment_score < 50) {
    recommendations.push({
      tool_id: 'okr-framework',
      tool_name: 'OKR Framework',
      category: 'execution',
      relevance_score: 92,
      reason: 'Strong performance but unclear direction - OKRs provide alignment across the organization.',
      priority: 'primary',
    });
    recommendations.push({
      tool_id: 'strategic-roadmap',
      tool_name: 'Strategic Roadmap Builder',
      category: 'execution',
      relevance_score: 88,
      reason: 'Convert strong fundamentals into coherent strategic direction.',
      priority: 'primary',
    });
  }

  // Growth priority recommendations
  if (intake.strategic_priorities.includes('growth_acceleration')) {
    recommendations.push({
      tool_id: 'ansoff-matrix',
      tool_name: 'Ansoff Growth Matrix',
      category: 'growth',
      relevance_score: 85,
      reason: 'Essential framework for evaluating growth vector options.',
      priority: recommendations.length < 2 ? 'primary' : 'secondary',
    });
    recommendations.push({
      tool_id: 'tam-sam-som',
      tool_name: 'TAM SAM SOM Analysis',
      category: 'growth',
      relevance_score: 80,
      reason: 'Quantify market opportunity for growth initiatives.',
      priority: 'secondary',
    });
  }

  // Digital transformation recommendations
  if (intake.strategic_priorities.includes('digital_transformation')) {
    recommendations.push({
      tool_id: 'digital-maturity',
      tool_name: 'Digital Maturity Assessment',
      category: 'digital',
      relevance_score: 88,
      reason: 'Baseline your digital capabilities before transformation investments.',
      priority: recommendations.length < 2 ? 'primary' : 'secondary',
    });
  }

  // Risk mitigation recommendations
  if (scores.threat_score >= 60 || intake.strategic_priorities.includes('risk_mitigation')) {
    recommendations.push({
      tool_id: 'risk-register',
      tool_name: 'Risk Register & Heat Map',
      category: 'risk',
      relevance_score: 90,
      reason: 'Elevated risk profile requires systematic risk tracking and prioritization.',
      priority: 'primary',
    });
    recommendations.push({
      tool_id: 'scenario-planning',
      tool_name: 'Scenario Planning Workshop',
      category: 'risk',
      relevance_score: 82,
      reason: 'Build organizational resilience through strategic foresight.',
      priority: 'secondary',
    });
  }

  // Innovation recommendations
  if (intake.strategic_priorities.includes('innovation_leadership')) {
    recommendations.push({
      tool_id: 'innovation-portfolio',
      tool_name: 'Innovation Portfolio Matrix',
      category: 'innovation',
      relevance_score: 85,
      reason: 'Balance innovation investments across horizons for sustainable growth.',
      priority: 'secondary',
    });
  }

  // Cost optimization recommendations
  if (intake.strategic_priorities.includes('cost_optimization')) {
    recommendations.push({
      tool_id: 'value-chain',
      tool_name: 'Value Chain Analysis',
      category: 'execution',
      relevance_score: 83,
      reason: 'Identify cost reduction opportunities across your value chain.',
      priority: 'secondary',
    });
  }

  // Always recommend basic tools
  if (recommendations.length < 5) {
    recommendations.push({
      tool_id: 'balanced-scorecard',
      tool_name: 'Balanced Scorecard',
      category: 'execution',
      relevance_score: 75,
      reason: 'Comprehensive performance management framework for strategic execution.',
      priority: 'supporting',
    });
  }

  // Sort by relevance and return top 7
  return recommendations
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 7);
}

function generateStrategicSummary(
  intake: DiagnosticIntake,
  scores: DiagnosticScores,
  insights: GeneratedInsight[]
): StrategicSummary {
  const concerns = insights.filter((i) => i.type === 'concern');
  const opportunities = insights.filter((i) => i.type === 'opportunity');

  // Generate executive summary
  let summary = `${intake.organization_name} operates in the ${intake.company_profile.industry} sector with a `;

  if (scores.overall_health >= 70) {
    summary += 'strong strategic position. ';
  } else if (scores.overall_health >= 50) {
    summary += 'moderate strategic position with areas requiring attention. ';
  } else {
    summary += 'challenging strategic position requiring focused intervention. ';
  }

  summary += `Performance score of ${scores.performance_score}/100 indicates ${
    scores.performance_score >= 70 ? 'healthy operations' : scores.performance_score >= 50 ? 'operational gaps' : 'significant operational challenges'
  }. `;

  summary += `Risk exposure at ${scores.threat_score}/100 is ${
    scores.threat_score >= 60 ? 'elevated and requires mitigation' : scores.threat_score >= 40 ? 'moderate and manageable' : 'well-controlled'
  }. `;

  summary += `Strategic alignment score of ${scores.alignment_score}/100 suggests ${
    scores.alignment_score >= 70 ? 'priorities match capabilities' : 'potential misalignment between goals and resources'
  }.`;

  return {
    executive_summary: summary,
    top_concerns: concerns.slice(0, 3).map((c) => c.title),
    top_opportunities: opportunities.slice(0, 3).map((o) => o.title),
    immediate_actions: insights
      .filter((i) => i.priority === 'high')
      .slice(0, 3)
      .map((i) => i.title),
  };
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useDiagnosticStore = create<DiagnosticStore>()(
  persist(
    (set, get) => ({
      currentIntake: null,
      currentStep: 0,
      savedIntakes: [],
      savedResults: [],
      simulations: [],

      startNewIntake: (userId: string, organizationName: string) => {
        const newIntake: Partial<DiagnosticIntake> = {
          id: uuidv4(),
          user_id: userId,
          organization_name: organizationName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed: false,
          company_profile: { ...defaultCompanyProfile },
          performance_kpis: { ...defaultPerformanceKPIs },
          risk_signals: { ...defaultRiskSignals },
          strategic_priorities: [],
          constraints: { ...defaultConstraints },
        };
        set({ currentIntake: newIntake, currentStep: 0 });
      },

      updateCompanyProfile: (profile) => {
        const { currentIntake } = get();
        if (!currentIntake) return;
        set({
          currentIntake: {
            ...currentIntake,
            company_profile: { ...currentIntake.company_profile!, ...profile },
            updated_at: new Date().toISOString(),
          },
        });
      },

      updatePerformanceKPIs: (kpis) => {
        const { currentIntake } = get();
        if (!currentIntake) return;
        set({
          currentIntake: {
            ...currentIntake,
            performance_kpis: { ...currentIntake.performance_kpis!, ...kpis },
            updated_at: new Date().toISOString(),
          },
        });
      },

      updateRiskSignals: (risks) => {
        const { currentIntake } = get();
        if (!currentIntake) return;
        set({
          currentIntake: {
            ...currentIntake,
            risk_signals: { ...currentIntake.risk_signals!, ...risks },
            updated_at: new Date().toISOString(),
          },
        });
      },

      updateStrategicPriorities: (priorities) => {
        const { currentIntake } = get();
        if (!currentIntake) return;
        set({
          currentIntake: {
            ...currentIntake,
            strategic_priorities: priorities,
            updated_at: new Date().toISOString(),
          },
        });
      },

      updateConstraints: (constraints) => {
        const { currentIntake } = get();
        if (!currentIntake) return;
        set({
          currentIntake: {
            ...currentIntake,
            constraints: { ...currentIntake.constraints!, ...constraints },
            updated_at: new Date().toISOString(),
          },
        });
      },

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      saveIntakeDraft: () => {
        const { currentIntake, savedIntakes } = get();
        if (!currentIntake?.id) return;

        const existingIndex = savedIntakes.findIndex((i) => i.id === currentIntake.id);
        const intakeToSave = { ...currentIntake, updated_at: new Date().toISOString() } as DiagnosticIntake;

        if (existingIndex >= 0) {
          const updated = [...savedIntakes];
          updated[existingIndex] = intakeToSave;
          set({ savedIntakes: updated });
        } else {
          set({ savedIntakes: [...savedIntakes, intakeToSave] });
        }
      },

      completeIntake: () => {
        const { currentIntake, savedIntakes, savedResults } = get();
        if (!currentIntake?.id) return null;

        // Complete the intake
        const completedIntake = {
          ...currentIntake,
          completed: true,
          updated_at: new Date().toISOString(),
        } as DiagnosticIntake;

        // Calculate scores
        const performanceScore = calculatePerformanceScore(completedIntake.performance_kpis);
        const threatScore = calculateThreatScore(completedIntake.risk_signals);
        const alignmentScore = calculateAlignmentScore(
          completedIntake.strategic_priorities,
          completedIntake.constraints,
          completedIntake.performance_kpis
        );
        const readinessScore = calculateReadinessScore(
          performanceScore,
          threatScore,
          alignmentScore,
          completedIntake.constraints
        );
        const overallHealth = Math.round(
          (performanceScore * 0.3 + (100 - threatScore) * 0.25 + alignmentScore * 0.25 + readinessScore * 0.2)
        );

        const scores: DiagnosticScores = {
          performance_score: performanceScore,
          threat_score: threatScore,
          alignment_score: alignmentScore,
          readiness_score: readinessScore,
          overall_health: overallHealth,
        };

        const statusIndicators: StatusIndicators = {
          performance: getTrafficLight(performanceScore),
          risk: getTrafficLight(threatScore, true),
          alignment: getTrafficLight(alignmentScore),
          readiness: getTrafficLight(readinessScore),
          overall: getTrafficLight(overallHealth),
        };

        const insights = generateInsights(completedIntake, scores);
        const recommendedTools = generateToolRecommendations(completedIntake, scores);
        const summary = generateStrategicSummary(completedIntake, scores, insights);

        const result: DiagnosticResult = {
          id: uuidv4(),
          intake_id: completedIntake.id,
          user_id: completedIntake.user_id,
          created_at: new Date().toISOString(),
          scores,
          status_indicators: statusIndicators,
          insights,
          recommended_tools: recommendedTools,
          summary,
        };

        // Update saved intakes
        const existingIndex = savedIntakes.findIndex((i) => i.id === completedIntake.id);
        const updatedIntakes = existingIndex >= 0
          ? savedIntakes.map((i, idx) => (idx === existingIndex ? completedIntake : i))
          : [...savedIntakes, completedIntake];

        set({
          savedIntakes: updatedIntakes,
          savedResults: [...savedResults, result],
          currentIntake: null,
          currentStep: 0,
        });

        return result;
      },

      deleteIntake: (intakeId) => {
        const { savedIntakes, savedResults, simulations } = get();
        set({
          savedIntakes: savedIntakes.filter((i) => i.id !== intakeId),
          savedResults: savedResults.filter((r) => r.intake_id !== intakeId),
          simulations: simulations.filter((s) => s.diagnostic_id !== intakeId),
        });
      },

      loadIntake: (intakeId) => {
        const { savedIntakes } = get();
        const intake = savedIntakes.find((i) => i.id === intakeId);
        if (intake) {
          set({ currentIntake: intake, currentStep: 0 });
        }
      },

      loadResult: (resultId) => {
        const { savedResults } = get();
        return savedResults.find((r) => r.id === resultId) || null;
      },

      createSimulation: (diagnosticId, name, adjustments) => {
        const { savedResults, simulations } = get();
        const baseResult = savedResults.find((r) => r.intake_id === diagnosticId);

        if (!baseResult) {
          throw new Error('No diagnostic result found for simulation');
        }

        // Apply adjustments to base scores
        const projectedScores: DiagnosticScores = {
          performance_score: Math.min(100, Math.max(0,
            baseResult.scores.performance_score + adjustments.revenue_growth_delta * 0.5 + adjustments.margin_delta * 0.3
          )),
          threat_score: Math.min(100, Math.max(0,
            baseResult.scores.threat_score + adjustments.risk_level_delta * 10
          )),
          alignment_score: Math.min(100, Math.max(0,
            baseResult.scores.alignment_score + adjustments.capability_delta * 5
          )),
          readiness_score: Math.min(100, Math.max(0,
            baseResult.scores.readiness_score + adjustments.capability_delta * 3
          )),
          overall_health: 0, // Calculated below
        };

        projectedScores.overall_health = Math.round(
          (projectedScores.performance_score * 0.3 +
            (100 - projectedScores.threat_score) * 0.25 +
            projectedScores.alignment_score * 0.25 +
            projectedScores.readiness_score * 0.2)
        );

        const deltaFromBaseline: DiagnosticScores = {
          performance_score: projectedScores.performance_score - baseResult.scores.performance_score,
          threat_score: projectedScores.threat_score - baseResult.scores.threat_score,
          alignment_score: projectedScores.alignment_score - baseResult.scores.alignment_score,
          readiness_score: projectedScores.readiness_score - baseResult.scores.readiness_score,
          overall_health: projectedScores.overall_health - baseResult.scores.overall_health,
        };

        const simulation: SimulationScenario = {
          id: uuidv4(),
          diagnostic_id: diagnosticId,
          name,
          created_at: new Date().toISOString(),
          adjustments,
          projected_scores: projectedScores,
          delta_from_baseline: deltaFromBaseline,
        };

        set({ simulations: [...simulations, simulation] });
        return simulation;
      },

      deleteSimulation: (simulationId) => {
        const { simulations } = get();
        set({ simulations: simulations.filter((s) => s.id !== simulationId) });
      },

      resetCurrentIntake: () => {
        set({ currentIntake: null, currentStep: 0 });
      },

      clearAllData: () => {
        set({
          currentIntake: null,
          currentStep: 0,
          savedIntakes: [],
          savedResults: [],
          simulations: [],
        });
      },
    }),
    {
      name: 'ambi-sight-diagnostics',
      partialize: (state) => ({
        savedIntakes: state.savedIntakes,
        savedResults: state.savedResults,
        simulations: state.simulations,
        currentIntake: state.currentIntake,
        currentStep: state.currentStep,
      }),
    }
  )
);
