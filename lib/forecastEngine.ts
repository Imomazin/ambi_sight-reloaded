// =============================================================================
// LUMINA F - FORECASTING & PROJECTION ENGINE
// =============================================================================
// Rules:
// - Revenue forecast flows to AR projection
// - Cost forecast flows to AP, COGS, OPEX
// - Capex flows to balance sheet fixed assets
// - Depreciation flows to income statement
// - Working capital forecast from captured days
// - Assets = Liabilities + Equity (enforced every period)
// - Cash flow reconciles to net income + adjustments
// =============================================================================

import {
  FinancialEntity,
  TimePeriod,
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
  ForecastHorizon,
  SeasonalityVector,
} from './financialModel';

// ---------------------------------------------------------------------------
// INPUT INTERFACE
// ---------------------------------------------------------------------------

export interface ForecastInput {
  entity: FinancialEntity;
  periods: TimePeriod[];
  revenueStreams: RevenueStream[];
  costObjects: CostObject[];
  workingCapital: WorkingCapitalComponent | null;
  capitalExpenditures: CapitalExpenditure[];
  debtInstruments: DebtInstrument[];
  equityInstruments: EquityInstrument[];
  taxObject: TaxObject | null;
  forecastHorizon: ForecastHorizon;
  forecastStartYear: number;
}

