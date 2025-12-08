'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosticStore } from '@/state/useDiagnosticStore';
import { useAppState } from '@/state/useAppState';
import CompanyProfileStep from './steps/CompanyProfileStep';
import PerformanceKPIsStep from './steps/PerformanceKPIsStep';
import RiskSignalsStep from './steps/RiskSignalsStep';
import PrioritiesStep from './steps/PrioritiesStep';
import ConstraintsStep from './steps/ConstraintsStep';

const STEPS = [
  { id: 0, title: 'Company Profile', description: 'Tell us about your organization' },
  { id: 1, title: 'Performance KPIs', description: 'Key performance indicators' },
  { id: 2, title: 'Risk Signals', description: 'Assess your risk landscape' },
  { id: 3, title: 'Strategic Priorities', description: 'Define what matters most' },
  { id: 4, title: 'Constraints', description: 'Budget, time, and capabilities' },
];

interface IntakeWizardProps {
  intakeId?: string;
}

export default function IntakeWizard({ intakeId }: IntakeWizardProps) {
  const router = useRouter();
  const { currentUser } = useAppState();
  const {
    currentIntake,
    currentStep,
    startNewIntake,
    loadIntake,
    setStep,
    nextStep,
    prevStep,
    saveIntakeDraft,
    completeIntake,
    resetCurrentIntake,
  } = useDiagnosticStore();

  const [organizationName, setOrganizationName] = useState('');
  const [isStarting, setIsStarting] = useState(!intakeId);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (intakeId) {
      loadIntake(intakeId);
      setIsStarting(false);
    }
  }, [intakeId, loadIntake]);

  useEffect(() => {
    if (currentIntake?.organization_name) {
      setOrganizationName(currentIntake.organization_name);
      setIsStarting(false);
    }
  }, [currentIntake?.organization_name]);

  const handleStart = () => {
    if (!organizationName.trim()) return;
    const userId = currentUser?.id || 'demo-user';
    startNewIntake(userId, organizationName.trim());
    setIsStarting(false);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    saveIntakeDraft();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
    setIsSaving(false);
  };

  const handleComplete = () => {
    const result = completeIntake();
    if (result) {
      router.push(`/diagnostic/results/${result.id}`);
    }
  };

  const handleCancel = () => {
    resetCurrentIntake();
    router.push('/diagnostic');
  };

  // Starting screen
  if (isStarting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">Start New Diagnostic</h2>
          <p className="text-[var(--text-muted)] mb-6">
            Enter your organization name to begin the strategic diagnostic assessment.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!organizationName.trim()}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Begin Diagnostic
            </button>

            <button
              onClick={() => router.push('/diagnostic')}
              className="w-full btn-secondary py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentIntake) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">Loading diagnostic...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyProfileStep />;
      case 1:
        return <PerformanceKPIsStep />;
      case 2:
        return <RiskSignalsStep />;
      case 3:
        return <PrioritiesStep />;
      case 4:
        return <ConstraintsStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {currentIntake.organization_name}
            </h1>
            <p className="text-[var(--text-muted)]">Strategic Diagnostic Assessment</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="btn-secondary px-4 py-2 text-sm"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleCancel}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] px-4 py-2 text-sm"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full ${
                  index === currentStep
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : index < currentStep
                    ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  index < currentStep ? 'bg-lime-500 text-navy-900' : ''
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </span>
                <span className="text-sm font-medium hidden md:block">{step.title}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${
                  index < currentStep ? 'bg-lime-500' : 'bg-[var(--border-color)]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{STEPS[currentStep].title}</h2>
          <p className="text-[var(--text-muted)]">{STEPS[currentStep].description}</p>
        </div>

        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-sm text-[var(--text-muted)]">
          Step {currentStep + 1} of {STEPS.length}
        </span>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            className="btn-primary px-6 py-2"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="bg-lime-500 hover:bg-lime-400 text-navy-900 font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Complete Diagnostic
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 bg-lime-500/20 text-lime-400 border border-lime-500/30 px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          Draft saved successfully
        </div>
      )}
    </div>
  );
}
