'use client';

import { useState, useEffect } from 'react';
import { useProjectState, OrganizationProfile, getNextStep } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
  'Energy', 'Education', 'Real Estate', 'Transportation', 'Media & Entertainment',
  'Hospitality', 'Agriculture', 'Telecommunications', 'Construction', 'Other'
];

const companySizes = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
];

const growthStages = [
  { value: 'idea', label: 'Idea Stage - Validating concept' },
  { value: 'early', label: 'Early Stage - Finding product-market fit' },
  { value: 'growth', label: 'Growth Stage - Scaling operations' },
  { value: 'mature', label: 'Mature - Optimizing and defending' },
  { value: 'declining', label: 'Declining - Restructuring needed' },
];

const commonChallenges = [
  'Market competition', 'Talent acquisition', 'Funding/Cash flow',
  'Technology adoption', 'Customer retention', 'Operational efficiency',
  'Regulatory compliance', 'Digital transformation', 'Market expansion',
  'Product innovation', 'Supply chain issues', 'Brand awareness'
];

interface DiscoverStepProps {
  onComplete?: () => void;
}

export default function DiscoverStep({ onComplete }: DiscoverStepProps) {
  const { getActiveProject, updateDiscoverData, completeStep, setCurrentStep } = useProjectState();
  const { addNotification } = useAppState();
  const project = getActiveProject();

  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({
    name: '',
    industry: '',
    size: 'small',
    growthStage: 'growth',
    region: '',
    challenges: [],
    goals: [],
  });

  const [newGoal, setNewGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing data
  useEffect(() => {
    if (project?.discover) {
      setFormData(project.discover);
    }
  }, [project?.discover]);

  const handleInputChange = (field: keyof OrganizationProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleChallenge = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges?.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...(prev.challenges || []), challenge]
    }));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...(prev.goals || []), newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals?.filter((_, i) => i !== index)
    }));
  };

  const generateAISummary = async () => {
    setIsGenerating(true);

    // Simulate AI summary generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const summary = `${formData.name || 'Your organization'} is a ${formData.size} ${formData.industry?.toLowerCase() || 'company'} in the ${formData.growthStage?.replace('_', ' ')} stage, operating in ${formData.region || 'their market'}.

Key challenges include ${formData.challenges?.slice(0, 3).join(', ') || 'various market factors'}.

Strategic priorities focus on ${formData.goals?.slice(0, 2).join(' and ') || 'growth and optimization'}.

Recommended diagnostic approach: Start with SWOT analysis to map internal capabilities, then use Porter's Five Forces for competitive positioning.`;

    setFormData(prev => ({ ...prev, aiSummary: summary }));
    setIsGenerating(false);
  };

  const handleSave = () => {
    updateDiscoverData(formData as OrganizationProfile);
    addNotification({
      type: 'success',
      title: 'Discovery Saved',
      message: 'Your organization profile has been updated.',
    });
  };

  const handleComplete = () => {
    if (!formData.name || !formData.industry) {
      addNotification({
        type: 'warning',
        title: 'Incomplete Information',
        message: 'Please fill in at least your organization name and industry.',
      });
      return;
    }

    updateDiscoverData(formData as OrganizationProfile);
    completeStep('discover');

    const nextStep = getNextStep('discover');
    if (nextStep) {
      setCurrentStep(nextStep);
    }

    addNotification({
      type: 'success',
      title: 'Discovery Complete!',
      message: 'Moving to Diagnose phase. Time to analyze your position.',
    });

    onComplete?.();
  };

  const isComplete = formData.name && formData.industry && formData.size && formData.growthStage;

  return (
    <div className="discover-step">
      <div className="step-header">
        <div className="header-content">
          <span className="step-icon">🔍</span>
          <div>
            <h2>Discover Your Organization</h2>
            <p>Let's understand your business context to provide tailored strategic guidance</p>
          </div>
        </div>
      </div>

      <div className="form-grid">
        {/* Organization Name */}
        <div className="form-group full-width">
          <label>Organization Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your organization name"
          />
        </div>

        {/* Industry */}
        <div className="form-group">
          <label>Industry *</label>
          <select
            value={formData.industry || ''}
            onChange={(e) => handleInputChange('industry', e.target.value)}
          >
            <option value="">Select industry</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Company Size */}
        <div className="form-group">
          <label>Company Size *</label>
          <select
            value={formData.size || ''}
            onChange={(e) => handleInputChange('size', e.target.value as any)}
          >
            {companySizes.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>

        {/* Growth Stage */}
        <div className="form-group">
          <label>Growth Stage *</label>
          <select
            value={formData.growthStage || ''}
            onChange={(e) => handleInputChange('growthStage', e.target.value as any)}
          >
            {growthStages.map(stage => (
              <option key={stage.value} value={stage.value}>{stage.label}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div className="form-group">
          <label>Primary Region/Market</label>
          <input
            type="text"
            value={formData.region || ''}
            onChange={(e) => handleInputChange('region', e.target.value)}
            placeholder="e.g., North America, Europe, Global"
          />
        </div>

        {/* Challenges */}
        <div className="form-group full-width">
          <label>Key Challenges (select all that apply)</label>
          <div className="challenge-tags">
            {commonChallenges.map(challenge => (
              <button
                key={challenge}
                type="button"
                className={`challenge-tag ${formData.challenges?.includes(challenge) ? 'selected' : ''}`}
                onClick={() => toggleChallenge(challenge)}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="form-group full-width">
          <label>Strategic Goals</label>
          <div className="goals-input">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              placeholder="Add a strategic goal and press Enter"
            />
            <button type="button" onClick={addGoal}>Add</button>
          </div>
          {formData.goals && formData.goals.length > 0 && (
            <div className="goals-list">
              {formData.goals.map((goal, index) => (
                <div key={index} className="goal-item">
                  <span>🎯 {goal}</span>
                  <button type="button" onClick={() => removeGoal(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Summary */}
        <div className="form-group full-width">
          <div className="summary-header">
            <label>AI Strategic Summary</label>
            <button
              type="button"
              className="generate-btn"
              onClick={generateAISummary}
              disabled={isGenerating || !formData.name}
            >
              {isGenerating ? 'Generating...' : '✨ Generate Summary'}
            </button>
          </div>
          {formData.aiSummary ? (
            <div className="ai-summary">
              <p>{formData.aiSummary}</p>
            </div>
          ) : (
            <div className="summary-placeholder">
              <p>Fill in your organization details and click "Generate Summary" to get AI-powered strategic insights.</p>
            </div>
          )}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={handleSave}>
          Save Progress
        </button>
        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={!isComplete}
        >
          Complete Discovery →
        </button>
      </div>

      <style jsx>{`
        .discover-step {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .step-header {
          padding: 24px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.05));
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-icon {
          font-size: 40px;
        }

        .step-header h2 {
          margin: 0;
          font-size: 24px;
          color: var(--text-primary);
        }

        .step-header p {
          margin: 4px 0 0;
          color: var(--text-muted);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          padding: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #A855F7;
        }

        .challenge-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .challenge-tag {
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .challenge-tag:hover {
          border-color: #A855F7;
        }

        .challenge-tag.selected {
          background: rgba(168, 85, 247, 0.2);
          border-color: #A855F7;
          color: #C084FC;
        }

        .goals-input {
          display: flex;
          gap: 8px;
        }

        .goals-input input {
          flex: 1;
        }

        .goals-input button {
          padding: 12px 20px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: white;
          cursor: pointer;
        }

        .goals-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        .goal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
        }

        .goal-item button {
          padding: 4px 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 18px;
          cursor: pointer;
        }

        .goal-item button:hover {
          color: #EF4444;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .generate-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #A855F7, #EC4899);
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-summary {
          padding: 20px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.05));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
        }

        .ai-summary p {
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }

        .summary-placeholder {
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          text-align: center;
        }

        .summary-placeholder p {
          margin: 0;
          font-size: 14px;
          color: var(--text-muted);
        }

        .step-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
        }

        .btn-primary {
          padding: 12px 24px;
          background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .step-actions {
            flex-direction: column;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
