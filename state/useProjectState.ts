'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Workflow step types
export type WorkflowStep = 'discover' | 'diagnose' | 'design' | 'decide' | 'deliver';

// Organization profile from Discover step
export interface OrganizationProfile {
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  growthStage: 'idea' | 'early' | 'growth' | 'mature' | 'declining';
  region: string;
  challenges: string[];
  goals: string[];
  aiSummary?: string;
}

// Diagnostic data from Diagnose step
export interface DiagnosticData {
  toolUsed: string;
  completedAt: string;
  scores: Record<string, number>;
  insights: string[];
  recommendations: string[];
  swotData?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pestelData?: {
    political: string[];
    economic: string[];
    social: string[];
    technological: string[];
    environmental: string[];
    legal: string[];
  };
}

// Framework data from Design step
export interface FrameworkData {
  frameworkUsed: string;
  completedAt: string;
  canvasData?: Record<string, string[]>;
  okrs?: { objective: string; keyResults: string[] }[];
  porterData?: Record<string, { score: number; notes: string }>;
}

// Decision data from Decide step
export interface DecisionData {
  priorityMatrix?: { item: string; impact: number; effort: number }[];
  roadmapItems?: { phase: string; initiatives: string[] }[];
  scenarios?: { name: string; probability: number; impact: string }[];
  votes?: { item: string; votes: number }[];
  selectedStrategy?: string;
}

// Execution data from Deliver step
export interface ExecutionData {
  tasks: { id: string; title: string; status: 'todo' | 'in_progress' | 'done'; dueDate?: string }[];
  milestones: { id: string; title: string; targetDate: string; completed: boolean }[];
  kpis: { name: string; target: number; current: number }[];
}

// Complete project
export interface StrategyProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  confidenceIndex: number;
  riskGauge: number;

  // Step data
  discover?: OrganizationProfile;
  diagnose?: DiagnosticData[];
  design?: FrameworkData[];
  decide?: DecisionData;
  deliver?: ExecutionData;
}

interface ProjectState {
  // All projects
  projects: StrategyProject[];

  // Current active project
  activeProjectId: string | null;

  // Actions
  createProject: (name: string) => string;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;

  // Get current project
  getActiveProject: () => StrategyProject | null;

  // Update workflow step
  setCurrentStep: (step: WorkflowStep) => void;
  completeStep: (step: WorkflowStep) => void;

  // Update step data
  updateDiscoverData: (data: OrganizationProfile) => void;
  addDiagnosticData: (data: DiagnosticData) => void;
  addFrameworkData: (data: FrameworkData) => void;
  updateDecisionData: (data: Partial<DecisionData>) => void;
  updateExecutionData: (data: Partial<ExecutionData>) => void;

  // Metrics
  updateConfidenceIndex: (value: number) => void;
  updateRiskGauge: (value: number) => void;
}

export const useProjectState = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      createProject: (name: string) => {
        const id = `project-${Date.now()}`;
        const newProject: StrategyProject = {
          id,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentStep: 'discover',
          completedSteps: [],
          confidenceIndex: 0,
          riskGauge: 50,
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: id,
        }));

        return id;
      },

      deleteProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        }));
      },

      setActiveProject: (id: string | null) => {
        set({ activeProjectId: id });
      },

      getActiveProject: () => {
        const state = get();
        return state.projects.find((p) => p.id === state.activeProjectId) || null;
      },

      setCurrentStep: (step: WorkflowStep) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, currentStep: step, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      completeStep: (step: WorkflowStep) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? {
                  ...p,
                  completedSteps: p.completedSteps.includes(step)
                    ? p.completedSteps
                    : [...p.completedSteps, step],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateDiscoverData: (data: OrganizationProfile) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, discover: data, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      addDiagnosticData: (data: DiagnosticData) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? {
                  ...p,
                  diagnose: [...(p.diagnose || []), data],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      addFrameworkData: (data: FrameworkData) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? {
                  ...p,
                  design: [...(p.design || []), data],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateDecisionData: (data: Partial<DecisionData>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? {
                  ...p,
                  decide: { ...p.decide, ...data },
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateExecutionData: (data: Partial<ExecutionData>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? {
                  ...p,
                  deliver: {
                    tasks: data.tasks || p.deliver?.tasks || [],
                    milestones: data.milestones || p.deliver?.milestones || [],
                    kpis: data.kpis || p.deliver?.kpis || [],
                  },
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateConfidenceIndex: (value: number) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, confidenceIndex: Math.min(100, Math.max(0, value)) }
              : p
          ),
        }));
      },

      updateRiskGauge: (value: number) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, riskGauge: Math.min(100, Math.max(0, value)) }
              : p
          ),
        }));
      },
    }),
    {
      name: 'lumina-projects-storage',
    }
  )
);

// Helper to get step order
export const WORKFLOW_STEPS: WorkflowStep[] = ['discover', 'diagnose', 'design', 'decide', 'deliver'];

export const getStepIndex = (step: WorkflowStep): number => WORKFLOW_STEPS.indexOf(step);

export const getNextStep = (step: WorkflowStep): WorkflowStep | null => {
  const index = getStepIndex(step);
  return index < WORKFLOW_STEPS.length - 1 ? WORKFLOW_STEPS[index + 1] : null;
};

export const getPreviousStep = (step: WorkflowStep): WorkflowStep | null => {
  const index = getStepIndex(step);
  return index > 0 ? WORKFLOW_STEPS[index - 1] : null;
};

export const getStepLabel = (step: WorkflowStep): string => {
  const labels: Record<WorkflowStep, string> = {
    discover: 'Discover',
    diagnose: 'Diagnose',
    design: 'Design',
    decide: 'Decide',
    deliver: 'Deliver',
  };
  return labels[step];
};

export const getStepDescription = (step: WorkflowStep): string => {
  const descriptions: Record<WorkflowStep, string> = {
    discover: 'Understand your organization and strategic context',
    diagnose: 'Analyze your current position with diagnostic tools',
    design: 'Build strategic frameworks and action plans',
    decide: 'Prioritize initiatives and make strategic choices',
    deliver: 'Execute your strategy and track progress',
  };
  return descriptions[step];
};
