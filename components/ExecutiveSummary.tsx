'use client';

import React, { useState, useCallback } from 'react';

interface SummarySection {
  id: string;
  title: string;
  icon: string;
  content: string;
  metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  highlights?: string[];
  risks?: string[];
  recommendations?: string[];
}

interface ExecutiveReport {
  generatedAt: Date;
  period: string;
  overallHealth: number;
  healthTrend: 'improving' | 'stable' | 'declining';
  sections: SummarySection[];
}

function generateReport(): ExecutiveReport {
  return {
    generatedAt: new Date(),
    period: 'Q4 2024',
    overallHealth: 78,
    healthTrend: 'improving',
    sections: [
      {
        id: 'overview',
        title: 'Executive Overview',
        icon: '📊',
        content: 'The strategic portfolio demonstrates strong momentum with key initiatives tracking ahead of schedule. Digital transformation efforts are yielding measurable efficiency gains, while risk exposure remains within acceptable thresholds.',
        metrics: [
          { label: 'Strategic Agility Index', value: '72/100', trend: 'up' },
          { label: 'Portfolio Health Score', value: '78/100', trend: 'up' },
          { label: 'Risk Exposure Level', value: '45/100', trend: 'down' },
          { label: 'Execution Readiness', value: '68/100', trend: 'up' },
        ],
      },
      {
        id: 'highlights',
        title: 'Key Achievements',
        icon: '🏆',
        content: 'Notable progress across strategic priorities this quarter.',
        highlights: [
          'Digital Platform Launch completed 2 weeks ahead of schedule',
          'Customer satisfaction increased 12% following UX improvements',
          'Operational costs reduced by $2.4M through automation initiatives',
          'New market entry in Southeast Asia secured strategic partnerships',
          'Talent acquisition exceeded targets with 45 key hires',
        ],
      },
      {
        id: 'risks',
        title: 'Risk Assessment',
        icon: '⚠️',
        content: 'Current risk landscape and mitigation status.',
        risks: [
          'Supply chain disruptions remain elevated (Medium) - Diversification underway',
          'Cybersecurity threat level increased (High) - Enhanced protocols deployed',
          'Regulatory changes in EU markets (Medium) - Compliance review in progress',
          'Talent retention in tech roles (Low) - Competitive packages implemented',
        ],
        metrics: [
          { label: 'Critical Risks', value: '2', trend: 'stable' },
          { label: 'High Risks', value: '5', trend: 'down' },
          { label: 'Medium Risks', value: '12', trend: 'stable' },
          { label: 'Risks Mitigated', value: '8', trend: 'up' },
        ],
      },
      {
        id: 'recommendations',
        title: 'Strategic Recommendations',
        icon: '💡',
        content: 'AI-generated recommendations based on current portfolio analysis.',
        recommendations: [
          'Accelerate cloud migration timeline to capture efficiency gains earlier',
          'Consider increasing R&D allocation by 15% to maintain competitive advantage',
          'Implement cross-functional tiger teams for at-risk initiatives',
          'Explore strategic acquisition opportunities in adjacent markets',
          'Establish quarterly strategic review cadence with key stakeholders',
        ],
      },
      {
        id: 'outlook',
        title: 'Forward Outlook',
        icon: '🔮',
        content: 'Based on current trajectories and market conditions, the portfolio is positioned for continued growth. Key inflection points expected in Q1 2025 with the completion of major transformation initiatives.',
        metrics: [
          { label: '90-Day Outlook', value: 'Positive', trend: 'up' },
          { label: 'Resource Utilization', value: '85%', trend: 'up' },
          { label: 'Strategic Alignment', value: '92%', trend: 'stable' },
          { label: 'Stakeholder Confidence', value: '88%', trend: 'up' },
        ],
      },
    ],
  };
}

function MetricPill({ label, value, trend }: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-navy-600/50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">{value}</span>
        {trend && (
          <span className={`text-xs ${
            trend === 'up' ? 'text-green-400' :
            trend === 'down' ? 'text-red-400' : 'text-gray-500'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionCard({ section, isExpanded, onToggle }: {
  section: SummarySection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-navy-700/50 border border-navy-600 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-navy-600/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">{section.content}</p>

          {section.metrics && (
            <div className="bg-navy-800/50 rounded-lg p-3">
              {section.metrics.map(metric => (
                <MetricPill key={metric.label} {...metric} />
              ))}
            </div>
          )}

          {section.highlights && (
            <ul className="space-y-2">
              {section.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-gray-300">{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {section.risks && (
            <ul className="space-y-2">
              {section.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span className="text-gray-300">{risk}</span>
                </li>
              ))}
            </ul>
          )}

          {section.recommendations && (
            <ol className="space-y-2 list-decimal list-inside">
              {section.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-gray-300 pl-2">
                  {rec}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExecutiveSummary() {
  const [report, setReport] = useState<ExecutiveReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [exportFormat, setExportFormat] = useState<'pdf' | 'pptx' | 'docx'>('pdf');

  const generateSummary = useCallback(async () => {
    setIsGenerating(true);
    // Simulate AI generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setReport(generateReport());
    setIsGenerating(false);
    setExpandedSections(new Set(['overview']));
  }, []);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (report) {
      setExpandedSections(new Set(report.sections.map(s => s.id)));
    }
  }, [report]);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  return (
    <div className="bg-navy-800/50 border border-navy-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-navy-600 bg-gradient-to-r from-amber-900/20 to-purple-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Executive Summary Generator
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              AI-powered board-ready strategic reports
            </p>
          </div>
          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span>🤖</span>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!report && !isGenerating && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-navy-700/50 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Report Generated</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              Click "Generate Report" to create an AI-powered executive summary based on your current portfolio data and strategic metrics.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span>⚡</span> Real-time data
              </span>
              <span className="flex items-center gap-1">
                <span>🤖</span> AI-powered insights
              </span>
              <span className="flex items-center gap-1">
                <span>📊</span> Board-ready format
              </span>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Generating Executive Summary</h3>
            <p className="text-sm text-gray-400 mb-4">
              Analyzing portfolio data and generating insights...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {report && !isGenerating && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    report.overallHealth >= 70 ? 'text-green-400' :
                    report.overallHealth >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {report.overallHealth}
                  </div>
                  <div className="text-xs text-gray-500">Health Score</div>
                </div>
                <div className="h-12 w-px bg-navy-600" />
                <div>
                  <div className="text-sm text-gray-400">Report Period</div>
                  <div className="text-lg font-semibold text-white">{report.period}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.healthTrend === 'improving' ? 'bg-green-500/20 text-green-400' :
                  report.healthTrend === 'declining' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {report.healthTrend === 'improving' ? '↑ Improving' :
                   report.healthTrend === 'declining' ? '↓ Declining' : '→ Stable'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-navy-600 rounded-lg hover:bg-navy-700"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-navy-600 rounded-lg hover:bg-navy-700"
                >
                  Collapse All
                </button>
                <div className="flex items-center gap-1 bg-navy-700 rounded-lg p-1">
                  {(['pdf', 'pptx', 'docx'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        exportFormat === format
                          ? 'bg-teal-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {report.sections.map(section => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isExpanded={expandedSections.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-navy-600 text-xs text-gray-500">
              <span>Generated: {report.generatedAt.toLocaleString()}</span>
              <span>Powered by AmbiSight AI • Confidential</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
