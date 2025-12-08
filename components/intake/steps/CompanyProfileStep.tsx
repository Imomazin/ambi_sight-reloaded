'use client';

import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import type { Industry, MaturityLevel } from '@/lib/users';
import type { OrganizationSize, RevenueRange, EmployeeRange, BusinessModel } from '@/lib/database.types';

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Financial Services', label: 'Financial Services' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Energy', label: 'Energy' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Public Sector', label: 'Public Sector' },
  { value: 'Consulting', label: 'Consulting' },
];

const SIZES: { value: OrganizationSize; label: string }[] = [
  { value: 'startup', label: 'Startup (1-50 employees)' },
  { value: 'small', label: 'Small (51-200 employees)' },
  { value: 'medium', label: 'Medium (201-1000 employees)' },
  { value: 'large', label: 'Large (1001-5000 employees)' },
  { value: 'enterprise', label: 'Enterprise (5000+ employees)' },
];

const MATURITY_LEVELS: { value: MaturityLevel; label: string }[] = [
  { value: 'Startup', label: 'Startup - Early stage, product-market fit' },
  { value: 'ScaleUp', label: 'ScaleUp - Rapid growth phase' },
  { value: 'Enterprise', label: 'Enterprise - Established market position' },
  { value: 'PublicSector', label: 'Public Sector - Government/nonprofit' },
];

const REGIONS = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa',
  'Global',
];

const REVENUE_RANGES: { value: RevenueRange; label: string }[] = [
  { value: 'under_1m', label: 'Under $1M' },
  { value: '1m_10m', label: '$1M - $10M' },
  { value: '10m_50m', label: '$10M - $50M' },
  { value: '50m_100m', label: '$50M - $100M' },
  { value: '100m_500m', label: '$100M - $500M' },
  { value: '500m_1b', label: '$500M - $1B' },
  { value: 'over_1b', label: 'Over $1B' },
];

const BUSINESS_MODELS: { value: BusinessModel; label: string }[] = [
  { value: 'b2b_saas', label: 'B2B SaaS' },
  { value: 'b2c_saas', label: 'B2C SaaS' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'e_commerce', label: 'E-Commerce' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' },
];

export default function CompanyProfileStep() {
  const { currentIntake, updateCompanyProfile } = useDiagnosticStore();
  const profile = currentIntake?.company_profile;

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry */}
        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <select
            value={profile.industry}
            onChange={(e) => updateCompanyProfile({ industry: e.target.value as Industry })}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {INDUSTRIES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Organization Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Organization Size</label>
          <select
            value={profile.size}
            onChange={(e) => updateCompanyProfile({ size: e.target.value as OrganizationSize })}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {SIZES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium mb-2">Primary Region</label>
          <select
            value={profile.region}
            onChange={(e) => updateCompanyProfile({ region: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Maturity Level */}
        <div>
          <label className="block text-sm font-medium mb-2">Maturity Level</label>
          <select
            value={profile.maturity}
            onChange={(e) => updateCompanyProfile({ maturity: e.target.value as MaturityLevel })}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {MATURITY_LEVELS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Years in Operation */}
        <div>
          <label className="block text-sm font-medium mb-2">Years in Operation</label>
          <input
            type="number"
            value={profile.years_in_operation}
            onChange={(e) => updateCompanyProfile({ years_in_operation: parseInt(e.target.value) || 0 })}
            min={0}
            max={200}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Annual Revenue Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Annual Revenue Range</label>
          <select
            value={profile.annual_revenue_range}
            onChange={(e) => updateCompanyProfile({ annual_revenue_range: e.target.value as RevenueRange })}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {REVENUE_RANGES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Business Model */}
        <div>
          <label className="block text-sm font-medium mb-2">Business Model</label>
          <select
            value={profile.business_model}
            onChange={(e) => updateCompanyProfile({ business_model: e.target.value as BusinessModel })}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {BUSINESS_MODELS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Primary Market */}
        <div>
          <label className="block text-sm font-medium mb-2">Primary Market</label>
          <input
            type="text"
            value={profile.primary_market}
            onChange={(e) => updateCompanyProfile({ primary_market: e.target.value })}
            placeholder="e.g., B2B Enterprise, Consumer, SMB"
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
        <p className="text-sm text-teal-400">
          This information helps us calibrate our diagnostic algorithms to your specific context and industry benchmarks.
        </p>
      </div>
    </div>
  );
}
