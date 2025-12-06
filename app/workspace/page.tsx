'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import PageContainer from '@/components/PageContainer';

interface StrategyDocument {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  status: 'Active' | 'Draft' | 'Archived';
  icon: React.ReactNode;
  color: string;
  content: string;
}

const documents: StrategyDocument[] = [
  {
    id: 'strategic-plan',
    title: 'Strategic Plan',
    description: 'Core strategic objectives and initiatives for 2024-2026',
    lastUpdated: '2 days ago',
    status: 'Active',
    color: 'teal',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    content: `# Strategic Plan 2024-2026

## Executive Summary
Our strategic plan focuses on three core pillars: Digital Transformation, Market Expansion, and Operational Excellence.

## Key Objectives
1. **Digital Transformation** - Modernize our technology stack with AI-native solutions
2. **Market Expansion** - Expand into MENA region with strategic partnerships
3. **Operational Excellence** - Achieve 20% cost reduction through automation

## Timeline
- Q1 2024: Foundation & Planning
- Q2 2024: Implementation Phase 1
- Q3 2024: Market Entry
- Q4 2024: Scale & Optimize

## Success Metrics
- Revenue Growth: 25% YoY
- Customer Satisfaction: 85%+
- Employee Engagement: 80%+`,
  },
  {
    id: 'risk-register',
    title: 'Risk Register',
    description: 'Comprehensive risk assessment and mitigation strategies',
    lastUpdated: '1 week ago',
    status: 'Active',
    color: 'amber',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    content: `# Risk Register

## Critical Risks

### 1. Technology Dependency Risk
- **Probability:** Medium (40%)
- **Impact:** High
- **Mitigation:** Multi-vendor strategy, robust backup systems

### 2. Market Entry Risk (MENA)
- **Probability:** High (60%)
- **Impact:** High
- **Mitigation:** Phased approach, local partnerships

### 3. Talent Acquisition Risk
- **Probability:** Medium (50%)
- **Impact:** Medium
- **Mitigation:** Competitive compensation, remote work options

## Risk Monitoring
Weekly risk reviews with executive steering committee
Monthly board updates on critical risks`,
  },
  {
    id: 'stakeholder-map',
    title: 'Stakeholder Map',
    description: 'Key stakeholder relationships and engagement strategy',
    lastUpdated: '3 days ago',
    status: 'Active',
    color: 'purple',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    content: `# Stakeholder Map

## Executive Stakeholders
| Name | Role | Influence | Interest | Strategy |
|------|------|-----------|----------|----------|
| Sarah Chen | CSO | High | High | Regular updates |
| Michael Torres | CRO | High | High | Monthly reviews |
| Emily Park | VP Product | Medium | High | Weekly syncs |

## External Stakeholders
- Board of Directors (Quarterly)
- Key Investors (Monthly)
- Strategic Partners (Bi-weekly)
- Regulatory Bodies (As needed)

## Engagement Calendar
- Monday: Team standups
- Wednesday: Stakeholder updates
- Friday: Executive summary`,
  },
  {
    id: 'value-drivers',
    title: 'Value Drivers',
    description: 'Analysis of key value creation levers and opportunities',
    lastUpdated: '5 days ago',
    status: 'Draft',
    color: 'lime',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    content: `# Value Drivers Analysis

## Primary Value Drivers

### 1. Revenue Growth
- New market penetration
- Product innovation
- Customer expansion

### 2. Margin Improvement
- Process automation
- Supply chain optimization
- Workforce efficiency

### 3. Capital Efficiency
- Asset utilization
- Working capital management
- Strategic investments

## Value Creation Roadmap
Phase 1: Quick wins (0-6 months)
Phase 2: Foundation building (6-12 months)
Phase 3: Scale (12-24 months)

## Expected Impact
- Revenue: +$15M
- EBITDA: +$5M
- Cash Flow: +$3M`,
  },
];

export default function WorkspacePage() {
  const [selectedDoc, setSelectedDoc] = useState<StrategyDocument | null>(null);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
      lime: { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30' },
    };
    return colors[color] || colors.teal;
  };

  return (
    <AppShell>
      <PageContainer
        title="Workspace"
        subtitle="Access and manage your strategy documents"
      >
        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, index) => {
            const colors = getColorClasses(doc.color);
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-6 rounded-xl border text-left bg-navy-700 border-navy-600 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}>
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
                        {doc.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        doc.status === 'Active'
                          ? 'bg-green-500/20 text-green-400'
                          : doc.status === 'Draft'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{doc.description}</p>
                    <p className="text-xs text-gray-500">Updated {doc.lastUpdated}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Document Modal */}
        {selectedDoc && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedDoc(null)}
            />
            <div className="fixed inset-4 md:inset-10 lg:inset-20 bg-navy-800 rounded-2xl border border-navy-600 z-50 overflow-hidden animate-scale-in flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-navy-600">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${getColorClasses(selectedDoc.color).bg} flex items-center justify-center ${getColorClasses(selectedDoc.color).text}`}>
                    {selectedDoc.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedDoc.title}</h2>
                    <p className="text-sm text-gray-400">{selectedDoc.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                    {selectedDoc.content}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-navy-600 flex items-center justify-between">
                <p className="text-sm text-gray-500">Last updated {selectedDoc.lastUpdated}</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-navy-700 text-gray-300 rounded-lg hover:bg-navy-600 transition-colors">
                    Export
                  </button>
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors">
                    Edit Document
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </AppShell>
  );
}
