'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { pricingPlans, planFeatures, type PricingPlan } from '../../lib/pricing';
import { ConsultingPackagesShowcase } from '../../lib/../components/ConsultingCTA';
import { useAppState } from '../../state/useAppState';
import type { Plan } from '../../lib/users';

// Plan Card Component
function PlanCard({
  plan,
  isAnnual,
  currentPlan,
}: {
  plan: PricingPlan;
  isAnnual: boolean;
  currentPlan: Plan | null;
}) {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;
  const isCurrentPlan = currentPlan === plan.id;
  const planHierarchy: Record<Plan, number> = { Free: 0, Pro: 1, Enterprise: 2 };
  const isDowngrade = currentPlan && planHierarchy[currentPlan] > planHierarchy[plan.id];

  return (
    <div
      className={`relative rounded-2xl border p-6 ${
        plan.highlighted
          ? 'bg-gradient-to-b from-blue-900/30 to-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/50 border-slate-700'
      }`}
    >
      {/* Popular Badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full border border-green-500/30">
            Current Plan
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
        <p className="text-sm text-slate-400">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        {plan.id === 'Enterprise' ? (
          <div>
            <span className="text-4xl font-bold text-white">Custom</span>
            <p className="text-sm text-slate-500 mt-1">Contact us for pricing</p>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-white">${price}</span>
              <span className="text-slate-400">/month</span>
            </div>
            {isAnnual && plan.price.monthly > 0 && (
              <p className="text-sm text-green-400 mt-1">
                Save ${(plan.price.monthly - plan.price.annual) * 12}/year
              </p>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-slate-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto">
        {isCurrentPlan ? (
          <button
            disabled
            className="w-full bg-slate-700 text-slate-400 py-3 rounded-lg font-medium cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : isDowngrade ? (
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors">
            Downgrade
          </button>
        ) : (
          <button
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              plan.ctaVariant === 'gradient'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                : plan.ctaVariant === 'primary'
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {plan.ctaText}
          </button>
        )}
      </div>
    </div>
  );
}

// Feature Comparison Table
function FeatureComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-4 px-4 text-slate-400 font-medium">Feature</th>
            {pricingPlans.map(plan => (
              <th key={plan.id} className="text-center py-4 px-4 text-white font-medium">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planFeatures.map(feature => (
            <tr key={feature.id} className="border-b border-slate-800">
              <td className="py-4 px-4">
                <div className="text-slate-300">{feature.name}</div>
                <div className="text-xs text-slate-500">{feature.description}</div>
              </td>
              {pricingPlans.map(plan => (
                <td key={plan.id} className="text-center py-4 px-4">
                  {feature.includedIn.includes(plan.id) ? (
                    feature.limit ? (
                      <span className="text-slate-300 text-sm">{feature.limit[plan.id]}</span>
                    ) : (
                      <svg className="w-5 h-5 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  ) : (
                    <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ Section
const faqs = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing period.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! We offer a 14-day free trial of Pro with full access to all Pro features. No credit card required to start.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and wire transfers for Enterprise customers. Annual plans can also be paid by invoice.',
  },
  {
    q: 'Can I get a refund?',
    a: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.',
  },
  {
    q: 'How does the Enterprise plan work?',
    a: 'Enterprise plans are customized based on your organization\'s needs. Contact our sales team for a personalized demo and pricing.',
  },
];

// Main Page Component
export default function PricingPage() {
  const { currentUser } = useAppState();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Ambi<span className="text-blue-500">Sight</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/tools" className="text-slate-400 hover:text-white text-sm transition-colors">
                Tools
              </Link>
              <Link
                href="/workspace"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Open Workspace
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your strategic needs. All plans include access to our core tools and AI advisor.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
              Annual
              <span className="ml-1 text-green-400">(Save 20%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              currentPlan={currentUser?.plan || null}
            />
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Compare Plans</h2>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
          <FeatureComparison />
        </div>
      </div>

      {/* Consulting Section */}
      <div className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Need More Than Software?</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our strategy consultants can help you implement frameworks, facilitate workshops, and drive transformation.
            </p>
          </div>
          <ConsultingPackagesShowcase />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h3 className="text-white font-medium mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-blue-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Strategy?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Start free and upgrade as you grow. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-8 py-3 rounded-lg transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/diagnosis"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-3 rounded-lg border border-slate-700 transition-colors"
            >
              Take Diagnostic Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
