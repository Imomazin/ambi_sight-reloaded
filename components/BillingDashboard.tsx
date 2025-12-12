'use client';

import { useState } from 'react';
import { useAppState, useUsageLimits, useTrialStatus } from '../state/useAppState';
import ProgressIndicator from './ProgressIndicator';

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export default function BillingDashboard() {
  const { currentUser } = useAppState();
  const { aiQueriesRemaining, dataUploadsRemaining, aiQueriesLimit, dataUploadsLimit } = useUsageLimits();
  const { isOnTrial, daysRemaining } = useTrialStatus();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = currentUser?.plan || 'Free';

  // Demo subscription data
  const subscription = {
    plan,
    status: 'active',
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: plan === 'Starter' ? 19.99 : plan === 'Pro' ? 99.99 : plan === 'Enterprise' ? 199.99 : 0,
    paymentMethod: {
      brand: 'visa',
      last4: '4242'
    }
  };

  const invoices: Invoice[] = [
    { id: 'INV-001', amount: subscription.amount, status: 'paid', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString() },
    { id: 'INV-002', amount: subscription.amount, status: 'paid', date: new Date().toLocaleDateString() }
  ];

  const handleUpgrade = async (newPlan: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: `price_${newPlan.toLowerCase()}`,
          userId: currentUser?.id
        })
      });
      const data = await response.json();
      if (data.success) {
        // In production, redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
    setIsProcessing(false);
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      await fetch('/api/billing/subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: `sub_${currentUser?.id}`,
          cancelImmediately: false
        })
      });
      setShowCancelModal(false);
    } catch (error) {
      console.error('Cancel failed:', error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="billing-dashboard">
      {/* Current Plan */}
      <div className="section">
        <h2>Current Plan</h2>
        <div className="plan-card">
          <div className="plan-info">
            <span className={`plan-badge ${plan.toLowerCase()}`}>{plan}</span>
            {isOnTrial && (
              <span className="trial-badge">{daysRemaining} days left in trial</span>
            )}
          </div>
          <div className="plan-details">
            <div className="plan-price">
              {subscription.amount > 0 ? (
                <>
                  <span className="amount">${subscription.amount}</span>
                  <span className="period">/month</span>
                </>
              ) : (
                <span className="free">Free</span>
              )}
            </div>
            {subscription.amount > 0 && (
              <p className="next-billing">
                Next billing: {subscription.nextBillingDate}
              </p>
            )}
          </div>
          <div className="plan-actions">
            {plan === 'Free' && (
              <button className="btn-upgrade" onClick={() => handleUpgrade('catalyst')}>
                Upgrade to Catalyst
              </button>
            )}
            {plan !== 'Free' && plan !== 'Enterprise' && (
              <button className="btn-upgrade" onClick={() => handleUpgrade('strategist')}>
                Upgrade Plan
              </button>
            )}
            {plan !== 'Free' && (
              <button className="btn-cancel" onClick={() => setShowCancelModal(true)}>
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="section">
        <h2>Usage This Month</h2>
        <div className="usage-grid">
          <div className="usage-item">
            <div className="usage-header">
              <span>AI Queries</span>
              <span className="usage-count">
                {aiQueriesLimit - aiQueriesRemaining} / {aiQueriesLimit === Infinity ? '∞' : aiQueriesLimit}
              </span>
            </div>
            {aiQueriesLimit !== Infinity && (
              <ProgressIndicator
                progress={((aiQueriesLimit - aiQueriesRemaining) / aiQueriesLimit) * 100}
                color={aiQueriesRemaining < 5 ? 'red' : 'teal'}
                showLabel={false}
                size="sm"
              />
            )}
          </div>
          <div className="usage-item">
            <div className="usage-header">
              <span>Data Uploads</span>
              <span className="usage-count">
                {dataUploadsLimit - dataUploadsRemaining} / {dataUploadsLimit === Infinity ? '∞' : dataUploadsLimit}
              </span>
            </div>
            {dataUploadsLimit !== Infinity && dataUploadsLimit > 0 && (
              <ProgressIndicator
                progress={((dataUploadsLimit - dataUploadsRemaining) / dataUploadsLimit) * 100}
                color={dataUploadsRemaining < 2 ? 'red' : 'purple'}
                showLabel={false}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      {plan !== 'Free' && (
        <div className="section">
          <h2>Payment Method</h2>
          <div className="payment-card">
            <div className="card-icon">💳</div>
            <div className="card-info">
              <span className="card-brand">{subscription.paymentMethod.brand.toUpperCase()}</span>
              <span className="card-number">•••• {subscription.paymentMethod.last4}</span>
            </div>
            <button className="btn-secondary">Update</button>
          </div>
        </div>
      )}

      {/* Invoices */}
      {plan !== 'Free' && invoices.length > 0 && (
        <div className="section">
          <h2>Recent Invoices</h2>
          <div className="invoices-table">
            {invoices.map(invoice => (
              <div key={invoice.id} className="invoice-row">
                <span className="invoice-id">{invoice.id}</span>
                <span className="invoice-date">{invoice.date}</span>
                <span className="invoice-amount">${invoice.amount.toFixed(2)}</span>
                <span className={`invoice-status ${invoice.status}`}>{invoice.status}</span>
                <button className="btn-link">Download</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Subscription</h3>
            <p>Are you sure you want to cancel? You'll lose access to premium features at the end of your billing period.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </button>
              <button
                className="btn-danger"
                onClick={handleCancelSubscription}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .billing-dashboard {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section h2 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .plan-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
        }

        .plan-info {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .plan-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
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

        .trial-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          background: rgba(168, 85, 247, 0.2);
          color: #C084FC;
        }

        .plan-details {
          margin-bottom: 20px;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .amount {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .period {
          font-size: 14px;
          color: var(--text-muted);
        }

        .free {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .next-billing {
          margin: 8px 0 0 0;
          font-size: 13px;
          color: var(--text-muted);
        }

        .plan-actions {
          display: flex;
          gap: 12px;
        }

        .btn-upgrade {
          padding: 12px 24px;
          background: linear-gradient(135deg, #14B8A6, #A855F7);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-upgrade:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
        }

        .btn-cancel {
          padding: 12px 24px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .usage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .usage-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }

        .usage-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .usage-count {
          font-weight: 600;
          color: var(--text-primary);
        }

        .payment-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 20px;
        }

        .card-icon {
          font-size: 32px;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-brand {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .card-number {
          font-size: 16px;
          color: var(--text-primary);
          font-family: monospace;
        }

        .btn-secondary {
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: var(--bg-card-hover);
        }

        .invoices-table {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .invoice-row {
          display: grid;
          grid-template-columns: 100px 1fr 80px 80px 80px;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }

        .invoice-row:last-child {
          border-bottom: none;
        }

        .invoice-id {
          font-weight: 500;
          color: var(--text-primary);
        }

        .invoice-date {
          color: var(--text-muted);
        }

        .invoice-amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        .invoice-status {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .invoice-status.paid {
          background: rgba(34, 197, 94, 0.2);
          color: #22C55E;
        }

        .invoice-status.pending {
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
        }

        .invoice-status.failed {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 13px;
          cursor: pointer;
          text-align: right;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
        }

        .modal h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: var(--text-primary);
        }

        .modal p {
          margin: 0 0 20px 0;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .btn-danger {
          padding: 10px 20px;
          background: #EF4444;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .plan-actions {
            flex-direction: column;
          }

          .invoice-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .invoice-date,
          .btn-link {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
