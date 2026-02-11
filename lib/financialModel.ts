// =============================================================================
// LUMINA F - CANONICAL FINANCIAL OBJECT MODEL
// =============================================================================
// Every financial number must reference one of these normalized objects
// before calculations proceed.
// =============================================================================

// ---------------------------------------------------------------------------
// CORE ENUMS & TYPES
// ---------------------------------------------------------------------------

export type AccountingBasis = 'cash' | 'accrual';
export type ReportingPeriod = 'monthly' | 'quarterly' | 'yearly';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'CNY' | 'INR' | 'BRL' | 'ZAR' | 'AED' | 'SGD' | 'HKD' | 'KRW' | 'SEK' | 'NOK' | 'DKK' | 'NZD' | 'MXN';
export type BusinessModelType = 'product' | 'service' | 'platform' | 'recurring_revenue' | 'transactional' | 'hybrid';
export type RevenueType = 'one_time_sale' | 'subscription' | 'usage_based' | 'license' | 'commission' | 'advertising' | 'other';
export type CostBehavior = 'fixed' | 'variable' | 'mixed' | 'one_off' | 'allocated';
export type DepreciationMethod = 'straight_line' | 'declining_balance' | 'units_of_production' | 'sum_of_years';
export type DebtType = 'term_loan' | 'revolving_credit' | 'bond' | 'convertible' | 'lease' | 'other';
export type EquityType = 'common' | 'preferred' | 'retained_earnings' | 'treasury' | 'additional_paid_in';
export type ForecastHorizon = 1 | 3 | 5 | 10;
export type ValuationMethod = 'dcf' | 'comparable_multiples' | 'precedent_transactions' | 'real_options';
export type TerminalValueMethod = 'perpetuity_growth' | 'exit_multiple';
export type ScenarioType = 'base' | 'optimistic' | 'pessimistic' | 'black_swan';
export type StressType = 'revenue_decline' | 'margin_compression' | 'cost_inflation' | 'capital_shock';

// Chart of Accounts categories
export type AccountCategory =
  | 'revenue'
  | 'cost_of_goods_sold'
  | 'operating_expense'
  | 'other_income'
  | 'other_expense'
  | 'interest_expense'
  | 'interest_income'
  | 'tax_expense'
  | 'current_asset'
  | 'non_current_asset'
  | 'current_liability'
  | 'non_current_liability'
  | 'equity';

// ---------------------------------------------------------------------------
// FINANCIAL ENTITY - The root business being modeled
// ---------------------------------------------------------------------------

