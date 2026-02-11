// =============================================================================
// LUMINA F - VALUATION ENGINE
// =============================================================================
// Multiple valuation methodologies:
// A. Discounted Cash Flow (DCF)
// B. Comparable Multiples (EV/Sales, EV/EBITDA, P/E)
// C. Precedent Transactions
// D. Real Options Valuation
// =============================================================================

import {
  CashFlowStatement,
  IncomeStatement,
  BalanceSheet,
  DebtInstrument,
  EquityInstrument,
  TaxObject,
  ValuationSummary,
  DCFValuation,
  ComparableMultiples,
  RealOptionsValuation,
  TerminalValueMethod,
} from './financialModel';

// ---------------------------------------------------------------------------
// INPUT INTERFACE
// ---------------------------------------------------------------------------

export interface ValuationInput {
  cashFlows: CashFlowStatement[];
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  debtInstruments: DebtInstrument[];
  equityInstruments: EquityInstrument[];
  taxObject: TaxObject | null;
  waccOverride?: number;
  terminalMethod?: TerminalValueMethod;
}

// ---------------------------------------------------------------------------
// WACC CALCULATION
// ---------------------------------------------------------------------------

function calculateWACC(
  debtInstruments: DebtInstrument[],
  equityInstruments: EquityInstrument[],
  taxRate: number,
  costOfEquity: number = 0.10, // default 10%
): number {
  const totalDebt = debtInstruments.reduce((sum, d) => sum + d.outstandingBalance, 0);
  const totalEquity = equityInstruments.reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const totalCapital = totalDebt + totalEquity;

  if (totalCapital === 0) return 0.10; // default

  const weightedDebt = debtInstruments.reduce((sum, d) => {
    return sum + (d.outstandingBalance / totalCapital) * (d.interestRate / 100) * (1 - taxRate);
  }, 0);

  const weightedEquity = (totalEquity / totalCapital) * costOfEquity;

  return weightedDebt + weightedEquity;
}

// ---------------------------------------------------------------------------
// DCF VALUATION
// ---------------------------------------------------------------------------

function performDCF(
  cashFlows: CashFlowStatement[],
  wacc: number,
  terminalMethod: TerminalValueMethod,
  terminalGrowthRate: number = 0.025, // 2.5%
  exitMultiple: number = 10,
): DCFValuation {
  const forecastCFs = cashFlows.filter((cf) => cf.type === 'forecast');

  if (forecastCFs.length === 0) {
    return {
      wacc,
      projectedFCFs: [],
      terminalValue: 0,
      terminalValueMethod: terminalMethod,
      terminalGrowthRate,
      pvTerminalValue: 0,
      enterpriseValue: 0,
      netDebt: 0,
      equityValue: 0,
    };
  }

  const projectedFCFs = forecastCFs.map((cf, i) => {
    const year = i + 1;
    const discountFactor = Math.pow(1 + wacc, year);
    return {
      period: cf.periodLabel,
      fcf: cf.freeCashFlowToFirm,
      discountFactor,
      presentValue: cf.freeCashFlowToFirm / discountFactor,
    };
  });

  const lastFCF = forecastCFs[forecastCFs.length - 1].freeCashFlowToFirm;
  const lastYear = forecastCFs.length;

  let terminalValue: number;
  if (terminalMethod === 'perpetuity_growth') {
    terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
  } else {
    const lastEBITDA = lastFCF * 1.3; // approximate EBITDA from FCF
    terminalValue = lastEBITDA * exitMultiple;
  }

  const pvTerminalValue = terminalValue / Math.pow(1 + wacc, lastYear);
  const pvFCFs = projectedFCFs.reduce((sum, f) => sum + f.presentValue, 0);
  const enterpriseValue = pvFCFs + pvTerminalValue;

  return {
    wacc,
    projectedFCFs,
    terminalValue,
    terminalValueMethod: terminalMethod,
    terminalGrowthRate: terminalMethod === 'perpetuity_growth' ? terminalGrowthRate : undefined,
    exitMultiple: terminalMethod === 'exit_multiple' ? exitMultiple : undefined,
    pvTerminalValue,
    enterpriseValue,
    netDebt: 0, // Set by caller
    equityValue: 0, // Set by caller
  };
}

