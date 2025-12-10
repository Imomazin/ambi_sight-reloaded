'use client';

import { useAppState, useUsageLimits, useTrialStatus } from '@/state/useAppState';
import ProgressIndicator from './ProgressIndicator';

export default function UsageDashboard() {
  const { currentUser, aiQueriesUsed, dataUploadsUsed, analysisHistory } = useAppState();
  const { aiQueriesRemaining, dataUploadsRemaining, aiQueriesLimit, dataUploadsLimit } = useUsageLimits();
  const { isOnTrial, daysRemaining } = useTrialStatus();

  const plan = currentUser?.plan || 'Free';

  const aiUsagePercent = aiQueriesLimit === Infinity
    ? 0
    : (aiQueriesUsed / aiQueriesLimit) * 100;

  const dataUsagePercent = dataUploadsLimit === Infinity
    ? 0
    : dataUploadsLimit > 0
      ? (dataUploadsUsed / dataUploadsLimit) * 100
      : 100;

  return (
    <div className="usage-dashboard">
      <div className="usage-header">
        <h3>Usage Overview</h3>
        <span className={`plan-badge ${plan.toLowerCase()}`}>{plan}</span>
      </div>

      {isOnTrial && (
        <div className="trial-banner">
          <span className="trial-icon">⏰</span>
          <div className="trial-info">
            <strong>Trial Active</strong>
            <span>{daysRemaining} days remaining</span>
          </div>
        </div>
      )}

      <div className="usage-grid">
        <div className="usage-card">
          <div className="usage-icon">💬</div>
          <div className="usage-content">
            <h4>Advisor Queries</h4>
            {aiQueriesLimit === Infinity ? (
              <p className="unlimited">Unlimited</p>
            ) : (
              <>
                <ProgressIndicator
                  progress={aiUsagePercent}
                  color={aiUsagePercent > 80 ? 'red' : aiUsagePercent > 50 ? 'amber' : 'teal'}
                  showLabel={false}
                  size="sm"
                />
                <p className="usage-stats">
                  <strong>{aiQueriesUsed}</strong> / {aiQueriesLimit} used
                  <span className="remaining">({aiQueriesRemaining} remaining)</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="usage-card">
          <div className="usage-icon">📤</div>
          <div className="usage-content">
            <h4>Data Uploads</h4>
            {dataUploadsLimit === Infinity ? (
              <p className="unlimited">Unlimited</p>
            ) : dataUploadsLimit === 0 ? (
              <p className="locked">Upgrade to enable</p>
            ) : (
              <>
                <ProgressIndicator
                  progress={dataUsagePercent}
                  color={dataUsagePercent > 80 ? 'red' : dataUsagePercent > 50 ? 'amber' : 'purple'}
                  showLabel={false}
                  size="sm"
                />
                <p className="usage-stats">
                  <strong>{dataUploadsUsed}</strong> / {dataUploadsLimit} used
                  <span className="remaining">({dataUploadsRemaining} remaining)</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="usage-card">
          <div className="usage-icon">📊</div>
          <div className="usage-content">
            <h4>Analyses Run</h4>
            <p className="analysis-count">{analysisHistory.length}</p>
            <span className="analysis-label">Total this period</span>
          </div>
        </div>
      </div>

      {(plan === 'Free' || plan === 'Starter') && (
        <div className="upgrade-prompt">
          <p>Need more? Upgrade your plan for higher limits and premium features.</p>
          <a href="/pricing" className="upgrade-btn">View Plans</a>
        </div>
      )}

      <style jsx>{`
        .usage-dashboard {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
        }

        .usage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .usage-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .plan-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .plan-badge.free {
          background: rgba(100, 116, 139, 0.2);
          color: #94A3B8;
        }

        .plan-badge.starter {
          background: rgba(20, 184, 166, 0.2);
          color: #2DD4BF;
        }

        .plan-badge.pro {
          background: rgba(168, 85, 247, 0.2);
          color: #C084FC;
        }

        .plan-badge.enterprise {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
          color: #FBBF24;
        }

        .trial-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .trial-icon {
          font-size: 24px;
        }

        .trial-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .trial-info strong {
          color: #C084FC;
          font-size: 14px;
        }

        .trial-info span {
          color: var(--text-muted);
          font-size: 12px;
        }

        .usage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .usage-card {
          display: flex;
          gap: 14px;
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .usage-card:hover {
          background: var(--bg-card-hover);
        }

        .usage-icon {
          font-size: 24px;
          line-height: 1;
        }

        .usage-content {
          flex: 1;
        }

        .usage-content h4 {
          margin: 0 0 8px 0;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
        }

        .usage-stats {
          margin: 8px 0 0 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .usage-stats strong {
          color: var(--text-primary);
        }

        .remaining {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .unlimited {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #22C55E;
        }

        .locked {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
        }

        .analysis-count {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .analysis-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .upgrade-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(168, 85, 247, 0.1));
          border-radius: 12px;
          gap: 16px;
        }

        .upgrade-prompt p {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .upgrade-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #14B8A6, #A855F7);
          color: white;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .upgrade-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
        }

        @media (max-width: 640px) {
          .upgrade-prompt {
            flex-direction: column;
            text-align: center;
          }

          .upgrade-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