export interface FinancialEntity {
  id: string;
  name: string;
  businessModelType: BusinessModelType;
  currency: Currency;
  reportingPeriod: ReportingPeriod;
  fiscalYearEnd: number; // Month (1-12)
  accountingBasis: AccountingBasis;
  industry?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// TIME PERIOD - Calendar structure for all financial data
// ---------------------------------------------------------------------------

export interface TimePeriod {
  id: string;
  label: string; // e.g., "FY2024 Q1", "Jan 2024"
  startDate: string;
  endDate: string;
  type: 'historical' | 'forecast';
  year: number;
  quarter?: number;
  month?: number;
}

// ---------------------------------------------------------------------------
// CHART OF ACCOUNTS
// ---------------------------------------------------------------------------

export interface AccountItem {
  id: string;
  code: string; // e.g., "4000" for revenue
  name: string;
  category: AccountCategory;
  parentId?: string;
  isGroup: boolean;
  description?: string;
}

// ---------------------------------------------------------------------------
// REVENUE STREAM OBJECT
// ---------------------------------------------------------------------------

export interface SeasonalityVector {
  jan: number; feb: number; mar: number; apr: number;
  may: number; jun: number; jul: number; aug: number;
  sep: number; oct: number; nov: number; dec: number;
}

export interface RevenueStream {
  id: string;
  name: string;
  revenueType: RevenueType;
  pricingModel: string;
  volumeDriver: string; // e.g., "units", "users", "transactions"
  basePrice: number;
  baseVolume: number;
  contractLength?: number; // months
  churnRate?: number; // percentage per period
  growthRate: number; // percentage
  seasonality: SeasonalityVector;
  historicalData: RevenueHistoricalPoint[];
  isRecurring: boolean;
}

export interface RevenueHistoricalPoint {
  periodId: string;
  revenue: number;
  volume: number;
  price: number;
}

// ---------------------------------------------------------------------------
// COST OBJECT
// ---------------------------------------------------------------------------

export interface CostObject {
  id: string;
  name: string;
  category: 'cogs' | 'opex' | 'capex_related' | 'other';
  behavior: CostBehavior;
  costDriver: string; // what drives this cost
  fixedAmount?: number; // for fixed costs
  variableRate?: number; // per unit for variable costs
  forecastRule: string; // description of how to forecast
  timingLag?: number; // months delay
  growthRate: number; // annual growth rate
  historicalData: CostHistoricalPoint[];
}

export interface CostHistoricalPoint {
  periodId: string;
  amount: number;
  units?: number;
}

// ---------------------------------------------------------------------------
// BALANCE SHEET ITEMS
// ---------------------------------------------------------------------------

export interface BalanceSheetItem {
  id: string;
  name: string;
  category: AccountCategory;
  subcategory: string;
  historicalValues: BalanceSheetHistoricalPoint[];
}

export interface BalanceSheetHistoricalPoint {
  periodId: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// WORKING CAPITAL COMPONENT
// ---------------------------------------------------------------------------

export interface WorkingCapitalComponent {
  accountsReceivableDays: number;
  accountsPayableDays: number;
  inventoryDays: number;
  prepaidExpenses: number;
  otherCurrentAssets: number;
  otherCurrentLiabilities: number;
  historicalData: WorkingCapitalHistorical[];
}

export interface WorkingCapitalHistorical {
  periodId: string;
  ar: number;
  ap: number;
  inventory: number;
  prepaid: number;
  otherCA: number;
  otherCL: number;
}

// ---------------------------------------------------------------------------
// CAPITAL EXPENDITURE OBJECT
// ---------------------------------------------------------------------------

export interface CapitalExpenditure {
  id: string;
  name: string;
  amount: number;
  usefulLife: number; // years
  depreciationMethod: DepreciationMethod;
  salvageValue: number;
  acquisitionDate: string;
  category: string;
}

// ---------------------------------------------------------------------------
// DEBT & INTEREST OBJECT
// ---------------------------------------------------------------------------

export interface DebtInstrument {
  id: string;
  name: string;
  type: DebtType;
  principal: number;
  outstandingBalance: number;
  interestRate: number; // annual percentage
  maturityDate: string;
  amortizationSchedule: AmortizationEntry[];
  isFixed: boolean; // fixed vs floating rate
  covenants?: DebtCovenant[];
}

export interface AmortizationEntry {
  periodId: string;
  principalPayment: number;
  interestPayment: number;
  balance: number;
}

export interface DebtCovenant {
  name: string;
  type: 'debt_to_equity' | 'interest_coverage' | 'current_ratio' | 'debt_service_coverage' | 'custom';
  threshold: number;
  operator: 'gt' | 'lt' | 'gte' | 'lte';
  description: string;
}

// ---------------------------------------------------------------------------
// EQUITY OBJECT
// ---------------------------------------------------------------------------

export interface EquityInstrument {
  id: string;
  name: string;
  type: EquityType;
  amount: number;
  sharesOutstanding?: number;
  parValue?: number;
  dividendRate?: number;
}

// ---------------------------------------------------------------------------
// TAX & REGULATION OBJECT
// ---------------------------------------------------------------------------

export interface TaxObject {
  jurisdiction: string;
  corporateTaxRate: number;
  effectiveTaxRate: number;
  deferredTaxAssets: number;
  deferredTaxLiabilities: number;
  taxCredits: number;
  incentives: TaxIncentive[];
  regulatoryConstraints: RegulatoryConstraint[];
}

export interface TaxIncentive {
  name: string;
  type: 'credit' | 'deduction' | 'exemption' | 'rate_reduction';
  amount: number;
  expiryDate?: string;
  description: string;
}

export interface RegulatoryConstraint {
  name: string;
  type: 'capital_adequacy' | 'solvency' | 'liquidity' | 'leverage' | 'custom';
  threshold: number;
  description: string;
}

// ---------------------------------------------------------------------------
// FINANCIAL STATEMENTS (OUTPUT OBJECTS)
// ---------------------------------------------------------------------------

export interface IncomeStatement {
  periodId: string;
  periodLabel: string;
  type: 'historical' | 'forecast';

  // Revenue
  totalRevenue: number;
  revenueBreakdown: { streamId: string; name: string; amount: number }[];

  // Cost of Goods Sold
  totalCOGS: number;
  cogsBreakdown: { costId: string; name: string; amount: number }[];