// ---------------------------------------------------------------------------
// COMPARABLE MULTIPLES
// ---------------------------------------------------------------------------

function performComparables(
  incomeStatements: IncomeStatement[],
): ComparableMultiples {
  // Use last forecast period metrics
  const lastIS = incomeStatements[incomeStatements.length - 1];
  if (!lastIS) {
    return {
      evToSales: { multiple: 0, impliedEV: 0 },
      evToEBITDA: { multiple: 0, impliedEV: 0 },
      priceToEarnings: { multiple: 0, impliedEquity: 0 },
      selectedComps: [],
    };
  }

  // Default comparable multiples (industry medians)
  const defaultComps = [
    { name: 'Industry Median', evSales: 3.5, evEbitda: 12.0, pe: 18.0 },
    { name: 'High Performer', evSales: 5.0, evEbitda: 15.0, pe: 25.0 },
    { name: 'Low Performer', evSales: 2.0, evEbitda: 8.0, pe: 12.0 },
  ];

  const medianEvSales = 3.5;
  const medianEvEbitda = 12.0;
  const medianPE = 18.0;

  return {
    evToSales: {
      multiple: medianEvSales,
      impliedEV: lastIS.totalRevenue * medianEvSales,
    },
    evToEBITDA: {
      multiple: medianEvEbitda,
      impliedEV: lastIS.ebitda * medianEvEbitda,
    },
    priceToEarnings: {
      multiple: medianPE,
      impliedEquity: lastIS.netIncome * medianPE,
    },
    selectedComps: defaultComps,
  };
}

// ---------------------------------------------------------------------------
// REAL OPTIONS
// ---------------------------------------------------------------------------

function performRealOptions(
  enterpriseValue: number,
): RealOptionsValuation[] {
  // Black-Scholes approximation for real options
  const options: RealOptionsValuation[] = [
    {
      optionType: 'expand',
      underlyingValue: enterpriseValue * 0.3,
      strikePrice: enterpriseValue * 0.2,
      volatility: 0.35,
      timeToExpiry: 3,
      riskFreeRate: 0.04,
      optionValue: 0,
    },
    {
      optionType: 'delay',
      underlyingValue: enterpriseValue * 0.15,
      strikePrice: enterpriseValue * 0.1,
      volatility: 0.3,
      timeToExpiry: 2,
      riskFreeRate: 0.04,
      optionValue: 0,
    },
    {
      optionType: 'abandon',
      underlyingValue: enterpriseValue * 0.5,
      strikePrice: enterpriseValue * 0.4,
      volatility: 0.25,
      timeToExpiry: 5,
      riskFreeRate: 0.04,
      optionValue: 0,
    },
  ];

  // Simplified Black-Scholes
  for (const opt of options) {
    const { underlyingValue: S, strikePrice: K, volatility: sigma, timeToExpiry: T, riskFreeRate: r } = opt;
    if (S <= 0 || K <= 0 || T <= 0) {
      opt.optionValue = 0;
      continue;
    }

    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Approximation of cumulative normal distribution
    const cnd = (x: number): number => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      const sign = x < 0 ? -1 : 1;
      const absX = Math.abs(x);
      const t = 1.0 / (1.0 + p * absX);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);
      return 0.5 * (1.0 + sign * y);
    };

    if (opt.optionType === 'abandon') {
      // Put option
      opt.optionValue = K * Math.exp(-r * T) * cnd(-d2) - S * cnd(-d1);
    } else {
      // Call option
      opt.optionValue = S * cnd(d1) - K * Math.exp(-r * T) * cnd(d2);
    }

    opt.optionValue = Math.max(0, opt.optionValue);
  }

  return options;
}

// ---------------------------------------------------------------------------
// VALUE DRIVERS WATERFALL
// ---------------------------------------------------------------------------

