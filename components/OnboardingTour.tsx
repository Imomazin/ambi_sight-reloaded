'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/state/useAppState';
import { useRouter } from 'next/navigation';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Lumina S!',
    description: 'Your AI-powered strategic business intelligence platform. Let me show you around.',
    icon: '👋',
  },
  {
    id: 'diagnosis',
    title: 'Start with Diagnosis',
    description: 'Begin your journey by running a comprehensive business diagnostic. Answer a few questions to get personalized insights.',
    icon: '🩺',
    action: '/diagnosis',
    highlight: 'diagnosis',
  },
  {
    id: 'tools',
    title: 'Strategic Analysis Tools',
    description: 'Access powerful frameworks like SWOT, Porter\'s Five Forces, and PESTEL analysis to understand your business landscape.',
    icon: '🔧',
    action: '/tools',
    highlight: 'tools',
  },
  {
    id: 'advisor',
    title: 'AI Business Advisor',
    description: 'Chat with our intelligent AI advisor for real-time strategic guidance and recommendations.',
    icon: '🤖',
    action: '/advisor',
    highlight: 'advisor',
  },
  {
    id: 'workspace',
    title: 'Your Workspace',
    description: 'Upload data, run analyses, and track your strategic decisions all in one place.',
    icon: '📊',
    action: '/workspace',
    highlight: 'workspace',
  },
  {
    id: 'shortcuts',
    title: 'Quick Access with ⌘K',
    description: 'Press Command+K (or Ctrl+K) anytime to open the command palette for quick navigation.',
    icon: '⌨️',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start exploring and transforming your business strategy. We\'re here to help you succeed.',
    icon: '🎉',
  },
];

export default function OnboardingTour() {
  const router = useRouter();
  const {
    showOnboarding,
    setShowOnboarding,
    currentUser: user,
    featureFlags
  } = useAppState();

  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show tour for new users who haven't completed onboarding
    if (user && showOnboarding && featureFlags.enableOnboardingTour !== false) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, showOnboarding, featureFlags]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const handleGoTo = (action?: string) => {
    if (action) {
      router.push(action);
    }
    handleNext();
  };

  const completeTour = () => {
    setShowOnboarding(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="skip-button" onClick={handleSkip}>
          Skip tour
        </button>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="step-content">
          <span className="step-icon">{step.icon}</span>
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </div>

        <div className="step-indicators">
          {tourSteps.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(idx)}
            />
          ))}
        </div>

        <div className="step-actions">
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          {step.action ? (
            <button
              className="btn-primary"
              onClick={() => handleGoTo(step.action)}
            >
              Go to {step.highlight} →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleNext}
            >
              {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .onboarding-modal {
          width: 100%;
          max-width: 480px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          margin: 20px;
          position: relative;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .skip-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.15s;
        }

        .skip-button:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .progress-bar {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), #a855f7);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .step-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .step-icon {
          font-size: 56px;
          display: block;
          margin-bottom: 20px;
          animation: bounce 0.5s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .step-content h2 {
          margin: 0 0 12px 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .step-content p {
          margin: 0;
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .step-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: var(--bg-tertiary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .indicator.completed {
          background: var(--accent);
          opacity: 0.5;
        }

        .indicator.active {
          background: var(--accent);
          width: 24px;
          border-radius: 5px;
        }

        .step-actions {
          display: flex;
          gap: 12px;
        }

        .btn-secondary,
        .btn-primary {
          flex: 1;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--bg-primary);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #a855f7);
          border: none;
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }

        @media (max-width: 480px) {
          .onboarding-modal {
            padding: 24px;
            margin: 16px;
          }

          .step-icon {
            font-size: 48px;
          }

          .step-content h2 {
            font-size: 20px;
          }

          .step-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