  // Gross Profit
  grossProfit: number;
  grossMargin: number;

  // Operating Expenses
  totalOpex: number;
  opexBreakdown: { costId: string; name: string; amount: number }[];

  // Operating Income
  ebitda: number;
  depreciation: number;
  amortization: number;
  ebit: number;

  // Other Income/Expense
  interestExpense: number;
  interestIncome: number;
  otherIncome: number;
  otherExpense: number;

  // Pre-tax & Tax
  ebt: number;
  taxExpense: number;

  // Net Income
  netIncome: number;
  netMargin: number;
}

export interface BalanceSheet {
  periodId: string;
  periodLabel: string;
  type: 'historical' | 'forecast';

  // Current Assets
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;

  // Non-Current Assets
  propertyPlantEquipment: number;
  accumulatedDepreciation: number;
  netPPE: number;
  intangibleAssets: number;
  goodwill: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;

  totalAssets: number;

  // Current Liabilities
  accountsPayable: number;
  shortTermDebt: number;
  currentPortionLTD: number;
  accruedExpenses: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;

  // Non-Current Liabilities
  longTermDebt: number;
  deferredTaxLiabilities: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;

  totalLiabilities: number;

  // Equity
  commonStock: number;
  additionalPaidInCapital: number;
  retainedEarnings: number;
  treasuryStock: number;
  otherEquity: number;
  totalEquity: number;

  totalLiabilitiesAndEquity: number;

  // Validation
  isBalanced: boolean;
}

export interface CashFlowStatement {
  periodId: string;
  periodLabel: string;
  type: 'historical' | 'forecast';

  // Operating Activities
  netIncome: number;
  depreciation: number;
  amortization: number;
  changeInAR: number;
  changeInInventory: number;
  changeInAP: number;
  changeInPrepaid: number;
  changeInAccruedExpenses: number;
  otherOperatingAdjustments: number;
  cashFromOperations: number;

  // Investing Activities
  capitalExpenditures: number;
  acquisitions: number;
  investmentPurchases: number;
  investmentSales: number;
  otherInvesting: number;
  cashFromInvesting: number;

  // Financing Activities
  debtProceeds: number;
  debtRepayments: number;
  equityIssuance: number;
  dividendsPaid: number;
  shareRepurchases: number;
  otherFinancing: number;
  cashFromFinancing: number;

  // Summary
  netChangeInCash: number;
  beginningCash: number;
  endingCash: number;

