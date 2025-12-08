'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import DiagnosticHeatmap from '@/components/diagnostic/DiagnosticHeatmap';
import ScoreCard from '@/components/diagnostic/ScoreCard';
import InsightsList from '@/components/diagnostic/InsightsList';
import ToolRecommendations from '@/components/diagnostic/ToolRecommendations';
import ScenarioSimulator from '@/components/diagnostic/ScenarioSimulator';
import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import { useToast } from '@/components/Toast';
import { exportToCSV, exportToJSON, generatePrintableReport } from '@/lib/exportUtils';
import type { DiagnosticResult, DiagnosticIntake } from '@/lib/database.types';

export default function DiagnosticResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { savedResults, savedIntakes } = useDiagnosticStore();
  const toast = useToast();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [intake, setIntake] = useState<DiagnosticIntake | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'tools' | 'simulate'>('overview');

  useEffect(() => {
    const foundResult = savedResults.find((r) => r.id === params.id);
    if (foundResult) {
      setResult(foundResult);
      const foundIntake = savedIntakes.find((i) => i.id === foundResult.intake_id);
      if (foundIntake) {
        setIntake(foundIntake);
      }
    }
  }, [params.id, savedResults, savedIntakes]);

  if (!result || !intake) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)]">Diagnostic result not found</p>
            <button
              onClick={() => router.push('/diagnostic')}
              className="btn-primary mt-4"
            >
              Back to Diagnostics
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => router.push('/diagnostic')}
              className="text-sm text-[var(--text-muted)] hover:text-teal-400 mb-2 flex items-center gap-1"
            >
              ← Back to Diagnostics
            </button>
            <h1 className="text-2xl font-bold">{intake.organization_name}</h1>
            <p className="text-[var(--text-muted)]">
              Strategic Diagnostic Report • {formatDate(result.created_at)}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-xl z-50 animate-scale-up overflow-hidden">
                  <button
                    onClick={() => {
                      generatePrintableReport({ intake: intake!, result: result! });
                      setShowExportMenu(false);
                      toast.success('Report opened in new tab - use Print to save as PDF');
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      exportToCSV({ intake: intake!, result: result! });
                      setShowExportMenu(false);
                      toast.success('CSV file downloaded');
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportToJSON({ intake: intake!, result: result! });
                      setShowExportMenu(false);
                      toast.success('JSON file downloaded');
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Export as JSON
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-[var(--border-color)]">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'insights', label: 'Insights' },
            { id: 'tools', label: 'Recommended Tools' },
            { id: 'simulate', label: 'Scenario Simulator' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ScoreCard
                label="Overall Health"
                score={result.scores.overall_health}
                status={result.status_indicators.overall}
                isMain
              />
              <ScoreCard
                label="Performance"
                score={result.scores.performance_score}
                status={result.status_indicators.performance}
              />
              <ScoreCard
                label="Risk Level"
                score={result.scores.threat_score}
                status={result.status_indicators.risk}
                isInverse
              />
              <ScoreCard
                label="Alignment"
                score={result.scores.alignment_score}
                status={result.status_indicators.alignment}
              />
              <ScoreCard
                label="Readiness"
                score={result.scores.readiness_score}
                status={result.status_indicators.readiness}
              />
            </div>

            {/* Executive Summary */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Executive Summary</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {result.summary.executive_summary}
              </p>
            </div>

            {/* Heatmap */}
            <DiagnosticHeatmap intake={intake} result={result} />

            {/* Top Concerns & Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Top Concerns
                </h3>
                <ul className="space-y-3">
                  {result.summary.top_concerns.map((concern, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <span className="text-red-400 font-bold">{index + 1}</span>
                      <span className="text-[var(--text-secondary)]">{concern}</span>
                    </li>
                  ))}
                  {result.summary.top_concerns.length === 0 && (
                    <li className="text-[var(--text-muted)] text-sm">No major concerns identified</li>
                  )}
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-lime-500" />
                  Top Opportunities
                </h3>
                <ul className="space-y-3">
                  {result.summary.top_opportunities.map((opportunity, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-lime-500/10 border border-lime-500/20 rounded-lg"
                    >
                      <span className="text-lime-400 font-bold">{index + 1}</span>
                      <span className="text-[var(--text-secondary)]">{opportunity}</span>
                    </li>
                  ))}
                  {result.summary.top_opportunities.length === 0 && (
                    <li className="text-[var(--text-muted)] text-sm">No major opportunities identified</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Immediate Actions */}
            {result.summary.immediate_actions.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Immediate Actions Required</h3>
                <div className="flex flex-wrap gap-3">
                  {result.summary.immediate_actions.map((action, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-sm"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <InsightsList insights={result.insights} />
        )}

        {activeTab === 'tools' && (
          <ToolRecommendations recommendations={result.recommended_tools} />
        )}

        {activeTab === 'simulate' && (
          <ScenarioSimulator intakeId={intake.id} baseScores={result.scores} />
        )}
      </div>
    </AppShell>
  );
}
