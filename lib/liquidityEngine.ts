// =============================================================================
// LUMINA F - LIQUIDITY & CASH FLOW ENGINE
// =============================================================================
// Generates:
// - Cash runway
// - Liquidity ratio curves
// - Days cash on hand
// - Burn rate
// - Working capital cycle dynamics
// - Covenant breach detection
// =============================================================================

import {
  BalanceSheet,
  CashFlowStatement,
  IncomeStatement,
  DebtInstrument,
  LiquidityMetrics,
} from './financialModel';

// ---------------------------------------------------------------------------
// INPUT INTERFACE
// ---------------------------------------------------------------------------

export interface LiquidityInput {
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlowStatement[];
  incomeStatements: IncomeStatement[];
  debtInstruments: DebtInstrument[];
}

// ---------------------------------------------------------------------------
// COVENANT CHECK
// ---------------------------------------------------------------------------

function checkCovenants(
  bs: BalanceSheet,
  is: IncomeStatement,
  debts: DebtInstrument[],
): string[] {
  const breaches: string[] = [];

  for (const debt of debts) {
    if (!debt.covenants) continue;

    for (const covenant of debt.covenants) {
      let currentValue = 0;

      switch (covenant.type) {
        case 'debt_to_equity':
          currentValue = bs.totalLiabilities / (bs.totalEquity || 1);
          break;
        case 'interest_coverage':
          currentValue = is.ebit / (is.interestExpense || 1);
          break;
        case 'current_ratio':
          currentValue = bs.totalCurrentAssets / (bs.totalCurrentLiabilities || 1);
          break;
        case 'debt_service_coverage':
          currentValue = is.ebitda / (is.interestExpense || 1);
          break;
        default:
          continue;
      }

      let breached = false;
      switch (covenant.operator) {
        case 'gt': breached = currentValue <= covenant.threshold; break;
        case 'lt': breached = currentValue >= covenant.threshold; break;
        case 'gte': breached = currentValue < covenant.threshold; break;
        case 'lte': breached = currentValue > covenant.threshold; break;
      }

      if (breached) {
        breaches.push(
          `${debt.name}: ${covenant.name} breached (${currentValue.toFixed(2)} vs threshold ${covenant.threshold})`
        );
      }
    }
  }

  return breaches;
}

// ---------------------------------------------------------------------------
// MAIN LIQUIDITY CALCULATION
// ---------------------------------------------------------------------------

export function calculateLiquidity(input: LiquidityInput): LiquidityMetrics[] {
  const { balanceSheets, cashFlows, incomeStatements, debtInstruments } = input;
  const metrics: LiquidityMetrics[] = [];

  for (let i = 0; i < balanceSheets.length; i++) {
    const bs = balanceSheets[i];
    const cf = cashFlows[i];
    const is = incomeStatements[i];

    if (!bs || !cf || !is) continue;

    // Current ratio
    const currentRatio = bs.totalCurrentLiabilities > 0
      ? bs.totalCurrentAssets / bs.totalCurrentLiabilities
      : 999;

    // Quick ratio (exclude inventory and prepaid)
    const quickAssets = bs.cash + bs.accountsReceivable;
    const quickRatio = bs.totalCurrentLiabilities > 0
      ? quickAssets / bs.totalCurrentLiabilities
      : 999;

    // Cash ratio
    const cashRatio = bs.totalCurrentLiabilities > 0
      ? bs.cash / bs.totalCurrentLiabilities
      : 999;

    // Burn rate (monthly negative cash consumption)
    const monthlyOpex = (is.totalCOGS + is.totalOpex) / 12;
    const monthlyRevenue = is.totalRevenue / 12;
    const burnRate = monthlyOpex > monthlyRevenue
      ? monthlyOpex - monthlyRevenue
      : 0;

    // Cash runway (months)
    const cashRunway = burnRate > 0
      ? bs.cash / burnRate
      : 999; // infinite if not burning

    // Days cash on hand
    const dailyOpex = (is.totalCOGS + is.totalOpex) / 365;
    const daysCashOnHand = dailyOpex > 0
      ? bs.cash / dailyOpex
      : 999;

    // Working capital cycle (days)
    const arDays = is.totalRevenue > 0
      ? (bs.accountsReceivable / is.totalRevenue) * 365
      : 0;
    const inventoryDays = is.totalCOGS > 0
      ? (bs.inventory / is.totalCOGS) * 365
      : 0;
    const apDays = is.totalCOGS > 0
      ? (bs.accountsPayable / is.totalCOGS) * 365
      : 0;
    const workingCapitalCycle = arDays + inventoryDays - apDays;

    // Operating cash flow
    const isNegativeOCF = cf.cashFromOperations < 0;

    // Covenant checks
    const covenantBreaches = checkCovenants(bs, is, debtInstruments);

    metrics.push({
      periodId: bs.periodId,
      cashRunway: Math.min(cashRunway, 999),
      currentRatio,
      quickRatio,
      cashRatio,
      daysCashOnHand: Math.min(daysCashOnHand, 999),
      burnRate,
      workingCapitalCycle,
      operatingCashFlow: cf.cashFromOperations,
      isNegativeOCF,
      debtCovenantBreaches: covenantBreaches,
    });
  }

  return metrics;
}