  // Free Cash Flow
  freeCashFlowToFirm: number;
  freeCashFlowToEquity: number;
}

// ---------------------------------------------------------------------------
// VALUATION OUTPUTS
// ---------------------------------------------------------------------------

export interface DCFValuation {
  wacc: number;
  projectedFCFs: { period: string; fcf: number; discountFactor: number; presentValue: number }[];
  terminalValue: number;
  terminalValueMethod: TerminalValueMethod;
  terminalGrowthRate?: number;
  exitMultiple?: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  sharesOutstanding?: number;
  impliedSharePrice?: number;
}

export interface ComparableMultiples {
  evToSales: { multiple: number; impliedEV: number };
  evToEBITDA: { multiple: number; impliedEV: number };
  priceToEarnings: { multiple: number; impliedEquity: number };
  selectedComps: { name: string; evSales: number; evEbitda: number; pe: number }[];
}

export interface RealOptionsValuation {
  optionType: 'expand' | 'delay' | 'abandon';
  underlyingValue: number;
  strikePrice: number;
  volatility: number;
  timeToExpiry: number;
  riskFreeRate: number;
  optionValue: number;
}

export interface ValuationSummary {
  dcf?: DCFValuation;
  comparables?: ComparableMultiples;
  precedentTransactions?: { name: string; evSales: number; evEbitda: number; premium: number }[];
  realOptions?: RealOptionsValuation[];
  compositeValue: number;
  valueRange: { low: number; mid: number; high: number };
  valueDrivers: { driver: string; impact: number }[];
}

// ---------------------------------------------------------------------------
// LIQUIDITY OUTPUTS
// ---------------------------------------------------------------------------

export interface LiquidityMetrics {
  periodId: string;
  cashRunway: number; // months
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  daysCashOnHand: number;
  burnRate: number; // monthly
  workingCapitalCycle: number; // days
  operatingCashFlow: number;
  isNegativeOCF: boolean;
  debtCovenantBreaches: string[];
}

// ---------------------------------------------------------------------------
// STRESS TEST OUTPUTS
// ---------------------------------------------------------------------------

export interface StressTestResult {
  scenarioName: string;
  stressType: StressType;
  severity: number; // percentage shock
  survivalProbability: number;
  valueAtRisk: number;
  conditionalVaR: number;
  impactOnRevenue: number;
  impactOnEBITDA: number;
  impactOnCashFlow: number;
  impactOnValuation: number;
  covenantBreaches: string[];
  liquidityStatus: 'healthy' | 'warning' | 'critical';
  periods: StressTestPeriodResult[];
}

export interface StressTestPeriodResult {
  periodId: string;
  revenue: number;
  ebitda: number;
  netIncome: number;
  cash: number;
  debtToEquity: number;
  interestCoverage: number;
}

// ---------------------------------------------------------------------------
// SCENARIO ENGINE OUTPUTS
// ---------------------------------------------------------------------------

export interface FinancialScenario {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  assumptions: ScenarioAssumption[];
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlowStatement[];
  valuation?: ValuationSummary;
  liquidity: LiquidityMetrics[];
}

export interface ScenarioAssumption {
  parameter: string;
  baseValue: number;
  adjustedValue: number;
  unit: string;
  description: string;
}

export interface ScenarioComparison {
  parameter: string;
  base: number;
  optimistic: number;
  pessimistic: number;
  blackSwan?: number;
  unit: string;
}

export interface SensitivityResult {
  driverName: string;
  driverRange: number[]; // e.g., [-20%, -10%, 0%, 10%, 20%]
  outputValues: number[]; // corresponding output values
  baseOutput: number;
  elasticity: number; // % change in output / % change in input
}

// ---------------------------------------------------------------------------
// GOVERNANCE & AUDIT
// ---------------------------------------------------------------------------

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'override' | 'approve' | 'export';
  category: 'assumption' | 'data' | 'model' | 'scenario' | 'report' | 'currency' | 'settings';
  description: string;
  previousValue?: string;
  newValue?: string;
  entityId?: string;
  entityType?: string;
  version: number;
}

export interface ModelVersion {
  id: string;
  version: number;
  timestamp: string;
  userId: string;
  userName: string;
  changeReason: string;
  snapshot: string; // JSON serialized state
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

// ---------------------------------------------------------------------------
// UPLOAD PATHWAY
// ---------------------------------------------------------------------------

export interface UploadResult {
  status: 'success' | 'partial' | 'failed';
  fileType: 'excel' | 'csv' | 'pdf' | 'word';
  detectedStatements: ('income' | 'balance_sheet' | 'cash_flow')[];
  mappedAccounts: { detected: string; mappedTo: string; confidence: number }[];
  missingFields: MissingField[];
  warnings: string[];
  normalizedData: NormalizedUploadData;
}

export interface MissingField {
  field: string;
  statement: string;
  period: string;
  suggestion: string;
}

export interface NormalizedUploadData {
  entity?: Partial<FinancialEntity>;
  periods: TimePeriod[];
  revenueStreams: Partial<RevenueStream>[];
  costs: Partial<CostObject>[];
  balanceSheetItems: BalanceSheetItem[];
  workingCapital?: Partial<WorkingCapitalComponent>;
  debts: Partial<DebtInstrument>[];
  equity: Partial<EquityInstrument>[];
}

// ---------------------------------------------------------------------------
// COMPLETE FINANCIAL MODEL STATE
// ---------------------------------------------------------------------------

export interface FinancialModelState {
  // Core Entity
  entity: FinancialEntity | null;
  periods: TimePeriod[];

  // Chart of Accounts
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

  // Analysis Outputs
  valuation: ValuationSummary | null;
  liquidityMetrics: LiquidityMetrics[];
  stressTests: StressTestResult[];
  scenarios: FinancialScenario[];
  sensitivityResults: SensitivityResult[];

  // Governance
  auditLog: AuditLogEntry[];
  modelVersions: ModelVersion[];

  // Interrogation State
  interrogationPhase: number; // 0-10
  interrogationComplete: boolean;

