// =============================================================================
// LUMINA F - FINANCIAL STATE MANAGEMENT (Zustand)
// =============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FinancialEntity,
  TimePeriod,
  AccountItem,
  RevenueStream,
  CostObject,
  WorkingCapitalComponent,
  CapitalExpenditure,
  DebtInstrument,
  EquityInstrument,
  TaxObject,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  ValuationSummary,
  LiquidityMetrics,
  StressTestResult,
  FinancialScenario,
  SensitivityResult,
  AuditLogEntry,
  ModelVersion,
  ForecastHorizon,
  DEFAULT_CHART_OF_ACCOUNTS,
  generateId,
  generateTimePeriods,
} from '../lib/financialModel';
import { buildForecast } from '../lib/forecastEngine';
import { calculateValuation } from '../lib/valuationEngine';
import { calculateLiquidity } from '../lib/liquidityEngine';
import { runStressTests } from '../lib/stressTestEngine';
import { runScenarioAnalysis, runSensitivityAnalysis } from '../lib/scenarioEngine';

// ---------------------------------------------------------------------------
// STATE INTERFACE
// ---------------------------------------------------------------------------

interface FinancialState {
  // Core Entity
  entity: FinancialEntity | null;
  periods: TimePeriod[];
  chartOfAccounts: AccountItem[];

  // Input Objects
  revenueStreams: RevenueStream[];
  costObjects: CostObject[];
  workingCapital: WorkingCapitalComponent | null;
  capitalExpenditures: CapitalExpenditure[];
  debtInstruments: DebtInstrument[];
  equityInstruments: EquityInstrument[];
  taxObject: TaxObject | null;

