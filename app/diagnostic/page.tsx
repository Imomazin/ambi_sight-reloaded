'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import { useAppState } from '@/state/useAppState';
import DiagnosticTrendChart from '@/components/diagnostic/DiagnosticTrendChart';

export default function DiagnosticPage() {
  const router = useRouter();
  const { currentUser } = useAppState();
  const { savedIntakes, savedResults, deleteIntake, loadIntake } = useDiagnosticStore();

  // Create a mapping of intake IDs to organization names for the trend chart
  const organizationNames = useMemo(() => {
    return savedIntakes.reduce((acc, intake) => {
      acc[intake.id] = intake.organization_name;
      return acc;
    }, {} as Record<string, string>);
  }, [savedIntakes]);

  const getResultForIntake = (intakeId: string) => {
    return savedResults.find((r) => r.intake_id === intakeId);
  };

  const handleStartNew = () => {
    router.push('/diagnostic/new');
  };

  const handleViewResult = (intakeId: string) => {
    const result = getResultForIntake(intakeId);
    if (result) {
      router.push(`/diagnostic/results/${result.id}`);
    }
  };

  const handleEditIntake = (intakeId: string) => {
    loadIntake(intakeId);
    router.push(`/diagnostic/new?id=${intakeId}`);
  };

  const handleDelete = (intakeId: string) => {
    if (confirm('Are you sure you want to delete this diagnostic? This cannot be undone.')) {
      deleteIntake(intakeId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Strategic Diagnostics</h1>
            <p className="text-[var(--text-muted)]">
              Analyze your organization&apos;s strategic health and get actionable recommendations
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="btn-primary px-6 py-3"
          >
            + New Diagnostic
          </button>
        </div>

        {/* Trend Chart - Show when we have completed diagnostics */}
        {savedResults.length > 0 && (
          <div className="mb-8">
            <DiagnosticTrendChart
              results={savedResults}
              organizationNames={organizationNames}
            />
          </div>
        )}

        {/* Empty State */}
        {savedIntakes.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">No Diagnostics Yet</h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              Start your first strategic diagnostic to analyze your organization&apos;s performance, risks, and opportunities.
            </p>
            <button
              onClick={handleStartNew}
              className="btn-primary px-8 py-3"
            >
              Start Your First Diagnostic
            </button>
          </div>
        )}

        {/* Diagnostics List */}
        {savedIntakes.length > 0 && (
          <div className="space-y-4">
            {savedIntakes
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
              .map((intake) => {
                const result = getResultForIntake(intake.id);
                return (
                  <div
                    key={intake.id}
                    className="card p-6 hover:border-teal-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {intake.organization_name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              intake.completed
                                ? 'bg-lime-500/20 text-lime-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {intake.completed ? 'Completed' : 'Draft'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                          <span>{intake.company_profile.industry}</span>
                          <span>•</span>
                          <span>{intake.company_profile.size}</span>
                          <span>•</span>
                          <span>{intake.company_profile.region}</span>
                        </div>

                        {/* Score Preview */}
                        {result && (
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${
                                result.status_indicators.overall === 'green'
                                  ? 'bg-lime-500'
                                  : result.status_indicators.overall === 'amber'
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`} />
                              <span className="text-sm">
                                Overall Health: <strong>{result.scores.overall_health}</strong>/100
                              </span>
                            </div>
                            <div className="text-sm text-[var(--text-muted)]">
                              Performance: {result.scores.performance_score} |
                              Risk: {result.scores.threat_score} |
                              Alignment: {result.scores.alignment_score}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-[var(--text-muted)] mt-3">
                          Last updated: {formatDate(intake.updated_at)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {intake.completed && result ? (
                          <button
                            onClick={() => handleViewResult(intake.id)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            View Results
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditIntake(intake.id)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            Continue
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(intake.id)}
                          className="text-[var(--text-muted)] hover:text-red-400 p-2 transition-colors"
                          title="Delete diagnostic"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Quick Stats */}
        {savedIntakes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-teal-400">{savedIntakes.length}</div>
              <div className="text-sm text-[var(--text-muted)]">Total Diagnostics</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-lime-400">
                {savedIntakes.filter((i) => i.completed).length}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Completed</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">
                {savedIntakes.filter((i) => !i.completed).length}
              </div>
              <div className="text-sm text-[var(--text-muted)]">In Progress</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">
                {savedResults.reduce((acc, r) => acc + r.recommended_tools.length, 0)}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Tools Recommended</div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
