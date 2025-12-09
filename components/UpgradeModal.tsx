'use client';

import React from 'react';
import Link from 'next/link';
import { pricingPlans, type PricingPlan } from '../lib/pricing';
import type { Plan } from '../lib/users';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: Plan;
  targetPlan?: Plan;
  feature?: string;
  message?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  targetPlan = 'Pro',
  feature,
  message,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const targetPlanData = pricingPlans.find(p => p.id === targetPlan);
  const currentPlanData = pricingPlans.find(p => p.id === currentPlan);

  if (!targetPlanData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to {targetPlanData.name}
          </h2>
          <p className="text-blue-100">
            {message || `Unlock ${feature || 'premium features'} and accelerate your strategy`}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-white">${targetPlanData.price.annual}</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Billed annually (save 20%)</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Everything in {currentPlanData?.name}, plus:
            </p>
            <ul className="space-y-2">
              {targetPlanData.features.slice(0, 6).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/pricing"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-lg text-center transition-all"
            >
              {targetPlanData.ctaText}
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-slate-400 hover:text-white py-2 text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline upgrade banner for embedding in pages
interface UpgradeBannerProps {
  currentPlan: Plan;
  feature: string;
  compact?: boolean;
}

export function UpgradeBanner({ currentPlan, feature, compact = false }: UpgradeBannerProps) {
  const targetPlan = currentPlan === 'Free' ? 'Pro' : 'Enterprise';
  const targetPlanData = pricingPlans.find(p => p.id === targetPlan);

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-400">→</span>
          <span className="text-sm text-slate-300">
            Upgrade to {targetPlan} for {feature}
          </span>
        </div>
        <Link
          href="/pricing"
          className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors"
        >
          Upgrade
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl">🔓</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            Unlock {feature}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            This feature is available on the {targetPlan} plan. Upgrade to access {feature.toLowerCase()} and more premium capabilities.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
            >
              Upgrade to {targetPlan}
            </Link>
            <Link
              href="/pricing"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Compare plans →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small upgrade tag for inline use
export function UpgradeTag({ plan }: { plan: Plan }) {
  const colors = {
    Pro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Enterprise: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Free: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <Link
      href="/pricing"
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colors[plan]} hover:opacity-80 transition-opacity`}
    >
      <span>🔒</span>
      <span>{plan}</span>
    </Link>
  );
}
