'use client';

import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import type { BudgetConstraint, TimeConstraint, CapabilityConstraint } from '@/lib/database.types';

const BUDGET_OPTIONS: { value: BudgetConstraint; label: string; description: string }[] = [
  { value: 'very_limited', label: 'Very Limited', description: 'Under $100K' },
  { value: 'limited', label: 'Limited', description: '$100K - $500K' },
  { value: 'moderate', label: 'Moderate', description: '$500K - $2M' },
  { value: 'significant', label: 'Significant', description: '$2M - $10M' },
  { value: 'extensive', label: 'Extensive', description: '$10M+' },
];

const TIME_OPTIONS: { value: TimeConstraint; label: string; description: string }[] = [
  { value: 'urgent', label: 'Urgent', description: '0-3 months' },
  { value: 'short_term', label: 'Short Term', description: '3-6 months' },
  { value: 'medium_term', label: 'Medium Term', description: '6-12 months' },
  { value: 'long_term', label: 'Long Term', description: '12+ months' },
];

const CAPABILITY_OPTIONS: { value: CapabilityConstraint; label: string }[] = [
  { value: 'technical_expertise', label: 'Technical Expertise' },
  { value: 'leadership_capacity', label: 'Leadership Capacity' },
  { value: 'change_management', label: 'Change Management' },
  { value: 'data_analytics', label: 'Data & Analytics' },
  { value: 'digital_skills', label: 'Digital Skills' },
  { value: 'industry_knowledge', label: 'Industry Knowledge' },
  { value: 'project_management', label: 'Project Management' },
];

export default function ConstraintsStep() {
  const { currentIntake, updateConstraints } = useDiagnosticStore();
  const constraints = currentIntake?.constraints;

  if (!constraints) return null;

  const toggleCapability = (capability: CapabilityConstraint) => {
    const current = constraints.capability_constraints || [];
    if (current.includes(capability)) {
      updateConstraints({
        capability_constraints: current.filter((c) => c !== capability),
      });
    } else {
      updateConstraints({
        capability_constraints: [...current, capability],
      });
    }
  };

  const handleResourceConstraintChange = (value: string) => {
    const resources = value.split('\n').filter((r) => r.trim());
    updateConstraints({ resource_constraints: resources });
  };

  const handleRegulatoryConstraintChange = (value: string) => {
    const regulations = value.split('\n').filter((r) => r.trim());
    updateConstraints({ regulatory_constraints: regulations });
  };

  return (
    <div className="space-y-8">
      {/* Budget Constraint */}
      <div>
        <h3 className="text-lg font-medium mb-2">Budget for Strategic Initiatives</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          What is your available budget for strategic investments over the next 12 months?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {BUDGET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConstraints({ budget_constraint: option.value })}
              className={`p-4 rounded-lg border text-center transition-all ${
                constraints.budget_constraint === option.value
                  ? 'bg-teal-500/20 border-teal-500/50'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-teal-500/30'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Constraint */}
      <div>
        <h3 className="text-lg font-medium mb-2">Time Horizon</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          What is your expected timeframe for achieving strategic outcomes?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConstraints({ time_constraint: option.value })}
              className={`p-4 rounded-lg border text-center transition-all ${
                constraints.time_constraint === option.value
                  ? 'bg-teal-500/20 border-teal-500/50'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-teal-500/30'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Capability Constraints */}
      <div>
        <h3 className="text-lg font-medium mb-2">Capability Gaps</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Select any capability areas where your organization has significant gaps.
        </p>

        <div className="flex flex-wrap gap-2">
          {CAPABILITY_OPTIONS.map((option) => {
            const isSelected = constraints.capability_constraints?.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleCapability(option.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-amber-500/30'
                }`}
              >
                {isSelected && '✓ '}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Constraints */}
      <div>
        <h3 className="text-lg font-medium mb-2">Resource Constraints</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          List any specific resource limitations (one per line).
        </p>

        <textarea
          value={constraints.resource_constraints?.join('\n') || ''}
          onChange={(e) => handleResourceConstraintChange(e.target.value)}
          placeholder="e.g., Limited engineering capacity&#10;Key leader departing in Q2&#10;Legacy system dependencies"
          rows={4}
          className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      {/* Regulatory Constraints */}
      <div>
        <h3 className="text-lg font-medium mb-2">Regulatory Constraints</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          List any regulatory or compliance constraints (one per line).
        </p>

        <textarea
          value={constraints.regulatory_constraints?.join('\n') || ''}
          onChange={(e) => handleRegulatoryConstraintChange(e.target.value)}
          placeholder="e.g., GDPR compliance requirements&#10;Industry-specific licensing&#10;Export control restrictions"
          rows={4}
          className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
        <p className="text-sm text-lime-400">
          Understanding your constraints helps us recommend realistic and achievable strategic interventions.
        </p>
      </div>
    </div>
  );
}
