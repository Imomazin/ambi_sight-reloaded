'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Persona, Scenario } from '@/lib/demoData';
import type { UserProfile } from '@/lib/users';

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'insight';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: { label: string; href: string };
}

// Analysis history
export interface AnalysisRecord {
  id: string;
  fileName: string;
  timestamp: Date;
  summary: string;
  confidence: number;
}

// Dashboard widget
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'tool' | 'insight' | 'activity';
  position: { x: number; y: number };
  size: { w: number; h: number };
}

interface AppState {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Current user
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;

  // Current persona
  currentPersona: Persona;
  setPersona: (persona: Persona) => void;

  // Current scenario
  currentScenario: Scenario | null;
  setScenario: (scenario: Scenario | null) => void;

  // Active tool (for workspace)
  activeToolId: string | null;
  setActiveToolId: (toolId: string | null) => void;

  // Admin controls
  riskMultiplier: number;
  setRiskMultiplier: (value: number) => void;

  noiseLevel: number;
  setNoiseLevel: (value: number) => void;

  // Help modal
  isHelpOpen: boolean;
  setHelpOpen: (open: boolean) => void;

  // User switcher modal
  isUserSwitcherOpen: boolean;
  setUserSwitcherOpen: (open: boolean) => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Onboarding
  onboardingCompleted: string[];
  completeOnboardingStep: (step: string) => void;
  resetOnboarding: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;

  // Command palette (Cmd+K)
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  isNotificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;

  // Analysis history
  analysisHistory: AnalysisRecord[];
  addAnalysisRecord: (record: Omit<AnalysisRecord, 'id' | 'timestamp'>) => void;
  clearAnalysisHistory: () => void;

  // Dashboard customization
  dashboardWidgets: DashboardWidget[];
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
  updateWidgetSize: (id: string, size: { w: number; h: number }) => void;
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  removeWidget: (id: string) => void;
  resetDashboard: () => void;

  // Usage tracking
  aiQueriesUsed: number;
  incrementAiQueries: () => void;
  dataUploadsUsed: number;
  incrementDataUploads: () => void;
  resetUsageCounters: () => void;

  // Trial management
  trialStartDate: string | null;
  setTrialStartDate: (date: string) => void;