  // Forecast Settings
  forecastHorizon: ForecastHorizon;
  forecastStartYear: number;
}

// ---------------------------------------------------------------------------
// DEFAULT SEASONALITY (even distribution)
// ---------------------------------------------------------------------------

export const DEFAULT_SEASONALITY: SeasonalityVector = {
  jan: 1, feb: 1, mar: 1, apr: 1,
  may: 1, jun: 1, jul: 1, aug: 1,
  sep: 1, oct: 1, nov: 1, dec: 1,
};

// ---------------------------------------------------------------------------
// DEFAULT CHART OF ACCOUNTS
// ---------------------------------------------------------------------------

export const DEFAULT_CHART_OF_ACCOUNTS: AccountItem[] = [
  // Revenue
  { id: 'rev-4000', code: '4000', name: 'Revenue', category: 'revenue', isGroup: true },
  { id: 'rev-4100', code: '4100', name: 'Product Revenue', category: 'revenue', parentId: 'rev-4000', isGroup: false },
  { id: 'rev-4200', code: '4200', name: 'Service Revenue', category: 'revenue', parentId: 'rev-4000', isGroup: false },
  { id: 'rev-4300', code: '4300', name: 'Subscription Revenue', category: 'revenue', parentId: 'rev-4000', isGroup: false },
  { id: 'rev-4400', code: '4400', name: 'Other Revenue', category: 'revenue', parentId: 'rev-4000', isGroup: false },

  // COGS
  { id: 'cogs-5000', code: '5000', name: 'Cost of Goods Sold', category: 'cost_of_goods_sold', isGroup: true },
  { id: 'cogs-5100', code: '5100', name: 'Direct Materials', category: 'cost_of_goods_sold', parentId: 'cogs-5000', isGroup: false },
  { id: 'cogs-5200', code: '5200', name: 'Direct Labor', category: 'cost_of_goods_sold', parentId: 'cogs-5000', isGroup: false },
  { id: 'cogs-5300', code: '5300', name: 'Manufacturing Overhead', category: 'cost_of_goods_sold', parentId: 'cogs-5000', isGroup: false },

  // Operating Expenses
  { id: 'opex-6000', code: '6000', name: 'Operating Expenses', category: 'operating_expense', isGroup: true },
  { id: 'opex-6100', code: '6100', name: 'Salaries & Wages', category: 'operating_expense', parentId: 'opex-6000', isGroup: false },
  { id: 'opex-6200', code: '6200', name: 'Rent & Facilities', category: 'operating_expense', parentId: 'opex-6000', isGroup: false },
  { id: 'opex-6300', code: '6300', name: 'Marketing & Sales', category: 'operating_expense', parentId: 'opex-6000', isGroup: false },
  { id: 'opex-6400', code: '6400', name: 'Research & Development', category: 'operating_expense', parentId: 'opex-6000', isGroup: false },
  { id: 'opex-6500', code: '6500', name: 'General & Administrative', category: 'operating_expense', parentId: 'opex-6000', isGroup: false },
  { id: 'opex-6600', code: '6600', name: 'Depreciation & Amortization', category: 'operating_expense', parentId: 'opex-6000', isGroup: false },

  // Assets
  { id: 'ca-1000', code: '1000', name: 'Current Assets', category: 'current_asset', isGroup: true },
  { id: 'ca-1100', code: '1100', name: 'Cash & Equivalents', category: 'current_asset', parentId: 'ca-1000', isGroup: false },
  { id: 'ca-1200', code: '1200', name: 'Accounts Receivable', category: 'current_asset', parentId: 'ca-1000', isGroup: false },
  { id: 'ca-1300', code: '1300', name: 'Inventory', category: 'current_asset', parentId: 'ca-1000', isGroup: false },
  { id: 'ca-1400', code: '1400', name: 'Prepaid Expenses', category: 'current_asset', parentId: 'ca-1000', isGroup: false },

  { id: 'nca-1500', code: '1500', name: 'Non-Current Assets', category: 'non_current_asset', isGroup: true },
  { id: 'nca-1600', code: '1600', name: 'Property, Plant & Equipment', category: 'non_current_asset', parentId: 'nca-1500', isGroup: false },
  { id: 'nca-1700', code: '1700', name: 'Intangible Assets', category: 'non_current_asset', parentId: 'nca-1500', isGroup: false },
  { id: 'nca-1800', code: '1800', name: 'Goodwill', category: 'non_current_asset', parentId: 'nca-1500', isGroup: false },

  // Liabilities
  { id: 'cl-2000', code: '2000', name: 'Current Liabilities', category: 'current_liability', isGroup: true },
  { id: 'cl-2100', code: '2100', name: 'Accounts Payable', category: 'current_liability', parentId: 'cl-2000', isGroup: false },
  { id: 'cl-2200', code: '2200', name: 'Short-Term Debt', category: 'current_liability', parentId: 'cl-2000', isGroup: false },
  { id: 'cl-2300', code: '2300', name: 'Accrued Expenses', category: 'current_liability', parentId: 'cl-2000', isGroup: false },

  { id: 'ncl-2500', code: '2500', name: 'Non-Current Liabilities', category: 'non_current_liability', isGroup: true },
  { id: 'ncl-2600', code: '2600', name: 'Long-Term Debt', category: 'non_current_liability', parentId: 'ncl-2500', isGroup: false },
  { id: 'ncl-2700', code: '2700', name: 'Deferred Tax Liabilities', category: 'non_current_liability', parentId: 'ncl-2500', isGroup: false },

  // Equity
  { id: 'eq-3000', code: '3000', name: 'Equity', category: 'equity', isGroup: true },
  { id: 'eq-3100', code: '3100', name: 'Common Stock', category: 'equity', parentId: 'eq-3000', isGroup: false },
  { id: 'eq-3200', code: '3200', name: 'Additional Paid-In Capital', category: 'equity', parentId: 'eq-3000', isGroup: false },
  { id: 'eq-3300', code: '3300', name: 'Retained Earnings', category: 'equity', parentId: 'eq-3000', isGroup: false },
  { id: 'eq-3400', code: '3400', name: 'Treasury Stock', category: 'equity', parentId: 'eq-3000', isGroup: false },
];

// ---------------------------------------------------------------------------
// HELPER: Generate unique ID
// ---------------------------------------------------------------------------
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ---------------------------------------------------------------------------
// HELPER: Generate time periods
// ---------------------------------------------------------------------------
export function generateTimePeriods(
  startYear: number,
  endYear: number,
  reportingPeriod: ReportingPeriod,
  forecastStartYear: number
): TimePeriod[] {
  const periods: TimePeriod[] = [];
  for (let year = startYear; year <= endYear; year++) {
    if (reportingPeriod === 'yearly') {
      periods.push({
        id: `FY${year}`,
        label: `FY${year}`,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        type: year < forecastStartYear ? 'historical' : 'forecast',
        year,
      });
    } else if (reportingPeriod === 'quarterly') {
      for (let q = 1; q <= 4; q++) {
        const startMonth = (q - 1) * 3 + 1;
        const endMonth = q * 3;
        periods.push({
          id: `FY${year}Q${q}`,
          label: `FY${year} Q${q}`,
          startDate: `${year}-${String(startMonth).padStart(2, '0')}-01`,
          endDate: `${year}-${String(endMonth).padStart(2, '0')}-${endMonth === 2 ? 28 : [4, 6, 9, 11].includes(endMonth) ? 30 : 31}`,
          type: year < forecastStartYear ? 'historical' : 'forecast',
          year,
          quarter: q,
        });
      }
    } else {
      for (let m = 1; m <= 12; m++) {
        const daysInMonth = new Date(year, m, 0).getDate();
        periods.push({
          id: `FY${year}M${String(m).padStart(2, '0')}`,
          label: `${year}-${String(m).padStart(2, '0')}`,
          startDate: `${year}-${String(m).padStart(2, '0')}-01`,
          endDate: `${year}-${String(m).padStart(2, '0')}-${daysInMonth}`,
          type: year < forecastStartYear ? 'historical' : 'forecast',
          year,
          month: m,
        });
      }
    }
  }
  return periods;
}

// ---------------------------------------------------------------------------
// HELPER: Format currency
// ---------------------------------------------------------------------------
export function formatCurrency(value: number, currency: Currency = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF ', CAD: 'C$',
    AUD: 'A$', CNY: '¥', INR: '₹', BRL: 'R$', ZAR: 'R', AED: 'AED ',
    SGD: 'S$', HKD: 'HK$', KRW: '₩', SEK: 'kr', NOK: 'kr', DKK: 'kr',
    NZD: 'NZ$', MXN: 'MX$',
  };
  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1e9) {
    formatted = `${(value / 1e9).toFixed(1)}B`;
  } else if (abs >= 1e6) {
    formatted = `${(value / 1e6).toFixed(1)}M`;
  } else if (abs >= 1e3) {
    formatted = `${(value / 1e3).toFixed(1)}K`;
  } else {
    formatted = value.toFixed(0);
  }
  return `${value < 0 ? '-' : ''}${symbols[currency] || '$'}${formatted.replace('-', '')}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