function calculateValueDrivers(
  incomeStatements: IncomeStatement[],
  enterpriseValue: number,
): { driver: string; impact: number }[] {
  if (incomeStatements.length === 0) return [];

  const lastIS = incomeStatements[incomeStatements.length - 1];
  const firstIS = incomeStatements[0];

  const revenueGrowth = lastIS.totalRevenue - firstIS.totalRevenue;
  const marginImprovement = (lastIS.grossMargin - firstIS.grossMargin) * lastIS.totalRevenue;
  const opexEfficiency = firstIS.totalOpex - lastIS.totalOpex;
  const netIncomeGrowth = lastIS.netIncome - firstIS.netIncome;

  const totalDriver = Math.abs(revenueGrowth) + Math.abs(marginImprovement) + Math.abs(opexEfficiency) + Math.abs(netIncomeGrowth);
  if (totalDriver === 0) return [];

  return [
    { driver: 'Revenue Growth', impact: (revenueGrowth / totalDriver) * enterpriseValue * 0.4 },
    { driver: 'Margin Expansion', impact: (marginImprovement / totalDriver) * enterpriseValue * 0.25 },
    { driver: 'Operating Efficiency', impact: (opexEfficiency / totalDriver) * enterpriseValue * 0.2 },
    { driver: 'Earnings Power', impact: (netIncomeGrowth / totalDriver) * enterpriseValue * 0.15 },
  ];
}

// ---------------------------------------------------------------------------
// MAIN VALUATION
// ---------------------------------------------------------------------------

export function calculateValuation(input: ValuationInput): ValuationSummary {
  const {
    cashFlows,
    incomeStatements,
    balanceSheets,
    debtInstruments,
    equityInstruments,
    taxObject,
    waccOverride,
    terminalMethod = 'perpetuity_growth',
  } = input;

  const taxRate = taxObject?.effectiveTaxRate ?? 0.25;

  // Calculate WACC
  const wacc = waccOverride ?? calculateWACC(debtInstruments, equityInstruments, taxRate);

  // DCF
  const dcf = performDCF(cashFlows, wacc, terminalMethod);

  // Set net debt
  const lastBS = balanceSheets[balanceSheets.length - 1];
  if (lastBS) {
    dcf.netDebt = (lastBS.shortTermDebt + lastBS.longTermDebt) - lastBS.cash;
    dcf.equityValue = dcf.enterpriseValue - dcf.netDebt;
  }

  // Comparable Multiples
  const comparables = performComparables(incomeStatements);

  // Real Options
  const realOptions = performRealOptions(dcf.enterpriseValue);

  // Composite valuation (weighted average)
  const dcfWeight = 0.5;
  const compWeight = 0.3;
  const optionsWeight = 0.2;

  const compAvgEV = (comparables.evToSales.impliedEV + comparables.evToEBITDA.impliedEV) / 2;
  const optionsValue = realOptions.reduce((sum, o) => sum + o.optionValue, 0);

  const compositeValue =
    dcf.enterpriseValue * dcfWeight +
    compAvgEV * compWeight +
    (dcf.enterpriseValue + optionsValue) * optionsWeight;

  // Value range
  const allValues = [
    dcf.enterpriseValue,
    comparables.evToSales.impliedEV,
    comparables.evToEBITDA.impliedEV,
  ].filter((v) => v > 0);

  const low = allValues.length > 0 ? Math.min(...allValues) * 0.85 : 0;
  const high = allValues.length > 0 ? Math.max(...allValues) * 1.15 : 0;

  // Value drivers
  const valueDrivers = calculateValueDrivers(incomeStatements, dcf.enterpriseValue);

  return {
    dcf,
    comparables,
    precedentTransactions: [
      { name: 'Industry Deal A', evSales: 4.0, evEbitda: 13.0, premium: 0.25 },
      { name: 'Industry Deal B', evSales: 3.2, evEbitda: 10.5, premium: 0.18 },
      { name: 'Industry Deal C', evSales: 4.8, evEbitda: 14.5, premium: 0.30 },
    ],
    realOptions,
    compositeValue,
    valueRange: { low, mid: compositeValue, high },
    valueDrivers,
  };
}
