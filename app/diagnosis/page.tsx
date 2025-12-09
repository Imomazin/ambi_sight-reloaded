'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  challengeCategories,
  urgencyLevels,
  scopeLevels,
  capabilityQuestions,
  wizardSteps,
  generateDiagnosisResult,
  type ChallengeCategory,
  type UrgencyLevel,
  type ScopeLevel,
  type DiagnosisResult,
} from '../../lib/diagnosticWizard';
import { useAppState } from '../../state/useAppState';
import { planColors, complexityColors } from '../../lib/strategyToolsLibrary';
import type { Plan } from '../../lib/users';

// Progress Bar Component
function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {wizardSteps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                idx < currentStep
                  ? 'bg-green-500 text-white'
                  : idx === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            {idx < wizardSteps.length - 1 && (
              <div
                className={`w-12 sm:w-24 h-1 mx-2 rounded transition-colors ${
                  idx < currentStep ? 'bg-green-500' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        {wizardSteps.map((step, idx) => (
          <span key={step.id} className={`${idx === currentStep ? 'text-blue-400' : ''} hidden sm:block`}>
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );
}

// Step 1: Challenge Selection (Multiple)
function ChallengeStep({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What strategic challenges are you facing?</h2>
        <p className="text-slate-400">Select all that apply - you can choose multiple challenges</p>
        {selected.length > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm">
            <span>{selected.length} selected</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challengeCategories.map(cat => {
          const isSelected = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`text-left p-5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-teal-600/20 border-teal-500 ring-2 ring-teal-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <span className="text-3xl">{cat.icon}</span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{cat.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.examples.slice(0, 2).map((ex, idx) => (
                      <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 2: Urgency Selection
function UrgencyStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">How urgent is this challenge?</h2>
        <p className="text-slate-400">This helps us prioritize tools based on time constraints</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {urgencyLevels.map(level => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`text-left p-5 rounded-xl border transition-all ${
              selected === level.id
                ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{level.icon}</span>
              <h3 className="font-semibold text-white">{level.title}</h3>
            </div>
            <p className="text-sm text-slate-400">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Scope Selection
function ScopeStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What is the scope of this challenge?</h2>
        <p className="text-slate-400">Understanding scope helps us recommend appropriately scaled tools</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {scopeLevels.map(level => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`text-left p-5 rounded-xl border transition-all ${
              selected === level.id
                ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{level.icon}</span>
              <h3 className="font-semibold text-white">{level.title}</h3>
            </div>
            <p className="text-sm text-slate-400">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 4: Capability Questions
function CapabilitiesStep({
  answers,
  onAnswer,
}: {
  answers: Record<string, string>;
  onAnswer: (questionId: string, answerId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about your current capabilities</h2>
        <p className="text-slate-400">This helps us match tools to your organizational maturity</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-8">
        {capabilityQuestions.map((q, qIdx) => (
          <div key={q.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="font-medium text-white mb-4">
              {qIdx + 1}. {q.question}
            </h3>
            <div className="space-y-2">
              {q.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onAnswer(q.id, opt.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    answers[q.id] === opt.id
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        answers[q.id] === opt.id ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                      }`}
                    >
                      {answers[q.id] === opt.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 5: Results
function ResultsStep({
  result,
  userPlan,
}: {
  result: DiagnosisResult;
  userPlan: Plan;
}) {
  const maturityLabels = ['', 'Basic', 'Developing', 'Advanced', 'Leading'];
  const maturityLabel = maturityLabels[Math.round(result.overallMaturity)] || 'Developing';

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
          <span>✓</span>
          <span className="font-medium">Diagnosis Complete</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Personalized Recommendations</h2>
        <p className="text-slate-400">Based on your inputs, here are the tools we recommend</p>
      </div>

      {/* Diagnosis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl mb-2">{result.primaryChallenge.icon}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Challenge</div>
          <div className="text-sm font-medium text-white">{result.primaryChallenge.title}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl mb-2">{result.urgency.icon}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Urgency</div>
          <div className="text-sm font-medium text-white">{result.urgency.title}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl mb-2">{result.scope.icon}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Scope</div>
          <div className="text-sm font-medium text-white">{result.scope.title}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Maturity</div>
          <div className="text-sm font-medium text-white">{maturityLabel}</div>
        </div>
      </div>

      {/* Suggested Approach */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <span>💡</span> Suggested Approach
        </h3>
        <p className="text-slate-300 mb-4">{result.suggestedApproach}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Estimated: <span className="text-white">{result.estimatedTimeframe}</span></span>
          </div>
        </div>
      </div>

      {/* Recommended Tools */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> Recommended Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.recommendedTools.map((tool, idx) => (
            <Link
              key={tool.id}
              href="/tools"
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {idx === 0 && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        Start Here
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-white truncate">{tool.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tool.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${complexityColors[tool.complexity]}`}>
                      {tool.complexity}
                    </span>
                    <span className="text-xs text-slate-500">{tool.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      {result.quickWins.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Wins
            <span className="text-xs font-normal text-slate-400">(Easy to start, fast results)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {result.quickWins.map(tool => (
              <Link
                key={tool.id}
                href="/tools"
                className="inline-flex items-center gap-2 bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-2 hover:bg-green-900/30 transition-colors"
              >
                <span>{tool.icon}</span>
                <span className="text-green-300">{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Tools */}
      {result.advancedTools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🚀</span> Advanced Tools
            <span className="text-xs font-normal text-slate-400">(For deeper analysis)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {result.advancedTools.map(tool => (
              <Link
                key={tool.id}
                href="/tools"
                className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 hover:bg-purple-900/30 transition-colors"
              >
                <span>{tool.icon}</span>
                <span className="text-purple-300">{tool.name}</span>
                {tool.requiredPlan !== 'Free' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${planColors[tool.requiredPlan]}`}>
                    {tool.requiredPlan}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📋</span> Next Steps
        </h3>
        <ol className="space-y-3">
          {result.nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm">
                {idx + 1}
              </span>
              <span className="text-slate-300">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Consulting CTA */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Need Expert Guidance?</h3>
        <p className="text-slate-300 mb-4">
          Our strategy consultants can help you implement these tools and accelerate your results.
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-lg transition-all">
          Request Consulting Sprint
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/tools"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg transition-colors text-center"
        >
          Browse All Tools
        </Link>
        <Link
          href="/workspace"
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-3 rounded-lg border border-slate-700 transition-colors text-center"
        >
          Open Workspace
        </Link>
      </div>
    </div>
  );
}

// Main Page Component
export default function DiagnosisPage() {
  const { currentUser } = useAppState();
  const userPlan = currentUser?.plan || 'Free';

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const [capabilityAnswers, setCapabilityAnswers] = useState<Record<string, string>>({});

  // Toggle challenge selection (multiple allowed)
  const handleChallengeToggle = (id: string) => {
    setSelectedChallenges(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  // Check if current step is complete
  const isStepComplete = useMemo(() => {
    switch (currentStep) {
      case 0:
        return selectedChallenges.length > 0;
      case 1:
        return selectedUrgency !== null;
      case 2:
        return selectedScope !== null;
      case 3:
        return capabilityQuestions.every(q => capabilityAnswers[q.id]);
      default:
        return true;
    }
  }, [currentStep, selectedChallenges, selectedUrgency, selectedScope, capabilityAnswers]);

  // Generate results when on last step (use first challenge as primary)
  const diagnosisResult = useMemo(() => {
    if (currentStep === 4 && selectedChallenges.length > 0 && selectedUrgency && selectedScope) {
      return generateDiagnosisResult(
        selectedChallenges[0], // Primary challenge
        selectedUrgency,
        selectedScope,
        capabilityAnswers,
        userPlan,
        selectedChallenges // Pass all challenges for enhanced results
      );
    }
    return null;
  }, [currentStep, selectedChallenges, selectedUrgency, selectedScope, capabilityAnswers, userPlan]);

  const handleNext = () => {
    if (isStepComplete && currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedChallenges([]);
    setSelectedUrgency(null);
    setSelectedScope(null);
    setCapabilityAnswers({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-white">
                Lumina <span className="text-teal-500">S</span>
              </Link>
              <span className="text-slate-500">/</span>
              <h1 className="text-lg font-medium text-slate-300">Diagnostic Wizard</h1>
            </div>
            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
                <span className="text-sm text-slate-300">{currentUser.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${planColors[currentUser.plan]}`}>
                  {currentUser.plan}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <ProgressBar currentStep={currentStep} totalSteps={wizardSteps.length} />
        </div>

        {/* Step Content */}
        <div className="min-h-[500px]">
          {currentStep === 0 && (
            <ChallengeStep selected={selectedChallenges} onSelect={handleChallengeToggle} />
          )}
          {currentStep === 1 && (
            <UrgencyStep selected={selectedUrgency} onSelect={setSelectedUrgency} />
          )}
          {currentStep === 2 && (
            <ScopeStep selected={selectedScope} onSelect={setSelectedScope} />
          )}
          {currentStep === 3 && (
            <CapabilitiesStep
              answers={capabilityAnswers}
              onAnswer={(qId, aId) => setCapabilityAnswers(prev => ({ ...prev, [qId]: aId }))}
            />
          )}
          {currentStep === 4 && diagnosisResult && (
            <ResultsStep result={diagnosisResult} userPlan={userPlan} />
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-800">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepComplete}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isStepComplete
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 3 ? 'Get Recommendations' : 'Continue →'}
            </button>
          </div>
        )}

        {/* Restart Button (on results page) */}
        {currentStep === 4 && (
          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <button
              onClick={handleRestart}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Start New Diagnosis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
