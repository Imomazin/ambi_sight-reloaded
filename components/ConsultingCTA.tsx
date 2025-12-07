'use client';

import React, { useState } from 'react';
import { consultingPackages, type ConsultingPackage } from '../lib/pricing';

interface ConsultingCTAProps {
  variant?: 'banner' | 'card' | 'inline' | 'modal';
  context?: string;
  onRequestConsulting?: () => void;
}

// Request Form Modal
function ConsultingRequestModal({
  isOpen,
  onClose,
  preselectedPackage,
}: {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage?: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    package: preselectedPackage || '',
    challenge: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', package: '', challenge: '' });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {submitted ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Request Received!</h2>
            <p className="text-slate-400">
              Our team will reach out within 24 hours to discuss your needs.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Request Consulting</h2>
              <p className="text-slate-400 text-sm mt-1">
                Tell us about your strategic challenge and we&apos;ll match you with the right solution
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Interested In</label>
                <select
                  value={formData.package}
                  onChange={e => setFormData({ ...formData, package: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a package (optional)</option>
                  {consultingPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Describe your challenge</label>
                <textarea
                  value={formData.challenge}
                  onChange={e => setFormData({ ...formData, challenge: e.target.value })}
                  rows={3}
                  placeholder="What strategic challenge are you facing?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-lg transition-all font-medium"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function ConsultingCTA({ variant = 'banner', context }: ConsultingCTAProps) {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        >
          Request consulting support
        </button>
        <ConsultingRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
          <div className="flex items-start gap-4">
            <div className="text-3xl">👨‍💼</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Need Expert Help?</h3>
              <p className="text-slate-400 text-sm mb-4">
                {context || 'Our strategy consultants can help you implement these tools and accelerate results.'}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Request Consulting →
              </button>
            </div>
          </div>
        </div>
        <ConsultingRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default: banner
  return (
    <>
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {context || 'Need hands-on strategic support?'}
              </h3>
              <p className="text-slate-400 text-sm">
                Our consultants help organizations implement strategy at scale
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-lg transition-all whitespace-nowrap"
          >
            Request Consulting
          </button>
        </div>
      </div>
      <ConsultingRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

// Consulting packages showcase component
export function ConsultingPackagesShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackage(pkgId);
    setShowModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consultingPackages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">{pkg.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                <p className="text-sm text-blue-400">{pkg.duration} • {pkg.price}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">{pkg.description}</p>
            <ul className="space-y-2 mb-4">
              {pkg.includes.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
              {pkg.includes.length > 3 && (
                <li className="text-sm text-slate-500">+{pkg.includes.length - 3} more</li>
              )}
            </ul>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-3">Best for: {pkg.bestFor}</p>
              <button
                onClick={() => handleSelectPackage(pkg.id)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConsultingRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        preselectedPackage={selectedPackage}
      />
    </>
  );
}
