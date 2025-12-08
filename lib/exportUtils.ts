// Export utilities for diagnostic data

import type { DiagnosticIntake, DiagnosticResult } from './database.types';

export interface ExportData {
  intake: DiagnosticIntake;
  result: DiagnosticResult;
}

// CSV Export Functions
export function exportToCSV(data: ExportData, filename?: string): void {
  const { intake, result } = data;

  // Build CSV content
  const rows: string[][] = [
    // Header section
    ['AmbiSight Strategic Diagnostic Report'],
    ['Generated', new Date().toISOString()],
    [''],

    // Company Profile
    ['COMPANY PROFILE'],
    ['Organization Name', intake.organization_name],
    ['Industry', intake.company_profile.industry],
    ['Size', intake.company_profile.size],
    ['Region', intake.company_profile.region],
    ['Business Model', intake.company_profile.business_model],
    ['Maturity', intake.company_profile.maturity],
    [''],

    // Scores
    ['DIAGNOSTIC SCORES'],
    ['Score Type', 'Value', 'Status'],
    ['Overall Health', String(result.scores.overall_health), result.status_indicators.overall],
    ['Performance Score', String(result.scores.performance_score), result.status_indicators.performance],
    ['Threat Score', String(result.scores.threat_score), result.status_indicators.risk],
    ['Alignment Score', String(result.scores.alignment_score), result.status_indicators.alignment],
    ['Readiness Score', String(result.scores.readiness_score), result.status_indicators.readiness],
    [''],

    // KPIs
    ['PERFORMANCE KPIS'],
    ['Metric', 'Value', 'Trend'],
    ['Revenue Growth', String(intake.performance_kpis.revenue_growth.value), intake.performance_kpis.revenue_growth.trend],
    ['Gross Margin', String(intake.performance_kpis.gross_margin.value), intake.performance_kpis.gross_margin.trend],
    ['Operating Margin', String(intake.performance_kpis.operating_margin.value), intake.performance_kpis.operating_margin.trend],
    ['Market Share', String(intake.performance_kpis.market_share.value), intake.performance_kpis.market_share.trend],
    ['Customer Satisfaction', String(intake.performance_kpis.customer_satisfaction.value), intake.performance_kpis.customer_satisfaction.trend],
    ['Employee Productivity', String(intake.performance_kpis.employee_productivity.value), intake.performance_kpis.employee_productivity.trend],
    [''],

    // Risk Signals
    ['RISK SIGNALS'],
    ['Risk Type', 'Score (1-5)', 'Trend'],
    ['Market Risk', String(intake.risk_signals.market_risk.score), intake.risk_signals.market_risk.trend],
    ['Operational Risk', String(intake.risk_signals.operational_risk.score), intake.risk_signals.operational_risk.trend],
    ['Financial Risk', String(intake.risk_signals.financial_risk.score), intake.risk_signals.financial_risk.trend],
    ['Competitive Risk', String(intake.risk_signals.competitive_risk.score), intake.risk_signals.competitive_risk.trend],
    ['Regulatory Risk', String(intake.risk_signals.regulatory_risk.score), intake.risk_signals.regulatory_risk.trend],
    ['Technology Disruption', String(intake.risk_signals.technology_disruption.score), intake.risk_signals.technology_disruption.trend],
    [''],

    // Insights
    ['GENERATED INSIGHTS'],
    ['Type', 'Title', 'Description', 'Priority', 'Related Area'],
    ...result.insights.map(insight => [
      insight.type,
      insight.title,
      insight.description,
      insight.priority,
      insight.related_area,
    ]),
    [''],

    // Tool Recommendations
    ['RECOMMENDED TOOLS'],
    ['Tool Name', 'Category', 'Relevance Score', 'Reason'],
    ...result.recommended_tools.map(tool => [
      tool.tool_name,
      tool.category,
      String(tool.relevance_score),
      tool.reason,
    ]),
  ];

  // Convert to CSV string
  const csvContent = rows
    .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Download file
  downloadFile(
    csvContent,
    filename || `diagnostic-${intake.organization_name.toLowerCase().replace(/\s+/g, '-')}-${formatDateForFilename(result.created_at)}.csv`,
    'text/csv;charset=utf-8;'
  );
}

// JSON Export
export function exportToJSON(data: ExportData, filename?: string): void {
  const { intake, result } = data;

  const exportObj = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    diagnostic: {
      intake,
      result,
    },
  };

  downloadFile(
    JSON.stringify(exportObj, null, 2),
    filename || `diagnostic-${intake.organization_name.toLowerCase().replace(/\s+/g, '-')}-${formatDateForFilename(result.created_at)}.json`,
    'application/json'
  );
}

// Summary export (simplified CSV)
export function exportSummaryCSV(results: DiagnosticResult[], intakes: Record<string, DiagnosticIntake>): void {
  const rows: string[][] = [
    ['AmbiSight Diagnostic Summary'],
    ['Generated', new Date().toISOString()],
    [''],
    ['Organization', 'Industry', 'Overall Health', 'Performance', 'Threat', 'Alignment', 'Readiness', 'Date'],
    ...results.map(result => {
      const intake = intakes[result.intake_id];
      return [
        intake?.organization_name || 'Unknown',
        intake?.company_profile.industry || '',
        String(result.scores.overall_health),
        String(result.scores.performance_score),
        String(result.scores.threat_score),
        String(result.scores.alignment_score),
        String(result.scores.readiness_score),
        formatDate(result.created_at),
      ];
    }),
  ];

  const csvContent = rows
    .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  downloadFile(
    csvContent,
    `diagnostic-summary-${formatDateForFilename(new Date().toISOString())}.csv`,
    'text/csv;charset=utf-8;'
  );
}

