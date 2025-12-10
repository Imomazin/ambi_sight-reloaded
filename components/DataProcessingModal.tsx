'use client';

import { useState, useEffect } from 'react';

interface ProcessingStage {
  id: string;
  label: string;
  description: string;
  icon: string;
  duration: number;
}

const processingStages: ProcessingStage[] = [
  {
    id: 'upload',
    label: 'Uploading',
    description: 'Securely transferring your data...',
    icon: '📤',
    duration: 1500,
  },
  {
    id: 'validate',
    label: 'Validating',
    description: 'Checking data format and integrity...',
    icon: '🔍',
    duration: 2000,
  },
  {
    id: 'preprocess',
    label: 'Preprocessing',
    description: 'Cleaning and normalizing data...',
    icon: '🧹',
    duration: 2500,
  },
  {
    id: 'analyze',
    label: 'AI Analysis',
    description: 'Running strategic intelligence analysis...',
    icon: '🧠',
    duration: 3000,
  },
  {
    id: 'insights',
    label: 'Generating Insights',
    description: 'Extracting key patterns and recommendations...',
    icon: '💡',
    duration: 2000,
  },
  {
    id: 'complete',
    label: 'Complete',
    description: 'Analysis ready for review!',
    icon: '✅',
    duration: 0,
  },
];

export interface AnalysisResult {
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  metrics: { label: string; value: string; change?: string }[];
  confidence: number;
}

interface DataProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  onComplete: (result: AnalysisResult) => void;
}

export default function DataProcessingModal({
  isOpen,
  onClose,
  fileName,
  onComplete,
}: DataProcessingModalProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setCurrentStageIndex(0);
      setProgress(0);
      setIsComplete(false);
      setResult(null);
      return;
    }

    // Progress through stages
    if (currentStageIndex < processingStages.length - 1) {
      const stage = processingStages[currentStageIndex];
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, stage.duration / 50);

      const stageTimeout = setTimeout(() => {
        setProgress(0);
        setCurrentStageIndex((prev) => prev + 1);
      }, stage.duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(stageTimeout);
      };
    } else if (currentStageIndex === processingStages.length - 1 && !isComplete) {
      // Generate mock analysis result
      const mockResult: AnalysisResult = {
        summary: `Analysis of "${fileName}" reveals significant strategic opportunities. The data indicates strong market positioning with room for optimization in key operational areas.`,
        keyInsights: [
          'Market share growth potential of 15-20% identified in underserved segments',
          'Operational efficiency gaps suggest 12% cost reduction opportunity',
          'Customer retention metrics trending positively (+8% YoY)',
          'Competitive pressure increasing in core markets',
          'Technology adoption rate ahead of industry average',
        ],
        recommendations: [
          'Prioritize expansion into identified high-growth segments',
          'Implement process automation in flagged operational areas',
          'Develop customer loyalty program to capitalize on retention trends',
          'Consider strategic partnerships to address competitive threats',
          'Invest in emerging technology capabilities',
        ],
        metrics: [
          { label: 'Data Quality Score', value: '94%', change: '+5%' },
          { label: 'Strategic Alignment', value: 'High', change: '' },
          { label: 'Risk Assessment', value: 'Moderate', change: '-2 levels' },
          { label: 'Opportunity Index', value: '8.4/10', change: '+1.2' },
        ],
        confidence: 87,
      };

      setResult(mockResult);
      setIsComplete(true);
      onComplete(mockResult);
    }
  }, [isOpen, currentStageIndex, isComplete, fileName, onComplete]);

  if (!isOpen) return null;

  const currentStage = processingStages[currentStageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isComplete ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {isComplete ? 'Analysis Complete' : 'Processing Data'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {fileName}
              </p>
            </div>
            {isComplete && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isComplete ? (
            <>
              {/* Processing Animation */}
              <div className="flex flex-col items-center py-8">
                {/* Animated Icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl animate-pulse">{currentStage.icon}</span>
                  </div>
                  {/* Spinning Ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>

                {/* Stage Info */}
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {currentStage.label}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  {currentStage.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-purple-500 transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
                    <span>Step {currentStageIndex + 1} of {processingStages.length}</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </div>

              {/* Stage Timeline */}
              <div className="flex justify-between items-center mt-8 px-4">
                {processingStages.slice(0, -1).map((stage, idx) => (
                  <div key={stage.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                        idx < currentStageIndex
                          ? 'bg-teal-500 text-white'
                          : idx === currentStageIndex
                          ? 'bg-teal-500/20 text-teal-400 ring-2 ring-teal-500'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}
                    >
                      {idx < currentStageIndex ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{stage.icon}</span>
                      )}
                    </div>
                    {idx < processingStages.length - 2 && (
                      <div
                        className={`w-8 sm:w-16 h-0.5 mx-1 transition-colors ${
                          idx < currentStageIndex ? 'bg-teal-500' : 'bg-[var(--bg-secondary)]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              {/* Success Header */}
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-400">Analysis Complete</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Confidence Score: {result?.confidence}%
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Summary
                </h4>
                <p className="text-[var(--text-secondary)]">{result?.summary}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {result?.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                    <div className="text-xs text-[var(--text-muted)] mb-1">{metric.label}</div>
                    <div className="text-lg font-semibold text-[var(--text-primary)]">{metric.value}</div>
                    {metric.change && (
                      <div className="text-xs text-teal-400">{metric.change}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Insights */}
              <div>
                <h4 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {result?.keyInsights.slice(0, 3).map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-teal-400 mt-0.5">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-teal-500 hover:bg-teal-400 text-white font-medium rounded-xl transition-colors"
                >
                  View Full Report
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-medium rounded-xl border border-[var(--border-color)] transition-colors"
                >
                  Download Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