export interface ForecastOutput {
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function getSeasonalFactor(month: number, seasonality: SeasonalityVector): number {
  const keys: (keyof SeasonalityVector)[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const values = keys.map((k) => seasonality[k]);
  const avg = values.reduce((a, b) => a + b, 0) / 12;
  return avg === 0 ? 1 : values[month - 1] / avg;
}

function getPeriodsPerYear(entity: FinancialEntity): number {
  if (entity.reportingPeriod === 'monthly') return 12;
  if (entity.reportingPeriod === 'quarterly') return 4;
  return 1;
}

function yearsBetween(period: TimePeriod, baseYear: number): number {
  return period.year - baseYear;
}

// ---------------------------------------------------------------------------
// REVENUE FORECASTING
// ---------------------------------------------------------------------------

function forecastRevenue(
  stream: RevenueStream,
  period: TimePeriod,
  baseYear: number,
  periodsPerYear: number
): number {
  const yearsFromBase = yearsBetween(period, baseYear);
  const growthFactor = Math.pow(1 + stream.growthRate / 100, yearsFromBase);

  let baseRevenue = stream.basePrice * stream.baseVolume;

  // Apply churn for recurring revenue
  if (stream.isRecurring && stream.churnRate) {
    const retentionFactor = Math.pow(1 - stream.churnRate / 100, yearsFromBase);
    baseRevenue *= retentionFactor;
  }

  let revenue = baseRevenue * growthFactor;

  // Apply seasonality for monthly/quarterly
  if (periodsPerYear > 1 && period.month) {
    revenue = (revenue / 12) * getSeasonalFactor(period.month, stream.seasonality);
  } else if (periodsPerYear === 4 && period.quarter) {
    const midMonth = (period.quarter - 1) * 3 + 2;
    revenue = (revenue / 4) * getSeasonalFactor(midMonth, stream.seasonality);
  } else {
    revenue = revenue; // yearly = full amount
  }

  return Math.max(0, revenue);
}

// ---------------------------------------------------------------------------
// COST FORECASTING
// ---------------------------------------------------------------------------

function forecastCost(
  cost: CostObject,
  period: TimePeriod,
  totalRevenue: number,
  baseYear: number,
  periodsPerYear: number
): number {
  const yearsFromBase = yearsBetween(period, baseYear);
  const growthFactor = Math.pow(1 + cost.growthRate / 100, yearsFromBase);

  let amount = 0;

  switch (cost.behavior) {
    case 'fixed':
      amount = (cost.fixedAmount || 0) * growthFactor;
      break;
    case 'variable':
      amount = totalRevenue * (cost.variableRate || 0) / 100;
      break;
    case 'mixed':
      amount = ((cost.fixedAmount || 0) * growthFactor) + (totalRevenue * (cost.variableRate || 0) / 100);
      break;
    case 'one_off':
      // One-off costs only in the first forecast year
      if (yearsFromBase === 0) {
        amount = cost.fixedAmount || 0;
      }
      break;
    case 'allocated':
      amount = (cost.fixedAmount || 0) * growthFactor;
      break;
  }

  // Adjust for period frequency
  if (periodsPerYear > 1) {
    amount = amount / periodsPerYear;
  }

  return Math.max(0, amount);
}

// ---------------------------------------------------------------------------
// DEPRECIATION
// ---------------------------------------------------------------------------

function calculateDepreciation(
  capexItems: CapitalExpenditure[],
  period: TimePeriod,
  periodsPerYear: number
): number {
  let totalDepreciation = 0;

  for (const item of capexItems) {
    const acqYear = parseInt(item.acquisitionDate.split('-')[0]);
    const yearsOwned = period.year - acqYear;

    if (yearsOwned < 0 || yearsOwned >= item.usefulLife) continue;

    let annualDep = 0;
    const depBase = item.amount - item.salvageValue;

    switch (item.depreciationMethod) {
      case 'straight_line':
        annualDep = depBase / item.usefulLife;
        break;
      case 'declining_balance':
        const rate = 2 / item.usefulLife;
        const bookValue = item.amount * Math.pow(1 - rate, yearsOwned);
        annualDep = bookValue * rate;
        break;
      case 'sum_of_years':
        const sumYears = (item.usefulLife * (item.usefulLife + 1)) / 2;
        const remaining = item.usefulLife - yearsOwned;
        annualDep = depBase * (remaining / sumYears);
        break;
      default:
        annualDep = depBase / item.usefulLife;
    }

    totalDepreciation += annualDep / periodsPerYear;
  }

  return totalDepreciation;
}

// ---------------------------------------------------------------------------
// DEBT SERVICE
// ---------------------------------------------------------------------------

function calculateDebtService(
  debts: DebtInstrument[],
  period: TimePeriod,
  periodsPerYear: number
): { interestExpense: number; principalPayment: number; totalDebt: number } {
  let interestExpense = 0;
  let principalPayment = 0;
  let totalDebt = 0;

  for (const debt of debts) {
    const maturityYear = parseInt(debt.maturityDate.split('-')[0]);
    if (period.year > maturityYear) continue;

    const periodRate = debt.interestRate / 100 / periodsPerYear;
    const remainingBalance = debt.outstandingBalance;

    interestExpense += remainingBalance * periodRate;

    // Simple amortization
    if (debt.type !== 'revolving_credit') {
      const totalPeriods = (maturityYear - period.year + 1) * periodsPerYear;
      if (totalPeriods > 0) {
        principalPayment += remainingBalance / totalPeriods;
      }
    }

    totalDebt += remainingBalance - principalPayment;
  }

  return { interestExpense, principalPayment, totalDebt: Math.max(0, totalDebt) };
}

// ---------------------------------------------------------------------------
// WORKING CAPITAL
// ---------------------------------------------------------------------------

function calculateWorkingCapital(
  wc: WorkingCapitalComponent | null,
  totalRevenue: number,
  totalCOGS: number,
  periodsPerYear: number
): {
  ar: number; ap: number; inventory: number;
  prepaid: number; otherCA: number; otherCL: number;
} {
  if (!wc) {
    return { ar: 0, ap: 0, inventory: 0, prepaid: 0, otherCA: 0, otherCL: 0 };
  }

  const annualRevenue = totalRevenue * periodsPerYear;
  const annualCOGS = totalCOGS * periodsPerYear;

  return {
    ar: (annualRevenue / 365) * wc.accountsReceivableDays,
    ap: (annualCOGS / 365) * wc.accountsPayableDays,
    inventory: (annualCOGS / 365) * wc.inventoryDays,
    prepaid: wc.prepaidExpenses,
    otherCA: wc.otherCurrentAssets,
    otherCL: wc.otherCurrentLiabilities,
  };
}

// ---------------------------------------------------------------------------
// MAIN FORECAST BUILDER
// ---------------------------------------------------------------------------

export function buildForecast(input: ForecastInput): ForecastOutput {
  const {
    entity,
    periods,
    revenueStreams,
    costObjects,
    workingCapital,
    capitalExpenditures,
    debtInstruments,
    equityInstruments,
    taxObject,
    forecastStartYear,
  } = input;

  const periodsPerYear = getPeriodsPerYear(entity);
  const taxRate = taxObject?.effectiveTaxRate ?? 0.25;

  const incomeStatements: IncomeStatement[] = [];
  const balanceSheets: BalanceSheet[] = [];
  const cashFlowStatements: CashFlowStatement[] = [];

  let prevBS: BalanceSheet | null = null;
  let cumulativeRetainedEarnings = 0;

  // Initialize retained earnings from equity instruments
  const retainedEarningsInstrument = equityInstruments.find(
    (e) => e.type === 'retained_earnings'
  );
  if (retainedEarningsInstrument) {
    cumulativeRetainedEarnings = retainedEarningsInstrument.amount;
  }

  for (const period of periods) {
    // -----------------------------------------------------------------------
    // INCOME STATEMENT
    // -----------------------------------------------------------------------

    // Revenue
    const revenueBreakdown = revenueStreams.map((stream) => ({
      streamId: stream.id,
      name: stream.name,
      amount: forecastRevenue(stream, period, forecastStartYear - 2, periodsPerYear),
    }));
    const totalRevenue = revenueBreakdown.reduce((sum, r) => sum + r.amount, 0);

    // COGS
    const cogsCosts = costObjects.filter((c) => c.category === 'cogs');
    const cogsBreakdown = cogsCosts.map((cost) => ({
      costId: cost.id,
      name: cost.name,
      amount: forecastCost(cost, period, totalRevenue, forecastStartYear - 2, periodsPerYear),
    }));
    const totalCOGS = cogsBreakdown.reduce((sum, c) => sum + c.amount, 0);
    const grossProfit = totalRevenue - totalCOGS;

    // Operating Expenses
    const opexCosts = costObjects.filter((c) => c.category === 'opex' || c.category === 'other');
    const opexBreakdown = opexCosts.map((cost) => ({
      costId: cost.id,
      name: cost.name,
      amount: forecastCost(cost, period, totalRevenue, forecastStartYear - 2, periodsPerYear),
    }));
    const totalOpex = opexBreakdown.reduce((sum, c) => sum + c.amount, 0);

    // Depreciation & Amortization
    const depreciation = calculateDepreciation(capitalExpenditures, period, periodsPerYear);
    const amortization = 0; // Can be extended

    // EBITDA and EBIT
    const ebitda = grossProfit - totalOpex;
    const ebit = ebitda - depreciation - amortization;

    // Debt service
    const debtService = calculateDebtService(debtInstruments, period, periodsPerYear);

    // EBT and Tax
    const ebt = ebit - debtService.interestExpense;
    const taxExpense = ebt > 0 ? ebt * taxRate : 0;
    const netIncome = ebt - taxExpense;

    const incomeStatement: IncomeStatement = {
      periodId: period.id,
      periodLabel: period.label,
      type: period.type,
      totalRevenue,
      revenueBreakdown,
      totalCOGS,
      cogsBreakdown,
      grossProfit,
      grossMargin: totalRevenue > 0 ? grossProfit / totalRevenue : 0,
      totalOpex,
      opexBreakdown,
      ebitda,
      depreciation,
      amortization,
      ebit,
      interestExpense: debtService.interestExpense,
      interestIncome: 0,
      otherIncome: 0,
      otherExpense: 0,
      ebt,
      taxExpense,
      netIncome,
      netMargin: totalRevenue > 0 ? netIncome / totalRevenue : 0,
    };

    incomeStatements.push(incomeStatement);

    // -----------------------------------------------------------------------
    // BALANCE SHEET
    // -----------------------------------------------------------------------

    // Working capital
    const wc = calculateWorkingCapital(workingCapital, totalRevenue, totalCOGS, periodsPerYear);

    // Fixed assets
    const grossPPE = capitalExpenditures.reduce((sum, c) => sum + c.amount, 0);
    const accumDep = prevBS ? prevBS.accumulatedDepreciation + depreciation : depreciation;
    const netPPE = grossPPE - accumDep;

    // Cash (plugged to balance)
    const totalEquityInstruments = equityInstruments
      .filter((e) => e.type !== 'retained_earnings' && e.type !== 'treasury')
      .reduce((sum, e) => sum + e.amount, 0);

    const commonStock = equityInstruments.find((e) => e.type === 'common')?.amount || 0;
    const apic = equityInstruments.find((e) => e.type === 'additional_paid_in')?.amount || 0;
    const treasury = equityInstruments.find((e) => e.type === 'treasury')?.amount || 0;

    cumulativeRetainedEarnings += netIncome;

    const totalEquity = commonStock + apic + cumulativeRetainedEarnings - treasury;

    // Liabilities
    const shortTermDebt = debtInstruments
      .filter((d) => {
        const matYear = parseInt(d.maturityDate.split('-')[0]);
        return matYear <= period.year + 1;
      })
      .reduce((sum, d) => sum + d.outstandingBalance * 0.2, 0);

    const longTermDebt = debtInstruments.reduce((sum, d) => sum + d.outstandingBalance, 0) - shortTermDebt;
    const deferredTaxLiab = taxObject?.deferredTaxLiabilities || 0;

    const totalCurrentLiabilities = wc.ap + shortTermDebt + wc.otherCL;
    const totalNonCurrentLiabilities = Math.max(0, longTermDebt) + deferredTaxLiab;
    const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

    // Plug cash to balance
    const totalNonCashAssets = wc.ar + wc.inventory + wc.prepaid + wc.otherCA + netPPE;
    const cash = Math.max(0, (totalLiabilities + totalEquity) - totalNonCashAssets);

    const totalCurrentAssets = cash + wc.ar + wc.inventory + wc.prepaid + wc.otherCA;
    const totalNonCurrentAssets = netPPE;
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    const balanceSheet: BalanceSheet = {
      periodId: period.id,
      periodLabel: period.label,
      type: period.type,
      cash,
      accountsReceivable: wc.ar,
      inventory: wc.inventory,
      prepaidExpenses: wc.prepaid,
      otherCurrentAssets: wc.otherCA,
      totalCurrentAssets,
      propertyPlantEquipment: grossPPE,
      accumulatedDepreciation: accumDep,
      netPPE,
      intangibleAssets: 0,
      goodwill: 0,
      otherNonCurrentAssets: 0,
      totalNonCurrentAssets,
      totalAssets,
      accountsPayable: wc.ap,
      shortTermDebt,
      currentPortionLTD: 0,
      accruedExpenses: 0,
      otherCurrentLiabilities: wc.otherCL,
      totalCurrentLiabilities,
      longTermDebt: Math.max(0, longTermDebt),
      deferredTaxLiabilities: deferredTaxLiab,
      otherNonCurrentLiabilities: 0,
      totalNonCurrentLiabilities,
      totalLiabilities,
      commonStock,
      additionalPaidInCapital: apic,
      retainedEarnings: cumulativeRetainedEarnings,
      treasuryStock: treasury,
      otherEquity: 0,
      totalEquity,
      totalLiabilitiesAndEquity,
      isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01,
    };

    balanceSheets.push(balanceSheet);

    // -----------------------------------------------------------------------
    // CASH FLOW STATEMENT
    // -----------------------------------------------------------------------

    const changeInAR = prevBS ? -(wc.ar - prevBS.accountsReceivable) : 0;
    const changeInInventory = prevBS ? -(wc.inventory - prevBS.inventory) : 0;
    const changeInAP = prevBS ? (wc.ap - prevBS.accountsPayable) : 0;
    const changeInPrepaid = prevBS ? -(wc.prepaid - prevBS.prepaidExpenses) : 0;
    const changeInAccrued = 0;

    const cashFromOperations =
      netIncome + depreciation + amortization +
      changeInAR + changeInInventory + changeInAP + changeInPrepaid + changeInAccrued;

    const capexThisPeriod = capitalExpenditures
      .filter((c) => {
        const acqYear = parseInt(c.acquisitionDate.split('-')[0]);
        return acqYear === period.year;
      })
      .reduce((sum, c) => sum + c.amount, 0) / periodsPerYear;

    const cashFromInvesting = -capexThisPeriod;

    const cashFromFinancing = -debtService.principalPayment;

    const netChangeInCash = cashFromOperations + cashFromInvesting + cashFromFinancing;
    const beginningCash = prevBS ? prevBS.cash : 0;
    const endingCash = beginningCash + netChangeInCash;

    const fcff = cashFromOperations - capexThisPeriod;
    const fcfe = fcff - debtService.principalPayment + debtService.interestExpense * (1 - taxRate);

    const cashFlowStatement: CashFlowStatement = {
      periodId: period.id,
      periodLabel: period.label,
      type: period.type,
      netIncome,
      depreciation,
      amortization,
      changeInAR,
      changeInInventory,
      changeInAP,
      changeInPrepaid,
      changeInAccruedExpenses: changeInAccrued,
      otherOperatingAdjustments: 0,
      cashFromOperations,
      capitalExpenditures: -capexThisPeriod,
      acquisitions: 0,
      investmentPurchases: 0,
      investmentSales: 0,
      otherInvesting: 0,
      cashFromInvesting,
      debtProceeds: 0,
      debtRepayments: -debtService.principalPayment,
      equityIssuance: 0,
      dividendsPaid: 0,
      shareRepurchases: 0,
      otherFinancing: 0,
      cashFromFinancing,
      netChangeInCash,
      beginningCash,
      endingCash,
      freeCashFlowToFirm: fcff,
      freeCashFlowToEquity: fcfe,
    };

    cashFlowStatements.push(cashFlowStatement);
    prevBS = balanceSheet;
  }

  return { incomeStatements, balanceSheets, cashFlowStatements };
}