  // Feature flags
  featureFlags: Record<string, boolean>;
  setFeatureFlag: (flag: string, value: boolean) => void;
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'kpi-1', type: 'kpi', position: { x: 0, y: 0 }, size: { w: 1, h: 1 } },
  { id: 'kpi-2', type: 'kpi', position: { x: 1, y: 0 }, size: { w: 1, h: 1 } },
  { id: 'kpi-3', type: 'kpi', position: { x: 2, y: 0 }, size: { w: 1, h: 1 } },
  { id: 'kpi-4', type: 'kpi', position: { x: 3, y: 0 }, size: { w: 1, h: 1 } },
  { id: 'chart-1', type: 'chart', position: { x: 0, y: 1 }, size: { w: 2, h: 2 } },
  { id: 'insight-1', type: 'insight', position: { x: 2, y: 1 }, size: { w: 2, h: 1 } },
  { id: 'activity-1', type: 'activity', position: { x: 2, y: 2 }, size: { w: 2, h: 1 } },
];

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },

      // User
      currentUser: null,
      setCurrentUser: (user) => set({
        currentUser: user,
        currentPersona: 'strategy-leader',
      }),
      logout: () => set({
        currentUser: null,
        currentPersona: 'strategy-leader',
        currentScenario: null,
        aiQueriesUsed: 0,
        dataUploadsUsed: 0,
      }),

      // Persona
      currentPersona: 'strategy-leader',
      setPersona: (persona) => set({ currentPersona: persona }),

      // Scenario
      currentScenario: null,
      setScenario: (scenario) => set({ currentScenario: scenario }),

      // Active Tool
      activeToolId: null,
      setActiveToolId: (toolId) => set({ activeToolId: toolId }),

      // Admin controls
      riskMultiplier: 1.0,
      setRiskMultiplier: (value) => set({ riskMultiplier: value }),

      noiseLevel: 0,
      setNoiseLevel: (value) => set({ noiseLevel: value }),

      // Help
      isHelpOpen: false,
      setHelpOpen: (open) => set({ isHelpOpen: open }),

      // User Switcher
      isUserSwitcherOpen: false,
      setUserSwitcherOpen: (open) => set({ isUserSwitcherOpen: open }),

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
      resetOnboarding: () => set({ onboardingCompleted: [], showOnboarding: true }),
      showOnboarding: true,
      setShowOnboarding: (show) => set({ showOnboarding: show }),

      // Command Palette
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif-${Date.now()}`,
              timestamp: new Date(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50), // Keep max 50 notifications
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      isNotificationCenterOpen: false,
      setNotificationCenterOpen: (open) => set({ isNotificationCenterOpen: open }),

      // Analysis history
      analysisHistory: [],
      addAnalysisRecord: (record) =>
        set((state) => ({
          analysisHistory: [
            {
              ...record,
              id: `analysis-${Date.now()}`,
              timestamp: new Date(),
            },
            ...state.analysisHistory,
          ].slice(0, 100),
        })),
      clearAnalysisHistory: () => set({ analysisHistory: [] }),

      // Dashboard
      dashboardWidgets: defaultWidgets,
      updateWidgetPosition: (id, position) =>
        set((state) => ({
          dashboardWidgets: state.dashboardWidgets.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),
      updateWidgetSize: (id, size) =>
        set((state) => ({
          dashboardWidgets: state.dashboardWidgets.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        })),
      addWidget: (widget) =>
        set((state) => ({
          dashboardWidgets: [
            ...state.dashboardWidgets,
            { ...widget, id: `widget-${Date.now()}` },
          ],
        })),
      removeWidget: (id) =>
        set((state) => ({
          dashboardWidgets: state.dashboardWidgets.filter((w) => w.id !== id),
        })),
      resetDashboard: () => set({ dashboardWidgets: defaultWidgets }),

      // Usage tracking
      aiQueriesUsed: 0,
      incrementAiQueries: () =>
        set((state) => ({ aiQueriesUsed: state.aiQueriesUsed + 1 })),
      dataUploadsUsed: 0,
      incrementDataUploads: () =>
        set((state) => ({ dataUploadsUsed: state.dataUploadsUsed + 1 })),
      resetUsageCounters: () => set({ aiQueriesUsed: 0, dataUploadsUsed: 0 }),

      // Trial
      trialStartDate: null,
      setTrialStartDate: (date) => set({ trialStartDate: date }),

      // Feature flags
      featureFlags: {
        enableVoiceInput: true,
        enableCollaboration: true,
        enableExports: true,
        enableIntegrations: true,
      },
      setFeatureFlag: (flag, value) =>
        set((state) => ({
          featureFlags: { ...state.featureFlags, [flag]: value },
        })),
    }),
    {
      name: 'lumina-s-storage',
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        currentPersona: state.currentPersona,
        riskMultiplier: state.riskMultiplier,
        noiseLevel: state.noiseLevel,
        onboardingCompleted: state.onboardingCompleted,
        showOnboarding: state.showOnboarding,
        isSidebarCollapsed: state.isSidebarCollapsed,
        dashboardWidgets: state.dashboardWidgets,
        aiQueriesUsed: state.aiQueriesUsed,
        dataUploadsUsed: state.dataUploadsUsed,
        trialStartDate: state.trialStartDate,
        analysisHistory: state.analysisHistory,
        featureFlags: state.featureFlags,
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

// Usage limits by plan
export const usageLimits = {
  Free: { aiQueries: 5, dataUploads: 0 },
  Starter: { aiQueries: 50, dataUploads: 10 },
  Pro: { aiQueries: 200, dataUploads: 50 },
  Enterprise: { aiQueries: Infinity, dataUploads: Infinity },
};

// Hook to check if user has exceeded limits
export const useUsageLimits = () => {
  const { currentUser, aiQueriesUsed, dataUploadsUsed } = useAppState();
  const plan = currentUser?.plan || 'Free';
  const limits = usageLimits[plan];

  return {
    aiQueriesRemaining: Math.max(0, limits.aiQueries - aiQueriesUsed),
    dataUploadsRemaining: Math.max(0, limits.dataUploads - dataUploadsUsed),
    canUseAi: aiQueriesUsed < limits.aiQueries,
    canUploadData: dataUploadsUsed < limits.dataUploads,
    aiQueriesLimit: limits.aiQueries,
    dataUploadsLimit: limits.dataUploads,
  };
};

// Trial helper
export const useTrialStatus = () => {
  const { trialStartDate, currentUser } = useAppState();

  if (!trialStartDate || currentUser?.plan === 'Free') {
    return { isOnTrial: false, daysRemaining: 0 };
  }

  const startDate = new Date(trialStartDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 14 - daysPassed);

  return {
    isOnTrial: daysRemaining > 0,
    daysRemaining,
  };
};
