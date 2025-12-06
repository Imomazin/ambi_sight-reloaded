'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Persona, Scenario } from '@/lib/demoData';
import { scenarios } from '@/lib/demoData';

interface AppState {
  // Current persona
  currentPersona: Persona;
  setPersona: (persona: Persona) => void;

  // Current scenario
  currentScenario: Scenario | null;
  setScenario: (scenario: Scenario | null) => void;

  // Admin controls
  riskMultiplier: number;
  setRiskMultiplier: (value: number) => void;

  noiseLevel: number;
  setNoiseLevel: (value: number) => void;

  // Help modal
  isHelpOpen: boolean;
  setHelpOpen: (open: boolean) => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Onboarding
  onboardingCompleted: string[];
  completeOnboardingStep: (step: string) => void;
  resetOnboarding: () => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      // Persona
      currentPersona: 'strategy-leader',
      setPersona: (persona) => set({ currentPersona: persona }),

      // Scenario
      currentScenario: null,
      setScenario: (scenario) => set({ currentScenario: scenario }),

      // Admin controls
      riskMultiplier: 1.0,
      setRiskMultiplier: (value) => set({ riskMultiplier: value }),

      noiseLevel: 0,
      setNoiseLevel: (value) => set({ noiseLevel: value }),

      // Help
      isHelpOpen: false,
      setHelpOpen: (open) => set({ isHelpOpen: open }),

      // Sidebar
      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      // Onboarding
      onboardingCompleted: [],
      completeOnboardingStep: (step) =>
        set((state) => ({
          onboardingCompleted: state.onboardingCompleted.includes(step)
            ? state.onboardingCompleted
            : [...state.onboardingCompleted, step],
        })),
      resetOnboarding: () => set({ onboardingCompleted: [] }),
    }),
    {
      name: 'ambi-sight-storage',
      partialize: (state) => ({
        currentPersona: state.currentPersona,
        riskMultiplier: state.riskMultiplier,
        noiseLevel: state.noiseLevel,
        onboardingCompleted: state.onboardingCompleted,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);

// Helper hook to apply multipliers to KPI values
export const useAdjustedValue = (baseValue: number, isRisk: boolean = false): number => {
  const { riskMultiplier, noiseLevel, currentScenario } = useAppState();

  let adjustedValue = baseValue;

  // Apply scenario multipliers
  if (currentScenario) {
    if (isRisk) {
      adjustedValue *= currentScenario.multipliers.risk;
    } else {
      adjustedValue *= currentScenario.multipliers.growth;
    }
  }

  // Apply admin risk multiplier
  if (isRisk) {
    adjustedValue *= riskMultiplier;
  }

  // Apply noise
  if (noiseLevel > 0) {
    const noise = (Math.random() - 0.5) * noiseLevel * 0.1;
    adjustedValue *= (1 + noise);
  }

  return Math.round(adjustedValue * 10) / 10;
};
