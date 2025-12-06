'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'Welcome to Ambi-Sight',
    description: 'Explore the Strategy Workspace to see your portfolio health at a glance.',
    action: { label: 'Open Workspace', href: '/workspace' },
  },
  {
    id: 2,
    title: 'Try the AI Advisor',
    description: 'Ask questions about risk clusters and get intelligent recommendations.',
    action: { label: 'Ask a Question', href: '/advisor' },
  },
  {
    id: 3,
    title: 'Load a Scenario',
    description: 'See how different strategies impact your KPIs in real-time.',
    action: { label: 'View Scenarios', href: '/scenarios' },
  },
  {
    id: 4,
    title: 'Switch Personas',
    description: 'Use the persona switcher in the top right to see different views.',
    action: null,
  },
];

export default function OnboardingBanner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if onboarding was already dismissed
    const dismissed = localStorage.getItem('ambi-sight-onboarding-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('ambi-sight-onboarding-dismissed', 'true');
    setTimeout(() => setIsDismissed(true), 300);
  };

  if (isDismissed) return null;

  const step = steps[currentStep];

  return (
    <div
      className={`fixed bottom-6 left-6 z-[100] max-w-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-navy-700">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-teal-400' : 'bg-navy-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{step.description}</p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {step.action && (
              <Link
                href={step.action.href}
                className="px-4 py-2 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-lg border border-teal-500/30 hover:bg-teal-500/30 transition-colors"
              >
                {step.action.label}
              </Link>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-navy-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-navy-600 transition-colors"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
            </button>
            <button
              onClick={handleDismiss}
              className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