  // Computed Outputs
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];

  // Analysis
  valuation: ValuationSummary | null;
  liquidityMetrics: LiquidityMetrics[];
  stressTests: StressTestResult[];
  scenarios: FinancialScenario[];
  sensitivityResults: SensitivityResult[];

  // Governance
  auditLog: AuditLogEntry[];
  modelVersions: ModelVersion[];

  // Interrogation
  interrogationPhase: number;
  interrogationComplete: boolean;

  // Forecast Settings
  forecastHorizon: ForecastHorizon;
  forecastStartYear: number;

  // -----------------------------------------------------------------------
  // ACTIONS - Entity
  // -----------------------------------------------------------------------
  setEntity: (entity: FinancialEntity) => void;
  updateEntity: (updates: Partial<FinancialEntity>) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Periods
  // -----------------------------------------------------------------------
  regeneratePeriods: () => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Revenue Streams
  // -----------------------------------------------------------------------
  addRevenueStream: (stream: RevenueStream) => void;
  updateRevenueStream: (id: string, updates: Partial<RevenueStream>) => void;
  removeRevenueStream: (id: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Cost Objects
  // -----------------------------------------------------------------------
  addCostObject: (cost: CostObject) => void;
  updateCostObject: (id: string, updates: Partial<CostObject>) => void;
  removeCostObject: (id: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Working Capital
  // -----------------------------------------------------------------------
  setWorkingCapital: (wc: WorkingCapitalComponent) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Capital Expenditures
  // -----------------------------------------------------------------------
  addCapex: (capex: CapitalExpenditure) => void;
  updateCapex: (id: string, updates: Partial<CapitalExpenditure>) => void;
  removeCapex: (id: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Debt
  // -----------------------------------------------------------------------
  addDebt: (debt: DebtInstrument) => void;
  updateDebt: (id: string, updates: Partial<DebtInstrument>) => void;
  removeDebt: (id: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Equity
  // -----------------------------------------------------------------------
  addEquity: (equity: EquityInstrument) => void;
  updateEquity: (id: string, updates: Partial<EquityInstrument>) => void;
  removeEquity: (id: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Tax
  // -----------------------------------------------------------------------
  setTaxObject: (tax: TaxObject) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Interrogation
  // -----------------------------------------------------------------------
  setInterrogationPhase: (phase: number) => void;
  completeInterrogation: () => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Forecast Settings
  // -----------------------------------------------------------------------
  setForecastHorizon: (horizon: ForecastHorizon) => void;
  setForecastStartYear: (year: number) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Compute
  // -----------------------------------------------------------------------
  runForecast: () => void;
  runValuation: (waccOverride?: number, terminalMethod?: 'perpetuity_growth' | 'exit_multiple') => void;
  runLiquidityAnalysis: () => void;
  runStressTest: () => void;
  runScenarios: () => void;
  runSensitivity: (drivers: string[]) => void;
  runAllAnalyses: () => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Governance
  // -----------------------------------------------------------------------
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'version'>) => void;
  saveModelVersion: (changeReason: string) => void;
  restoreModelVersion: (versionId: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Scenarios
  // -----------------------------------------------------------------------
  addScenario: (scenario: FinancialScenario) => void;
  removeScenario: (id: string) => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Reset
  // -----------------------------------------------------------------------
  resetModel: () => void;

  // -----------------------------------------------------------------------
  // ACTIONS - Import from upload
  // -----------------------------------------------------------------------
  importNormalizedData: (data: any) => void;
}

// ---------------------------------------------------------------------------
// DEFAULT STATE
// ---------------------------------------------------------------------------

const defaultState = {
  entity: null,
  periods: [],
  chartOfAccounts: DEFAULT_CHART_OF_ACCOUNTS,
  revenueStreams: [],
  costObjects: [],
  workingCapital: null,
  capitalExpenditures: [],
  debtInstruments: [],
  equityInstruments: [],
  taxObject: null,
  incomeStatements: [],
  balanceSheets: [],
  cashFlowStatements: [],
  valuation: null,
  liquidityMetrics: [],
  stressTests: [],
  scenarios: [],
  sensitivityResults: [],
  auditLog: [],
  modelVersions: [],
  interrogationPhase: 0,
  interrogationComplete: false,
  forecastHorizon: 5 as ForecastHorizon,
  forecastStartYear: new Date().getFullYear(),
};

// ---------------------------------------------------------------------------
// STORE
// ---------------------------------------------------------------------------

export const useFinancialState = create<FinancialState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // Entity
      setEntity: (entity) => {
        set({ entity });
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'create',
          category: 'settings',
          description: `Created financial entity: ${entity.name}`,
        });
      },

      updateEntity: (updates) => {
        const current = get().entity;
        if (!current) return;
        const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
        set({ entity: updated });
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'update',
          category: 'settings',
          description: `Updated entity: ${Object.keys(updates).join(', ')}`,
        });
      },

      // Periods
      regeneratePeriods: () => {
        const { entity, forecastHorizon, forecastStartYear } = get();
        if (!entity) return;
        const startYear = forecastStartYear - 2; // 2 years historical
        const endYear = forecastStartYear + forecastHorizon - 1;
        const periods = generateTimePeriods(startYear, endYear, entity.reportingPeriod, forecastStartYear);
        set({ periods });
      },

      // Revenue Streams
      addRevenueStream: (stream) => {
        set((state) => ({ revenueStreams: [...state.revenueStreams, stream] }));
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'create',
          category: 'data',
          description: `Added revenue stream: ${stream.name}`,
        });
      },

      updateRevenueStream: (id, updates) => {
        set((state) => ({
          revenueStreams: state.revenueStreams.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'update',
          category: 'data',
          description: `Updated revenue stream: ${id}`,
        });
      },

      removeRevenueStream: (id) => {
        const stream = get().revenueStreams.find((s) => s.id === id);
        set((state) => ({
          revenueStreams: state.revenueStreams.filter((s) => s.id !== id),
        }));
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'delete',
          category: 'data',
          description: `Removed revenue stream: ${stream?.name || id}`,
        });
      },

      // Cost Objects
      addCostObject: (cost) => {
        set((state) => ({ costObjects: [...state.costObjects, cost] }));
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'create',
          category: 'data',
          description: `Added cost object: ${cost.name}`,
        });
      },

      updateCostObject: (id, updates) => {
        set((state) => ({
          costObjects: state.costObjects.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      removeCostObject: (id) => {
        set((state) => ({
          costObjects: state.costObjects.filter((c) => c.id !== id),
        }));
      },

      // Working Capital
      setWorkingCapital: (wc) => {
        set({ workingCapital: wc });
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'update',
          category: 'data',
          description: 'Updated working capital assumptions',
        });
      },

      // Capex
      addCapex: (capex) => {
        set((state) => ({ capitalExpenditures: [...state.capitalExpenditures, capex] }));
      },

      updateCapex: (id, updates) => {
        set((state) => ({
          capitalExpenditures: state.capitalExpenditures.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      removeCapex: (id) => {
        set((state) => ({
          capitalExpenditures: state.capitalExpenditures.filter((c) => c.id !== id),
        }));
      },

      // Debt
      addDebt: (debt) => {
        set((state) => ({ debtInstruments: [...state.debtInstruments, debt] }));
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'create',
          category: 'data',
          description: `Added debt instrument: ${debt.name}`,
        });
      },

      updateDebt: (id, updates) => {
        set((state) => ({
          debtInstruments: state.debtInstruments.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        }));
      },

      removeDebt: (id) => {
        set((state) => ({
          debtInstruments: state.debtInstruments.filter((d) => d.id !== id),
        }));
      },

      // Equity
      addEquity: (equity) => {
        set((state) => ({ equityInstruments: [...state.equityInstruments, equity] }));
      },

      updateEquity: (id, updates) => {
        set((state) => ({
          equityInstruments: state.equityInstruments.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      removeEquity: (id) => {
        set((state) => ({
          equityInstruments: state.equityInstruments.filter((e) => e.id !== id),
        }));
      },

      // Tax
      setTaxObject: (tax) => {
        set({ taxObject: tax });
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'update',
          category: 'data',
          description: 'Updated tax assumptions',
        });
      },

      // Interrogation
      setInterrogationPhase: (phase) => set({ interrogationPhase: phase }),
      completeInterrogation: () => set({ interrogationComplete: true, interrogationPhase: 10 }),

      // Forecast Settings
      setForecastHorizon: (horizon) => {
        set({ forecastHorizon: horizon });
        get().regeneratePeriods();
      },

      setForecastStartYear: (year) => {
        set({ forecastStartYear: year });
        get().regeneratePeriods();
      },

      // Compute - Forecast
      runForecast: () => {
        const state = get();
        if (!state.entity || state.revenueStreams.length === 0) return;

        const result = buildForecast({
          entity: state.entity,
          periods: state.periods,
          revenueStreams: state.revenueStreams,
          costObjects: state.costObjects,
          workingCapital: state.workingCapital,
          capitalExpenditures: state.capitalExpenditures,
          debtInstruments: state.debtInstruments,
          equityInstruments: state.equityInstruments,
          taxObject: state.taxObject,
          forecastHorizon: state.forecastHorizon,
          forecastStartYear: state.forecastStartYear,
        });

        set({
          incomeStatements: result.incomeStatements,
          balanceSheets: result.balanceSheets,
          cashFlowStatements: result.cashFlowStatements,
        });

        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'update',
          category: 'model',
          description: `Generated ${state.forecastHorizon}-year forecast`,
        });
      },

      // Compute - Valuation
      runValuation: (waccOverride, terminalMethod) => {
        const state = get();
        if (state.cashFlowStatements.length === 0) return;

        const valuation = calculateValuation({
          cashFlows: state.cashFlowStatements,
          incomeStatements: state.incomeStatements,
          balanceSheets: state.balanceSheets,
          debtInstruments: state.debtInstruments,
          equityInstruments: state.equityInstruments,
          taxObject: state.taxObject,
          waccOverride,
          terminalMethod,
        });

        set({ valuation });
      },

      // Compute - Liquidity
      runLiquidityAnalysis: () => {
        const state = get();
        if (state.cashFlowStatements.length === 0) return;

        const metrics = calculateLiquidity({
          balanceSheets: state.balanceSheets,
          cashFlows: state.cashFlowStatements,
          incomeStatements: state.incomeStatements,
          debtInstruments: state.debtInstruments,
        });

        set({ liquidityMetrics: metrics });
      },

      // Compute - Stress Test
      runStressTest: () => {
        const state = get();
        if (!state.entity || state.incomeStatements.length === 0) return;

        const results = runStressTests({
          entity: state.entity,
          periods: state.periods,
          revenueStreams: state.revenueStreams,
          costObjects: state.costObjects,
          workingCapital: state.workingCapital,
          capitalExpenditures: state.capitalExpenditures,
          debtInstruments: state.debtInstruments,
          equityInstruments: state.equityInstruments,
          taxObject: state.taxObject,
          forecastHorizon: state.forecastHorizon,
          forecastStartYear: state.forecastStartYear,
          baseIncomeStatements: state.incomeStatements,
          baseCashFlows: state.cashFlowStatements,
          baseBalanceSheets: state.balanceSheets,
        });

        set({ stressTests: results });
      },

      // Compute - Scenarios
      runScenarios: () => {
        const state = get();
        if (!state.entity || state.revenueStreams.length === 0) return;

        const scenarios = runScenarioAnalysis({
          entity: state.entity,
          periods: state.periods,
          revenueStreams: state.revenueStreams,
          costObjects: state.costObjects,
          workingCapital: state.workingCapital,
          capitalExpenditures: state.capitalExpenditures,
          debtInstruments: state.debtInstruments,
          equityInstruments: state.equityInstruments,
          taxObject: state.taxObject,
          forecastHorizon: state.forecastHorizon,
          forecastStartYear: state.forecastStartYear,
        });

        set({ scenarios });
      },

      // Compute - Sensitivity
      runSensitivity: (drivers) => {
        const state = get();
        if (!state.entity || state.revenueStreams.length === 0) return;

        const results = runSensitivityAnalysis({
          entity: state.entity,
          periods: state.periods,
          revenueStreams: state.revenueStreams,
          costObjects: state.costObjects,
          workingCapital: state.workingCapital,
          capitalExpenditures: state.capitalExpenditures,
          debtInstruments: state.debtInstruments,
          equityInstruments: state.equityInstruments,
          taxObject: state.taxObject,
          forecastHorizon: state.forecastHorizon,
          forecastStartYear: state.forecastStartYear,
          drivers,
        });

        set({ sensitivityResults: results });
      },

      // Run all analyses
      runAllAnalyses: () => {
        const state = get();
        state.runForecast();
        // After forecast, run the rest
        setTimeout(() => {
          state.runValuation();
          state.runLiquidityAnalysis();
          state.runStressTest();
          state.runScenarios();
          state.runSensitivity(['revenue_growth', 'cost_growth', 'wacc', 'working_capital_days']);
        }, 0);
      },

      // Governance
      addAuditEntry: (entry) => {
        const newEntry: AuditLogEntry = {
          ...entry,
          id: generateId(),
          timestamp: new Date().toISOString(),
          version: get().modelVersions.length + 1,
        };
        set((state) => ({
          auditLog: [newEntry, ...state.auditLog].slice(0, 500),
        }));
      },

      saveModelVersion: (changeReason) => {
        const state = get();
        const version: ModelVersion = {
          id: generateId(),
          version: state.modelVersions.length + 1,
          timestamp: new Date().toISOString(),
          userId: 'current-user',
          userName: 'Current User',
          changeReason,
          snapshot: JSON.stringify({
            entity: state.entity,
            revenueStreams: state.revenueStreams,
            costObjects: state.costObjects,
            workingCapital: state.workingCapital,
            capitalExpenditures: state.capitalExpenditures,
            debtInstruments: state.debtInstruments,
            equityInstruments: state.equityInstruments,
            taxObject: state.taxObject,
            forecastHorizon: state.forecastHorizon,
            forecastStartYear: state.forecastStartYear,
          }),
          isApproved: false,
        };
        set((state) => ({
          modelVersions: [version, ...state.modelVersions],
        }));
      },

      restoreModelVersion: (versionId) => {
        const version = get().modelVersions.find((v) => v.id === versionId);
        if (!version) return;
        const snapshot = JSON.parse(version.snapshot);
        set({
          entity: snapshot.entity,
          revenueStreams: snapshot.revenueStreams,
          costObjects: snapshot.costObjects,
          workingCapital: snapshot.workingCapital,
          capitalExpenditures: snapshot.capitalExpenditures,
          debtInstruments: snapshot.debtInstruments,
          equityInstruments: snapshot.equityInstruments,
          taxObject: snapshot.taxObject,
          forecastHorizon: snapshot.forecastHorizon,
          forecastStartYear: snapshot.forecastStartYear,
        });
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'update',
          category: 'model',
          description: `Restored model to version ${version.version}`,
        });
      },

      // Scenarios
      addScenario: (scenario) => {
        set((state) => ({ scenarios: [...state.scenarios, scenario] }));
      },

      removeScenario: (id) => {
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== id),
        }));
      },

      // Reset
      resetModel: () => {
        set({ ...defaultState });
      },

      // Import
      importNormalizedData: (data) => {
        const updates: Partial<FinancialState> = {};
        if (data.entity) updates.entity = data.entity as FinancialEntity;
        if (data.periods) updates.periods = data.periods;
        if (data.revenueStreams) updates.revenueStreams = data.revenueStreams;
        if (data.costs) updates.costObjects = data.costs;
        if (data.workingCapital) updates.workingCapital = data.workingCapital;
        if (data.debts) updates.debtInstruments = data.debts;
        if (data.equity) updates.equityInstruments = data.equity;
        set(updates as any);
        get().addAuditEntry({
          userId: 'current-user',
          userName: 'Current User',
          action: 'create',
          category: 'data',
          description: 'Imported financial data from upload',
        });
      },
    }),
    {
      name: 'lumina-f-financial-state',
      partialize: (state) => ({
        entity: state.entity,
        periods: state.periods,
        chartOfAccounts: state.chartOfAccounts,
        revenueStreams: state.revenueStreams,
        costObjects: state.costObjects,
        workingCapital: state.workingCapital,
        capitalExpenditures: state.capitalExpenditures,
        debtInstruments: state.debtInstruments,
        equityInstruments: state.equityInstruments,
        taxObject: state.taxObject,
        incomeStatements: state.incomeStatements,
        balanceSheets: state.balanceSheets,
        cashFlowStatements: state.cashFlowStatements,
        valuation: state.valuation,
        liquidityMetrics: state.liquidityMetrics,
        stressTests: state.stressTests,
        scenarios: state.scenarios,
        sensitivityResults: state.sensitivityResults,
        auditLog: state.auditLog,
        modelVersions: state.modelVersions,
        interrogationPhase: state.interrogationPhase,
        interrogationComplete: state.interrogationComplete,
        forecastHorizon: state.forecastHorizon,
        forecastStartYear: state.forecastStartYear,
      }),
    }
  )
);