// Print-friendly report generation (opens in new window for print/PDF)
export function generatePrintableReport(data: ExportData): void {
  const { intake, result } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Strategic Diagnostic Report - ${intake.organization_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #1a1a2e;
      line-height: 1.6;
    }
    .header {
      border-bottom: 3px solid #14b8a6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #14b8a6;
    }
    .title {
      font-size: 28px;
      margin-top: 10px;
    }
    .date {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #14b8a6;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .metric-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .score-green { color: #22c55e; }
    .score-amber { color: #f59e0b; }
    .score-red { color: #ef4444; }
    .insight-card {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      border-left: 3px solid #14b8a6;
    }
    .insight-title { font-weight: 600; }
    .insight-desc { font-size: 14px; color: #444; margin-top: 5px; }
    .tag {
      display: inline-block;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      margin-right: 5px;
    }
    .tag-concern { background: #fee2e2; color: #dc2626; }
    .tag-opportunity { background: #d1fae5; color: #059669; }
    .tag-recommendation { background: #dbeafe; color: #2563eb; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AmbiSight</div>
    <h1 class="title">${intake.organization_name}</h1>
    <div class="date">Strategic Diagnostic Report | ${formatDate(result.created_at)}</div>
  </div>

  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <div class="grid-4">
      <div class="metric-card">
        <div class="metric-value ${getScoreClass(result.scores.overall_health)}">${result.scores.overall_health}</div>
        <div class="metric-label">Overall Health</div>
      </div>
      <div class="metric-card">
        <div class="metric-value ${getScoreClass(result.scores.performance_score)}">${result.scores.performance_score}</div>
        <div class="metric-label">Performance</div>
      </div>
      <div class="metric-card">
        <div class="metric-value ${getScoreClass(100 - result.scores.threat_score)}">${result.scores.threat_score}</div>
        <div class="metric-label">Threat Level</div>
      </div>
      <div class="metric-card">
        <div class="metric-value ${getScoreClass(result.scores.alignment_score)}">${result.scores.alignment_score}</div>
        <div class="metric-label">Alignment</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Company Profile</h2>
    <div class="grid-2">
      <div><strong>Industry:</strong> ${intake.company_profile.industry}</div>
      <div><strong>Size:</strong> ${intake.company_profile.size}</div>
      <div><strong>Region:</strong> ${intake.company_profile.region}</div>
      <div><strong>Business Model:</strong> ${intake.company_profile.business_model}</div>
      <div><strong>Maturity:</strong> ${intake.company_profile.maturity}</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Key Insights (${result.insights.length})</h2>
    ${result.insights.slice(0, 6).map(insight => `
      <div class="insight-card">
        <span class="tag tag-${insight.type}">${insight.type}</span>
        <span class="insight-title">${insight.title}</span>
        <div class="insight-desc">${insight.description}</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">Recommended Tools (Top 5)</h2>
    <table>
      <thead>
        <tr>
          <th>Tool</th>
          <th>Category</th>
          <th>Match</th>
        </tr>
      </thead>
      <tbody>
        ${result.recommended_tools.slice(0, 5).map(tool => `
          <tr>
            <td>${tool.tool_name}</td>
            <td>${tool.category}</td>
            <td>${tool.relevance_score}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2 class="section-title">Performance KPIs</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Revenue Growth</td>
          <td>${intake.performance_kpis.revenue_growth.value}%</td>
          <td>${intake.performance_kpis.revenue_growth.trend}</td>
        </tr>
        <tr>
          <td>Gross Margin</td>
          <td>${intake.performance_kpis.gross_margin.value}%</td>
          <td>${intake.performance_kpis.gross_margin.trend}</td>
        </tr>
        <tr>
          <td>Market Share</td>
          <td>${intake.performance_kpis.market_share.value}%</td>
          <td>${intake.performance_kpis.market_share.trend}</td>
        </tr>
        <tr>
          <td>Customer Satisfaction</td>
          <td>${intake.performance_kpis.customer_satisfaction.value}</td>
          <td>${intake.performance_kpis.customer_satisfaction.trend}</td>
        </tr>
        <tr>
          <td>Employee Productivity</td>
          <td>${intake.performance_kpis.employee_productivity.value}</td>
          <td>${intake.performance_kpis.employee_productivity.trend}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Generated by AmbiSight | ${new Date().toLocaleDateString()}</p>
    <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #14b8a6; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>
  `;

  // Open in new window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

// Helper functions
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateForFilename(dateString: string): string {
  return new Date(dateString).toISOString().split('T')[0];
}

function getScoreClass(score: number): string {
  if (score >= 70) return 'score-green';
  if (score >= 40) return 'score-amber';
  return 'score-red';
}
