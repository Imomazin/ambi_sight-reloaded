'use client';

import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import type { KPIValue, PerformanceKPIs } from '@/lib/database.types';

interface KPIFieldProps {
  label: string;
  description: string;
  kpiKey: keyof PerformanceKPIs;
  unit: KPIValue['unit'];
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function KPIField({ label, description, kpiKey, unit, min = 0, max = 100, step = 1, prefix, suffix }: KPIFieldProps) {
  const { currentIntake, updatePerformanceKPIs } = useDiagnosticStore();
  const kpi = currentIntake?.performance_kpis?.[kpiKey];

  if (!kpi) return null;

  const handleValueChange = (value: number) => {
    updatePerformanceKPIs({
      [kpiKey]: { ...kpi, value },
    });
  };

  const handleTrendChange = (trend: KPIValue['trend']) => {
    updatePerformanceKPIs({
      [kpiKey]: { ...kpi, trend },
    });
  };

  const handleBenchmarkChange = (benchmark: KPIValue['benchmark_comparison']) => {
    updatePerformanceKPIs({
      [kpiKey]: { ...kpi, benchmark_comparison: benchmark },
    });
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Value Input */}
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Value</label>
          <div className="flex items-center">
            {prefix && <span className="text-[var(--text-muted)] mr-1">{prefix}</span>}
            <input
              type="number"
              value={kpi.value}
              onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
              min={min}
              max={max}
              step={step}
              className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {suffix && <span className="text-[var(--text-muted)] ml-1">{suffix}</span>}
          </div>
        </div>

        {/* Trend */}
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Trend</label>
          <select
            value={kpi.trend}
            onChange={(e) => handleTrendChange(e.target.value as KPIValue['trend'])}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="improving">Improving</option>
            <option value="stable">Stable</option>
            <option value="declining">Declining</option>
          </select>
        </div>

        {/* Benchmark */}
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">vs. Industry</label>
          <select
            value={kpi.benchmark_comparison}
            onChange={(e) => handleBenchmarkChange(e.target.value as KPIValue['benchmark_comparison'])}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="above">Above Benchmark</option>
            <option value="at">At Benchmark</option>
            <option value="below">Below Benchmark</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function PerformanceKPIsStep() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Enter your current performance metrics. Include trend direction and how you compare to industry benchmarks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPIField
          label="Revenue Growth"
          description="Year-over-year revenue growth rate"
          kpiKey="revenue_growth"
          unit="percentage"
          min={-50}
          max={200}
          suffix="%"
        />

        <KPIField
          label="Gross Margin"
          description="Gross profit as percentage of revenue"
          kpiKey="gross_margin"
          unit="percentage"
          min={0}
          max={100}
          suffix="%"
        />

        <KPIField
          label="Operating Margin"
          description="Operating profit as percentage of revenue"
          kpiKey="operating_margin"
          unit="percentage"
          min={-50}
          max={100}
          suffix="%"
        />

        <KPIField
          label="Market Share"
          description="Your share of the target market"
          kpiKey="market_share"
          unit="percentage"
          min={0}
          max={100}
          suffix="%"
        />

        <KPIField
          label="Customer Acquisition Cost"
          description="Average cost to acquire a customer"
          kpiKey="customer_acquisition_cost"
          unit="currency"
          min={0}
          max={100000}
          step={100}
          prefix="$"
        />

        <KPIField
          label="Customer Lifetime Value"
          description="Total revenue expected from a customer"
          kpiKey="customer_lifetime_value"
          unit="currency"
          min={0}
          max={1000000}
          step={100}
          prefix="$"
        />

        <KPIField
          label="Employee Productivity"
          description="Revenue per employee or output efficiency"
          kpiKey="employee_productivity"
          unit="score"
          min={0}
          max={100}
          suffix="/100"
        />

        <KPIField
          label="Customer Satisfaction"
          description="NPS, CSAT, or satisfaction score"
          kpiKey="customer_satisfaction"
          unit="score"
          min={0}
          max={100}
          suffix="/100"
        />

        <KPIField
          label="Innovation Rate"
          description="% revenue from new products/services"
          kpiKey="innovation_rate"
          unit="percentage"
          min={0}
          max={100}
          suffix="%"
        />

        <KPIField
          label="Operational Efficiency"
          description="Overall operational effectiveness score"
          kpiKey="operational_efficiency"
          unit="score"
          min={0}
          max={100}
          suffix="/100"
        />
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
        <p className="text-sm text-amber-400">
          These metrics are used to calculate your Performance Score. Be as accurate as possible for meaningful insights.
        </p>
      </div>
    </div>
  );
}
